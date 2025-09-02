// import { CircularProgress, Tooltip } from "@mui/material";
// import React, { useEffect, useState, useRef } from "react";
// import * as ReactDOM from "react-dom";
// import axios from "../../../../api/axios";
// import numberSuffixPipe from "../../../../shared/helpers/numberSuffixPipe";
// import CollapsibleTable from "../components/APCaseManagementGrid";
// import TablePagination from "@mui/material/TablePagination";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import FilterBar from "../../../../shared/ui/filter-bar/FilterBar";
// import {
//   Config,
//   Filter,
//   ReviewStatus,
// } from "../../../../shared/models/filters";
// import TextField from "@mui/material/TextField";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
// import MuiAccordionSummary, {
//   AccordionSummaryProps,
// } from "@mui/material/AccordionSummary";
// import MuiAccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
// import { styled } from "@mui/material/styles";
// import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
// import FormControl from "@mui/material/FormControl";
// import PositionedMenu from "../../dashboard/generalLedger/transactions/components/TransactionExport";
// import { Button } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import { useNavigate } from "react-router-dom";

// import AccordionActions from "@mui/material/AccordionActions";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


// import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
// import { useAppDispatch, useAppSelector } from "../../../../hooks";
// import { updateOtherPage } from "../../app-slice/app-slice";
// import { RiskLevelItem, RiskLevel } from "../../../../shared/models/records";
// import { getPath } from "../../../../shared/helpers/getPath";
// import { downloadCSV, downloadExcel } from "../../../../shared/helpers/downloadFile";
// import CMBarchart from "../../../ui/Charts/CMBarchart";
// import CMColumnChart from "../../../ui/Charts/CMColumnChart";
// import CMStackBarChart from "../../../ui/Charts/CMStackBarChart";

// const RISK_ASSIGNMENT = "v1/apcasemgt/getinvoices";
// const RISK_HEADERS = "v1/apcasemgt/getlistheaders";
// const GETFILTERS = "v1/ap/getfilters";
// const GET_FILTERS_URL = "v1/ap/get_filters";
// const FILTER_DATA = "v1/apcasemgt/getassignedbylist";
// const CHART_DATA = "v1/apcasemgt/chartsdata";
// const PRINT_TOKEN = "v1/print/token";

// interface filterOptions {
//   assigned_by?: any;
//   company?: any;
//   toggle?: any;
//   process_status?: any;
//   stext?: any;
//   SUBRSTATUSID?: any;
//   isDeviation?: number;
//   audit_id?: any;
// }
// const setInitData = () => {
//   let config = [
//     {
//       label: "Company",
//       data: [],
//       filterName: "companies",
//       filterType: "multi-dropdown",
//       selected: undefined,
//       active: true,
//     },
//     {
//       label: "Assigned By",
//       data: [],
//       filterName: "assigned_by",
//       filterType: "multi-dropdown",
//       selected: [],
//       active: true,
//     },
//     {
//       label: "Analysis Data Set",
//       data: [
//         { text: "All", value: 0 },
//         { text: "Above Materiality", value: 1 },
//         { text: "Above Threshold", value: 2 },
//         { text: "Below Threshold", value: 3 },
//       ],
//       filterName: "toggle",
//       filterType: "single-dropdown",
//       selected: 0,
//       active: true,
//     },
//   ];

//   return config;
// };
// const APCaseManagement = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const Axios = axios;

//   const [riskDataRecordUnderReview, setRiskDataRecordUnderReview] = useState(
//     {}
//   );
//   const [riskDataRecordClosed, setRiskDataRecordClosed] = useState({});
//   const [riskUnderReviewHeader, setRiskUnderReviewHeader] = useState({
//     count: 0,
//     amount: 0,
//   });

//   const [riskClosedHeader, setRiskClosedHeader] = useState({
//     count: 0,
//     amount: 0,
//   });
//   const [reviewPage, setReviewPage] = React.useState(0);
//   const [reviewRowsPerPage, setReviewRowsPerPage] = React.useState(5);
//   const [reviewTotal, setReviewTotal] = React.useState(0);
//   const [closedPage, setClosedPage] = React.useState(0);
//   const [closedRowsPerPage, setClosedRowsPerPage] = React.useState(5);
//   const [closedTotal, setClosedTotal] = React.useState(0);
//   const [filterConfig, setFilterConfig] = useState<Config[]>(setInitData());
//   const [isLoading, setIsLoading] = useState(false);
//   const [auditReview, setAuditReview] = React.useState<Object[]>([]);
//   const [backLog, setBackLog] = React.useState<Object[]>([]);
//   const [elapsedTime, setElapsedTime] = React.useState<Object[]>([]);
//   const sTextRef = useRef<any>(null);
//   const sTextRefClosed = useRef<any>(null);
//   const [reviewDeviation, setReviewDeviaton] = useState<any>({
//     SUBRSTATUSID: [],
//     isDeviation: "",
//   });
//   const [closedDeviation, setClosedDeviation] = useState<any>({
//     SUBRSTATUSID: [],
//     isDeviation: "",
//   });
//   const [deviationStatusReview, setDeviationStatusReview] = React.useState("1");
//   const [deviationStatusClosed, setDeviationStatusClosed] = React.useState("1");
//   const [reviewCreditDebitSum, setReviewCreditDebitSum] = useState({
//     totaldebit: 0,
//     totalcredit: 0,
//   });
//   const [closedCreditDebitSum, setClosedCreditDebitSum] = useState({
//     totaldebit: 0,
//     totalcredit: 0,
//   });

//   const [filterSetReview, setFilterSetReview] = useState<filterOptions>({
//     assigned_by: [""],
//     company: [""],
//     toggle: "",
//     stext: "",
//   });
//   const [filterSetClosed, setFilterSetClosed] = useState<filterOptions>({
//     assigned_by: [""],
//     company: [""],
//     toggle: "",
//     stext: "",
//   });
//   const [isRiskClosedLoading, setIsRiskClosedLoading] = useState(false);
//   const currencySymbol = localStorage.getItem("CurrencySymbol");
//   const [riskLevel, setRiskLevel] = useState<RiskLevel>({
//     range_high: 0,
//     range_medium: 0,
//     range_low: 0,
//   });

//   const handleChangePage = (
//     event: React.MouseEvent<HTMLButtonElement> | null,
//     newPage: number
//   ) => {
//     setReviewPage(newPage);
//     riskUnderReview(null, newPage, reviewRowsPerPage, null);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setReviewRowsPerPage(parseInt(event.target.value, 10));
//     setReviewPage(0);
//     riskUnderReview(null, 0, parseInt(event.target.value, 10), null);
//   };
//   const handleChangePageClosed = (
//     event: React.MouseEvent<HTMLButtonElement> | null,
//     newPage: number
//   ) => {
//     setClosedPage(newPage);
//     riskClosed(null, newPage, closedRowsPerPage, null);
//   };
//   const seachHandleClosed = () => {
//     const tempfilterSet = { ...filterSetClosed };
//     tempfilterSet.stext = sTextRefClosed.current?.value;
//     setFilterSetClosed(tempfilterSet);
//     riskClosed(tempfilterSet);
//   };
//   const handleChangeDeviationReview = (event: SelectChangeEvent) => {
//     // const tempfilterSet = { ...filterSetReview };
//     const tempfilterSet = { SUBRSTATUSID: ["2"], isDeviation: 1 };
//     setDeviationStatusReview(event.target.value);
//     if (event.target.value === "1") {
//       // delete tempfilterSet["SUBRSTATUSID"];
//       // delete tempfilterSet["isDeviation"];
//       tempfilterSet.SUBRSTATUSID = [];
//       tempfilterSet.isDeviation = -10;
//       setReviewDeviaton({ SUBRSTATUSID: [], isDeviation: "" });
//       // setFilterSetReview({ ...tempfilterSet });
//     } else if (event.target.value === "2") {
//       // tempfilterSet.SUBRSTATUSID = ["3"];
//       // tempfilterSet.isDeviation = 1;
//       tempfilterSet.SUBRSTATUSID = ["3"];
//       tempfilterSet.isDeviation = 1;
//       setReviewDeviaton({ SUBRSTATUSID: ["3"], isDeviation: 1 });
//       // setFilterSetReview(tempfilterSet);
//     } else if (event.target.value === "3") {
//       // tempfilterSet.SUBRSTATUSID = ["3"];
//       // tempfilterSet.isDeviation = 0;
//       tempfilterSet.SUBRSTATUSID = ["3"];
//       tempfilterSet.isDeviation = 0;
//       setReviewDeviaton({ SUBRSTATUSID: ["3"], isDeviation: 0 });
//       // setFilterSetReview(tempfilterSet);
//     } else if (event.target.value === "4") {
//       // tempfilterSet.SUBRSTATUSID = ["4"];
//       // tempfilterSet.isDeviation = -1;
//       tempfilterSet.SUBRSTATUSID = ["4"];
//       tempfilterSet.isDeviation = -1;
//       setReviewDeviaton({ SUBRSTATUSID: ["4"], isDeviation: -1 });
//       // setFilterSetReview(tempfilterSet);
//     }

//     // riskUnderReview(tempfilterSet);
//     setReviewPage(0);
//     riskUnderReview(null, 0, reviewRowsPerPage, tempfilterSet);
//   };
//   const seachHandleReview = () => {
//     const tempfilterSet = { ...filterSetReview };
//     tempfilterSet.stext = sTextRef.current?.value;
//     setFilterSetReview(tempfilterSet);
//     riskUnderReview();
//   };
//   const handleStextEnterAction = (event: any) => {
//     if (event.key === "Enter") {
//       seachHandleReview();
//     }
//   };
//   const handleStextEnterActionClosed = (event: any) => {
//     if (event.key === "Enter") {
//       seachHandleClosed();
//     }
//   };
//   const handleChangeRowsPerPageClosed = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setClosedRowsPerPage(parseInt(event.target.value, 10));
//     setClosedPage(0);
//     riskClosed(null, 0, parseInt(event.target.value, 10), null);
//   };
//   const handleChangeDeviationClosed = (event: SelectChangeEvent) => {
//     // const tempfilterSet = { ...filterSetClosed };
//     const tempfilterSet = { SUBRSTATUSID: ["1"], isDeviation: 1 };
//     setDeviationStatusClosed(event.target.value);
//     if (event.target.value === "1") {
//       // delete tempfilterSet["SUBRSTATUSID"];
//       // delete tempfilterSet["isDeviation"];
//       tempfilterSet.SUBRSTATUSID = [];
//       tempfilterSet.isDeviation = -1;
//       setFilterSetClosed({ ...tempfilterSet });
//     } else if (event.target.value === "2") {
//       // tempfilterSet.SUBRSTATUSID = ["1"];
//       // tempfilterSet.isDeviation = 1;
//       tempfilterSet.SUBRSTATUSID = ["1"];
//       tempfilterSet.isDeviation = 1;
//       setFilterSetClosed(tempfilterSet);
//     } else if (event.target.value === "3") {
//       // tempfilterSet.SUBRSTATUSID = ["2"];
//       // tempfilterSet.isDeviation = 0;
//       tempfilterSet.SUBRSTATUSID = ["2"];
//       tempfilterSet.isDeviation = 0;
//       setFilterSetClosed(tempfilterSet);
//     }
//     setClosedPage(0);
//     riskClosed(null, 0, closedRowsPerPage, tempfilterSet);
//   };
//   const handleStateFilter = (items: any, filterName: string) => {
//     let itemArray = [...filterConfig];

//     let index = itemArray.findIndex((item) => {
//       return item.filterName === filterName;
//     });

//     itemArray[index].selected = items;

//     setFilterConfig(itemArray);

//     let tempfilterSetReview: any = { ...filterSetReview };
//     tempfilterSetReview[filterName] = items;
//     let tempfilterSetClosed: any = { ...filterSetClosed };
//     tempfilterSetClosed[filterName] = items;

//     chartData(tempfilterSetReview);
//     riskListHeaders(tempfilterSetReview);
//     riskUnderReview(tempfilterSetReview, reviewPage, reviewRowsPerPage, null);
//     riskClosed(tempfilterSetClosed);
//   };
//   const riskClosed = async (
//     data?: any,
//     pageNo?: any,
//     perPage?: any,
//     deviationStatus?: any
//   ) => {
//     // let tempfilterSet: any = {};
//     // if (data) {
//     //   tempfilterSet = { ...data };
//     // } else {
//     //   tempfilterSet = { ...filterSetClosed };
//     // }

//     // tempfilterSet.process_status = ["3"];
//     // if (tempfilterSet["toggle"] === 0) {
//     //   tempfilterSet["toggle"] = "";
//     // }

//     let tempItemArray: any[] = [];
//     let filters: filterOptions;
//     if (data) {
//       filters = {
//         process_status: ["2"],
//         ...data
//       };
//     } else {
//       tempItemArray = [...filterConfig];
//       filters = {
//         process_status: ["3"],
//         company: tempItemArray?.find((element) => {
//           if (element.filterName === "companies") {
//             return element;
//           }
//         })!?.selected
//           ? tempItemArray?.find((element) => {
//               if (element.filterName === "companies") {
//                 return element;
//               }
//             })!?.selected
//           : [],
//         toggle: tempItemArray
//           ?.find((element) => {
//             if (element.filterName === "toggle") {
//               return element;
//             }
//           })!
//           .selected.toString(),
//         assigned_by:
//           tempItemArray?.find((element) => {
//             if (element.filterName === "assigned_by") {
//               return element;
//             }
//           })!?.selected !== undefined
//             ? tempItemArray?.find((element) => {
//                 if (element.filterName === "assigned_by") {
//                   return element;
//                 }
//               })!?.selected
//             : [""],
//         stext:
//           sTextRefClosed.current?.value.length > 0
//             ? sTextRefClosed.current?.value
//             : "",
//           };
//     }
//     if (!deviationStatus) {
//       deviationStatus = { ...closedDeviation };
//     }
//     filters.audit_id  = getPath.getPathValue("audit_id");
//     if (deviationStatus.isDeviation !== -1) {
//             filters.isDeviation = deviationStatus.isDeviation;
//           }
//           if (deviationStatus.SUBRSTATUSID.length > 0) {
//             filters.SUBRSTATUSID = deviationStatus.SUBRSTATUSID;
//       }

//     let page = pageNo ? pageNo : closedPage;
//     let perpage = perPage ? perPage : closedRowsPerPage;

//     let formData = new FormData();
//     formData.append("filters", JSON.stringify(filters));
//     formData.append("page", (page + 1).toString());
//     formData.append("perpage", perpage.toString());
//     formData.append("sortorder", "desc");
//     formData.append("sortKey", "BLENDED_RISK_SCORE");

//     try {
//       setIsRiskClosedLoading(true);
//       const getUsersResponse = await Axios.post(RISK_ASSIGNMENT, formData, {
//         headers: {
//           Authorization: localStorage.getItem("TR_Token") as string,
//         },
//       });
//       setTimeout(() => {
//         setIsRiskClosedLoading(false);
//       }, 2000);
//       let dataRecord = getUsersResponse.data.data.records;
//       setClosedTotal(getUsersResponse.data.data.totalcount);
//       setClosedCreditDebitSum({
//         totalcredit: getUsersResponse.data.data.totalcredit,
//         totaldebit: getUsersResponse.data.data.totaldebit,
//       });
//       let riskRecordClosed = [];
//       for (let key in dataRecord) {
//         let selectedArray = [];
//         if (dataRecord[key]?.SELECTED_TRANSACTIONS !== undefined) {
//           if (
//             dataRecord[key]?.SELECTED_TRANSACTIONS !== null &&
//             dataRecord[key]?.SELECTED_TRANSACTIONS.length
//           ) {
//             let removeStartEnd = dataRecord[key].SELECTED_TRANSACTIONS.replace(
//               "[",
//               ""
//             );
//             removeStartEnd = removeStartEnd.replace("]", "");
//             selectedArray = removeStartEnd.split(",");
//           }
//         }
//         riskRecordClosed.push({
//           ...dataRecord[key],
//           SELECTED: [...selectedArray],
//         });
//       }

//       setRiskDataRecordClosed(riskRecordClosed);
//     } catch (error: any) {
//       if (error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//   const riskUnderReview = async (
//     data?: any,
//     pageNo?: any,
//     perPage?: any,
//     deviationStatus?: any
//   ) => {
//     // let tempfilterSet: any = {};
//     // if (data) {
//     //   tempfilterSet = { ...data };
//     // } else {
//     //   tempfilterSet = { ...filterSetReview };
//     // }
//     // tempfilterSet.process_status = ["2"];

//     // if (tempfilterSet["toggle"] === 0) {
//     //   tempfilterSet["toggle"] = "";
//     // }

//     let tempItemArray: any;
//     let filters : filterOptions;
//     if (data) {
//       filters = {
//         process_status: ["2"],
//         ...data
//       };
//     } else {
//       tempItemArray = [...filterConfig];


//       filters = {
//         process_status: ["2"],
//         company: tempItemArray?.find((element : any) => {
//           if (element.filterName === "companies") {
//             return element;
//           }
//         })!?.selected
//           ? tempItemArray?.find((element : any) => {
//               if (element.filterName === "companies") {
//                 return element;
//               }
//             })!?.selected
//           : [],
//         toggle: tempItemArray
//           ?.find((element : any) => {
//             if (element.filterName === "toggle") {
//               return element;
//             }
//           })!
//           .selected.toString(),
//         assigned_by:
//           tempItemArray?.find((element: any) => {
//             if (element.filterName === "assigned_by") {
//               return element;
//             }
//           })!?.selected !== undefined
//             ? tempItemArray?.find((element: any) => {
//                 if (element.filterName === "assigned_by") {
//                   return element;
//                 }
//               })!?.selected
//             : [""],
//         stext: sTextRef.current?.value.length > 0 ? sTextRef.current?.value : "",
//       };
//     }

//     if (!deviationStatus) {
//       deviationStatus = { ...reviewDeviation };
//     }

//     if (deviationStatus.isDeviation !== -10) {
//       filters.isDeviation = deviationStatus.isDeviation;
//     }
//     if (deviationStatus.SUBRSTATUSID.length > 0) {
//       filters.SUBRSTATUSID = deviationStatus.SUBRSTATUSID;
//     }
//     filters.audit_id  = getPath.getPathValue("audit_id");

//     let page = pageNo ? pageNo : reviewPage;
//     let perpage = perPage ? perPage : reviewRowsPerPage;

//     let formData = new FormData();
//     formData.append("filters", JSON.stringify(filters));
//     formData.append("page", (page + 1).toString());
//     formData.append("perpage", perpage.toString());
//     formData.append("sortorder", "desc");
//     formData.append("sortKey", "BLENDED_RISK_SCORE");

//     try {
//       setIsLoading(true);
//       const getUsersResponse = await Axios.post(RISK_ASSIGNMENT, formData, {
//         headers: {
//           Authorization: localStorage.getItem("TR_Token") as string,
//         },
//       });
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 2000);
//       let dataRecord = getUsersResponse.data.data.records;
//       setReviewTotal(getUsersResponse.data.data.totalcount);
//       setReviewCreditDebitSum({
//         totalcredit: getUsersResponse.data.data.totalcredit,
//         totaldebit: getUsersResponse.data.data.totaldebit,
//       });
//       let riskRecordUnderReview = [];

//       for (let key in dataRecord) {
//         let selectedArray = [];
//         if (dataRecord[key]?.SELECTED_TRANSACTIONS !== undefined) {
//           if (
//             dataRecord[key]?.SELECTED_TRANSACTIONS !== null &&
//             dataRecord[key]?.SELECTED_TRANSACTIONS.length
//           ) {
//             let removeStartEnd = dataRecord[key].SELECTED_TRANSACTIONS.replace(
//               "[",
//               ""
//             );
//             removeStartEnd = removeStartEnd.replace("]", "");
//             selectedArray = removeStartEnd.split(",");
//           }
//         }
//         riskRecordUnderReview.push({
//           ...dataRecord[key],
//           SELECTED: [...selectedArray],
//         });
//       }

//       setRiskDataRecordUnderReview(riskRecordUnderReview);
//     } catch (error: any) {
//       if (error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };


//   const riskListHeaders = async (data?: any) => {
//     let formData = new FormData();
//     let tempfilterSet: any = {};
//     if (data) {
//       tempfilterSet = { ...data };
//     } else {
//       tempfilterSet = { ...filterSetReview };
//     }
//     tempfilterSet["audit_id"] = getPath.getPathValue("audit_id")
//     if (tempfilterSet["toggle"] === 0) {
//       tempfilterSet["toggle"] = "";
//     }
//     delete tempfilterSet["SUBRSTATUSID"];
//     delete tempfilterSet["isDeviation"];
//     delete tempfilterSet["stext"];
//     delete tempfilterSet["process_status"];

//     formData.append("filters", JSON.stringify(tempfilterSet));
//     try {
//       const getUsersResponse = await Axios.post(RISK_HEADERS, formData, {
//         headers: {
//           Authorization: localStorage.getItem("TR_Token") as string,
//         },
//       });
//       setRiskUnderReviewHeader(getUsersResponse.data.data.inprogress);
//       setRiskClosedHeader(getUsersResponse.data.data.closed);
//     } catch (error: any) {
//       if (error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };
//   const chartData = async (data?: any) => {
//     let Token = localStorage.getItem("TR_Token") as string;

//     let tempfilterSet: any = {};
//     if (data) {
//       tempfilterSet = { ...data };
//     } else {
//       tempfilterSet = { ...filterSetReview };
//     }

//     if (tempfilterSet["toggle"] === 0) {
//       tempfilterSet["toggle"] = "";
//     }
//     tempfilterSet["audit_id"] =  getPath.getPathValue("audit_id")

//     delete tempfilterSet["SUBRSTATUSID"];
//     delete tempfilterSet["isDeviation"];
//     delete tempfilterSet["stext"];
//     delete tempfilterSet["process_status"];
//     let formData1: any = new FormData();
//     formData1.append("filters", JSON.stringify(tempfilterSet));
//     formData1.append("charttype", "elapsedtime");
//     let formData2: any = new FormData();
//     formData2.append("filters", JSON.stringify(tempfilterSet));
//     formData2.append("charttype", "auditbacklog");
//     let formData3: any = new FormData();
//     formData3.append("filters", JSON.stringify(tempfilterSet));
//     formData3.append("charttype", "riskreview");
//     try {
//       setIsLoading(true);
//       const getElapsedTime = await Axios.post(CHART_DATA, formData1, {
//         headers: {
//           Authorization: Token,
//         },
//       });
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 3000);
//       const getBackLog = await Axios.post(CHART_DATA, formData2, {
//         headers: {
//           Authorization: Token,
//         },
//       });
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 3000);
//       const getAuditReview = await Axios.post(CHART_DATA, formData3, {
//         headers: {
//           Authorization: Token,
//         },
//       });
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 3000);
//       setBackLog(getBackLog.data.data);
//       setElapsedTime(getElapsedTime.data.data);
//       setAuditReview(getAuditReview.data.data);
//     } catch (error: any) {
//       if (error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };
//   const [expanded1, setExpanded1] = React.useState<string | false>("panel1");
//   const [expanded2, setExpanded2] = React.useState<string | false>("panel2");
//   const [expanded3, setExpanded3] = React.useState<string | false>("panel3");

//   const handleChange1 =
//     (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
//       setExpanded1(newExpanded ? panel : false);
//     };
//   const handleChange2 =
//     (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
//       setExpanded2(newExpanded ? panel : false);
//     };
//   const handleChange3 =
//     (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
//       setExpanded3(newExpanded ? panel : false);
//     };
//   const Accordion = styled((props: AccordionProps) => (
//     <MuiAccordion disableGutters elevation={0} square {...props} />
//   ))(({ theme }) => ({
//     border: `1px solid ${theme.palette.divider}`,
//     "&:not(:last-child)": {
//       borderBottom: 0,
//     },
//     "&:before": {
//       display: "none",
//     },
//   }));

//   const AccordionSummary = styled((props: AccordionSummaryProps) => (
//     <MuiAccordionSummary
//       expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
//       {...props}
//     />
//   ))(() => ({
//     backgroundColor: "rgba(0, 0, 0, .03)",
//     flexDirection: "row",
//     "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
//       transform: "rotate(90deg)",
//     },
//     "& .MuiAccordionSummary-content": {
//       marginLeft: 1,
//     },
//   }));

//   const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
//     padding: theme.spacing(2),
//     borderTop: "1px solid rgba(0, 0, 0, .125)",
//   }));

//   const csv = async (process_status: number) => {
//     try {
//       const response = await Axios.get(PRINT_TOKEN, {
//         headers: {
//           Authorization: localStorage.getItem("TR_Token") as string,
//         },
//       });
//       let filters = {
//         audit_id: getPath.getPathValue("audit_id"),
//         process_status: [process_status.toString()],
//         company_code: filterConfig?.find((element) => {
//           if (element.filterName === "companies") {
//             return element;
//           }
//         })!?.selected
//           ? filterConfig?.find((element) => {
//               if (element.filterName === "companies") {
//                 return element;
//               }
//             })!?.selected
//           : [],
//         toggle: filterConfig
//           ?.find((element) => {
//             if (element.filterName === "toggle") {
//               return element;
//             }
//           })!
//           .selected.toString(),
//         assigned_by:
//           filterConfig?.find((element) => {
//             if (element.filterName === "assigned_by") {
//               return element;
//             }
//           })!?.selected.length > 0
//             ? filterConfig?.find((element) => {
//                 if (element.filterName === "assigned_by") {
//                   return element;
//                 }
//               })!?.selected
//             : [],
//       };;
//       downloadCSV(response.data.data.Token, filters, "csvapdashboard", "accountdocument", "AP")
//     } catch (error: any) {
//       if (error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//   const getCsvData = (process_status: number) => {
//     csv(process_status);
//   };

//   const excel = async (process_status: number) => {
//     try {
//       const response = await Axios.get(PRINT_TOKEN, {
//         headers: {
//           Authorization: localStorage.getItem("TR_Token") as string,
//         },
//       });
//       // setCsvToken(response.data.data.Token)
//       let filters = {
//         audit_id: getPath.getPathValue("audit_id"),
//         process_status: [process_status.toString()],
//         company_code: filterConfig?.find((element) => {
//           if (element.filterName === "companies") {
//             return element;
//           }
//         })!?.selected
//           ? filterConfig?.find((element) => {
//               if (element.filterName === "companies") {
//                 return element;
//               }
//             })!?.selected
//           : [],
//         toggle: filterConfig
//           ?.find((element) => {
//             if (element.filterName === "toggle") {
//               return element;
//             }
//           })!
//           .selected.toString(),
//         assigned_by:
//           filterConfig?.find((element) => {
//             if (element.filterName === "assigned_by") {
//               return element;
//             }
//           })!?.selected.length > 0
//             ? filterConfig?.find((element) => {
//                 if (element.filterName === "assigned_by") {
//                   return element;
//                 }
//               })!?.selected
//             : [],
//       };
//       downloadExcel(response.data.data.Token, filters, "apdashboard", "accountdocument", "AP")
//     } catch (error: any) {
//       if (error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//   const getExcelData = (process_status: number) => {
//     excel(process_status);
//   };
//   const handleClearFilters = () => {
//     let configCopy: Config[] = [...filterConfig];
//     configCopy.forEach((filter, index) => {
//       if (filter.filterName === "companies") {
//         filter.selected = [];
//       } else if (filter.filterName === "assigned_by") {
//         filter.selected = [];
//       } else if (filter.filterName === "toggle") {
//         filter.selected = 0;
//       }
//     });
//     setFilterConfig(configCopy);
//     // chartData();
//     // riskListHeaders();
//     // riskUnderReview();
//     // riskClosed();
//   };

//   useEffect(() => {
//     dispatch(updateOtherPage(true));
//     const generateFilterConfig = (companyData: any, assignedData: any) => {
//       let companyResponse = companyData;
//       let companyKeys = Object.keys(companyResponse);

//       let assignedResponse = assignedData;
//       let assignedKeys = Object.keys(assignedResponse);

//       let configCopy: Config[] = [...setInitData()];
//       companyKeys.forEach((key: any) => {
//         setInitData().forEach((filter, index) => {
//           //console.log("filter", filter);
//           if (filter.filterName === "companies") {
//             let Obj: any[] = [];

//             companyResponse.forEach((companyItem: any) => {
//               Obj.push(companyItem);
//             });

//             configCopy[index].data = [...Obj];
//           }
//         });
//       });
//       assignedKeys.forEach((key: any) => {
//         setInitData().forEach((filter, index) => {
//           if (filter.filterName === "assigned_by") {
//             let Obj: any[] = [];
//             assignedResponse.forEach((assignedItem: any) => {
//               assignedItem.text =
//                 assignedItem.USER_FIRST_NAME +
//                 " " +
//                 assignedItem.USER_LAST_NAME;
//               assignedItem.value = assignedItem.USERID;
//               Obj.push(assignedItem);
//               // console.log("assignedItem", assignedItem);
//             });
//             configCopy[index].data = [...Obj];
//           }
//         });
//       });

//       setFilterConfig([...configCopy]);
//     };

//     const getFilters = async () => {
//       try {
//         setIsLoading(true);
//         let formData = new FormData();
//         formData.append("filtertype", "apcompanies");
//         formData.append("audit_id",  getPath.getPathValue("audit_id"));
//         formData.append("client_id",  getPath.getPathValue("client_id"));
//         const response = await Axios.post(GETFILTERS, formData, {
//           headers: {
//             Authorization: localStorage.getItem("TR_Token") as string,
//           },
//         });
//         const companyHolder = response.data.data;
//         const getUsersResponse = await Axios.get(FILTER_DATA, {
//           headers: {
//             Authorization: localStorage.getItem("TR_Token") as string,
//           },
//         });
//         const assignedData = getUsersResponse.data.data;

//         generateFilterConfig(companyHolder, assignedData);
//         setIsLoading(false);
//       } catch (error: any) {
//         if (error.response.status === 401) {
//           localStorage.clear();
//           navigate("/login");
//         }
//       }
//     };
//     getFilters();
//     getRiskConfig()
//     chartData();
//     riskListHeaders();
//     riskUnderReview();
//     riskClosed();
//   }, []);

//   const getRiskConfig = async () => {
//     try {
//         let formData = new FormData();
//         formData.append("filtertype", "riskweights");
//         formData.append("audit_id",  getPath.getPathValue("audit_id"));
//         formData.append("client_id",  getPath.getPathValue("client_id"));

//         const response = await Axios.post(GET_FILTERS_URL, formData, {
//             headers: {
//                 Authorization: localStorage.getItem(
//                     "TR_Token"
//                 ) as string,
//             },
//         });

//         if (response.data.data) {
//             let Obj: RiskLevel = {
//                 range_high: 0,
//                 range_low: 0,
//                 range_medium: 0,
//             };
//             response?.data?.data?.riskweights?.forEach(
//                 (element: RiskLevelItem) => {
//                     switch (element.KEYNAME) {
//                         case "range_high":
//                             Obj.range_high =
//                                 Number(element.KEYVALUE) * 100;
//                             break;
//                         case "range_medium":
//                             Obj.range_medium =
//                                 Number(element.KEYVALUE) * 100;
//                             break;
//                         case "range_low":
//                             Obj.range_low =
//                                 Number(element.KEYVALUE) * 100;
//                             break;
//                         default:
//                             break;
//                     }
//                 }
//             );
//             setRiskLevel(Obj);
//         }
//     } catch (error: any) {
//         if (error.response.status === 401) {
//             localStorage.clear();
//             navigate("/login");
//         }
//     }
// };
//   return (
//     <>
//       <div className="px-7 pt-7 pb-3 text-base font-raleway font-bold bg-[#F5F5F5]">
//         AP Case Management
//       </div>
//       <div className="flex m-2 p-2 shadow-lg font-raleway">
//         <FilterBar
//           config={filterConfig}
//           isLoading={isLoading}
//           handleStateToParent={handleStateFilter}
//         />
//         <span className="my-auto cursor-pointer">
//           <Tooltip title="Clear Filters">
//             <Button
//               className="text-black"
//               onClick={handleClearFilters}
//               // onClick={() => {
//               //     handleAddOrRemoveFilters(
//               //             "apcompanies",
//               //             false
//               //         );
//               //     }}
//             >
//               <BackspaceOutlinedIcon />
//             </Button>
//           </Tooltip>
//         </span>
//       </div>

//       {/* <div className="flex m-2 p-2  font-raleway">
//             <div className="flex-1 mb-2 font-raleway shadow-lg h-fit">
//             <StackingBarChart title="audit-review" data={auditReview}/>
//             </div>
//             <div className="flex-1 mb-2 font-raleway shadow-lg h-fit">
//             <BarChart title="elapsed-time" data={elapsedTime}/>
//             </div>
//             <div className="flex-1 mb-2 font-raleway shadow-lg h-fit">
//             <ColumnChart title="backlog" data={backLog}/> 
//             </div>
//         </div> */}
//       <div className="flex font-raleway mx-2 ">
//         <div className="flex-1 m-1 font-raleway ">
//           {/* <Accordion
//                         expanded={expanded1 === "panel1"}
//                         onChange={handleChange1("panel1")}
//                     >
//                         <AccordionSummary
//                             aria-controls="panel1d-content"
//                             id="panel1d-header"
//                         >
//                             <Typography>Risk Review Status Analysis</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <StackingBarChart
//                                 title="audit-review"
//                                 data={auditReview}
//                             />
//                         </AccordionDetails>
//                     </Accordion> */}
//           <Typography>
//             Risk Review Status Analysis
//             <span className="top-1 p-3 cursor-pointer">
//               {isLoading == true ? (
//                 <CircularProgress
//                   style={{ color: " rgb(116, 187, 251)" }}
//                   size={20}
//                   color="secondary"
//                 />
//               ) : (
//                 ""
//               )}
//             </span>
//           </Typography>
//           <CMStackBarChart title="audit-review" data={auditReview} />
//         </div>
//         <div className="flex-1 m-1 font-raleway ">
//           {/* <Accordion
//                         expanded={expanded2 === "panel2"}
//                         onChange={handleChange2("panel2")}
//                     >
//                         <AccordionSummary
//                             aria-controls="panel1d-content"
//                             id="panel1d-header"
//                         >
//                             <Typography>Elapsed Time</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <BarChart title="elapsed-time" data={elapsedTime} />
//                         </AccordionDetails>
//                     </Accordion> */}
//           <Typography>
//             Elapsed Time
//             <span className="top-1 p-3 cursor-pointer">
//               {isLoading == true ? (
//                 <CircularProgress
//                   style={{ color: " rgb(116, 187, 251)" }}
//                   size={20}
//                   color="secondary"
//                 />
//               ) : (
//                 ""
//               )}
//             </span>
//           </Typography>
//           <CMBarchart title="elapsed-time" data={elapsedTime} />
//         </div>
//         <div className="flex-1 m-1 font-raleway">
//           {/* <Accordion
//                         expanded={expanded3 === "panel3"}
//                         onChange={handleChange3("panel3")}
//                     >
//                         <AccordionSummary
//                             aria-controls="panel1d-content"
//                             id="panel1d-header"
//                         >
//                             <Typography>Audit Backlog By Assignee</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <ColumnChart title="backlog" data={backLog} />
//                         </AccordionDetails>
//                     </Accordion> */}
//           <Typography>
//             Audit Backlog By Assignee
//             <span className="top-1 p-3 cursor-pointer">
//               {isLoading == true ? (
//                 <CircularProgress
//                   style={{ color: " rgb(116, 187, 251)" }}
//                   size={20}
//                   color="secondary"
//                 />
//               ) : (
//                 ""
//               )}
//             </span>
//           </Typography>
//           <CMColumnChart title="backlog" data={backLog} />
//         </div>
//       </div>
//       <div className="m-2 p-2 shadow-lg">
//         <div className="flex mb-2 font-raleway">Risk Assignment</div>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1-content"
//             id="panel1-header"
//           >
//             <div>
//               <div className="float-left"> Under Review </div>
//               {!isLoading ? (
//                 <div className="absolute right-14">
//                   {" "}
//                   {currencySymbol}
//                   {numberSuffixPipe(riskUnderReviewHeader.amount)} |{" "}
//                   {numberSuffixPipe(riskUnderReviewHeader.count)}{" "}
//                 </div>
//               ) : (
//                 <div className="absolute right-14">
//                   <CircularProgress
//                     style={{ color: " rgb(116, 187, 251)" }}
//                     size={20}
//                     color="secondary"
//                   />
//                 </div>
//               )}
//             </div>
//           </AccordionSummary>
//           <AccordionDetails>
//             <div>
//               <div className="flex mb-5">
//                 {/* <TextField
//                                     sx={{ width: "500px" }}
//                                     id="standard-basic"
//                                     label="Search Accounting Documents"
//                                     variant="standard"
//                                     value={seachText}
//                                     onChange={(e) =>
//                                         seachHandleReview(e.target.value)
//                                     }
//                                 /> */}
//                 <div className="w-full md:w-2/5 my-auto">
//                   <div className="relative flex flex-row">
//                     <input
//                       className="p-2 w-full h-full border-2 border-solid border-slate-300 rounded-md focus:border-[#1976d2] focus:outline-none"
//                       ref={sTextRef}
//                       type="text"
//                       autoComplete="off"
//                       // onChange={handleStextupdate}
//                       placeholder="Search Accounting Documents"
//                       onKeyDown={handleStextEnterAction}
//                     />
//                     <span
//                       className="absolute right-2  top-1 m-auto cursor-pointer text-slate-500"
//                       onClick={seachHandleReview}
//                     >
//                       <SearchIcon />
//                     </span>
//                   </div>
//                 </div>
//                 {/* <span className="top-1 p-3 cursor-pointer">
//                   {isLoading == true
//                     ?
//                     <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
//                     :
//                     ''
//                   }
//                 </span> */}
//                 <FormControl variant="standard" sx={{ ml: 10, minWidth: 200 }}>
//                   <InputLabel id="demo-simple-select-standard-label">
//                     Deviation Status
//                   </InputLabel>
//                   <Select
//                     labelId="demo-simple-select-standard-label"
//                     id="demo-simple-select-standard"
//                     value={deviationStatusReview}
//                     onChange={handleChangeDeviationReview}
//                     label="Deviation Status"
//                   >
//                     <MenuItem value={"1"}>All</MenuItem>
//                     <MenuItem value={"2"}>
//                       Manager Review With Deviation
//                     </MenuItem>
//                     <MenuItem value={"3"}>
//                       Manager Review Without Deviation
//                     </MenuItem>
//                     <MenuItem value={"4"}>Assigned To Auditor</MenuItem>
//                   </Select>
//                 </FormControl>
//                 <PositionedMenu
//                   getCsvData={() => {
//                     getCsvData(2);
//                   }}
//                   getExcelData={() => {
//                     getExcelData(2);
//                   }}
//                 />
//               </div>
//               {riskDataRecordUnderReview == "" ? (
//                 <p>No Records Found</p>
//               ) : (
//                 <CollapsibleTable
//                   data={riskDataRecordUnderReview}
//                   sumData={reviewCreditDebitSum}
//                   reviewStatus="Under Review"
//                   riskLevel={riskLevel}
//                 />
//               )}

//               <TablePagination
//                 component="div"
//                 count={reviewTotal}
//                 page={reviewPage}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={reviewRowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 rowsPerPageOptions={[5, 10, 25, 50, 100]}
//               />
//             </div>
//           </AccordionDetails>
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1-content"
//             id="panel1-header"
//           >
//             <div>
//               <div className="float-left"> Closed </div>
//               {!isRiskClosedLoading ? (
//                 <div className="absolute right-14">
//                   {" "}
//                   {currencySymbol}
//                   {numberSuffixPipe(riskClosedHeader.amount)} |{" "}
//                   {numberSuffixPipe(riskClosedHeader.count)}{" "}
//                 </div>
//               ) : (
//                 <div className="absolute right-14">
//                   <CircularProgress
//                     style={{ color: " rgb(116, 187, 251)" }}
//                     size={20}
//                     color="secondary"
//                   />
//                 </div>
//               )}
//             </div>
//           </AccordionSummary>
//           <AccordionDetails>
//             <div>
//               <div className="flex mb-5">
//                 {/* <TextField
//                                     sx={{ width: "500px" }}
//                                     id="standard-basic-close"
//                                     label="Search Accounting Documents"
//                                     variant="standard"
//                                     value={seachTextClosed}
//                                     onChange={(e) =>
//                                         seachHandleClosed(e.target.value)
//                                     }
//                                 /> */}
//                 <div className="w-full md:w-2/5 my-auto">
//                   <div className="relative flex flex-row">
//                     <input
//                       className="p-2 w-full h-full border-2 border-solid border-slate-300 rounded-md focus:border-[#1976d2] focus:outline-none"
//                       ref={sTextRefClosed}
//                       type="text"
//                       autoComplete="off"
//                       // onChange={handleStextupdate}
//                       placeholder="Search Accounting Documents"
//                       onKeyDown={handleStextEnterActionClosed}
//                     />
//                     <span
//                       className="absolute right-2  top-1 m-auto cursor-pointer text-slate-500"
//                       onClick={seachHandleClosed}
//                     >
//                       <SearchIcon />
//                     </span>
//                   </div>
//                 </div>
//                 {/* <span className="top-1 p-3 cursor-pointer">
//                   {isLoading == true
//                     ?
//                     <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
//                     :
//                     ''
//                   }
//                 </span> */}
//                 <FormControl variant="standard" sx={{ ml: 10, minWidth: 200 }}>
//                   <InputLabel id="demo-simple-select-standard-close-label">
//                     Deviation Status
//                   </InputLabel>
//                   <Select
//                     labelId="demo-simple-select-close-standard-label"
//                     id="demo-simple-select-close-standard"
//                     value={deviationStatusClosed}
//                     onChange={handleChangeDeviationClosed}
//                     label="Deviation Status"
//                   >
//                     <MenuItem value={"1"}>All</MenuItem>
//                     <MenuItem value={"2"}>Closed With Deviation</MenuItem>
//                     <MenuItem value={"3"}>Closed Without Devitation</MenuItem>
//                   </Select>
//                 </FormControl>
//                 <PositionedMenu
//                   getCsvData={() => {
//                     getCsvData(3);
//                   }}
//                   getExcelData={() => {
//                     getExcelData(3);
//                   }}
//                 />
//               </div>
//               {riskDataRecordClosed == "" ? (
//                 <p>No Records Found</p>
//               ) : (
//                 <CollapsibleTable
//                   data={riskDataRecordClosed}
//                   sumData={closedCreditDebitSum}
//                   reviewStatus="Closed"
//                   riskLevel={riskLevel}
//                 />
//               )}

//               <TablePagination
//                 component="div"
//                 count={closedTotal}
//                 page={closedPage}
//                 onPageChange={handleChangePageClosed}
//                 rowsPerPage={closedRowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPageClosed}
//                 rowsPerPageOptions={[5, 10, 25, 50, 100]}
//               />
//             </div>
//           </AccordionDetails>
//         </Accordion>
//       </div>
//     </>
//   );
// };

// export default APCaseManagement;




import { CircularProgress, Tooltip } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import * as ReactDOM from "react-dom";
import axios from "../../../../api/axios";
import CollapsibleTable from "../components/APCaseManagementGrid";
import TablePagination from "@mui/material/TablePagination";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FilterBar from "../../../../shared/ui/filter-bar/FilterBar";
import {
  Config,
  Filter,
  ReviewStatus,
} from "../../../../shared/models/filters";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import FormControl from "@mui/material/FormControl";
import PositionedMenu from "../../dashboard/generalLedger/transactions/components/TransactionExport";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { useAppDispatch, useAppSelector } from "../../../../hooks";

import CMBarchart from "../../../ui/Charts/CMBarchart";
import CMColumnChart from "../../../ui/Charts/CMColumnChart";
import CMStackBarChart from "../../../ui/Charts/CMStackBarChart";
import numberSuffixPipe from "../../../../shared/helpers/numberSuffixPipe";
import { updateOtherPage } from "../../app-slice/app-slice";

const RISK_ASSIGNMENT = "v1/apcasemgt/getinvoices";
const RISK_HEADERS = "v1/apcasemgt/getlistheaders";
const GETFILTERS = "v1/ap/getfilters";
const FILTER_DATA = "v1/apcasemgt/getassignedbylist";
const CHART_DATA = "v1/apcasemgt/chartsdata";
const PRINT_TOKEN = "v1/print/token";

interface filterOptions {
  assigned_by?: any;
  company?: any;
  toggle?: any;
  process_status?: any;
  stext?: any;
  SUBRSTATUSID?: any;
  isDeviation?: number;
}
const setInitData = () => {
  let config = [
    {
      label: "Company",
      data: [],
      filterName: "companies",
      filterType: "multi-dropdown",
      selected: undefined,
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
        { text: "All", value: 0 },
        { text: "Above Materiality", value: 1 },
        { text: "Above Threshold", value: 2 },
        { text: "Below Threshold", value: 3 },
      ],
      filterName: "toggle",
      filterType: "single-dropdown",
      selected: 0,
      active: true,
    },
  ];

  return config;
};
const APCaseManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const Axios = axios;

  const [riskDataRecordUnderReview, setRiskDataRecordUnderReview] = useState(
    {},
  );
  const [riskDataRecordClosed, setRiskDataRecordClosed] = useState({});
  const [riskUnderReviewHeader, setRiskUnderReviewHeader] = useState({
    count: 0,
    amount: 0,
  });

  const [riskClosedHeader, setRiskClosedHeader] = useState({
    count: 0,
    amount: 0,
  });
  const [reviewPage, setReviewPage] = React.useState(0);
  const storedValue = localStorage.getItem("rpp");
  const [reviewRowsPerPage, setReviewRowsPerPage] = useState(
    storedValue ? parseInt(storedValue) : 5,
  );

  useEffect(() => {
    localStorage.setItem("rpp", reviewRowsPerPage.toString());
  }, [reviewRowsPerPage]);

  const [reviewTotal, setReviewTotal] = React.useState(0);
  const [closedPage, setClosedPage] = React.useState(0);
  const [closedRowsPerPage, setClosedRowsPerPage] = React.useState(5);
  const [closedTotal, setClosedTotal] = React.useState(0);
  const [filterConfig, setFilterConfig] = useState<Config[]>(setInitData());
  const [isLoading, setIsLoading] = useState(false);
  const [auditReview, setAuditReview] = React.useState<Object[]>([]);
  const [backLog, setBackLog] = React.useState<Object[]>([]);
  const [elapsedTime, setElapsedTime] = React.useState<Object[]>([]);
  const sTextRef = useRef<any>(null);
  const sTextRefClosed = useRef<any>(null);
  const [reviewDeviation, setReviewDeviaton] = useState<any>({
    SUBRSTATUSID: [],
    isDeviation: "",
  });
  const [closedDeviation, setClosedDeviation] = useState<any>({
    SUBRSTATUSID: [],
    isDeviation: "",
  });
  const [deviationStatusReview, setDeviationStatusReview] = React.useState("1");
  const [deviationStatusClosed, setDeviationStatusClosed] = React.useState("1");
  const [reviewCreditDebitSum, setReviewCreditDebitSum] = useState({
    totaldebit: 0,
    totalcredit: 0,
  });
  const [closedCreditDebitSum, setClosedCreditDebitSum] = useState({
    totaldebit: 0,
    totalcredit: 0,
  });

  const [filterSetReview, setFilterSetReview] = useState<filterOptions>({
    assigned_by: [""],
    company: [""],
    toggle: "",
    stext: "",
  });
  const [filterSetClosed, setFilterSetClosed] = useState<filterOptions>({
    assigned_by: [""],
    company: [""],
    toggle: "",
    stext: "",
  });
  const [isRiskClosedLoading, setIsRiskClosedLoading] = useState(false);
  const currencySymbol = localStorage.getItem("CurrencySymbol");

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setReviewPage(newPage);
    riskUnderReview(null, newPage, reviewRowsPerPage, null);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setReviewRowsPerPage(parseInt(event.target.value, 10));
    setReviewPage(0);
    riskUnderReview(null, 0, parseInt(event.target.value, 10), null);
  };
  const handleChangePageClosed = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setClosedPage(newPage);
    riskClosed(null, newPage, closedRowsPerPage, null);
  };
  const seachHandleClosed = () => {
    const tempfilterSet = { ...filterSetClosed };
    tempfilterSet.stext = sTextRefClosed.current?.value;
    setFilterSetClosed(tempfilterSet);
    riskClosed(tempfilterSet);
  };
  const handleChangeDeviationReview = (event: SelectChangeEvent) => {
    // const tempfilterSet = { ...filterSetReview };
    const tempfilterSet = { SUBRSTATUSID: ["2"], isDeviation: 1 };
    setDeviationStatusReview(event.target.value);
    if (event.target.value === "1") {
      // delete tempfilterSet["SUBRSTATUSID"];
      // delete tempfilterSet["isDeviation"];
      tempfilterSet.SUBRSTATUSID = [];
      tempfilterSet.isDeviation = -10;
      setReviewDeviaton({ SUBRSTATUSID: [], isDeviation: "" });
      // setFilterSetReview({ ...tempfilterSet });
    } else if (event.target.value === "2") {
      // tempfilterSet.SUBRSTATUSID = ["3"];
      // tempfilterSet.isDeviation = 1;
      tempfilterSet.SUBRSTATUSID = ["3"];
      tempfilterSet.isDeviation = 1;
      setReviewDeviaton({ SUBRSTATUSID: ["3"], isDeviation: 1 });
      // setFilterSetReview(tempfilterSet);
    } else if (event.target.value === "3") {
      // tempfilterSet.SUBRSTATUSID = ["3"];
      // tempfilterSet.isDeviation = 0;
      tempfilterSet.SUBRSTATUSID = ["3"];
      tempfilterSet.isDeviation = 0;
      setReviewDeviaton({ SUBRSTATUSID: ["3"], isDeviation: 0 });
      // setFilterSetReview(tempfilterSet);
    } else if (event.target.value === "4") {
      // tempfilterSet.SUBRSTATUSID = ["4"];
      // tempfilterSet.isDeviation = -1;
      tempfilterSet.SUBRSTATUSID = ["4"];
      tempfilterSet.isDeviation = -1;
      setReviewDeviaton({ SUBRSTATUSID: ["4"], isDeviation: -1 });
      // setFilterSetReview(tempfilterSet);
    }

    // riskUnderReview(tempfilterSet);
    setReviewPage(0);
    riskUnderReview(null, 0, reviewRowsPerPage, tempfilterSet);
  };
  const seachHandleReview = () => {
    const tempfilterSet = { ...filterSetReview };
    tempfilterSet.stext = sTextRef.current?.value;
    setFilterSetReview(tempfilterSet);
    riskUnderReview();
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
  const handleChangeRowsPerPageClosed = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setClosedRowsPerPage(parseInt(event.target.value, 10));
    setClosedPage(0);
    riskClosed(null, 0, parseInt(event.target.value, 10), null);
  };
  const handleChangeDeviationClosed = (event: SelectChangeEvent) => {
    // const tempfilterSet = { ...filterSetClosed };
    const tempfilterSet = { SUBRSTATUSID: ["1"], isDeviation: 1 };
    setDeviationStatusClosed(event.target.value);
    if (event.target.value === "1") {
      // delete tempfilterSet["SUBRSTATUSID"];
      // delete tempfilterSet["isDeviation"];
      tempfilterSet.SUBRSTATUSID = [];
      tempfilterSet.isDeviation = -1;
      setFilterSetClosed({ ...tempfilterSet });
    } else if (event.target.value === "2") {
      // tempfilterSet.SUBRSTATUSID = ["1"];
      // tempfilterSet.isDeviation = 1;
      tempfilterSet.SUBRSTATUSID = ["1"];
      tempfilterSet.isDeviation = 1;
      setFilterSetClosed(tempfilterSet);
    } else if (event.target.value === "3") {
      // tempfilterSet.SUBRSTATUSID = ["2"];
      // tempfilterSet.isDeviation = 0;
      tempfilterSet.SUBRSTATUSID = ["2"];
      tempfilterSet.isDeviation = 0;
      setFilterSetClosed(tempfilterSet);
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

    let tempfilterSetReview: any = { ...filterSetReview };
    tempfilterSetReview[filterName] = items;
    let tempfilterSetClosed: any = { ...filterSetClosed };
    tempfilterSetClosed[filterName] = items;

    chartData(tempfilterSetReview);
    riskListHeaders(tempfilterSetReview);
    riskUnderReview(tempfilterSetReview, reviewPage, reviewRowsPerPage, null);
    riskClosed(tempfilterSetClosed);
  };
  const riskClosed = async (
    data?: any,
    pageNo?: any,
    perPage?: any,
    deviationStatus?: any,
  ) => {
    // let tempfilterSet: any = {};
    // if (data) {
    //   tempfilterSet = { ...data };
    // } else {
    //   tempfilterSet = { ...filterSetClosed };
    // }

    // tempfilterSet.process_status = ["3"];
    // if (tempfilterSet["toggle"] === 0) {
    //   tempfilterSet["toggle"] = "";
    // }

    let tempItemArray: any[] = [];
    if (data) {
      tempItemArray = [...data];
    } else {
      tempItemArray = [...filterConfig];
    }
    if (!deviationStatus) {
      deviationStatus = { ...closedDeviation };
    }
    let filters: filterOptions = {
      process_status: ["3"],
      company: tempItemArray?.find((element) => {
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
      stext:
        sTextRefClosed.current?.value.length > 0
          ? sTextRefClosed.current?.value
          : "",
    };

    if (deviationStatus.isDeviation !== -1) {
      filters.isDeviation = deviationStatus.isDeviation;
    }
    if (deviationStatus.SUBRSTATUSID.length > 0) {
      filters.SUBRSTATUSID = deviationStatus.SUBRSTATUSID;
    }

    let page = pageNo !== null ? pageNo : closedPage;
    let perpage = perPage ? perPage : closedRowsPerPage;

    let formData = new FormData();
    formData.append("filters", JSON.stringify(filters));
    formData.append("page", (page + 1).toString());
    formData.append("perpage", perpage.toString());
    formData.append("sortorder", "desc");
    formData.append("sortKey", "BLENDED_RISK_SCORE");

    try {
      setIsRiskClosedLoading(true);
      const getUsersResponse = await Axios.post(RISK_ASSIGNMENT, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setTimeout(() => {
        setIsRiskClosedLoading(false);
      }, 2000);
      let dataRecord = getUsersResponse.data.data.records;
      setClosedTotal(getUsersResponse.data.data.totalcount);
      setClosedCreditDebitSum({
        totalcredit: getUsersResponse.data.data.totalcredit,
        totaldebit: getUsersResponse.data.data.totaldebit,
      });
      let riskRecordClosed = [];
      for (let key in dataRecord) {
        let selectedArray = [];
        if (dataRecord[key]?.SELECTED_TRANSACTIONS !== undefined) {
          if (
            dataRecord[key]?.SELECTED_TRANSACTIONS !== null &&
            dataRecord[key]?.SELECTED_TRANSACTIONS.length
          ) {
            let removeStartEnd = dataRecord[key].SELECTED_TRANSACTIONS.replace(
              "[",
              "",
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

  const riskUnderReview = async (
    data?: any,
    pageNo?: any,
    perPage?: any,
    deviationStatus?: any,
  ) => {
    // let tempfilterSet: any = {};
    // if (data) {
    //   tempfilterSet = { ...data };
    // } else {
    //   tempfilterSet = { ...filterSetReview };
    // }
    // tempfilterSet.process_status = ["2"];

    // if (tempfilterSet["toggle"] === 0) {
    //   tempfilterSet["toggle"] = "";
    // }

    let tempItemArray: any[] = [];
    if (data) {
      tempItemArray = [...data];
    } else {
      tempItemArray = [...filterConfig];
    }

    if (!deviationStatus) {
      deviationStatus = { ...reviewDeviation };
    }

    let filters: filterOptions = {
      process_status: ["2"],
      company: tempItemArray?.find((element) => {
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
      stext: sTextRef.current?.value.length > 0 ? sTextRef.current?.value : "",
    };

    if (deviationStatus.isDeviation !== -10) {
      filters.isDeviation = deviationStatus.isDeviation;
    }
    if (deviationStatus.SUBRSTATUSID.length > 0) {
      filters.SUBRSTATUSID = deviationStatus.SUBRSTATUSID;
    }

    let page = pageNo !== null ? pageNo : reviewPage;
    let perpage = perPage ? perPage : reviewRowsPerPage;

    let formData = new FormData();
    formData.append("filters", JSON.stringify(filters));
    formData.append("page", (page + 1).toString());
    formData.append("perpage", perpage.toString());
    formData.append("sortorder", "desc");
    formData.append("sortKey", "BLENDED_RISK_SCORE");

    try {
      setIsLoading(true);
      const getUsersResponse = await Axios.post(RISK_ASSIGNMENT, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      let dataRecord = getUsersResponse.data.data.records;
      setReviewTotal(getUsersResponse.data.data.totalcount);
      setReviewCreditDebitSum({
        totalcredit: getUsersResponse.data.data.totalcredit,
        totaldebit: getUsersResponse.data.data.totaldebit,
      });
      let riskRecordUnderReview = [];

      for (let key in dataRecord) {
        let selectedArray = [];
        if (dataRecord[key]?.SELECTED_TRANSACTIONS !== undefined) {
          if (
            dataRecord[key]?.SELECTED_TRANSACTIONS !== null &&
            dataRecord[key]?.SELECTED_TRANSACTIONS.length
          ) {
            let removeStartEnd = dataRecord[key].SELECTED_TRANSACTIONS.replace(
              "[",
              "",
            );
            removeStartEnd = removeStartEnd.replace("]", "");
            selectedArray = removeStartEnd.split(",");
          }
        }
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
  const riskListHeaders = async (data?: any) => {
    let formData = new FormData();
    let tempfilterSet: any = {};
    if (data) {
      tempfilterSet = { ...data };
    } else {
      tempfilterSet = { ...filterSetReview };
    }

    if (tempfilterSet["toggle"] === 0) {
      tempfilterSet["toggle"] = "";
    }
    delete tempfilterSet["SUBRSTATUSID"];
    delete tempfilterSet["isDeviation"];
    delete tempfilterSet["stext"];
    delete tempfilterSet["process_status"];

    formData.append("filters", JSON.stringify(tempfilterSet));
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
  const chartData = async (data?: any) => {
    let Token = localStorage.getItem("TR_Token") as string;

    let tempfilterSet: any = {};
    if (data) {
      tempfilterSet = { ...data };
    } else {
      tempfilterSet = { ...filterSetReview };
    }

    if (tempfilterSet["toggle"] === 0) {
      tempfilterSet["toggle"] = "";
    }

    delete tempfilterSet["SUBRSTATUSID"];
    delete tempfilterSet["isDeviation"];
    delete tempfilterSet["stext"];
    delete tempfilterSet["process_status"];
    let formData1: any = new FormData();
    formData1.append("filters", JSON.stringify(tempfilterSet));
    formData1.append("charttype", "elapsedtime");
    let formData2: any = new FormData();
    formData2.append("filters", JSON.stringify(tempfilterSet));
    formData2.append("charttype", "auditbacklog");
    let formData3: any = new FormData();
    formData3.append("filters", JSON.stringify(tempfilterSet));
    formData3.append("charttype", "riskreview");
    try {
      setIsLoading(true);
      const getElapsedTime = await Axios.post(CHART_DATA, formData1, {
        headers: {
          Authorization: Token,
        },
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      const getBackLog = await Axios.post(CHART_DATA, formData2, {
        headers: {
          Authorization: Token,
        },
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      const getAuditReview = await Axios.post(CHART_DATA, formData3, {
        headers: {
          Authorization: Token,
        },
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
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
  const [expanded1, setExpanded1] = React.useState<string | false>("panel1");
  const [expanded2, setExpanded2] = React.useState<string | false>("panel2");
  const [expanded3, setExpanded3] = React.useState<string | false>("panel3");

  const handleChange1 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded1(newExpanded ? panel : false);
    };
  const handleChange2 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded2(newExpanded ? panel : false);
    };
  const handleChange3 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded3(newExpanded ? panel : false);
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

  const csv = async (process_status: number) => {
    try {
      const response = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      // setCsvToken(response.data.data.Token)
      const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
      // const REDIRECT = `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${accountDocCode}`
      //window.location.href = `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${accountDocCode}`
      //     console.log(REDIRECT,"REDIRECT")
      // navigate(REDIRECT)
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
          })!?.selected.length > 0
            ? filterConfig?.find((element) => {
              if (element.filterName === "assigned_by") {
                return element;
              }
            })!?.selected
            : [],
      };
      const u = encodeURIComponent(JSON.stringify(filters));
      window.open(
        `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvapdashboard?filters=${u}`,
      );
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

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
          })!?.selected.length > 0
            ? filterConfig?.find((element) => {
              if (element.filterName === "assigned_by") {
                return element;
              }
            })!?.selected
            : [],
      };
      const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
      const u = encodeURIComponent(JSON.stringify(filters));
      window.open(
        `${REACT_APP_BASE_URL}v1/excel/${response.data.data.Token}/apdashboard?filters=${u}`,
      );
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
  const handleClearFilters = () => {
    let configCopy: Config[] = [...filterConfig];
    configCopy.forEach((filter, index) => {
      if (filter.filterName === "companies") {
        filter.selected = [];
      } else if (filter.filterName === "assigned_by") {
        filter.selected = [];
      } else if (filter.filterName === "toggle") {
        filter.selected = 0;
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
    const generateFilterConfig = (companyData: any, assignedData: any) => {
      let companyResponse = companyData;
      let companyKeys = Object.keys(companyResponse);

      let assignedResponse = assignedData;
      let assignedKeys = Object.keys(assignedResponse);

      let configCopy: Config[] = [...setInitData()];
      companyKeys.forEach((key: any) => {
        setInitData().forEach((filter, index) => {
          //console.log("filter", filter);
          if (filter.filterName === "companies") {
            let Obj: any[] = [];

            companyResponse.forEach((companyItem: any) => {
              Obj.push(companyItem);
            });

            configCopy[index].data = [...Obj];
          }
        });
      });
      assignedKeys.forEach((key: any) => {
        setInitData().forEach((filter, index) => {
          if (filter.filterName === "assigned_by") {
            let Obj: any[] = [];
            assignedResponse.forEach((assignedItem: any) => {
              assignedItem.text =
                assignedItem.USER_FIRST_NAME +
                " " +
                assignedItem.USER_LAST_NAME;
              assignedItem.value = assignedItem.USERID;
              Obj.push(assignedItem);
              // console.log("assignedItem", assignedItem);
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
        let formData = new FormData();
        formData.append("filtertype", "apcompanies");
        const response = await Axios.post(GETFILTERS, formData, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
        const companyHolder = response.data.data;
        const getUsersResponse = await Axios.get(FILTER_DATA, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
        const assignedData = getUsersResponse.data.data;

        generateFilterConfig(companyHolder, assignedData);
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
    <>
      <div className="px-7 pt-7 pb-3 text-base font-raleway font-bold bg-[#F5F5F5]">
        AP Case Management
      </div>
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

      {/* <div className="flex m-2 p-2  font-raleway">
            <div className="flex-1 mb-2 font-raleway shadow-lg h-fit">
            <StackingBarChart title="audit-review" data={auditReview}/>
            </div>
            <div className="flex-1 mb-2 font-raleway shadow-lg h-fit">
            <BarChart title="elapsed-time" data={elapsedTime}/>
            </div>
            <div className="flex-1 mb-2 font-raleway shadow-lg h-fit">
            <ColumnChart title="backlog" data={backLog}/>
            </div>
        </div> */}
      <div className="flex font-raleway mx-2 ">
        <div className="flex-1 m-1 font-raleway ">
          {/* <Accordion
                        expanded={expanded1 === "panel1"}
                        onChange={handleChange1("panel1")}
                    >
                        <AccordionSummary
                            aria-controls="panel1d-content"
                            id="panel1d-header"
                        >
                            <Typography>Risk Review Status Analysis</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <StackingBarChart
                                title="audit-review"
                                data={auditReview}
                            />
                        </AccordionDetails>
                    </Accordion> */}
          <Typography>
            Risk Review Status Analysis
            <span className="top-1 p-3 cursor-pointer">
              {isLoading == true ? (
                <CircularProgress
                  style={{ color: " rgb(116, 187, 251)" }}
                  size={20}
                  color="secondary"
                />
              ) : (
                ""
              )}
            </span>
          </Typography>
          <CMStackBarChart title="audit-review" data={auditReview} />
        </div>
        <div className="flex-1 m-1 font-raleway ">
          {/* <Accordion
                        expanded={expanded2 === "panel2"}
                        onChange={handleChange2("panel2")}
                    >
                        <AccordionSummary
                            aria-controls="panel1d-content"
                            id="panel1d-header"
                        >
                            <Typography>Elapsed Time</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <BarChart title="elapsed-time" data={elapsedTime} />
                        </AccordionDetails>
                    </Accordion> */}
          <Typography>
            Elapsed Time
            <span className="top-1 p-3 cursor-pointer">
              {isLoading == true ? (
                <CircularProgress
                  style={{ color: " rgb(116, 187, 251)" }}
                  size={20}
                  color="secondary"
                />
              ) : (
                ""
              )}
            </span>
          </Typography>
          <CMBarchart title="elapsed-time" data={elapsedTime} />
        </div>
        <div className="flex-1 m-1 font-raleway">
          {/* <Accordion
                        expanded={expanded3 === "panel3"}
                        onChange={handleChange3("panel3")}
                    >
                        <AccordionSummary
                            aria-controls="panel1d-content"
                            id="panel1d-header"
                        >
                            <Typography>Audit Backlog By Assignee</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ColumnChart title="backlog" data={backLog} />
                        </AccordionDetails>
                    </Accordion> */}
          <Typography>
            Audit Backlog By Assignee
            <span className="top-1 p-3 cursor-pointer">
              {isLoading == true ? (
                <CircularProgress
                  style={{ color: " rgb(116, 187, 251)" }}
                  size={20}
                  color="secondary"
                />
              ) : (
                ""
              )}
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
              {!isLoading ? (
                <div className="absolute right-14">
                  {" "}
                  {currencySymbol}
                  {numberSuffixPipe(riskUnderReviewHeader.amount)} |{" "}
                  {numberSuffixPipe(riskUnderReviewHeader.count)}{" "}
                </div>
              ) : (
                <div className="absolute right-14">
                  <CircularProgress
                    style={{ color: " rgb(116, 187, 251)" }}
                    size={20}
                    color="secondary"
                  />
                </div>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <div className="flex mb-5">
                {/* <TextField
                                    sx={{ width: "500px" }}
                                    id="standard-basic"
                                    label="Search Accounting Documents"
                                    variant="standard"
                                    value={seachText}
                                    onChange={(e) =>
                                        seachHandleReview(e.target.value)
                                    }
                                /> */}
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
                {/* <span className="top-1 p-3 cursor-pointer">
                  {isLoading == true
                    ?
                    <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                    :
                    ''
                  }
                </span> */}
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
              </div>
              {riskDataRecordUnderReview == "" ? (
                <p>No Records Found</p>
              ) : (
                <CollapsibleTable
                  data={riskDataRecordUnderReview}
                  sumData={reviewCreditDebitSum}
                  reviewStatus="Under Review"
                  riskLevel={[]}
                />
              )}

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
              {!isRiskClosedLoading ? (
                <div className="absolute right-14">
                  {" "}
                  {currencySymbol}
                  {numberSuffixPipe(riskClosedHeader.amount)} |{" "}
                  {numberSuffixPipe(riskClosedHeader.count)}{" "}
                </div>
              ) : (
                <div className="absolute right-14">
                  <CircularProgress
                    style={{ color: " rgb(116, 187, 251)" }}
                    size={20}
                    color="secondary"
                  />
                </div>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <div className="flex mb-5">
                {/* <TextField
                                    sx={{ width: "500px" }}
                                    id="standard-basic-close"
                                    label="Search Accounting Documents"
                                    variant="standard"
                                    value={seachTextClosed}
                                    onChange={(e) =>
                                        seachHandleClosed(e.target.value)
                                    }
                                /> */}
                <div className="w-full md:w-2/5 my-auto">
                  <div className="relative flex flex-row">
                    <input
                      className="p-2 w-full h-full border-2 border-solid border-slate-300 rounded-md focus:border-[#1976d2] focus:outline-none"
                      ref={sTextRefClosed}
                      type="text"
                      autoComplete="off"
                      // onChange={handleStextupdate}
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
                {/* <span className="top-1 p-3 cursor-pointer">
                  {isLoading == true
                    ?
                    <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                    :
                    ''
                  }
                </span> */}
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
              </div>
              {riskDataRecordClosed == "" ? (
                <p>No Records Found</p>
              ) : (
                <CollapsibleTable
                  data={riskDataRecordClosed}
                  sumData={closedCreditDebitSum}
                  reviewStatus="Closed"
                  riskLevel={[]}
                />
              )}

              <TablePagination
                component="div"
                count={closedTotal}
                page={closedPage}
                onPageChange={handleChangePageClosed}
                rowsPerPage={closedRowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPageClosed}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default APCaseManagement;
