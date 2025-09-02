// import React, { useEffect, useState } from "react";
// import Accordion from "@mui/material/Accordion";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import RiskAssignment from "./RiskAssignment";
// import axios from "../../api/axios";
// import Box from "@mui/material/Box";
// import FormControl from "@mui/material/FormControl";
// import TextField from "@mui/material/TextField";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import Checkbox from "@mui/material/Checkbox";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import MenuItem from "@mui/material/MenuItem";
// import ListItemText from "@mui/material/ListItemText";
// import ContentPasteIcon from "@mui/icons-material/ContentPaste";
// import Charts from "./charts";
// import InputLabel from "@mui/material/InputLabel";
// import numberSuffixPipe from "../../shared/helpers/numberSuffixPipe";

// interface filterOptions {
//     assigned_by?: any;
//     company?: any;
//     toggle?: any;
//     process_status?: any;
//     stext?: any;
// }

// const APCaseManagement = () => {
//     let [riskDataRecordClosed, setRiskDataRecordClosed] = useState({});
//     const [companyName, setCompanyName] = React.useState<string[]>([]);
//     const [assignedBy, setAssignedBy] = React.useState<string[]>([]);
//     const [analysisSet, setAnalysisSet] = React.useState<string>("");
//     const [backLog, setBackLog] = React.useState<Object[]>([]);
//     const [elapsedTime, setElapsedTime] = React.useState<Object[]>([]);
//     const [auditReview, setAuditReview] = React.useState<Object[]>([]);
//     const [assignedByDataSet, setAssignedByDataSet] = React.useState<string[]>(
//         []
//     );
//     const [companyDataSet, setCompanyDataSet] = React.useState<string[]>([]);
//     let [riskDataRecordUnderReview, setRiskDataRecordUnderReview] = useState(
//         {}
//     );
//     let [riskUnderReviewHeader, setRiskUnderReviewHeader] = useState({
//         count: 0,
//         amount: 0,
//     });
//     let [riskClosedHeader, setRiskClosedHeader] = useState({
//         count: 0,
//         amount: 0,
//     });
//     let [filterSet, setFilterSet] = React.useState<filterOptions>({
//         assigned_by: [""],
//         company: [""],
//         toggle: "2",
//         stext: "",
//     });

//     const Axios = axios;
//     const RISK_ASSIGNMENT = "v1/apcasemgt/getinvoices";
//     const RISK_HEADERS = "v1/apcasemgt/getlistheaders";
//     const GETFILTERS = "v1/ap/getfilters";
//     const FILTER_DATA = "v1/apcasemgt/getassignedbylist";
//     const CHART_DATA = "v1/apcasemgt/chartsdata";
//     const BACK_LOG = "/v1/casemgmt/backlogassigneec";
//     const AUDIT_REVIEW = "/v1/casemgmt/auditreviewstatusc";

//     const [expanded, setExpanded] = React.useState<string | false>(false);
//     useEffect(() => {
//         riskUnderReview();
//         riskUnderReviewClosed();
//         riskListHeaders();
//         companyData();
//         AssignedByDataSet();
//         handleChartData();
//     }, [filterSet]);
//     const companyData = async () => {
//         let Token = localStorage.getItem("TR_Token") as string;
//         let formData: any = new FormData();
//         formData.append("filtertype", "apcompanies");
//         try {
//             const getUsersResponse = await Axios.post(GETFILTERS, formData, {
//                 headers: {
//                     Authorization: Token,
//                 },
//             });
//             setCompanyDataSet(getUsersResponse.data.data);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const AssignedByDataSet = async () => {
//         try {
//             const getUsersResponse = await Axios.get(FILTER_DATA, {
//                 headers: {
//                     Authorization: localStorage.getItem("TR_Token") as string,
//                 },
//             });
//             setAssignedByDataSet(getUsersResponse.data.data);
//         } catch (err) {
//             console.log(err);
//         }
//     };
//     const clearFilter = () => {
//         setAnalysisSet("");
//         setAssignedBy([]);
//         setCompanyName([]);
//         setFilterSet({
//             assigned_by: [""],
//             company: [""],
//             toggle: "2",
//             process_status: ["2"],
//             stext: "",
//         });
//     };
//     const handleAssignedBy = (event: SelectChangeEvent<typeof assignedBy>) => {
//         const val = event.target.value;
//         const tempAssignSet = { ...filterSet };
//         setAssignedBy(typeof val === "string" ? val.split(",") : val);
//         tempAssignSet.assigned_by = val;
//         setFilterSet(tempAssignSet);
//     };
//     const handleAnalysisDataSet = (
//         event: SelectChangeEvent<typeof analysisSet>
//     ) => {
//         const val = event.target.value;
//         const tempAnalysisSet = { ...filterSet };
//         setAnalysisSet(event.target.value);
//         tempAnalysisSet.toggle = val;
//         setFilterSet(tempAnalysisSet);
//     };
//     const handleChartData = async () => {
//         let Token = localStorage.getItem("TR_Token") as string;
//         let formDataElapsed: any = new FormData();
//         formDataElapsed.append("filters", JSON.stringify(filterSet));
//         formDataElapsed.append("charttype", "elapsedtime");
//         let formDataRisk: any = new FormData();
//         formDataRisk.append("filters", JSON.stringify(filterSet));
//         formDataRisk.append("charttype", "riskreview");
//         let formDataBacklog: any = new FormData();
//         formDataBacklog.append("filters", JSON.stringify(filterSet));
//         formDataBacklog.append("charttype", "auditbacklog");
//         try {
//             const getElapsedTime = await Axios.post(
//                 CHART_DATA,
//                 formDataElapsed,
//                 {
//                     headers: {
//                         Authorization: Token,
//                     },
//                 }
//             );
//             const getBackLog = await Axios.post(CHART_DATA, formDataRisk, {
//                 headers: {
//                     Authorization: Token,
//                 },
//             });
//             const getAuditReview = await Axios.post(
//                 CHART_DATA,
//                 formDataBacklog,
//                 {
//                     headers: {
//                         Authorization: Token,
//                     },
//                 }
//             );
//             setBackLog(getBackLog.data.data);
//             setElapsedTime(getElapsedTime.data.data);
//             setAuditReview(getAuditReview.data.data);
//         } catch (err) {
//             console.log(err);
//         }
//     };
//     const handleCompanyName = (
//         event: SelectChangeEvent<typeof companyName>
//     ) => {
//         const val = event.target.value;
//         const tempfilterSet = { ...filterSet };
//         setCompanyName(typeof val === "string" ? val.split(",") : val);
//         tempfilterSet.company = val;
//         setFilterSet(tempfilterSet);
//     };
//     const riskListHeaders = async () => {
//         let formData = new FormData();
//         formData.append("filters", JSON.stringify(filterSet));
//         try {
//             const getUsersResponse = await Axios.post(RISK_HEADERS, formData, {
//                 headers: {
//                     Authorization: localStorage.getItem("TR_Token") as string,
//                 },
//             });
//             setRiskUnderReviewHeader(getUsersResponse.data.data.inprogress);
//             setRiskClosedHeader(getUsersResponse.data.data.closed);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const handleChange =
//         (panel: string) =>
//         (event: React.SyntheticEvent, isExpanded: boolean) => {
//             setExpanded(isExpanded ? panel : false);
//         };
//     const riskUnderReview = async () => {
//         const tempfilterSet = { ...filterSet };

//         tempfilterSet.process_status = ["2"];

//         let formData = new FormData();
//         formData.append("filters", JSON.stringify(tempfilterSet));
//         formData.append("page", "1");
//         formData.append("perpage", "5");
//         formData.append("sortkey", "BLENDED_RISK_SCORE");

//         try {
//             const getUsersResponse = await Axios.post(
//                 RISK_ASSIGNMENT,
//                 formData,
//                 {
//                     headers: {
//                         Authorization: localStorage.getItem(
//                             "TR_Token"
//                         ) as string,
//                     },
//                 }
//             );
//             let dataRecord = getUsersResponse.data.data.records;
//             let riskRecordUnderReview = [];

//             for (let key in dataRecord) {
//                 riskRecordUnderReview.push(dataRecord[key]);
//             }

//             setRiskDataRecordUnderReview(riskRecordUnderReview);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const riskUnderReviewClosed = async () => {
//         const tempfilterSet = { ...filterSet };

//         tempfilterSet.process_status = ["3"];

//         let formData = new FormData();
//         formData.append("filters", JSON.stringify(tempfilterSet));
//         formData.append("page", "1");
//         formData.append("perpage", "5");
//         formData.append("sortkey", "BLENDED_RISK_SCORE");

//         try {
//             const getUsersResponse = await Axios.post(
//                 RISK_ASSIGNMENT,
//                 formData,
//                 {
//                     headers: {
//                         Authorization: localStorage.getItem(
//                             "TR_Token"
//                         ) as string,
//                     },
//                 }
//             );
//             let dataRecord = getUsersResponse.data.data.records;
//             let riskRecordClosed = [];
//             for (let key in dataRecord) {
//                 riskRecordClosed.push(dataRecord[key]);
//             }
//             setRiskDataRecordClosed(riskRecordClosed);
//         } catch (err) {
//             console.log(err);
//         }
//     };
//     return (
//         <div className="font-['Helvetica']">
//             <div className="">
//                 <Box
//                     sx={{
//                         minWidth: "89%",
//                         width: "89%",
//                         boxShadow: 1,
//                         ml: "12px",
//                         mb: "12px",
//                         pl: "16px",
//                         py: "16px",
//                     }}
//                 >
//                     Case Management {companyName}
//                 </Box>
//                 <Box
//                     sx={{
//                         minWidth: "100%",
//                         width: "100%",
//                         boxShadow: 1,
//                         ml: "12px",
//                         my: "12px",
//                         pl: "16px",
//                         py: "16px",
//                     }}
//                 >
//                     <div className="inline-flex w-[25%]">
//                         <div className="py-4">Company : </div>
//                         <div className=" w-[70%] pr-3.5">
//                             <FormControl fullWidth variant="standard">
//                                 <Select
//                                     id="demo-multiple-checkbox"
//                                     multiple
//                                     value={companyName}
//                                     onChange={handleCompanyName}
//                                     // displayEmpty
//                                     input={
//                                         <OutlinedInput
//                                             label="Tag"
//                                             sx={{
//                                                 border: 0,
//                                                 borderColor: "white",
//                                             }}
//                                         />
//                                     }
//                                     renderValue={(selected) =>
//                                         selected.join(", ")
//                                     }
//                                     sx={{
//                                         width: "100%",
//                                     }}
//                                 >
//                                     <MenuItem key="all" value="">
//                                         <Checkbox
//                                             checked={
//                                                 companyName.indexOf("") > -1
//                                             }
//                                         />
//                                         <ListItemText primary="All" />
//                                     </MenuItem>
//                                     {companyDataSet.map((company: any) => (
//                                         <MenuItem
//                                             key={company.value}
//                                             value={company.text}
//                                         >
//                                             <Checkbox
//                                                 checked={
//                                                     companyName.indexOf(
//                                                         company.text
//                                                     ) > -1
//                                                 }
//                                             />
//                                             <ListItemText
//                                                 primary={company.text}
//                                             />
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </div>
//                     </div>
//                     <div className="inline-flex  w-[25%]">
//                         <div className="py-4">Assigned by:</div>
//                         <div className=" w-[60%] pr-3.5">
//                             <FormControl fullWidth variant="standard">
//                                 <Select
//                                     id="demo-multiple-checkbox"
//                                     multiple
//                                     value={assignedBy}
//                                     onChange={handleAssignedBy}
//                                     input={<OutlinedInput label="Tag" />}
//                                     renderValue={(selected) =>
//                                         selected.join(", ")
//                                     }
//                                     sx={{ width: "100%" }}
//                                 >
//                                     <MenuItem key="all" value="">
//                                         <Checkbox
//                                             checked={
//                                                 assignedBy.indexOf("") > -1
//                                             }
//                                         />
//                                         <ListItemText primary="All" />
//                                     </MenuItem>
//                                     {assignedByDataSet.map((assign: any) => (
//                                         <MenuItem
//                                             key={assign.USERID}
//                                             value={
//                                                 assign.USER_FIRST_NAME +
//                                                 " " +
//                                                 assign.USER_LAST_NAME
//                                             }
//                                         >
//                                             <Checkbox
//                                                 checked={
//                                                     assignedBy.indexOf(
//                                                         assign.USER_FIRST_NAME +
//                                                             " " +
//                                                             assign.USER_LAST_NAME
//                                                     ) > -1
//                                                 }
//                                             />
//                                             <ListItemText
//                                                 primary={
//                                                     assign.USER_FIRST_NAME +
//                                                     " " +
//                                                     assign.USER_LAST_NAME
//                                                 }
//                                             />
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </div>
//                     </div>
//                     <div className="inline-flex w-[25%]">
//                         <div className="py-4">Analysis Data Set :</div>
//                         <div className=" w-[50%] pr-3.5">
//                             <FormControl fullWidth variant="standard">
//                                 <Select
//                                     id="demo-multiple-checkbox"
//                                     value={analysisSet}
//                                     onChange={handleAnalysisDataSet}
//                                     sx={{ width: "100%" }}
//                                 >
//                                     <MenuItem key="1" value={1}>
//                                         Above Materiality
//                                     </MenuItem>
//                                     <MenuItem key="2" value={2}>
//                                         Above Threshold
//                                     </MenuItem>
//                                     <MenuItem key="3" value={3}>
//                                         Below Threshold
//                                     </MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </div>
//                     </div>
//                     <div className="inline-flex py-4 pr-3.5 w-[10%]">
//                         <ContentPasteIcon onClick={clearFilter} />
//                     </div>
//                 </Box>
//             </div>
//             <div>
//                 {auditReview && Object.keys(auditReview).length > 0 && (
//                     <div className="inline-flex w-[30%]">
//                         <Charts
//                             chartData={auditReview}
//                             chartHeader="Risk Review Status Analysis"
//                             key_val="auditReview"
//                         />
//                     </div>
//                 )}
//                 {elapsedTime && elapsedTime.length > 0 && (
//                     <div className="inline-flex w-[30%]">
//                         <Charts
//                             chartData={elapsedTime}
//                             chartHeader="Elapsed Time"
//                             key_val="elapsedTime"
//                         />
//                     </div>
//                 )}

//                 {backLog && backLog.length > 0 && (
//                     <div className="inline-flex w-[30%]">
//                         <Charts
//                             chartData={backLog}
//                             chartHeader="Audit Backlog by Assignee"
//                             key_val="backLog"
//                         />
//                     </div>
//                 )}
//             </div>
//             <div className="shadow-2xl my-3 mx-3 w-['100'] pb-20">
//                 <div className="font-semibold pt-4 px-4 text-sm">
//                     Risk Assignment
//                 </div>
//                 <div className="shadow-lg my-2 mx-2.5 max-w-full">
//                     <Accordion
//                         expanded={expanded === "underreview"}
//                         onChange={handleChange("underreview")}
//                     >
//                         <AccordionSummary
//                             expandIcon={<ExpandMoreIcon />}
//                             aria-controls="panel3bh-content"
//                             id="panel3bh-header"
//                         >
//                             <Typography
//                                 sx={{
//                                     width: "89%",
//                                     flexShrink: 0,
//                                     fontSize: 14,
//                                     fontWeight: 600,
//                                 }}
//                             >
//                                 Under Review
//                             </Typography>
//                             <Typography
//                                 sx={{
//                                     color: "text.secondary",
//                                     fontSize: 14,
//                                     fontWeight: 600,
//                                 }}
//                                 align="right"
//                             >
//                                 ${numberSuffixPipe(riskUnderReviewHeader.amount)}|
//                                 {numberSuffixPipe(riskUnderReviewHeader.count)}
//                             </Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <div className="w-[99%] text-[10px]">
//                                 <RiskAssignment
//                                     data={riskDataRecordUnderReview}
//                                     reviewStatus={"Under Review"}
//                                 />
//                             </div>
//                         </AccordionDetails>
//                     </Accordion>
//                 </div>
//                 <div className="shadow-lg my-2 mx-2.5">
//                     <Accordion
//                         expanded={expanded === "underclosed"}
//                         onChange={handleChange("underclosed")}
//                     >
//                         <AccordionSummary
//                             expandIcon={<ExpandMoreIcon />}
//                             aria-controls="panel3bh-content"
//                             id="panel3bh-header"
//                         >
//                             <Typography
//                                 sx={{
//                                     width: "89%",
//                                     flexShrink: 0,
//                                     fontSize: 14,
//                                     fontWeight: 600,
//                                 }}
//                             >
//                                 Closed
//                             </Typography>
//                             <Typography
//                                 sx={{
//                                     color: "text.secondary",
//                                     fontSize: 14,
//                                     fontWeight: 600,
//                                 }}
//                             >
//                                 ${numberSuffixPipe(riskClosedHeader.amount)}|
//                                 {numberSuffixPipe(riskClosedHeader.count)}
//                             </Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <div>
//                                 <RiskAssignment
//                                     data={riskDataRecordClosed}
//                                     reviewStatus={"Closed"}
//                                 />
//                             </div>
//                         </AccordionDetails>
//                     </Accordion>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default APCaseManagement;


import { CircularProgress, Tooltip } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import * as ReactDOM from "react-dom";
import TablePagination from "@mui/material/TablePagination";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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
// import PositionedMenu from "../../dashboard/generalLedger/transactions/components/TransactionExport";

import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CMStackBarChart from "../../features/ui/Charts/CMStackBarChart";
import CMBarchart from "../../features/ui/Charts/CMBarchart";
import CMColumnChart from "../../features/ui/Charts/CMColumnChart";
import axios from "../../api/axios";
import numberSuffixPipe from "../../shared/helpers/numberSuffixPipe";
import { useAppDispatch } from "../../hooks";
import { updateOtherPage } from "../../features/modules/app-slice/app-slice";
import { Config } from "../../shared/models/filters";
import PositionedMenu from "../../features/modules/dashboard/generalLedger/transactions/components/TransactionExport";
import CollapsibleTable from "../../features/modules/case-management/components/APCaseManagementGrid";
import FilterBar from "../../shared/ui/filter-bar/FilterBar";


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
