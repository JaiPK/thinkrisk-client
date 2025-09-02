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
// import { glWorkFlow } from "../../shared/helpers/workFlow";
// import { ActionButton } from "../../shared/models/workFlowItems";
// import numberSuffixPipe from "../../shared/helpers/numberSuffixPipe";

// interface filterOptions {
//     assigned_by?: any;
//     company?: any;
//     toggle?: any;
//     process_status?: any;
//     stext?: any;
// }

// export interface Data {
//     account_code: number;
//     acc_doc_id: number;
//     description: string;
//     transactionId: number;
//     riskScore: number;
//     entryDate: string;
//     debit: number;
//     credit: number;
//     name: string;
// }
// const POST_ASSIGN_TASK_URL = "v1/je/assignuser";
// const GLCaseManagement = () => {
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
//     const [transLoading, setTransLoading] = useState(false);
//     const [alertMessage, setAlertMessage] = useState("");
//     const [openAlert, setOpenAlert] = useState(false);
//     // const [actionButtons, setActionButtons] = useState<ActionButton[]>(
//     //     glWorkFlow(
//     //         reviewStatusId,
//     //         subrStatusId,
//     //         roleId,
//     //         userId,
//     //         assignedBy,
//     //         assignedTo
//     //     )
//     // );

//     const Axios = axios;
//     const RISK_ASSIGNMENT = "/v1/casemgmt/getdocuments";
//     const RISK_HEADERS = "/v1/casemgmt/getlistheaders";
//     const COMPANY_DATA = "/v1/je/companies";
//     const FILTER_DATA = "/v1/casemgmt/getassignbyfilter";
//     const ELAPSED_TIME = "/v1/casemgmt/elapsedtimec";
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
//         try {
//             const getUsersResponse = await Axios.get(COMPANY_DATA, {
//                 headers: {
//                     Authorization: localStorage.getItem("TR_Token") as string,
//                 },
//             });
//             setCompanyDataSet(getUsersResponse.data.data);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     //for case management
//     const roleId: number = Number(
//         JSON.parse(localStorage.getItem("THR_USER")!)?.roleId
//     );
//     const userId: number = Number(
//         JSON.parse(localStorage.getItem("THR_USER")!)?.userId
//     );

//     //for popup
//     const [open, setOpen] = useState(false);
//     const [closeTaskOpen, setCloseTaskOpen] = useState(false);
//     const [feedbackOpen, setFeedbackOpen] = useState(false);
//     const handleClickOpen = (task: string) => {
//         switch (task) {
//             case "assigntask":
//                 setOpen(true);
//                 break;
//             case "sendtomanager":
//                 setCloseTaskOpen(true);
//                 break;
//             case "recommendtoclosure":
//                 setCloseTaskOpen(true);
//                 break;
//             case "closetask":
//                 setCloseTaskOpen(true);
//                 break;
//             case "recall":
//                 handleRecallAction();
//                 break;
//             case "feedback":
//                 setFeedbackOpen(true);
//                 break;
//             default:
//                 break;
//         }
//     };

//     const handleClose = (actionCode: number, popup: string) => {
//         switch (popup) {
//             case "assigntask":
//                 if (actionCode === 1) {
//                     //for cancel or close
//                     setOpen(false);
//                 } else {
//                     //for submission
//                     setOpen(false);
//                     setTimeout(() => {
//                         // Run after 100 milliseconds


//                     }, 2000);
//                 }
//                 break;
//             case "sendtomanager":
//                 if (actionCode === 1) {
//                     //for cancel or close
//                     setCloseTaskOpen(false);
//                 } else {
//                     //for submission
//                     setCloseTaskOpen(false);
//                     setTimeout(() => {
//                         // Run after 100 milliseconds

//                     }, 2000);
//                 }
//                 break;
//             case "recommendtoclosure":
//                 if (actionCode === 1) {
//                     //for cancel or close
//                     setCloseTaskOpen(false);
//                     setTimeout(() => {
//                         // Run after 100 milliseconds


//                     }, 2000);
//                 } else {
//                     //for submission
//                     setCloseTaskOpen(false);
//                     setTimeout(() => {
//                         // Run after 100 milliseconds

//                     }, 2000);
//                 }
//                 break;
//             case "closetask":
//                 if (actionCode === 1) {
//                     //for cancel or close
//                     setCloseTaskOpen(false);
//                 } else {
//                     //for submission
//                     setCloseTaskOpen(false);
//                     handlePopUp("Feedback");
//                     // handlePopUp("Feedback");
//                     // setTimeout(() => {

//                     //     handleNavigateBack();
//                     // }, 2000);
//                 }
//                 break;
//             case "feedback":
//                 if (actionCode === 1) {
//                     //for cancel or close
//                     setFeedbackOpen(false);
//                     setTimeout(() => {
//                         // Run after 100 milliseconds

//                     }, 2000);
//                 } else {
//                     //for submission
//                     setFeedbackOpen(false);
//                     setTimeout(() => {
//                         // Run after 100 milliseconds

//                     }, 2000);
//                 }
//                 break;
//             default:
//                 break;
//         }
//     };

//     const handleRecallAction = async () => {
//         let formData = new FormData();
//         // formData.append("ACCOUNTDOCID", document?.ACCOUNTDOCID.toString());
//         formData.append("COMMENTS", "Recalled");
//         formData.append("TRANSACTIONS", "null");
//         formData.append("ASSIGNED_TO", userId.toString());
//         setTransLoading(true);
//         const recallResponse = await Axios.post(
//             POST_ASSIGN_TASK_URL,
//             formData,
//             {
//                 headers: {
//                     Authorization: localStorage.getItem("TR_Token") as string,
//                 },
//             }
//         ).catch((error) => {
//             console.log("error:", error);
//             return;
//         });

//         if (
//             recallResponse?.data?.data ||
//             recallResponse?.data?.message === "Assigned successfully."
//         ) {
//             setTransLoading(false);
//             setAlertMessage(recallResponse.data.message);
//             setOpenAlert(true);
//             setTimeout(() => {
//                 // Run after 100 milliseconds
//             }, 2000);
//         }
//     };
//     const [popupTitle, setPopupTitle] = useState("");
//     const [selectedTrans, setSelectedTrans] = useState<Data[]>([]);
//     const [selectedTransIds, setSelectedTransIds] = useState<number[]>([]);
//     const [initSelectedTrans, setInitSelectedTrans] = useState<number[]>([]);

//     const handlePopUp = (popupTitle: string) => {
//         switch (popupTitle) {
//             case "Assign Task":
//                 setPopupTitle("Assign Task");
//                 handleClickOpen("assigntask");
//                 break;
//             case "Send to Manager":
//                 setPopupTitle("Send to Manager");
//                 handleClickOpen("sendtomanager");
//                 break;
//             case "Recommend to Closure":
//                 setPopupTitle("Recommend to Closure");
//                 handleClickOpen("recommendtoclosure");
//                 break;
//             case "Close Issue":
//                 setPopupTitle("Close Issue");
//                 handleClickOpen("closetask");
//                 break;
//             case "Recall":
//                 setPopupTitle("Recall");
//                 handleClickOpen("recall");
//                 break;
//             case "Feedback":
//                 setPopupTitle("Was the transaction a deviation from normal?");
//                 handleClickOpen("feedback");
//                 break;
//             default:
//                 break;
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
//         let formData: any = new FormData();
//         formData.append("filters", JSON.stringify(filterSet));
//         try {
//             const getElapsedTime = await Axios.post(ELAPSED_TIME, formData, {
//                 headers: {
//                     Authorization: Token,
//                 },
//             });
//             const getBackLog = await Axios.post(BACK_LOG, formData, {
//                 headers: {
//                     Authorization: Token,
//                 },
//             });
//             const getAuditReview = await Axios.post(AUDIT_REVIEW, formData, {
//                 headers: {
//                     Authorization: Token,
//                 },
//             });
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
        
//         tempfilterSet.process_status = ['2'];
        
//         let formData = new FormData();
//         formData.append("filters", JSON.stringify(tempfilterSet));
//         formData.append("page", "1");
//         formData.append("perpage", "5");
//         formData.append("sortkey", "asc");

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
        
//         tempfilterSet.process_status = ['3'];
        
//         let formData = new FormData();
//         formData.append("filters", JSON.stringify(tempfilterSet));
//         formData.append("page", "1");
//         formData.append("perpage", "5");
//         formData.append("sortkey", "asc");

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
//                     Case Management
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
//                                             key={company.COMPANYID}
//                                             value={company.COMPANY_CODE}
//                                         >
//                                             <Checkbox
//                                                 checked={
//                                                     companyName.indexOf(
//                                                         company.COMPANY_CODE
//                                                     ) > -1
//                                                 }
//                                             />
//                                             <ListItemText
//                                                 primary={company.COMPANY_CODE}
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
//                                                 primary={assign.USER_FIRST_NAME +
//                                                     " " +
//                                                     assign.USER_LAST_NAME}
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
//                                  ${numberSuffixPipe(riskUnderReviewHeader.amount)}|
//                                 {numberSuffixPipe(riskUnderReviewHeader.count)}
                                
//                             </Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <div className="w-[99%] text-[10px]">
//                                 <RiskAssignment
//                                     data={riskDataRecordUnderReview} reviewStatus={"Under Review"}
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
//                              ${numberSuffixPipe(riskClosedHeader.amount)}|
//                                 {numberSuffixPipe(riskClosedHeader.count)}  
//                             </Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <div>
//                                 <RiskAssignment data={riskDataRecordClosed} reviewStatus={"Closed"} />
//                             </div>
//                         </AccordionDetails>
//                     </Accordion>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default GLCaseManagement;
import React from 'react'

function CaseManagement() {
  return (
    <div>
      
    </div>
  )
}

export default CaseManagement
