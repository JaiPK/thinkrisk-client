import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../../../../api/axios";
import { Config, ReviewStatus } from "../../../../../../shared/models/filters";
import {
  AccDocument,
  ControlException,
  RiskLevel,
} from "../../../../../../shared/models/records";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Button, CircularProgress, Divider } from "@mui/material";
import TransactionDetailsTable from "./TransactionDetailsTable";
import { titleCase } from "../../../../../../shared/helpers/titleCase";
import AssignTaskPopUp from "./popups/AssignTaskPopUp";
import FeedBackPopUp from "./popups/FeedBackPopUp";
import { transformSelectedTrans } from "../../../../../../shared/helpers/transformSelectedTrans";
import CloseTaskPopUp from "./popups/CloseTaskPopUp";
import AlertComponent from "../../../../../ui/alert-component/AlertComponent";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks";
import {
  updateAPTransDetailsDrillThrough,
  updateAPTransDetailsDrillThroughConfig,
} from "../../state/APTransDetailsDrillThroughSlice";
import CurrencyFormat from "react-currency-format";
import CloseIcon from "@mui/icons-material/Close";
import TransactionDetailsPagination from "./TransactionDetailsPagination";
import { updateRouteBackToInsights } from "../../../../ap-slice/APSlice";
import { getPath } from "../../../../../../shared/helpers/getPath";

const GET_TRANSACTIONS_URL = "v1/ap/transactions";
const GET_FILTERS_URL = "v1/ap/get_filters";
const POST_ASSIGN_TASK_URL = "v1/ap/assignuser";
const config = [
  {
    label: "Company",
    data: [],
    filterName: "apcompanies",
    filterType: "multi-dropdown",
    selected: undefined,
    active: true,
  },
  {
    label: "Controls",
    data: [
      // { text: "Oliver Hansen", value: 1 },
    ],
    filterName: "aprules",
    filterType: "multi-dropdown",
    selected: undefined,
    active: true,
  },
];

const statusDropDownConfig: ReviewStatus = {
  label: "Review Status",
  data: [{ text: "", value: 1 }],
  selected: 1,
};

export interface Props {
  document: AccDocument;
  riskLevelData: RiskLevel;
  highlightActiveTab(tabIndex: number): void;
}

export interface Data {
  account_code: number;
  acc_doc_id: number;
  description: string;
  transactionId: number;
  riskScore: number;
  entryDate: string;
  debit: number;
  credit: number;
  name: string;
  controlException: string[];
}

export function createData(
  account_code: number,
  acc_doc_id: number,
  description: string,
  transactionId: number,
  riskScore: number,
  entryDate: string,
  debit: number,
  credit: number,
  name: string,
  controlException: string[]
): Data {
  return {
    account_code,
    acc_doc_id,
    description,
    transactionId,
    riskScore,
    entryDate,
    debit,
    credit,
    name,
    controlException,
  };
}

const TransactionDetails = ({ document, riskLevelData, highlightActiveTab }: Props) => {
  const transId = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const currencySymbol = localStorage.getItem("CurrencySymbol");

  let APTransDetailsDrillThrough = useAppSelector(
    (state) => state.APTransDetailsDrillThrough
  );

  let IsRouteBackToInsights = useAppSelector((state) => state.APDataSlice.routeBackToInsights);

  const [filterConfig, setFilterConfig] = useState<Config[]>(config);
  const [reviewStatusConfig, setReviewStatusConfig] =
    useState(statusDropDownConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isReviewStatusLoading, setIsReviewStatusLoading] = useState(false);
  const [transactions, setTransactions] = useState<Data[]>([]);
  const [transLoading, setTransLoading] = useState(false);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>({
    range_high: 0,
    range_medium: 0,
    range_low: 0,
  });
  const [explainability, setExplainability] = useState<ControlException[]>([]);
  const [transControlExceptions, setTransControlExceptions] = useState<
    string[]
  >([]);
  const [transControlExceptionId, setTransControlExceptionId] = useState();
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const Axios = axios;
  const [toggleControlExceptionView, setToggleControlExceptionView] =
    useState(false);

  //for case management
  const roleId: number = Number(
    JSON.parse(localStorage.getItem("THR_USER")!)?.roleId
  );
  const userId: number = Number(
    JSON.parse(localStorage.getItem("THR_USER")!)?.userId
  );

  //for alert popup
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  //for popup
  const [open, setOpen] = useState(false);
  const [closeTaskOpen, setCloseTaskOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const handleClickOpen = (task: string) => {
    switch (task) {
      case "assigntask":
        setOpen(true);
        break;
      case "sendtomanager":
        setCloseTaskOpen(true);
        break;
      case "recommendtoclosure":
        setCloseTaskOpen(true);
        break;
      case "closetask":
        setCloseTaskOpen(true);
        break;
      case "recall":
        handleRecallAction();
        break;
      case "feedback":
        setFeedbackOpen(true);
        break;
      default:
        break;
    }
  };
  const handleClose = (actionCode: number, popup: string) => {
    switch (popup) {
      case "assigntask":
        if (actionCode === 1) {
          //for cancel or close
          setOpen(false);
        } else {
          //for submission
          setOpen(false);
          setTimeout(() => {
            // Run after 100 milliseconds

            handleNavigateBack();
          }, 2000);
        }
        break;
      case "sendtomanager":
        if (actionCode === 1) {
          //for cancel or close
          setCloseTaskOpen(false);
        } else {
          //for submission
          setCloseTaskOpen(false);
          setTimeout(() => {
            // Run after 100 milliseconds

            handleNavigateBack();
          }, 2000);
        }
        break;
      case "recommendtoclosure":
        if (actionCode === 1) {
          //for cancel or close
          setCloseTaskOpen(false);
          setTimeout(() => {
            // Run after 100 milliseconds

            handleNavigateBack();
          }, 2000);
        } else {
          //for submission
          setCloseTaskOpen(false);
          setTimeout(() => {
            // Run after 100 milliseconds

            handleNavigateBack();
          }, 2000);
        }
        break;
      case "closetask":
        if (actionCode === 1) {
          //for cancel or close
          setCloseTaskOpen(false);
        } else {
          //for submission
          setCloseTaskOpen(false);
          handlePopUp("Feedback");
          // handlePopUp("Feedback");
          // setTimeout(() => {

          //     handleNavigateBack();
          // }, 2000);
        }
        break;
      case "feedback":
        if (actionCode === 1) {
          //for cancel or close
          setFeedbackOpen(false);
          setTimeout(() => {
            // Run after 100 milliseconds

            handleNavigateBack();
          }, 2000);
        } else {
          //for submission
          setFeedbackOpen(false);
          setTimeout(() => {
            // Run after 100 milliseconds

            handleNavigateBack();
          }, 2000);
        }
        break;
      default:
        break;
    }
  };


  const handleRecallAction = async () => {
    let formData = new FormData();
    formData.append("ACCOUNT_DOC_ID", document?.ACCOUNT_DOC_ID.toString());
    formData.append("COMMENTS", "Recalled");
    formData.append("TRANSACTIONS", "null");
    formData.append("ASSIGNED_TO", userId.toString());
    formData.append("audit_id", getPath.getPathValue("audit_id"))
    setTransLoading(true);
    const recallResponse = await Axios.post(POST_ASSIGN_TASK_URL, formData, {
      headers: {
        Authorization: localStorage.getItem("TR_Token") as string,
      },
    }).catch((error) => {
      console.log("error:", error);
      return;
    });

    if (
      recallResponse?.data?.data ||
      recallResponse?.data?.message === "Assigned successfully."
    ) {
      setTransLoading(false);
      setAlertMessage(recallResponse.data.message);
      setOpenAlert(true);
      setTimeout(() => {
        // Run after 2000 milliseconds

        handleNavigateBack();
      }, 2000);
    }
  };
  const [popupTitle, setPopupTitle] = useState("");
  const [selectedTrans, setSelectedTrans] = useState<Data[]>([]);
  const [selectedTransIds, setSelectedTransIds] = useState<number[]>([]);
  const [initSelectedTrans, setInitSelectedTrans] = useState<number[]>([]);

  const handleNavigateBack = () => {
    dispatch(updateAPTransDetailsDrillThrough(false));
    dispatch(
      updateAPTransDetailsDrillThroughConfig({
        transId: 0,
        document: {
          ACCOUNTDOCID: 0,
          ACCOUNTDOC_CODE: "",
          ACCOUNT_DOC_ID: null,
          ASSIGNED_BY: null,
          ASSIGNED_TO: null,
          BLENDED_RISK_SCORE: 0,
          BLENDED_SCORE_INDEXED: 0,
          COMMENTS: 0,
          COMPANY_CODE_NAME: null,
          CONTROL_DEVIATION: null,
          CREDIT_AMOUNT: 0,
          DEBIT_AMOUNT: null,
          ENTRY_ID: null,
          INVOICE_NUMBER: null,
          ISDEVIATION: null,
          POSTED_BY_NAME: null,
          POSTED_DATE: null,
          POSTED_LOCATION_NAME: null,
          REVIEWSTATUSID: 0,
          REVIEW_STATUS_CODE: "",
          SELECTED_TRANSACTIONS: null,
          SUBRSTATUSID: null,
          SUB_R_STATUS_CODE: null,
          riskScore: null,
        },
        riskLevel: {
          range_high: null,
          range_low: null,
          range_medium: null,
        },
      })
    );
    let url = window.location.pathname.split("/");
    let navUrl = url.filter((_, i) => i <=5);
    if (IsRouteBackToInsights) {
      dispatch(updateRouteBackToInsights(false));
      highlightActiveTab(0);
      navUrl.push("insights");
    }
    else {
      navUrl.push("transactions");
    }
    navigate(navUrl.join("/"));
  };

  const handlePopUp = (popupTitle: string) => {
    switch (popupTitle) {
      case "Assign Task":
        setPopupTitle("Assign Task");
        handleClickOpen("assigntask");
        break;
      case "Send to Manager":
        setPopupTitle("Send to Manager");
        handleClickOpen("sendtomanager");
        break;
      case "Recommend to Closure":
        setPopupTitle("Recommend to Closure");
        handleClickOpen("recommendtoclosure");
        break;
      case "Close Issue":
        setPopupTitle("Close Issue");
        handleClickOpen("closetask");
        break;
      case "Recall":
        setPopupTitle("Recall");
        handleClickOpen("recall");
        break;
      case "Feedback":
        setPopupTitle("Was the transaction a deviation from normal?");
        handleClickOpen("feedback");
        break;
      default:
        break;
    }
  };

  const handleSelectedTrans = (selectedtrans: string[]) => {
    if (initSelectedTrans?.length) {
      setSelectedTrans([]);
      setSelectedTransIds([]);
      let currentSelectedTrans = [...selectedtrans];
      let Obj: Data[] = [];
      if (selectedtrans.length) {
        selectedtrans.forEach((arrayIndex) => {
          Obj.push(transactions[Number(arrayIndex)]);
        });
        initSelectedTrans.forEach((transactionId) => {
          transactions.forEach((transaction) => {
            if (transaction.transactionId === transactionId) {
              Obj.push(transaction);
            }
          });
        });
      }
      setSelectedTrans(Obj);
      if (Obj.length) {
        let tempArray: number[] = [];
        Obj.forEach((transaction) => {
          tempArray.push(transaction.transactionId);
        });
        // initSelectedTrans.forEach((transId)=>{
        //     tempArray.push(transId);
        // });
        setSelectedTransIds(tempArray);
      }
    } else {
      setSelectedTrans([]);
      setSelectedTransIds([]);
      let Obj: Data[] = [];
      if (selectedtrans.length) {
        selectedtrans.forEach((arrayIndex) => {
          Obj.push(transactions[Number(arrayIndex)]);
        });
      }
      setSelectedTrans(Obj);
      if (Obj.length) {
        let TempArray: number[] = [];
        Obj.forEach((transaction) => {
          TempArray.push(transaction.transactionId);
        });
        setSelectedTransIds(TempArray);
      }
    }
  };

  const getTransactions = async (page: number, perpage: number) => {
    try {
      setTransLoading(true);
      let formData = new FormData();
      formData.append("page", (page + 1)?.toString());
      formData.append("perpage", perpage?.toString());
      formData.append("sortkey", "BLENDED_RISK_SCORE");
      formData.append("sortorder", "desc");
      formData.append(
        "ACCOUNT_DOC_ID",
        APTransDetailsDrillThrough.IsDrillThrough &&
          APTransDetailsDrillThrough.config.document.ACCOUNT_DOC_ID !== null
          ? APTransDetailsDrillThrough.config.document.ACCOUNT_DOC_ID
          : document?.ACCOUNT_DOC_ID
      );
      formData.append("audit_id",  getPath.getPathValue("audit_id"));
      formData.append("exp", "");
      const getTransResponse = await Axios.post(
        GET_TRANSACTIONS_URL,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        }
      );
      if (getTransResponse.data.data.records.length) {
        let Obj: any = [];
        getTransResponse.data.data.records.forEach(
          (record: any, index: number) => {
            let transObj: any = [];
            transObj.account_code = record?.ACCOUNT_NUMBER;
            transObj.acc_doc_id = Number(record?.ACCOUNT_DOC_ID);
            transObj.description = record?.DESCRIPTION;
            transObj.transactionId = Number(record?.TRANSACTION_ID);
            transObj.riskScore = Number(
              Math.trunc(Number(record?.BLENDED_RISK_SCORE * 100))
            );
            transObj.entryDate = record?.ENTRY_DATE;
            transObj.debit = record?.DEBIT_AMOUNT;
            transObj.credit = record?.CREDIT_AMOUNT;
            transObj.name = index.toString();
            transObj.transDesc = record?.TRANSACTION_DESC;
            transObj.location = record?.ENTRY_LOCATION;
            transObj.entryByName = record?.ENTERED_BY_NAME;
            transObj.comments = record?.COMMENTS;
            transObj.controlException = record?.CONTROL_DEVIATION.split(",");
            let tempControlException = [
              ...transObj.controlException.filter((i: string) => i !== ""),
            ];
            transObj.controlException = [...tempControlException];

            Obj.push(transObj);
          }
        );

        setTotalTransactions(getTransResponse.data.data.totalrecords);

        //temporary variable to store keys
        let expKeys = Object.keys(getTransResponse.data.data.explainability[0]);
        let expObjArray: ControlException[] = [];
        expKeys.forEach((exception) => {
          let tempObj: any = {};
          tempObj.rule = exception.toString();
          tempObj.doccount = Number(
            getTransResponse.data.data.explainability[0][exception]
          );
          tempObj.title = titleCase(exception.toString());
          tempObj.rule_desc = "";
          expObjArray.push(tempObj);
        });
        setTransactions(Obj);
        setExplainability(expObjArray);
        setTransLoading(false);
      }
    } catch (err) { }
  };

  //for toggling the controlexceptions view
  const toggleControlView = () => {
    let temp = toggleControlExceptionView;
    setToggleControlExceptionView(!temp);
  };

  //for triggering the controlexceptions view from the transactionDetailsTable component
  const handleControlExceptionView = (transactionId: any) => {
    if (transactionId !== undefined && transactionId !== null) {
      let tempTransaction = transactions.find(
        (transaction: any) => transaction.transactionId === transactionId
      );
      if (tempTransaction !== undefined) {
        setTransControlExceptionId(transactionId);
        setTransControlExceptions(tempTransaction.controlException);
      }
    }
  };

  //catch toggle event from transactionDetailsTable
  const handleEventControlExceptions = (toggle: boolean) => {
    setToggleControlExceptionView(toggle);
  };

  const handlePageChange = (event: any, newPage: number) => {
    console.log("newPage:", newPage);
    setPage(newPage);
    getTransactions(newPage, perPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
    getTransactions(0, parseInt(event.target.value, 10));
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const generateFilterConfig = (data: any) => {
      let response = data;
      let keys = Object.keys(response);
      let configCopy: Config[] = [...config];
      keys.forEach((key: any) => {
        config.forEach((filter, index) => {
          if (filter.filterName === key) {
            let Obj: any[] = [];
            switch (key) {
              case "apcompanies":
                response[key].forEach((companyItem: any) => {
                  companyItem.text = companyItem.COMPANY_CODE;
                  companyItem.value = companyItem.COMPANYID;
                  delete companyItem.COMPANY_CODE;
                  delete companyItem.COMPANYID;
                  Obj.push(companyItem);
                });
                configCopy[index].data = [...Obj];
                break;
              case "aprules":
                response[key].forEach((rulesItem: any) => {
                  // rulesItem.value = rulesItem.CONTROL_KEY;
                  // rulesItem.text = rulesItem?.CONTROL_NAME;
                  // delete rulesItem.CONTROL_KEY;
                  // delete rulesItem.CONTROL_NAME;
                  Obj.push(rulesItem);
                });
                configCopy[index].data = [...Obj];
                break;
              default:
                break;
            }
          }
        });
      });
      setFilterConfig([...configCopy]);
      isMounted && getTransactions(page, perPage);
    };

    const getFilters = async () => {
      try {
        let getFilterArray: string[] = [];
        config.forEach((item) => {
          if (item.filterName) {
            getFilterArray.push(item.filterName);
          }
        });
        let formData = new FormData();
        formData.append("filtertype", getFilterArray.join(","));
        formData.append("audit_id",  getPath.getPathValue("audit_id"));
        formData.append("client_id", getPath.getPathValue("client_id"));
        setIsLoading(true);
        const response = await Axios.post(GET_FILTERS_URL, formData, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
        isMounted && generateFilterConfig(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    //checking if the route was triggered from transactions tab
    if (APTransDetailsDrillThrough.IsDrillThrough === true) {
      if (APTransDetailsDrillThrough.config.document.ENTRY_ID !== 0) {
        getFilters();
      }
      dispatch(updateAPTransDetailsDrillThrough(false));
    } else if (document.ENTRY_ID !== 0) {
      getTransactions(page, perPage);
    } else {
      //if the route was not triggered from transactions tab,
      //route the user back to transactions tab
      handleNavigateBack();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    console.log(document, "document")
    console.log(document?.SELECTED_TRANSACTIONS, document?.SELECTED_TRANSACTIONS, "document?.SELECTED_TRANSACTIONS")
    setInitSelectedTrans(
      transformSelectedTrans(
        document?.SELECTED_TRANSACTIONS !== null && document?.SELECTED_TRANSACTIONS !== undefined
          ? document?.SELECTED_TRANSACTIONS!
          : ""
      )!
    );
    setRiskLevel(riskLevelData);
  }, [document, riskLevelData]);

  return (
    <div className="flex flex-col p-7">
      <div className="flex flex-row items-center">
        <Button
          className="flex flex-row gap-2"
          sx={{ textTransform: "none" }}
          onClick={handleNavigateBack}
        >
          <span className="text-[#0091ea]">
            <ArrowBackIosNewIcon
              className=""
              sx={{ fontSize: "15px", verticalAlign: "-0.1rem" }}
            />
          </span>
          <span className="font-roboto font-bold text-md text-[#1976d2]">
            Back to Documents List
          </span>
        </Button>
      </div>
      <div className="flex flex-row w-full shadow-lg border border-solid border-slate-300 rounded-lg">
        <div className="flex flex-col md:flex-row gap-3 md:gap-2 w-full p-5">
          <div className="flex flex-row md:flex-col flex-1 md:gap-3 justify-between">
            <div className="font-roboto text-slate-500">
              ACCOUNTING DOCUMENTS
            </div>
            <div className="font-roboto font-bold text-slate-700">
              {APTransDetailsDrillThrough.config.document?.ENTRY_ID !== null
                ? APTransDetailsDrillThrough.config.document?.ENTRY_ID
                : document?.ENTRY_ID}
            </div>
          </div>
          <div className="flex flex-row md:flex-col flex-1 md:gap-3 justify-between">
            <div className="font-roboto text-slate-500">COMPANY</div>
            <div className="font-roboto font-bold text-slate-700">
              {APTransDetailsDrillThrough.config.document?.COMPANY_CODE_NAME !==
                null
                ? APTransDetailsDrillThrough.config.document?.COMPANY_CODE_NAME
                : document?.COMPANY_CODE_NAME}
            </div>
          </div>
          <div className="flex flex-row md:flex-col flex-1 md:gap-3 justify-between">
            <div className="font-roboto text-slate-500">POSTED BY</div>
            <div className="font-roboto font-bold text-slate-700">
              {APTransDetailsDrillThrough.config.document?.POSTED_BY_NAME !==
                null
                ? APTransDetailsDrillThrough.config.document?.POSTED_BY_NAME
                : document?.POSTED_BY_NAME}
            </div>
          </div>
          <div className="flex flex-row md:flex-col flex-1 md:gap-3 justify-between">
            <div className="font-roboto text-slate-500">ACCOUNTING DATE</div>
            <div className="font-roboto font-bold text-slate-700">
              {APTransDetailsDrillThrough.config.document?.POSTED_DATE !== null
                ? APTransDetailsDrillThrough.config.document?.POSTED_DATE.split(
                  " "
                )[0]
                : document?.POSTED_DATE?.split(" ")[0]}
            </div>
          </div>
          <div className="flex flex-row md:flex-col flex-1 md:gap-3 justify-between">
            <div className="font-roboto text-slate-500">POSTED LOCATION</div>
            <div className="font-roboto font-bold text-slate-700">
              {APTransDetailsDrillThrough.config.document
                ?.POSTED_LOCATION_NAME !== null
                ? APTransDetailsDrillThrough.config.document
                  ?.POSTED_LOCATION_NAME
                : document?.POSTED_LOCATION_NAME}
            </div>
          </div>
          <div className="flex flex-row md:flex-col flex-1 md:gap-3 justify-between">
            <div className="font-roboto text-slate-500">INVOICE NUMBER</div>
            <div className="font-roboto font-bold text-slate-700">
              {APTransDetailsDrillThrough.config.document?.INVOICE_NUMBER !==
                null
                ? APTransDetailsDrillThrough.config.document?.INVOICE_NUMBER
                : document?.INVOICE_NUMBER}
            </div>
          </div>
          <div className="flex flex-row md:flex-col flex-1 md:gap-3 justify-between">
            <div className="font-roboto text-slate-500">AMOUNT</div>
            <div className="font-roboto font-bold text-slate-700">
              {currencySymbol}
              <CurrencyFormat
                displayType={"text"}
                thousandSeparator={true}
                value={
                  APTransDetailsDrillThrough.config.document?.DEBIT_AMOUNT !==
                    null
                    ? APTransDetailsDrillThrough.config.document?.DEBIT_AMOUNT
                    : document?.DEBIT_AMOUNT
                }
              />
            </div>
          </div>
          <div className="flex flex-row md:flex-col flex-1 md:gap-3 justify-between">
            <div className="font-roboto text-slate-500">RISK SCORE</div>
            <div className="flex">
              <div
                className={`rounded-lg md:w-12 p-1 text-center text-white font-roboto font-bold ${APTransDetailsDrillThrough.config.riskLevel.range_high !==
                  null
                  ? APTransDetailsDrillThrough.config.document.riskScore >=
                    APTransDetailsDrillThrough.config.riskLevel.range_high
                    ? "bg-[#d60000]"
                    : APTransDetailsDrillThrough.config.document.riskScore >=
                      APTransDetailsDrillThrough.config.riskLevel.range_medium
                      ? "bg-[#f2641a]"
                      : APTransDetailsDrillThrough.config.document.riskScore >=
                        APTransDetailsDrillThrough.config.riskLevel.range_low
                        ? "bg-[#f5af2d]"
                        : "bg-[#00A4DF]"
                  : document.riskScore >= riskLevel.range_high
                    ? "bg-[#d60000]"
                    : document.riskScore >= riskLevel.range_medium
                      ? "bg-[#f2641a]"
                      : document.riskScore >= riskLevel.range_low
                        ? "bg-[#f5af2d]"
                        : "bg-[#00A4DF]"
                  }`}
              >
                {APTransDetailsDrillThrough.config.document.riskScore !== null
                  ? APTransDetailsDrillThrough.config.document.riskScore
                  : document.riskScore}
                %
              </div>
            </div>
          </div>
        </div>
      </div>
      <AssignTaskPopUp
        open={open}
        handleClose={handleClose}
        title={popupTitle}
        transactions={
          initSelectedTrans?.length ? initSelectedTrans : selectedTransIds
        }
        accountDocCodeId={Number(document?.ENTRY_ID)}
        accountDoc_Code={document?.ACCOUNT_DOC_ID}
      />
      <CloseTaskPopUp
        open={closeTaskOpen}
        handleClose={handleClose}
        title={popupTitle}
        transactions={
          initSelectedTrans?.length ? initSelectedTrans : selectedTransIds
        }
        accountDocCodeId={Number(document?.ENTRY_ID)}
        accountDoc_Code={document.ACCOUNT_DOC_ID}
        isDeviation={Number(document.ISDEVIATION)}
      />
      <FeedBackPopUp
        open={feedbackOpen}
        handleClose={handleClose}
        title={popupTitle}
        transactions={
          initSelectedTrans?.length ? initSelectedTrans : selectedTransIds
        }
        accountDocCodeId={Number(document?.ENTRY_ID)}
        accountDoc_Code={document.ACCOUNT_DOC_ID}
      />
      <div className="flex flex-row w-full mt-5 gap-5">
        <div className="flex flex-col w-full">
          <TransactionDetailsTable
            rowData={transactions}
            riskLevel={riskLevelData}
            reviewStatusId={document.REVIEWSTATUSID}
            subrStatusId={document.SUBRSTATUSID ? document.SUBRSTATUSID : 0}
            roleId={roleId}
            userId={userId}
            assignedBy={Number(document.ASSIGNED_BY)}
            assignedTo={Number(document.ASSIGNED_TO)}
            transLoading={transLoading}
            handlePopUp={handlePopUp}
            handleSelectedTrans={handleSelectedTrans}
            initialSelectedTrans={initSelectedTrans}
            accountDocCode={Number(document.ACCOUNT_DOC_ID)}
            handleControlExceptionView={handleControlExceptionView}
            handleEventControlExceptions={handleEventControlExceptions}
            totalTransactions={totalTransactions}
            tablePage={page}
            tablePerPage={perPage}
          />
          <TransactionDetailsPagination
            rowsPerPageOptions={[5, 10, 25]}
            count={totalTransactions}
            rowsPerPage={perPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        <div
          className={`hidden md:${!toggleControlExceptionView ? "flex" : "hidden"
            } md:w-3/12`}
        >
          <div className="flex flex-col w-full h-min p-5 shadow-lg border border-solid border-slate-300 rounded-lg">
            <div className="flex flex-row font-roboto font-bold justify-between">
              <span className="flex">Control Exceptions</span>
              <span className="grow item-center justify-center">
                <div
                  className={`flex-row-reverse pr-2 ${!transLoading ? "hidden" : "flex"
                    }`}
                >
                  <CircularProgress size={20} />
                </div>
              </span>
            </div>
            <Divider className="mt-2" />
            {explainability.map((exception) => {
              return exception.doccount ? (
                <div
                  key={exception.title}
                  className="flex flex-row w-full justify-between mt-3"
                >
                  <div className="font-roboto text-sm text-[#1976d2]">
                    {exception.title}
                  </div>
                  <div className="font-roboto text-sm">
                    {exception.doccount}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
        <div
          className={`hidden md:${toggleControlExceptionView ? "flex" : "hidden"
            } md:w-3/12`}
        >
          <div className="flex flex-col w-full h-min p-5 shadow-lg border border-solid border-slate-300 rounded-lg">
            <div className="flex flex-row font-roboto font-bold justify-between my-auto">
              <span className="flex my-auto">
                Transaction {transControlExceptionId}
              </span>
              <span className="grow item-center justify-center my-auto">
                <div className="flex flex-row-reverse pr-2 my-auto">
                  <Button onClick={toggleControlView}>
                    <CloseIcon />
                  </Button>
                </div>
              </span>
            </div>
            <Divider className="mt-2" />
            {transControlExceptions.map((exception) => {
              return exception ? (
                <div className="flex flex-row w-full justify-between mt-3">
                  <div className="font-roboto text-sm text-[#1976d2]">
                    {exception}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
      <AlertComponent
        openAlert={openAlert}
        handleClose={handleAlertClose}
        message={alertMessage}
        vertical={"bottom"}
        horizontal={"center"}
        severity={"success"}
      />
    </div>
  );
};

export default TransactionDetails;
