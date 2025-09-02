import { CircularProgress, Tooltip } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import * as ReactDOM from "react-dom";
import axios from "../../../../api/axios";
import numberSuffixPipe from "../../../../shared/helpers/numberSuffixPipe";
import CollapsibleTable from "../components/CaseManagementGrid";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FilterBar from "../../../../shared/ui/filter-bar/FilterBar";
import {
  Config,
  Filter,
  ReviewStatus,
} from "../../../../shared/models/filters";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import PositionedMenu from "../../dashboard/generalLedger/transactions/components/TransactionExport";
import PrintIcon from "@mui/icons-material/Print";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { updateOtherPage } from "../../app-slice/app-slice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { getPath } from "../../../../shared/helpers/getPath";
import { downloadCSV, downloadExcel } from "../../../../shared/helpers/downloadFile";
import CMStackBarChart from "../../../ui/Charts/CMStackBarChart";
import CMBarchart from "../../../ui/Charts/CMBarchart";
import CMColumnChart from "../../../ui/Charts/CMColumnChart";

const RISK_ASSIGNMENT = "/v1/casemgmt/getdocuments";
const RISK_HEADERS = "/v1/casemgmt/getlistheaders";
const ELAPSED_TIME = "/v1/casemgmt/elapsedtimec";
const BACK_LOG = "/v1/casemgmt/backlogassigneec";
const AUDIT_REVIEW = "/v1/casemgmt/auditreviewstatusc";
const PRINT_TOKEN = "v1/print/token";

interface filterOptions {
  assigned_by?: any;
  company_code?: any;
  toggle?: any;
  process_status?: any;
  stext?: any;
  SUBRSTATUSID?: any;
  isDeviation?: number;
  audit_id?: any;
}

const setInitData = (
  companies: any,
) => {
  let config = [
    {
      label: "Company",
      data: companies,
      filterName: "companies",
      filterType: "multi-dropdown",
      selected: [],
      active: true,
    },
    {
      label: "Assigned By",
      data: [],
      filterName: "assigned_by",
      filterType: "multi-dropdown",
      selected: [],
      active: true,
    },
    {
      label: "Analysis Data Set",
      data: [
        { text: "Above Materiality", value: 1 },
        { text: "Above Threshold", value: 2 },
        { text: "Below Threshold", value: 3 },
      ],
      filterName: "toggle",
      filterType: "single-dropdown",
      selected: 2,
      active: true,
    },

  ];



  return config;
};



const GLCaseManagement = () => {
  const navigate = useNavigate();
  const Axios = axios;
  const dispatch = useAppDispatch();
  let companies = useAppSelector((state) => state.GLDataSlice.companies);

  const [filterSetReview, setFilterSetReview] = useState<filterOptions>({
    assigned_by: [""],
    company_code: [""],
    toggle: 2,
    stext: "",
  });
  const [filterSetClosed, setFilterSetClosed] = useState<filterOptions>({
    assigned_by: [""],
    company_code: [""],
    toggle: 2,
    stext: "",
  });
  const COMPANY_DATA = "/v1/je/companies";
  const FILTER_DATA = "/v1/casemgmt/getassignbyfilter";
  const [riskDataRecordUnderReview, setRiskDataRecordUnderReview] = useState(
    {}
  );
  const [riskDataRecordClosed, setRiskDataRecordClosed] = useState({});
  const [selectedTransUnderReview, setSelectedTransUnderReview] = useState([]);
  const [selectedTransClosed, setSelectedTransClosed] = useState([]);
  const [riskUnderReviewHeader, setRiskUnderReviewHeader] = useState({
    count: 0,
    amount: 0,
  });

  const [riskClosedHeader, setRiskClosedHeader] = useState({
    count: 0,
    amount: 0,
  });
  const [reviewPage, setReviewPage] = React.useState(0);
  const [reviewRowsPerPage, setReviewRowsPerPage] = React.useState(5);
  const [reviewTotal, setReviewTotal] = React.useState(0);
  const [reviewCreditDebitSum, setReviewCreditDebitSum] = useState({
    totaldebit: 0,
    totalcredit: 0,
  });
  const [closedPage, setClosedPage] = React.useState(0);
  const [closedRowsPerPage, setClosedRowsPerPage] = React.useState(5);
  const [closedTotal, setClosedTotal] = React.useState(0);
  const [closedCreditDebitSum, setClosedCreditDebitSum] = useState({
    totaldebit: 0,
    totalcredit: 0,
  });
  const [seachText, setSearchText] = useState("");
  const [seachTextClosed, setSearchTextClosed] = useState("");
  const [backLog, setBackLog] = React.useState<Object[]>([]);
  const [elapsedTime, setElapsedTime] = React.useState<Object[]>([]);
  const [auditReview, setAuditReview] = React.useState<Object[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterConfig, setFilterConfig] = useState<Config[]>(setInitData(companies));
  const [deviationStatusReview, setDeviationStatusReview] = React.useState("1");
  const [deviationStatusClosed, setDeviationStatusClosed] = React.useState("1");
  const sTextRef = useRef<any>(null);
  const sTextRefClosed = useRef<any>(null);
  const [isRiskClosedLoading, setIsRiskClosedLoading] = useState(false)
  const [getDocument , setGetDocuments] = useState<any>([])
  const [reviewDeviation, setReviewDeviaton] = useState<any>({SUBRSTATUSID:[],isDeviation:""})
  const [closedDeviation, setClosedDeviation] = useState<any>({SUBRSTATUSID:[],isDeviation:""})
  const currencySymbol = localStorage.getItem("CurrencySymbol");

  // const [isLoading, setIsLoading] = useState(true)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setReviewPage(newPage);
    riskUnderReview(null, newPage, reviewRowsPerPage, null);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReviewRowsPerPage(parseInt(event.target.value, 10));
    setReviewPage(0);
    riskUnderReview( null,0, parseInt(event.target.value, 10),null);
  };

  const handleChangePageClosed = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setClosedPage(newPage);
    riskClosed(null, newPage, closedRowsPerPage, null);
  };
  const handleChangeRowsPerPageClosed = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setClosedRowsPerPage(parseInt(event.target.value, 10));
    setClosedPage(0);
    riskClosed(null, 0, parseInt(event.target.value, 10), null);
  };
  const handleStextEnterAction = (event: any) => {
    if (event.key === "Enter") {
      seachHandleReview();
    }
  };
  const handleStextEnterActionClosed = (event: any) => {
    if (event.key === "Enter") {
      seachHandleClosed();
    }
  };
  const seachHandleReview = () => {
    // const tempfilterSet = { ...filterSetReview };
    // tempfilterSet.stext = sTextRef.current?.value;
    // setFilterSetReview(tempfilterSet);
    riskUnderReview();
  };
  const handleChangeDeviationReview = (event: SelectChangeEvent) => {
    const tempfilterSet = { SUBRSTATUSID : ["2"], isDeviation : 1 };
    setDeviationStatusReview(event.target.value);
    if (event.target.value === "1") {
      tempfilterSet.SUBRSTATUSID = [];
      tempfilterSet.isDeviation = -10;
      // setFilterSetReview({ ...tempfilterSet });
      setReviewDeviaton({SUBRSTATUSID:[],isDeviation:""})
    } else if (event.target.value === "2") {
      tempfilterSet.SUBRSTATUSID = ["3"];
      tempfilterSet.isDeviation = 1;
      setReviewDeviaton({SUBRSTATUSID:["3"],isDeviation:1})
      // setFilterSetReview(tempfilterSet);
    } else if (event.target.value === "3") {
      tempfilterSet.SUBRSTATUSID = ["3"];
      tempfilterSet.isDeviation = 0;
      // setFilterSetReview(tempfilterSet);
      setReviewDeviaton({SUBRSTATUSID:["3"],isDeviation:0})
    } else if (event.target.value === "4") {
      tempfilterSet.SUBRSTATUSID = ["4"];
      tempfilterSet.isDeviation = -1;
      // setFilterSetReview(tempfilterSet);
      setReviewDeviaton({SUBRSTATUSID:["4"],isDeviation:-1})
    }
    setReviewPage(0);
    riskUnderReview(null, 0, reviewRowsPerPage, tempfilterSet);
  };

  const seachHandleClosed = () => {
    // const tempfilterSet = { ...filterSetClosed };
    // tempfilterSet.stext = sTextRefClosed.current?.value;
    // setFilterSetClosed(tempfilterSet);
    riskClosed();
  };
  const handleChangeDeviationClosed = (event: SelectChangeEvent) => {
    const tempfilterSet = {SUBRSTATUSID : ["1"], isDeviation: 1 };
    setDeviationStatusClosed(event.target.value);
    if (event.target.value === "1") {
      tempfilterSet.SUBRSTATUSID = [];
      tempfilterSet.isDeviation = -1;
      // setFilterSetClosed({ ...tempfilterSet });
      setClosedDeviation({SUBRSTATUSID:[],isDeviation:""})
    } else if (event.target.value === "2") {
      tempfilterSet.SUBRSTATUSID = ["1"];
      tempfilterSet.isDeviation = 1;
      // setFilterSetClosed(tempfilterSet);
      setClosedDeviation({SUBRSTATUSID:["1"],isDeviation:1})
    } else if (event.target.value === "3") {
      tempfilterSet.SUBRSTATUSID = ["2"];
      tempfilterSet.isDeviation = 0;
      // setFilterSetClosed(tempfilterSet);
      setClosedDeviation({SUBRSTATUSID:["2"],isDeviation:0})
    }
    setClosedPage(0);
    riskClosed(null, 0, closedRowsPerPage, tempfilterSet);
  };

  const handleStateFilter = (items: any, filterName: string) => {
    let itemArray = [...filterConfig];

    let index = itemArray.findIndex((item) => {
      return item.filterName === filterName;
    });

    itemArray[index].selected = items;

    setFilterConfig(itemArray);

   
    chartData();
    riskListHeaders();
    riskUnderReview(itemArray, reviewPage, reviewRowsPerPage, null);
    riskClosed(itemArray,closedPage, closedRowsPerPage, null);
  };

  const riskListHeaders = async () => {
    let formData = new FormData();
    // let tempfilterSet: any = {};
    // if (data) {
    //   tempfilterSet = { ...data };
    // } else {
    //   tempfilterSet = { ...filterSetReview };
    //   tempfilterSet.company = filterConfig[0].selected;
    //   tempfilterSet.assigned_by = filterConfig[1].selected;
    //   tempfilterSet.toggle = filterConfig[2].selected;
      
    // }
    // delete tempfilterSet["SUBRSTATUSID"];
    // delete tempfilterSet["isDeviation"];
    // delete tempfilterSet["stext"];
    // delete tempfilterSet["process_status"];
    let filters = {
      company_code: filterConfig?.find((element) => {
        if (element.filterName === "companies") {
          return element;
        }
      })!?.selected
        ? filterConfig?.find((element) => {
          if (element.filterName === "companies") {
            return element;
          }
        })!?.selected
        : [],
      toggle: filterConfig
        ?.find((element) => {
          if (element.filterName === "toggle") {
            return element;
          }
        })!
        .selected.toString(),
      assigned_by:
        filterConfig?.find((element) => {
          if (element.filterName === "assigned_by") {
            return element;
          }
        })!?.selected !== undefined
          ? filterConfig?.find((element) => {
            if (element.filterName === "assigned_by") {
              return element;
            }
          })!?.selected
          : [""],
          audit_id:getPath.getPathValue("audit_id")
    };

    formData.append("filters", JSON.stringify(filters));

    //formData.append("filters", JSON.stringify(tempfilterSet));
    try {
      const getUsersResponse = await Axios.post(RISK_HEADERS, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setRiskUnderReviewHeader(getUsersResponse.data.data.inprogress);
      setRiskClosedHeader(getUsersResponse.data.data.closed);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const riskClosed = async ( itemArray?:any, pageNo?: any, perPage?: any, deviationStatus?: any) => {
    // let tempfilterSet: any = {};
    // if (data) {
    //   tempfilterSet = { ...data };
    // } else {
    //   tempfilterSet = { ...filterSetClosed };
    // }

    // tempfilterSet.process_status = ["3"];
    let tempItemArray:any[] = [];
    if(itemArray){
      tempItemArray = [...itemArray
      ];
    }
    else{
tempItemArray = [...filterConfig];
    }
    if (!deviationStatus) {
      deviationStatus = {...closedDeviation}
    }
    let filters: filterOptions = {
      process_status: ["3"],
      company_code: tempItemArray?.find((element) => {
        if (element.filterName === "companies") {
          return element;
        }
      })!?.selected
        ? tempItemArray?.find((element) => {
          if (element.filterName === "companies") {
            return element;
          }
        })!?.selected
        : [],
      toggle: tempItemArray
        ?.find((element) => {
          if (element.filterName === "toggle") {
            return element;
          }
        })!
        .selected.toString(),
      assigned_by:
      tempItemArray?.find((element) => {
          if (element.filterName === "assigned_by") {
            return element;
          }
        })!?.selected !== undefined
          ? tempItemArray?.find((element) => {
            if (element.filterName === "assigned_by") {
              return element;
            }
          })!?.selected
          : [""],
      stext: sTextRefClosed.current?.value.length > 0 ? sTextRefClosed.current?.value : "",
      audit_id:getPath.getPathValue("audit_id")
    };
    if (deviationStatus.isDeviation !== -1) {
      filters.isDeviation = deviationStatus.isDeviation;
    }
    if (deviationStatus.SUBRSTATUSID.length > 0) {
      filters.SUBRSTATUSID = deviationStatus.SUBRSTATUSID;
    }
    let page = pageNo!==null ? pageNo : closedPage;
    let perpage = perPage ? perPage : closedRowsPerPage;

    let formData = new FormData();
    // formData.append("filters", JSON.stringify(tempfilterSet));
    formData.append("filters", JSON.stringify(filters));
    formData.append("page", (page + 1).toString());
    formData.append("perpage", perpage.toString());
    formData.append("sortkey", "null");
    formData.append("sortorder", "asc");
    try {
      setIsRiskClosedLoading(true)
      const getUsersResponse = await Axios.post(RISK_ASSIGNMENT, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setTimeout(() => {
        setIsRiskClosedLoading(false)
      }, 2000)
      let dataRecord = getUsersResponse.data.data.records;
      setClosedTotal(getUsersResponse.data.data.totalcount);
      setClosedCreditDebitSum(getUsersResponse.data.data.totalsum);
      let riskRecordClosed = [];
      for (let key in dataRecord) {
        let selectedArray = [];
        if (dataRecord[key]?.SELECTED_TRANSACTIONS !== undefined) {
          if (dataRecord[key]?.SELECTED_TRANSACTIONS !== null && dataRecord[key]?.SELECTED_TRANSACTIONS.length) {
            let removeStartEnd = dataRecord[key].SELECTED_TRANSACTIONS.replace(
              "[",
              ""
            );
            removeStartEnd = removeStartEnd.replace("]", "");
            selectedArray = removeStartEnd.split(",");
          }
        }
        riskRecordClosed.push({
          ...dataRecord[key],
          SELECTED: [...selectedArray],
        });
      }

      setRiskDataRecordClosed(riskRecordClosed);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const riskUnderReview = async ( itemArray?:any, pageNo?: any, perPage?: any, deviationStatus?: any) => {
    // let tempfilterSet: any = {};
    // if (data) {
    //   tempfilterSet = { ...data };
    // } else {
    //   tempfilterSet = { ...filterSetReview };
    //   tempfilterSet.company = filterConfig[0].selected;
    //   tempfilterSet.assigned_by = filterConfig[1].selected;
    //   tempfilterSet.toggle = filterConfig[2].selected;
    // }
    // tempfilterSet.process_status = ["2"];
    let tempItemArray:any[] = [];
    if(itemArray){
      tempItemArray = [...itemArray];
    }
    else{
      tempItemArray = [...filterConfig];
    }
    if (!deviationStatus) {
      deviationStatus = {...reviewDeviation}

    }

    let filters: filterOptions = {
      process_status: ["2"],
      company_code: tempItemArray?.find((element) => {
        if (element.filterName === "companies") {
          return element;
        }
      })!?.selected
        ? tempItemArray?.find((element) => {
          if (element.filterName === "companies") {
            return element;
          }
        })!?.selected
        : [],
      toggle: tempItemArray
        ?.find((element) => {
          if (element.filterName === "toggle") {
            return element;
          }
        })!
        .selected.toString(),
      assigned_by:
      tempItemArray?.find((element) => {
          if (element.filterName === "assigned_by") {
            return element;
          }
        })!?.selected !== undefined
          ? tempItemArray?.find((element) => {
            if (element.filterName === "assigned_by") {
              return element;
            }
          })!?.selected
          : [""],
      stext:  sTextRef.current?.value.length > 0 ? sTextRef.current?.value : "",
      audit_id:getPath.getPathValue("audit_id")
    };

    if (deviationStatus.isDeviation !== -10) {
      filters.isDeviation = deviationStatus.isDeviation;
    }
    if (deviationStatus.SUBRSTATUSID.length > 0) {
      filters.SUBRSTATUSID = deviationStatus.SUBRSTATUSID;
    }

    let page = pageNo!==null ? pageNo : reviewPage;
    let perpage = perPage ? perPage : reviewRowsPerPage;

    let formData = new FormData();
    //formData.append("filters", JSON.stringify(tempfilterSet));
    formData.append("filters", JSON.stringify(filters));
    formData.append("page", (page + 1).toString());
    formData.append("perpage", perpage.toString());
    formData.append("sortkey", "null");
    formData.append("sortorder", "asc");
    try {
      setIsLoading(true)

      const getUsersResponse = await Axios.post(RISK_ASSIGNMENT, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
      let dataRecord = getUsersResponse.data.data.records;
      setGetDocuments(dataRecord)
      setReviewTotal(getUsersResponse.data.data.totalcount);
      setReviewCreditDebitSum(getUsersResponse.data.data.totalsum);
      let riskRecordUnderReview = [];

      for (let key in dataRecord) {
        let selectedArray = [];
        let lengthOfString = dataRecord[key].SELECTED_TRANSACTIONS.length;
        let removeStartEnd = dataRecord[key].SELECTED_TRANSACTIONS.replace(
          "[",
          ""
        );
        removeStartEnd = removeStartEnd.replace("]", "");
        selectedArray = removeStartEnd.split(",");
        riskRecordUnderReview.push({
          ...dataRecord[key],
          SELECTED: [...selectedArray],
        });
      }

      setRiskDataRecordUnderReview(riskRecordUnderReview);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const chartData = async () => {
    let Token = localStorage.getItem("TR_Token") as string;
    let formData: any = new FormData();

    let filters = {
      company_code: filterConfig?.find((element) => {
        if (element.filterName === "companies") {
          return element;
        }
      })!?.selected
        ? filterConfig?.find((element) => {
          if (element.filterName === "companies") {
            return element;
          }
        })!?.selected
        : [],
      toggle: filterConfig
        ?.find((element) => {
          if (element.filterName === "toggle") {
            return element;
          }
        })!
        .selected.toString(),
      assigned_by:
        filterConfig?.find((element) => {
          if (element.filterName === "assigned_by") {
            return element;
          }
        })!?.selected !== undefined
          ? filterConfig?.find((element) => {
            if (element.filterName === "assigned_by") {
              return element;
            }
          })!?.selected
          : [""],
      process_status:["2,3"],
      audit_id:getPath.getPathValue("audit_id")
    };


    formData.append("filters", JSON.stringify(filters));
    try {
      setIsLoading(true)
      const getElapsedTime = await Axios.post(ELAPSED_TIME, formData, {
        headers: {
          Authorization: Token,
        },
      });
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
      const getBackLog = await Axios.post(BACK_LOG, formData, {
        headers: {
          Authorization: Token,
        },
      });
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
      const getAuditReview = await Axios.post(AUDIT_REVIEW, formData, {
        headers: {
          Authorization: Token,
        },
      });
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
      setBackLog(getBackLog.data.data);
      setElapsedTime(getElapsedTime.data.data);
      setAuditReview(getAuditReview.data.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const csv = async (process_status: number) => {
    try {
      const response = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });

      let filters = {
        process_status: [process_status.toString()],
        company_code: filterConfig?.find((element) => {
          if (element.filterName === "companies") {
            return element;
          }
        })!?.selected
          ? filterConfig?.find((element) => {
            if (element.filterName === "companies") {
              return element;
            }
          })!?.selected
          : [],
        toggle: filterConfig
          ?.find((element) => {
            if (element.filterName === "toggle") {
              return element;
            }
          })!
          .selected.toString(),
        assigned_by:
          filterConfig?.find((element) => {
            if (element.filterName === "assigned_by") {
              return element;
            }
          })!?.selected !== undefined
            ? filterConfig?.find((element) => {
              if (element.filterName === "assigned_by") {
                return element;
              }
            })!?.selected
            : [""],
        stext: seachText.length > 0 ? seachText : "",
        audit_id:getPath.getPathValue("audit_id")
      };

      downloadCSV(response.data.data.Token, filters, "csvriskbasedonstatuscasem", "casemanagementgl", "GL")
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(() => ({
    backgroundColor: "rgba(0, 0, 0, .03)",
    flexDirection: "row",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: 1,
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));
  const getCsvData = (process_status: number) => {
    csv(process_status);
  };

  const excel = async (process_status: number) => {
    try {
      const response = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      // setCsvToken(response.data.data.Token)
      let filters = {
        process_status: [process_status.toString()],
        company_code: filterConfig?.find((element) => {
          if (element.filterName === "companies") {
            return element;
          }
        })!?.selected
          ? filterConfig?.find((element) => {
            if (element.filterName === "companies") {
              return element;
            }
          })!?.selected
          : [],
        toggle: filterConfig
          ?.find((element) => {
            if (element.filterName === "toggle") {
              return element;
            }
          })!
          .selected.toString(),
        assigned_by:
          filterConfig?.find((element) => {
            if (element.filterName === "assigned_by") {
              return element;
            }
          })!?.selected !== undefined
            ? filterConfig?.find((element) => {
              if (element.filterName === "assigned_by") {
                return element;
              }
            })!?.selected
            : [""],
        stext: seachText.length > 0 ? seachText : "",
        audit_id:getPath.getPathValue("audit_id")
      };
      downloadExcel(response.data.data.Token, filters, "riskbasedonstatuscasem", "casemanagementgl", "GL")
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getExcelData = (process_status: number) => {
    excel(process_status);
  };

  const print = async (process_status: number) => {
    try {
      const response = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      // setCsvToken(response.data.data.Token)
      let filters = {
        process_status: [process_status.toString()],
        company_code: filterConfig?.find((element) => {
          if (element.filterName === "companies") {
            return element;
          }
        })!?.selected
          ? filterConfig?.find((element) => {
            if (element.filterName === "companies") {
              return element;
            }
          })!?.selected
          : [],
        toggle: filterConfig
          ?.find((element) => {
            if (element.filterName === "toggle") {
              return element;
            }
          })!
          .selected.toString(),
        assigned_by:
          filterConfig?.find((element) => {
            if (element.filterName === "assigned_by") {
              return element;
            }
          })!?.selected !== undefined
            ? filterConfig?.find((element) => {
              if (element.filterName === "assigned_by") {
                return element;
              }
            })!?.selected
            : [""],
        stext: seachText.length > 0 ? seachText : "",
      };
      downloadExcel(response.data.data.Token, filters, "riskbasedonstatuscasem", "casemanagementgl", "GL")

    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  const handleClearFilters = () => {
    let configCopy: Config[] = [...filterConfig];
    configCopy.forEach((filter, index) => {
      if (filter.filterName === "companies") {
        filter.selected = [];
      } else if (filter.filterName === "assigned_by") {
        filter.selected = [];
      } else if (filter.filterName === "toggle") {
        filter.selected = 2;
      }
    });
    setFilterConfig(configCopy);
    // chartData();
    // riskListHeaders();
    // riskUnderReview();
    // riskClosed();
  };

  useEffect(() => {
    dispatch(updateOtherPage(true));
    //const generateFilterConfig = (companyData: any, assignedData: any) => {
    const generateFilterConfig = ( assignedData: any) => {
      // let companyResponse = companyData;
      // let companyKeys = Object.keys(companyResponse);

      let assignedResponse = assignedData;
      let assignedKeys = Object.keys(assignedResponse);

      let configCopy: Config[] = [...setInitData(companies)];
      // companyKeys.forEach((key: any) => {
      //   setInitData(companies).forEach((filter, index) => {
      //     if (filter.filterName === "company") {
      //       let Obj: any[] = [];

      //       companyResponse.forEach((companyItem: any) => {
      //         companyItem.text = companyItem.COMPANY_CODE;
      //         companyItem.value = companyItem.COMPANYID;
      //         Obj.push(companyItem);
      //       });

      //       configCopy[index].data = [...Obj];
      //     }
      //   });
      // });
      assignedKeys.forEach((key: any) => {
        setInitData(companies).forEach((filter, index) => {
          if (filter.filterName === "assigned_by") {
            let Obj: any[] = [];
            assignedResponse.forEach((assignedItem: any) => {
              assignedItem.text =
                assignedItem.USER_FIRST_NAME +
                " " +
                assignedItem.USER_LAST_NAME;
              assignedItem.value = assignedItem.USERID;
              Obj.push(assignedItem);
            });
            configCopy[index].data = [...Obj];
          }
        });
      });

      setFilterConfig([...configCopy]);
    };

    const getFilters = async () => {
      try {
        setIsLoading(true);
        // const response = await Axios.get(COMPANY_DATA, {
        //   headers: {
        //     Authorization: localStorage.getItem("TR_Token") as string,
        //   },
        // });
        // const companyHolder = response.data.data;
        const getUsersResponse = await Axios.get(FILTER_DATA, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
        const assignedData = getUsersResponse.data.data;

        // generateFilterConfig(companyHolder, assignedData);
        generateFilterConfig(assignedData);
        setIsLoading(false);
      } catch (error: any) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    getFilters();
    chartData();
    riskListHeaders();
    riskUnderReview();
    riskClosed();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="px-7 pt-7 pb-3 text-base font-raleway font-bold bg-[#F5F5F5]">GL Case Management</div>
      <div className="flex m-2 p-2 shadow-lg font-raleway">
        <FilterBar
          config={filterConfig}
          isLoading={isLoading}
          handleStateToParent={handleStateFilter}
        />

        <span className="my-auto cursor-pointer">
          <Tooltip title="Clear Filters">
            <Button
              className="text-black"
              onClick={handleClearFilters}
            // onClick={() => {
            //     handleAddOrRemoveFilters(
            //             "apcompanies",
            //             false
            //         );
            //     }}
            >
              <BackspaceOutlinedIcon />
            </Button>
          </Tooltip>
        </span>
      </div>

      <div className="flex font-raleway mx-2">
        <div className="flex flex-col w-1/3 font-raleway">
          <Typography>Risk Review Status Analysis
            <span className="top-1 p-3 cursor-pointer">
              {isLoading == true
                ?
                <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                :
                ''
              }
            </span></Typography>
            <CMStackBarChart title="audit-review" data={auditReview} />
        </div>
        <div className="flex flex-col w-1/3 font-raleway">
          <Typography>Elapsed Time   <span className="top-1 p-3 cursor-pointer">
            {isLoading == true
              ?
              <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
              :
              ''
            }
          </span></Typography>
          <CMBarchart title="elapsed-time" data={elapsedTime} />
        </div>
        <div className="flex flex-col w-1/3 font-raleway">
          <Typography>Audit Backlog By Assignee
            <span className="top-1 p-3 cursor-pointer">
              {isLoading == true
                ?
                <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                :
                ''
              }
            </span>
          </Typography>

          <CMColumnChart title="backlog" data={backLog} />
        </div>
      </div>
      <div className="m-2 p-2 shadow-lg">
        <div className="flex mb-2 font-raleway">Risk Assignment</div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div>
              <div className="float-left"> Under Review </div>
              {!isLoading
                ?
                <div className="absolute right-14">
                  {" "}
                  {currencySymbol}{numberSuffixPipe(riskUnderReviewHeader.amount)} |{" "}
                  {numberSuffixPipe(riskUnderReviewHeader.count)}{" "}
                </div>
                :
                <div className="absolute right-14">
                  <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                </div>
              }
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <div className="flex mb-5">
                <div className="w-full md:w-2/5 my-auto">
                  <div className="relative flex flex-row">
                    <input
                      className="p-2 w-full h-full border-2 border-solid border-slate-300 rounded-md focus:border-[#1976d2] focus:outline-none"
                      ref={sTextRef}
                      type="text"
                      autoComplete="off"
                      // onChange={handleStextupdate}
                      placeholder="Search Accounting Documents"
                      onKeyDown={handleStextEnterAction}
                    />
                    <span
                      className="absolute right-2  top-1 m-auto cursor-pointer text-slate-500"
                      onClick={seachHandleReview}
                    >
                      <SearchIcon />
                    </span>
                  </div>
                </div>
                <FormControl variant="standard" sx={{ ml: 10, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Deviation Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={deviationStatusReview}
                    onChange={handleChangeDeviationReview}
                    label="Deviation Status"
                  >
                    <MenuItem value={"1"}>All</MenuItem>
                    <MenuItem value={"2"}>
                      Manager Review With Deviation
                    </MenuItem>
                    <MenuItem value={"3"}>
                      Manager Review Without Deviation
                    </MenuItem>
                    <MenuItem value={"4"}>Assigned To Auditor</MenuItem>
                  </Select>
                </FormControl>
                <PositionedMenu
                  getCsvData={() => {
                    getCsvData(2);
                  }}
                  getExcelData={() => {
                    getExcelData(2);
                  }}
                />
                <Button
                  onClick={() => {
                    print(2);
                  }}
                >
                  <PrintIcon />
                </Button>
              </div>
              {riskDataRecordUnderReview == '' ?
                <p>No Records Found</p>
                :
                <CollapsibleTable
                  data={riskDataRecordUnderReview}
                  sumData={reviewCreditDebitSum}
                  reviewStatus="Under Review"
                  
                />
              }

              <TablePagination
                component="div"
                count={reviewTotal}
                page={reviewPage}
                onPageChange={handleChangePage}
                rowsPerPage={reviewRowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div>
              <div className="float-left"> Closed </div>
              {!isRiskClosedLoading
                ?
                <div className="absolute right-14">
                  {" "}
                  {currencySymbol}{numberSuffixPipe(riskClosedHeader.amount)} |{" "}
                  {numberSuffixPipe(riskClosedHeader.count)}{" "}
                </div>
                :
                <div className="absolute right-14">
                  <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                </div>
              }
            </div>
          </AccordionSummary>
          <AccordionDetails>
          <div>
              <div className="flex mb-5">
                <div className="w-full md:w-2/5 my-auto">
                  <div className="relative flex flex-row">
                    <input
                      className="p-2 w-full h-full border-2 border-solid border-slate-300 rounded-md focus:border-[#1976d2] focus:outline-none"
                      ref={sTextRefClosed}
                      type="text"
                      autoComplete="off"
                      placeholder="Search Accounting Documents"
                      onKeyDown={handleStextEnterActionClosed}
                    />
                    <span
                      className="absolute right-2  top-1 m-auto cursor-pointer text-slate-500"
                      onClick={seachHandleClosed}
                    >
                      <SearchIcon />
                    </span>
                  </div>
                </div>
                <FormControl variant="standard" sx={{ ml: 10, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-standard-close-label">
                    Deviation Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-close-standard-label"
                    id="demo-simple-select-close-standard"
                    value={deviationStatusClosed}
                    onChange={handleChangeDeviationClosed}
                    label="Deviation Status"
                  >
                    <MenuItem value={"1"}>All</MenuItem>
                    <MenuItem value={"2"}>Closed With Deviation</MenuItem>
                    <MenuItem value={"3"}>Closed Without Devitation</MenuItem>
                  </Select>
                </FormControl>
                <PositionedMenu
                  getCsvData={() => {
                    getCsvData(3);
                  }}
                  getExcelData={() => {
                    getExcelData(3);
                  }}
                />
                <Button
                  onClick={() => {
                    print(3);
                  }}
                >
                  <PrintIcon />
                </Button>
              </div>
              {riskDataRecordClosed==''?
              <p>No Records Found</p>
              :
              <CollapsibleTable
                data={riskDataRecordClosed}
                sumData={closedCreditDebitSum}
                reviewStatus="Closed"
              />
              }

              <TablePagination
                component="div"
                count={closedTotal}
                page={closedPage}
                onPageChange={handleChangePageClosed}
                rowsPerPage={closedRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                onRowsPerPageChange={handleChangeRowsPerPageClosed}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default GLCaseManagement;
