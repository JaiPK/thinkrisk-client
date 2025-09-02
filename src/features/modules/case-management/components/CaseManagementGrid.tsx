import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import axios from "../../../../api/axios";
import numberSuffixPipe from "../../../../shared/helpers/numberSuffixPipe";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { alpha } from "@mui/material/styles";
import AssignTaskPopUp from "./popups/AssignTaskPopUp";
import FeedBackPopUp from "./popups/FeedBackPopUp";
import CloseTaskPopUp from "./popups/CloseTaskPopUp";
import { glWorkFlow } from "../../../../shared/helpers/workFlow";
import { ActionButton } from "../../../../shared/models/workFlowItems";
import TablePagination from "@mui/material/TablePagination";
import TableFooter from "@mui/material/TableFooter";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CommentsPopOver from "../../../../shared/ui/pop-overs/CommentsPopOver";
import FormControl from "@mui/material/FormControl";
import { RiskLevelItem, RiskLevel } from "../../../../shared/models/records";
import {
  Badge,
  Checkbox,
  CircularProgress,
  Stack,
  TableSortLabel,
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import PositionedMenu from "../../dashboard/generalLedger/transactions/components/TransactionExport";
import PrintIcon from "@mui/icons-material/Print";
import { CheckBox, Label } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { visuallyHidden } from "@mui/utils";

const RISK_TRANSACTIONS = "/v1/je/transactions";
const PRINT_TOKEN = "v1/print/token";
const GET_ASSIGN_COMMENTS = "v1/casemgmt/getassigncomments";
const SAVE_REVIWE_COMMENT = "v1/casemgmt/savereviewcomment";
const GET_REVIWE_COMMENT = "v1/casemgmt/getreviewcomments";
const POST_ASSIGN_TASK_URL = "v1/je/assignuser";

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
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  actionButtons: ActionButton[];
  initSelected: number[];
  reviewStatusId: number;
}

function createData(
  ACCOUNTDOCID: number,
  ACCOUNTDOC_CODE: string,
  COMPANY_CODE_NAME: string,
  POSTED_LOCATION_NAME: string,
  POSTED_BY_NAME: string,
  POSTED_DATE: string,
  DEBIT_AMOUNT: string,
  CREDIT_AMOUNT: string,
  BLENDED_RISK_SCORE: string,
  CONTROL_DEVIATION: string,
  REVIEW_STATUS_CODE: string,
  ASSIGNED_BY_NAME: string,
  ASSIGNED_TO_NAME: string,
  ASSIGNED_ON: string,
  COMPANY_CODE: string,
  SUBRSTATUSID: number,
  REVIEWSTATUSID: number,
  ASSIGNED_BY: number,
  ASSIGNED_TO: number,
  COMMENTS: number,
  ISDEVIATION: number,
  SUB_R_STATUS_CODE: string,
  SELECTED: any[]
) {
  return {
    ACCOUNTDOCID,
    ACCOUNTDOC_CODE,
    COMPANY_CODE_NAME,
    POSTED_LOCATION_NAME,
    POSTED_BY_NAME,
    POSTED_DATE,
    DEBIT_AMOUNT,
    CREDIT_AMOUNT,
    BLENDED_RISK_SCORE,
    CONTROL_DEVIATION,
    REVIEW_STATUS_CODE,
    ASSIGNED_BY_NAME,
    ASSIGNED_TO_NAME,
    ASSIGNED_ON,
    COMPANY_CODE,
    SUBRSTATUSID,
    REVIEWSTATUSID,
    ASSIGNED_BY,
    ASSIGNED_TO,
    COMMENTS,
    ISDEVIATION,
    SUB_R_STATUS_CODE,
    SELECTED,
  };
}

const StyledTableCell = styled(TableCell)({
  padding: 3,
  fontSize: "11px",
});

const StyledTableHead = styled(TableHead)({
  fontSize: "11px",
  fontWeight: 700,
});

function Row(props: {
  row: ReturnType<typeof createData>;
  reviewStatus: string;
}) {
  let riskLevels = useAppSelector((state) => state.GLDataSlice.risk_level);
  const { row } = props;
  const [open1, setOpen1] = React.useState(false);

  const [transactions, setTransactions] = React.useState<any>([]);
  const Axios = axios;
  const [documentID, setDocumentID] = React.useState<any>(0);
  const [assignComments, setAssignComments] = useState<any>([]);
  const [docKey, setDocKey] = useState<any>();
  const [isShowAssigner, setIsShowAssigner] = useState(false);
  const [isShowAssignee, setIsShowAssignee] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [isAssigner, setIsAssigner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currencySymbol = localStorage.getItem("CurrencySymbol");

  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected, actionButtons, initSelected, reviewStatusId } = props;
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        <div className="flex flex-row-reverse min-w-max gap-3">
          {isLoading == true ? (
            <CircularProgress
              style={{ color: " rgb(116, 187, 251)" }}
              size={20}
              color="secondary"
            />
          ) : (
            ""
          )}
          {actionButtons.length
            ? actionButtons.map((actionButton) => (
                <Button
                  className={`bg-[#0091ea] text-white  disabled:bg-slate-300 disabled:text-slate-500 ${
                    actionButton.show ? "flex" : "hidden"
                  }`}
                  disabled={disableButton(
                    reviewStatusId,
                    numSelected,
                    actionButton
                  )}
                  style={{ textTransform: "none" }}
                  key={actionButton.text}
                  onClick={() => {
                    handlePopUp(actionButton.text);
                  }}
                >
                  {actionButton.text}
                </Button>
              ))
            : null}
        </div>
      </Toolbar>
    );
  };

  const tranactionHandler = async (dockey: number, explain: any, page: number, perPage: number) => {
    try {
      let formData = new FormData();
      setDocumentID(dockey);

      formData.append("page", (page + 1).toString());
      formData.append("perpage", perPage.toString());
      formData.append("sortkey", "BLENDED_RISK_SCORE");
      formData.append("sortorder", "desc");
      formData.append("ACCOUNTDOCID", dockey.toString());
      formData.append("exp", "");
      if (explain) {
        formData.append("exp", explain.toString());
      }
      const getUsersResponse = await Axios.post(RISK_TRANSACTIONS, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });

      setTransactions(getUsersResponse.data.data.records);
      setReviewTotal(getUsersResponse.data.data.totalrecords);

      setTotalSum(getUsersResponse.data.data.totalsum[0]);
      setExplain(getUsersResponse.data.data.explainability[0]);

      const listOfKeys = Object.keys(
        getUsersResponse.data.data.explainability[0]
      );

      const listOfExplain = [{}];
      //console.log("explain full", getUsersResponse.data.data.explainability[0]);
      listOfKeys.forEach((element: string) => {
        //console.log("explain", getUsersResponse.data.data.explainability[0][element]);
        if (Number(getUsersResponse.data.data.explainability[0][element]) > 0) {
          let Obj: { value: string; text: string } = { value: "", text: "" };
          Obj.value = element;
          Obj.text =
            element +
            " " +
            getUsersResponse.data.data.explainability[0][element];
          listOfExplain.push(Obj);
          //console.log("list of keys", listOfExplain)
        }
      });
      setExplainFinal(listOfExplain);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const handleChangeExplain = (event: SelectChangeEvent) => {
    setExplainValue(event.target.value);
    tranactionHandler(documentID, event.target.value,reviewPage,reviewRowsPerPage);
  };

  const handleOpen1 = (dockey: number, row: any) => {
    const userId: number = Number(
      JSON.parse(localStorage.getItem("THR_USER")!)?.userId
    );
    if (userId == row.ASSIGNED_BY) {
      setIsShowAssigner(true);
      getAssignComments(dockey);
    }
    if (userId == row.ASSIGNED_TO) {
      setIsShowAssignee(true);
      getAssignComments(dockey);
      getReviewComment(dockey);
    }
    if (userId == row.ASSIGNED_BY && userId == row.ASSIGNED_TO) {
      setIsShowAssignee(false);
      setIsAssigner(true);
      getAssignComments(dockey);
    }
    getReviewComment(dockey);
    setDocKey(dockey);
    tranactionHandler(dockey,null,reviewPage,reviewRowsPerPage);
    setOpen1(!open1);
  };
  const getAssignComments = async (docId: any) => {
    let formData = new FormData();
    formData.append("accdoc_id", docId);
    try {
      const getAssignComments = await Axios.post(
        GET_ASSIGN_COMMENTS,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        }
      );
      if(getAssignComments.data.data){
        setAssignComments(getAssignComments.data.data[0].COMMENTS);
      }
      // console.log(getAssignComments.data.data[0].COMMENTS, "getAssignComments")
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
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
  const disableButton = (
    reviewStatusId: number,
    numSelected: number,
    actionButton: ActionButton
  ) => {
    switch (reviewStatusId) {
      case 1:
        if (actionButton.disabled === true && numSelected === 0) {
          return true;
        }
        if (actionButton.disabled === true && numSelected > 0) {
          return false;
        }
        break;
      case 2:
        if (actionButton.disabled === true) {
          return true;
        } else {
          return false;
        }
        break;
      default:
        break;
    }
  };
  // comments
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState(0);
  const [selectedAccDocCommentId, setSelectedAccDocCommentId] = useState(0);
  const open_comments = Boolean(anchorEl);
  const handleClose_comments = () => {
    setAnchorEl(null);
    setSelectedCommentId(0);
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const setNewAccDocTransactionId = (transId: number) => {
    console.log("acc_commentid invoked:",transId);
    setSelectedAccDocCommentId(transId);
  };

  const setNewTransactionId = (transId: number) => {
    console.log("transactionId invoked:",transId);
    setSelectedCommentId(transId);
  };

  const [anchorEl_ACCDOC, setAnchorEl_ACCDOC] =
    useState<HTMLButtonElement | null>(null);
  const open_comments_ACCDOC = Boolean(anchorEl_ACCDOC);
  const handleClose_comments_ACCDOC = () => {
    setAnchorEl_ACCDOC(null);
    setNewAccDocTransactionId(0);
  };
  const handleClick_ACCDOC = (event: any) => {
    console.log("handleClick_ACCDOC invoked");
    setAnchorEl_ACCDOC(event.currentTarget);
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
        //console.log("recall");
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
    try{
    setIsLoading(true);
    let formData = new FormData();
    formData.append("ACCOUNTDOCID", row.ACCOUNTDOCID.toString());
    formData.append("COMMENTS", "Recalled");
    formData.append("TRANSACTIONS", "null");
    formData.append("ASSIGNED_TO", userId.toString());

    const recallResponse = await Axios.post(POST_ASSIGN_TASK_URL, formData, {
      headers: {
        Authorization: localStorage.getItem("TR_Token") as string,
      },
    }).catch((error) => {
      console.log("error:", error);
      return;
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    if (
      recallResponse?.data?.data ||
      recallResponse?.data?.message === "Assigned successfully."
    ) {
      setAlertMessage(recallResponse.data.message);
      setOpenAlert(true);
      setTimeout(() => {
        // Run after 100 milliseconds

        handleNavigateBack();
      }, 2000);
    }
  }
  catch(error:any){
    if (error.response.status === 401) {
      localStorage.clear();
      navigate("/login");
    }
  }
  };
  const [popupTitle, setPopupTitle] = useState("");
  const [selectedTrans, setSelectedTrans] = useState<Data[]>([]);
  const [selectedTransIds, setSelectedTransIds] = useState<number[]>([]);
  const [initSelectedTrans, setInitSelectedTrans] = useState<number[]>([]);
  const navigate = useNavigate();
  const handleNavigateBack = () => {
    window.location.reload();
  };
  const roleId: number = Number(
    JSON.parse(localStorage.getItem("THR_USER")!)?.roleId
  );
  const userId: number = Number(
    JSON.parse(localStorage.getItem("THR_USER")!)?.userId
  );
  const [actionButtons, setActionButtons] = useState<ActionButton[]>(
    glWorkFlow(
      row.REVIEWSTATUSID,
      row.SUBRSTATUSID,
      roleId,
      userId,
      row.ASSIGNED_BY,
      row.ASSIGNED_TO
    )
  );
  const [reviewPage, setReviewPage] = React.useState(0);
  const [reviewRowsPerPage, setReviewRowsPerPage] = React.useState(5);
  const [reviewTotal, setReviewTotal] = React.useState(0);
  const [totalSum, setTotalSum] = React.useState({
    totalcredit: 0,
    totaldebit: 0,
  });
  const [explain, setExplain] = React.useState<any>({});
  const [explainValue, setExplainValue] = React.useState("");
  const [explainFinal, setExplainFinal] = React.useState<any>([]);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(riskLevels);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setReviewPage(newPage);
    tranactionHandler(row.ACCOUNTDOCID,null,newPage,reviewRowsPerPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReviewRowsPerPage(parseInt(event.target.value, 10));
    setReviewPage(0);
    tranactionHandler(row.ACCOUNTDOCID,null,0,parseInt(event.target.value, 10));
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
  const [csvToken, setCsvToken] = useState("");
  const csv = async () => {
    try {
      const response = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setCsvToken(response.data.data.Token);
      const REACT_APP_BASE_URL = "https:" + "//" + window.location.hostname + ":8443/public/index.php/";
      // const REDIRECT = `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${accountDocCode}`
      //window.location.href = `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${accountDocCode}`
      //     console.log(REDIRECT,"REDIRECT")
      // navigate(REDIRECT)
      // const u = encodeURIComponent(JSON.stringify(""));
      // console.log("u",u);
      window.open(
        `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${row.ACCOUNTDOCID}`
      );
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getCsvData = () => {
    csv();
  };

  const excel = async () => {
    try {
      const response = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setCsvToken(response.data.data.Token);
      const REACT_APP_BASE_URL = "https:" + "//" + window.location.hostname + ":8443/public/index.php/";
      // const REDIRECT = `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${accountDocCode}`
      //window.location.href = `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${accountDocCode}`
      //     console.log(REDIRECT,"REDIRECT")
      // navigate(REDIRECT)
      // const u = encodeURIComponent(JSON.stringify(""));
      // console.log("u",u);
      window.open(
        `${REACT_APP_BASE_URL}v1/excel/${response.data.data.Token}/riskaccdoccasem?ACCOUNTDOCID=${row.ACCOUNTDOCID}`
      );
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getExcelData = () => {
    excel();
  };

  const print = async () => {
    try {
      const response = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      // setCsvToken(response.data.data.Token)
      const REACT_APP_BASE_URL = "https:" + "//" + window.location.hostname + ":8443/public/index.php/";
      window.open(
        `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/riskaccdoccasem?ACCOUNTDOCID=${row.ACCOUNTDOCID}`
      );
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    // getRiskConfig();
    setActionButtons(
      glWorkFlow(
        row.REVIEWSTATUSID,
        row.SUBRSTATUSID,
        roleId,
        userId,
        row.ASSIGNED_BY,
        row.ASSIGNED_TO
      )
    );
  }, []);

  const [eventVal, setEventVal] = useState<any>();
  const [reviewComments, setReviewComments] = useState<any>();
  const [isButtonEnable, setIsButtonEnable] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const handleMessageChange = (event: any) => {
    setEventVal(event.target.value);
    setIsButtonEnable(true);
  };

  const saveComments = async () => {
    let formData = new FormData();
    formData.append("accdoc_id", docKey);
    formData.append("rcomment", eventVal);
    try {
      const saveComments = await Axios.post(SAVE_REVIWE_COMMENT, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setIsSave(true);
      setIsShow(true);
      setTimeout(() => {
        setIsShow(false);
      }, 3000);
      //console.log(saveComments, "saveComments")
      getReviewComment(docKey);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getReviewComment = async (docKey: any) => {
    let formData = new FormData();
    formData.append("accdoc_id", docKey);
    try {
      const getReviewComments = await Axios.post(GET_REVIWE_COMMENT, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      if(getReviewComments.data?.data){
        setReviewComments(getReviewComments.data?.data[0]?.REVIEWCOMMENTS);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const nestedTableHeaders: any = [
    {
      id: "",
      title: "",
    },
    {
      id: "TRANSACTIONID",
      title: "Transaction Number",
    },
    {
      id: "LOCATION_CODE",
      title: "Entered Location",
    },
    {
      id: "",
      title: "Entered Function",
    },
    {
      id: "ENTERED_BY_NAME",
      title: "Entered By",
    },
    {
      id: "ENTERED_DATE",
      title: "Entered Date",
    },
    {
      id: "ACCOUNT_CODE",
      title: "Account",
    },

    {
      id: "DESCRIPTION",
      title: "Account Description",
    },
    {
      id: "DEBIT_AMOUNT",
      title: "Debit Amount",
    },
    {
      id: "CREDIT_AMOUNT",
      title: "Credit Amount",
    },
    {
      id: "RULES_RISK_SCORE",
      title: "Risk Score",
    },
    {
      id: "CONTROL_DEVIATION",
      title: "Control Deviations",
    },
    {
      id: "SUB_R_STATUS_CODE",
      title: "Review Status",
    },
    {
      id: "COMMENTS",
      title: "Comments",
    },
  ];
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
  const [order, setOrder] = useState<any>("asc");
  const [orderBy, setOrderBy] = useState<any>("TRANSACTIONID");

  const createNestedSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      const sortBy = property;
      if (sortBy) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        transactions.sort(
          (a: { [x: string]: number }, b: { [x: string]: number }) => {
            if (sortDirection === "asc") {
              if (
                String(sortBy) === "DEBIT_AMOUNT" ||
                String(sortBy) === "CREDIT_AMOUNT"
              ) {
                if (Number(a[sortBy]) < Number(b[sortBy])) {
                  return -1;
                }
                if (Number(a[sortBy]) > Number(b[sortBy])) {
                  return 1;
                }
              } else {
                if (a[sortBy] < b[sortBy]) {
                  return -1;
                }
                if (a[sortBy] > b[sortBy]) {
                  return 1;
                }
              }
            }
            if (sortDirection === "desc") {
              if (
                String(sortBy) === "DEBIT_AMOUNT" ||
                String(sortBy) === "CREDIT_AMOUNT"
              ) {
                if (Number(a[sortBy]) > Number(b[sortBy])) {
                  return -1;
                }
                if (Number(a[sortBy]) < Number(b[sortBy])) {
                  return 1;
                }
              } else {
                if (a[sortBy] > b[sortBy]) {
                  return -1;
                }
                if (a[sortBy] < b[sortBy]) {
                  return 1;
                }
              }
            }
            return 0;
          }
        );
      } else {
        setSortDirection("asc");
      }
    };
  return (
    <React.Fragment>
      <AssignTaskPopUp
        open={open}
        handleClose={handleClose}
        title={popupTitle}
        transactions={
          initSelectedTrans?.length ? initSelectedTrans : selectedTransIds
        }
        accountDocCodeId={Number(row.ACCOUNTDOCID)}
        accountDoc_Code={row.ACCOUNTDOC_CODE}
      />
      <CloseTaskPopUp
        open={closeTaskOpen}
        handleClose={handleClose}
        title={popupTitle}
        transactions={
          initSelectedTrans?.length ? initSelectedTrans : selectedTransIds
        }
        accountDocCodeId={Number(row.ACCOUNTDOCID)}
        accountDoc_Code={row.ACCOUNTDOC_CODE}
        isDeviation={row.ISDEVIATION}
      />
      <FeedBackPopUp
        open={feedbackOpen}
        handleClose={handleClose}
        title={popupTitle}
        transactions={
          initSelectedTrans?.length ? initSelectedTrans : selectedTransIds
        }
        accountDocCodeId={Number(row.ACCOUNTDOCID)}
        accountDoc_Code={row.ACCOUNTDOC_CODE}
      />
      <TableRow key={1} sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.ACCOUNTDOC_CODE}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.COMPANY_CODE_NAME}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.POSTED_LOCATION_NAME}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.POSTED_BY_NAME}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.POSTED_DATE.split(" ")[0]}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {currencySymbol}
          {numberSuffixPipe(Number(row.DEBIT_AMOUNT))}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {currencySymbol}({numberSuffixPipe(Number(row.CREDIT_AMOUNT))})
        </StyledTableCell>
        <StyledTableCell
          onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}
          className={
            Number(row.BLENDED_RISK_SCORE) * 100 >= riskLevel.range_high
              ? "bg-[#ff4b3d] opacity-80 text-white"
              : Number(row.BLENDED_RISK_SCORE) * 100 >= riskLevel.range_medium
              ? "bg-[#f2641a] opacity-80 text-white"
              : Number(row.BLENDED_RISK_SCORE) * 100 >= riskLevel.range_low
              ? "bg-[#f5af2d] opacity-80 text-white"
              : "bg-[#00A4DF]"
          }
        >
          {(Number(row.BLENDED_RISK_SCORE) * 100).toFixed(2)}%
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.CONTROL_DEVIATION}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.SUB_R_STATUS_CODE}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.ASSIGNED_BY_NAME}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.ASSIGNED_TO_NAME}
        </StyledTableCell>
        <StyledTableCell onClick={() => handleOpen1(row.ACCOUNTDOCID, row)}>
          {row.ASSIGNED_ON.split(" ")[0]}
        </StyledTableCell>
        <StyledTableCell>
          <Button
            onClick={(event) => {
              setNewAccDocTransactionId(Number(row.ACCOUNTDOCID));
              handleClick_ACCDOC(event);
            }}
          >
            <Badge
              className="flex"
              badgeContent={String(row?.COMMENTS)}
              color="primary"
            >
              <ForumIcon color="action" />
            </Badge>
          </Button>
          {/* <CommentsPopOver
            open={open_comments_ACCDOC}
            anchorEl={anchorEl_ACCDOC}
            handleClose={handleClose_comments_ACCDOC}
            module={"je"}
            docId={selectedAccDocCommentId}
            type={"doc"}
          /> */}
        </StyledTableCell>
        <CommentsPopOver
          open={open_comments_ACCDOC}
          anchorEl={anchorEl_ACCDOC}
          handleClose={handleClose_comments_ACCDOC}
          module={"je"}
          docId={selectedAccDocCommentId}
          type={"doc"}
        />
      </TableRow>
      <TableRow key={2}>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={14}
        >
          <Collapse in={open1} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0, width: "100%" }}>
              <Typography variant="h6" gutterBottom component="div">
                Accounting Doc # {row.ACCOUNTDOC_CODE}
              </Typography>
              <FormControl variant="standard" sx={{ mb: 5, minWidth: 200 }}>
                <InputLabel id="explain">Explainability</InputLabel>
                <Select
                  labelId="explain"
                  id="explain"
                  value={explainValue}
                  onChange={handleChangeExplain}
                  label="Explainability"
                >
                  {explainFinal.length > 0 &&
                    explainFinal.map((item: any, index: number) => {
                      return (
                        <MenuItem key={index} value={item.value}>
                          {item.text}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <PositionedMenu
                getCsvData={getCsvData}
                getExcelData={getExcelData}
              />
              <Button onClick={print}>
                <PrintIcon />
              </Button>
              <Table size="medium">
                <TableHead style={{ backgroundColor: "#e3e4e6" }}>
                  <TableRow sx={{ margin: 1, width: "100%" }}>
                    {nestedTableHeaders?.map(
                      (nestedHeader: any, index: any) => (
                        <StyledTableCell>
                          <TableSortLabel
                            // active={orderBy === header.id}
                            direction={sortDirection}
                            onClick={createNestedSortHandler(nestedHeader.id)}
                            key={index}
                          >
                            {nestedHeader.title}
                            {orderBy === nestedHeader.id ? (
                              <Box component="span" sx={visuallyHidden}>
                                {order === "desc"
                                  ? "sorted descending"
                                  : "sorted ascending"}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        </StyledTableCell>
                      )
                    )}
                    {/* <StyledTableCell>Transaction Number</StyledTableCell>
                                        <StyledTableCell>Entered Location</StyledTableCell>
                                        <StyledTableCell>Entered Function</StyledTableCell>
                                        <StyledTableCell>Entered By</StyledTableCell>
                                        <StyledTableCell>Entered Date</StyledTableCell>
                                        <StyledTableCell>Account</StyledTableCell>
                                        <StyledTableCell>Account Description</StyledTableCell>
                                        <StyledTableCell>Debit Amount</StyledTableCell>
                                        <StyledTableCell>Credit Amount</StyledTableCell>
                                        <StyledTableCell>Risk Score</StyledTableCell>
                                        <StyledTableCell>Control Deviations</StyledTableCell>
                                        <StyledTableCell>Review Status</StyledTableCell>
                                        <StyledTableCell>Comments</StyledTableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ margin: 1 }}>
                  {transactions.length > 0 &&
                    transactions.map((transRow: any, index: number) => (
                      <TableRow key={index}>
                        <StyledTableCell>
                          <Checkbox
                            disabled={true}
                            checked={row.SELECTED.includes(
                              transRow.TRANSACTIONID.toString()
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {transRow.TRANSACTIONID}
                        </StyledTableCell>

                        <StyledTableCell>
                          {transRow.LOCATION_CODE}
                        </StyledTableCell>
                        <StyledTableCell>
                          {transRow.ENTERED_FUNCTION}
                        </StyledTableCell>
                        <StyledTableCell>
                          {transRow.ENTERED_BY_NAME}
                        </StyledTableCell>
                        <StyledTableCell>
                          {transRow.ENTERED_DATE}
                        </StyledTableCell>
                        <StyledTableCell>
                          {transRow.ACCOUNT_CODE}
                        </StyledTableCell>
                        <StyledTableCell>
                          {transRow.DESCRIPTION}
                        </StyledTableCell>
                        <StyledTableCell>
                          {currencySymbol}
                          {numberSuffixPipe(transRow.DEBIT_AMOUNT)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {currencySymbol}(
                          {numberSuffixPipe(transRow.CREDIT_AMOUNT)})
                        </StyledTableCell>
                        <StyledTableCell
                          className={
                            Number(transRow.BLENDED_RISK_SCORE) * 100 >=
                            riskLevel.range_high
                              ? "bg-[#ff4b3d] opacity-80 text-white"
                              : Number(transRow.BLENDED_RISK_SCORE) * 100 >=
                                riskLevel.range_medium
                              ? "bg-[#f2641a] opacity-80 text-white"
                              : Number(transRow.BLENDED_RISK_SCORE) * 100 >=
                                riskLevel.range_low
                              ? "bg-[#f5af2d] opacity-80 text-white"
                              : "bg-[#00A4DF]"
                          }
                        >
                          {(Number(transRow.BLENDED_RISK_SCORE) * 100).toFixed(
                            2
                          )}
                          %
                        </StyledTableCell>
                        <StyledTableCell>
                          {transRow.CONTROL_DEVIATION}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.SUB_R_STATUS_CODE}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Button
                            onClick={(event) => {
                              setNewTransactionId(
                                Number(transRow.TRANSACTIONID)
                              );
                              handleClick(event);
                            }}
                          >
                            <Badge
                              className="flex"
                              badgeContent={String(transRow?.COMMENTS)}
                              color="primary"
                            >
                              <ForumIcon color="action" />
                            </Badge>
                          </Button>
                          {/* <CommentsPopOver
                            open={open_comments}
                            anchorEl={anchorEl}
                            handleClose={handleClose_comments}
                            module={"je"}
                            docId={selectedCommentId}
                            type={"tr"}
                          /> */}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter style={{ backgroundColor: "#ddf5fc" }}>
                  <StyledTableCell>Total</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>
                    {currencySymbol}
                    {numberSuffixPipe(totalSum.totaldebit)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {currencySymbol}({numberSuffixPipe(totalSum.totalcredit)})
                  </StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableFooter>
              </Table>

              <div className="flex flex-wrap" style={{ margin: 9 }}>
                {isShowAssigner || isAssigner ? (
                  <div style={{ marginTop: "2vh" }}>
                    <label htmlFor="message">Assigner Comments...</label>
                    <div
                      style={{
                        backgroundColor: "#efefef",
                        borderTop: "1px solid",
                        borderBottom: "1px solid",
                        padding: "8px",
                        margin: 6,
                      }}
                    >
                      <Box>
                        <p>{assignComments}</p>
                        <textarea
                          style={{ border: "none", backgroundColor: "#efefef" }}
                          id="message"
                          name="message"
                          // value={assignComments}
                          onChange={(e: any) => handleMessageChange(e)}
                          readOnly
                        ></textarea>
                      </Box>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {isShowAssignee == true ? (
                  <>
                    <div style={{ marginTop: "2vh" }}>
                      <label htmlFor="message">Assigner Comments...</label>
                      <div
                        style={{
                          backgroundColor: "#efefef",
                          borderTop: "1px solid",
                          borderBottom: "1px solid",
                          padding: "8px",
                          margin: 6,
                        }}
                      >
                        <Box>
                          <p>{assignComments}</p>
                          <textarea
                            style={{
                              border: "none",
                              backgroundColor: "#efefef",
                            }}
                            id="message"
                            name="message"
                            // value={assignComments}
                            onChange={(e: any) => handleMessageChange(e)}
                            readOnly
                          ></textarea>
                        </Box>
                      </div>
                    </div>

                    <div style={{ marginLeft: "2%" }}>
                      <div style={{ margin: 9 }}>
                        <label htmlFor="message"> Assignee Comments...</label>
                        <div
                          style={{
                            backgroundColor: "#efefef",
                            borderTop: "1px solid",
                            borderBottom: "1px solid",
                            padding: "8px",
                            margin: 6,
                          }}
                        >
                          <Box>
                            <p>{reviewComments}</p>
                            <textarea
                              style={{
                                border: "none",
                                backgroundColor: "#efefef",
                              }}
                              id="message"
                              name="message"
                              // value=''
                              // defaultValue={reviewComments}
                              onChange={(e: any) => handleMessageChange(e)}
                            ></textarea>
                          </Box>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {/* save */}
                {isShowAssignee ? (
                  <div style={{ margin: "10vh" }}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        sx={{
                          borderRadius: "5px",
                          textTransform: "capitalize",
                          margin: "auto",
                          display: "flex",
                        }}
                        variant="contained"
                        onClick={saveComments}
                        disabled={!isButtonEnable}
                      >
                        Save
                      </Button>
                    </Stack>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {isShow ? (
                <p style={{ fontWeight: "bold", color: "green" }}>
                  Saved successfully
                </p>
              ) : (
                ""
              )}
              <EnhancedTableToolbar
                numSelected={2}
                actionButtons={actionButtons}
                initSelected={[]}
                reviewStatusId={row.REVIEWSTATUSID}
              />

              <TablePagination
                component="div"
                count={reviewTotal}
                page={reviewPage}
                onPageChange={handleChangePage}
                rowsPerPage={reviewRowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
              />
              <CommentsPopOver
                            open={open_comments}
                            anchorEl={anchorEl}
                            handleClose={handleClose_comments}
                            module={"je"}
                            docId={selectedCommentId}
                            type={"tr"}
                          />
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface Props {
  reviewStatus: string;
  sumData: any;
  selectedTrans?: any[];
  data: any;
}
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: any;
  orderBy: string;
  rowCount: number;
}

export default function CollapsibleTable(
  { data, reviewStatus, sumData, selectedTrans }: Props,
  test: EnhancedTableProps
) {
  const { onRequestSort } = test;
  const [tableData, setTableData] = useState<any>();
  interface HeadCell {
    id: any;
    title: string;
  }
  const currencySymbol = localStorage.getItem("CurrencySymbol");

  const header: readonly HeadCell[] = [
    {
      id: "ACCOUNTDOC_CODE",
      title: "Accounting Document",
    },
    {
      id: "COMPANY_CODE_NAME",
      title: "Company",
    },
    {
      id: "POSTED_LOCATION_NAME",
      title: "Posted Location",
    },
    {
      id: "POSTED_BY_NAME",
      title: "Posted By",
    },
    {
      id: "POSTED_DATE",
      title: "Posted Date",
    },
    {
      id: "DEBIT_AMOUNT",
      title: "Debit Amount",
    },
    {
      id: "CREDIT_AMOUNT",
      title: "Credit Amount",
    },
    {
      id: "BLENDED_RISK_SCORE",
      title: "Risk Score",
    },
    {
      id: "CONTROL_DEVIATION",
      title: "Control Deviation",
    },
    {
      id: "SUB_R_STATUS_CODE",
      title: "Review Status",
    },
    {
      id: "ASSIGNED_BY_NAME",
      title: "Assigned By",
    },
    {
      id: "ASSIGNED_TO_NAME",
      title: "Assigned To",
    },
    {
      id: "ASSIGNED_ON",
      title: "Assigned Date",
    },
    {
      id: "COMMENTS",
      title: "Comments",
    },
  ];

  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
  const [order, setOrder] = useState<any>("asc");
  const [orderBy, setOrderBy] = useState<any>("ACCOUNTDOC_CODE");

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      const sortBy = property;
      if (sortBy) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        data.sort((a: { [x: string]: number }, b: { [x: string]: number }) => {
          if (sortDirection === "asc") {
            if (
              String(sortBy) === "DEBIT_AMOUNT" ||
              String(sortBy) === "CREDIT_AMOUNT"
            ) {
              if (Number(a[sortBy]) < Number(b[sortBy])) {
                return -1;
              }
              if (Number(a[sortBy]) > Number(b[sortBy])) {
                return 1;
              }
            } else {
              if (a[sortBy] < b[sortBy]) {
                return -1;
              }
              if (a[sortBy] > b[sortBy]) {
                return 1;
              }
            }
          }
          if (sortDirection === "desc") {
            if (
              String(sortBy) === "DEBIT_AMOUNT" ||
              String(sortBy) === "CREDIT_AMOUNT"
            ) {
              if (Number(a[sortBy]) > Number(b[sortBy])) {
                return -1;
              }
              if (Number(a[sortBy]) < Number(b[sortBy])) {
                return 1;
              }
            } else {
              if (a[sortBy] > b[sortBy]) {
                return -1;
              }
              if (a[sortBy] < b[sortBy]) {
                return 1;
              }
            }
          }
          return 0;
        });
      } else {
        setSortDirection("asc");
      }
    };

  return (
    <>
      <TableContainer component={Paper} style={{ width: "100%" }}>
        <Table aria-label="collapsible table">
          <StyledTableHead style={{ backgroundColor: "#e3e4e6" }}>
            <TableRow>
              {header?.map((header: any, index: any) => (
                <StyledTableCell>
                  <TableSortLabel
                    // active={orderBy === header.id}
                    direction={sortDirection}
                    onClick={createSortHandler(header.id)}
                    key={index}
                  >
                    {header.title}
                    {orderBy === header.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
              {/* <StyledTableCell sx={{ width: "7%" }}>Accounting Document</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Company</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Posted Location</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Posted By</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Posted Date</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Debit Amount</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Credit Amount</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Risk Score</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Control Deviation</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Review Status</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Assigned By</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Assigned To</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Assigned Date</StyledTableCell>
                        <StyledTableCell sx={{ width: "7%" }}>Comments</StyledTableCell> */}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {data.length > 0 &&
              data.map((row: any, index: number) => (
                <Row key={index} row={row} reviewStatus={reviewStatus} />
              ))}
          </TableBody>
          <TableFooter style={{ backgroundColor: "#ddf5fc" }}>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                {currencySymbol}
                {numberSuffixPipe(sumData.totaldebit)}
              </TableCell>
              <TableCell>
                {currencySymbol}({numberSuffixPipe(sumData.totalcredit)})
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
