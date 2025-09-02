import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Stack } from "@mui/system";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import axios from "../../../../../api/axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { setInterval } from "timers/promises";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function createData(
  name: string,
  description: string,
  datatype: string,
  required: boolean,
  db_key: string,
  state: any
) {
  return { name, description, datatype, required, db_key, state };
}

export interface Props {
  headers: any[];
  setActiveStep: any;
  setIsShowMap: any;
  setIsShowCheckDataHealth: any;
  UniqueId: any;
  handleback: any;
  setDataHealthMsg: any;
  previousMapping: any[];
  apiCallVal: any;
  debitFlags: any;
  creditFlags: any;
  setApiCallVal: any;
  isShowAutoMapping: any;
  setCreditFlags: any;
  setDebitFlags: any;
  setMappingPayload: any;
  setMappingConfig: any;
  setHealthReportData: any
  setIsMappingError: any
  setStatus:any
}

const VALIDATE_DATA = "v1/je/setMapping";

const sampleData = [
  { value: "ACCOUNTING_DOC", key: "Financial Doc Id - PK" },
  { value: "TRANSACTION_DESCRIPTION", key: "Fin Doc Line Item Text" },
  { value: "DOC_TYPE", key: "Document Type Id" },
  { value: "DOC_TYPE_DESCRIPTION", key: "Document Type Description" },
  { value: "AMOUNT", key: "Line Amt LOC" },
  { value: "ENTERED_BY", key: "Parking Username" },
  { value: "POSTED_BY", key: "Username" },
  { value: "SAP_ACCOUNT", key: "Gl Account ID" },
  { value: "ACCOUNT_DESCRIPTION", key: "GL Account Name" },
  { value: "SAP_COMPANY", key: "Company Code Id" },
  { value: "POSTED_LOCATION", key: "Posting Location" },
  { value: "ENTERED_LOCATION", key: "Entered Location" },
  { value: "POSTING_DATE", key: "Posting Date" },
  { value: "LINE_ITEM_IDENTIFIER", key: "Line Item Id - PK" },
  { value: "DEBIT_AMOUNT", key: "Line Debit Amt LOC" },
  { value: "CREDIT_AMOUNT", key: "Line Credit Amt LOC" },
  { value: "ENTRY_DATE", key: "Entry Date" },
  { value: "ENTRY_TIME", key: "Entry Time" },
  { value: "MANUAL_ENTRY", key: "Manual Entry" },
  { value: "DEBIT_CREDIT_INDICATOR", key: "DEBIT_CREDIT_INDICATOR" },
];

// const sampleData1 = [
//   {key: "" }
// ]

export default function TRMappingTable(props: Props) {
  const Axios = axios;
  const navigate = useNavigate();

  const [Accounting_Doc, setAccounting_DOC] = React.useState("");
  const [Transaction, SetTransaction] = React.useState("");
  const [Document_Type_Id, SetDocument_Type_Id] = React.useState("");
  const [Document_Type_Description, SetDocument_Type_Description] =
    React.useState("");
  const [Line_Amt_LOC, SetLine_Amt_LOC] = React.useState("");
  const [Parking_Username, SetParking_Username] = React.useState("");
  const [Username, SetUsername] = React.useState("");
  const [Gl_Account_ID, SetGl_Account_ID] = React.useState("");
  const [GL_Account_Name, SetGL_Account_Name] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [Posting_Location, SetPosting_Location] = React.useState("");
  const [Entered_Location, SetEntered_Location] = React.useState("");
  const [Posting_Date, SetPosting_Date] = React.useState("");
  const [Line_Item_Id_PK, SetLine_Item_Id_PK] = React.useState("");
  const [Line_Debit_Amt_LOC, SetLine_Debit_Amt_LOC] = React.useState("");
  const [Line_Credit_Amt_LOC, SetLine_Credit_Amt_LOC] = React.useState("");
  const [Debit_Credit_Flag, SetDebit_Credit_Flag] = React.useState("");
  const [Entry_Date, SetEntry_Date] = React.useState("");
  const [Entry_Time, SetEntry_Time] = React.useState("");
  const [Manual_Entry, SetManual_Entry] = React.useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedHeaders, setSelectedHeaders] = React.useState<any>();
  const [previousMappings, setPreviousMappings] = useState<any[]>([
    props.previousMapping,
  ]);
  const [isCreditDebitIndicatorSelected, setIsCreditDebitIndicatorSelected] =
    useState(false);
  const [creditFlag, setCreditFlag] = useState<any>();
  const [debitFlag, setDebitFlag] = useState<any>();
  const [emptyArr, setEmptyArr] = useState<any>([]);
  const [posted_Position, setPosted_Position] = useState("");
  const [posted_Department, setPosted_Department] = useState("");
  const [entered_By_Position, setEntered_By_Position] = useState("");
  const [entered_By_Department, setEntered_By_Department] = useState("");
  const [reversal, setReversal] = useState("");
  const [reverse_Document_Number, setReverse_Document_Number] = useState("");
  const [isManualEntrySelected, setIsManualEntrySelected] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMappingError, setIsMappingError] = useState(false);
  const [mappingErrData, setMappingErrData] = useState<any>('');
  const [assignedData, setAssignedData] = useState<any[]>([]);
  const [headerData , setHeaderData] = useState<any>(props.headers);
  const rows = [
    createData(
      "Accounting Doc",
      "Identifier for a transaction or entry , represented by a number or a code",
      "String",
      true,
      "ACCOUNTING_DOC",
      Accounting_Doc
    ),
    createData(
      "Journal Type",
      "ID used to uniquely identify a journal",
      "String",
      true,
      "DOC_TYPE",
      Document_Type_Id
    ),
    createData(
      "Journal Type description",
      "Description of the transaction / Narration or a transaction text.",
      "String",
      true,
      "DOC_TYPE_DESCRIPTION",
      Document_Type_Description
    ),
    
    createData(
      "Amount",
      "Amount pertaining to a line item - Debits will be positive and Credits will be negative",
      "Float",
      true,
      "AMOUNT",
      Line_Amt_LOC
    ),
    createData(
      "Posted by user",
      "Username/User ID of the user who approved and posted the transaction",
      "String",
      true,
      "POSTED_BY",
      Username
    ),
    createData(
      "Account Number",
      "Account Number to which the entry is posted",
      "String",
      true,
      "SAP_ACCOUNT",
      Gl_Account_ID
    ),
    createData(
      "Account Name",
      "Account Name to which the entry is posted.",
      "String",
      true,
      "ACCOUNT_DESCRIPTION",
      GL_Account_Name
    ), 
    createData(
      "Company",
      "Company code",
      "String",
      true,
      "SAP_COMPANY",
      company
    ),
    createData(
      "Accounting date",
      "Date on which transaction will be accounted and reflected on the GL/TB/FS",
      "Date",
      true,
      "POSTING_DATE",
      Posting_Date
    ),
    createData(
      "Transaction ID GA",
      "ID used to uniquely identify a line item in a journal",
      "String",
      true,
      "LINE_ITEM_IDENTIFIER",
      Line_Item_Id_PK
    ),
    createData(
      "Debit Credit Indicator",
      "Indicating the Debit / credit impact of a line item in a Accouting Document",
      "String",
      true,
      "DEBIT_CREDIT_INDICATOR",
      Debit_Credit_Flag
    ),
    createData(
      "Transaction Description",
      "Description of the transaction / Narration or a transaction text",
      "String",
      false,
      "TRANSACTION_DESCRIPTION",
      Transaction
    ),
    createData(
      "Entered by user",
      "Username/User ID of the user who entered the transaction",
      "String",
      false,
      "ENTERED_BY",
      Parking_Username
    ),
    createData(
      "Posting Location",
      "Location from where the posting/approval of entry was done",
      "String",
      false,
      "POSTED_LOCATION",
      Posting_Location
    ),
    createData(
      "Entered Location",
      "Location from where the transaction was entered ",
      "String",
      false,
      "ENTERED_LOCATION",
      Entered_Location
    ),
    createData(
      "Debit Amount",
      "Debit $ Amount pertaining to the transaction",
      "Float",
      false,
      "DEBIT_AMOUNT",
      Line_Debit_Amt_LOC
    ),
    createData(
      "Credit Amount",
      "Credit $ Amount pertaining to the transaction",
      "Float",
      false,
      "CREDIT_AMOUNT",
      Line_Credit_Amt_LOC
    ),
    
    createData(
      "Entered Date",
      "Date on which transaction is recorded or entered in the system.",
      "Date",
      false,
      "ENTRY_DATE",
      Entry_Date
    ),
    createData(
      "Entered Time",
      "Time on which Journal is posted to GL",
      "Time",
      false,
      "ENTRY_TIME",
      Entry_Time
    ),
    createData(
      "Manual Entry",
      " Identifies if an entry is manual entry or system posted entry.",
      "String",
      false,
      //isManualEntrySelected,
      "MANUAL_ENTRY",
      Manual_Entry
    ),
    createData(
      "Posted Position",
      "Position of the user who approved and posted the transaction",
      "String",
      false,
      "POSTED_POSITION",
      posted_Position
    ),
    createData(
      "Posted department",
      "Department of the user who approved and posted the transaction",
      "String",
      false,
      "POSTED_DEPARTMENT",
      posted_Department
    ),
    createData(
      "Entered by Position",
      "Position of the user who entered the transaction",
      "String",
      false,
      "ENTERED_BY_POSITION",
      entered_By_Position
    ),
    createData(
      "Entered by Department",
      "Department of the user who entered the transaction",
      "String",
      false,
      "ENTERED_BY_DEPARTMENT",
      entered_By_Department
    ),
    createData(
      "Reversal",
      "Used to identify if a line item has been reversed subsequently or is a reversal.",
      "String",
      false,
      "REVERSAL",
      reversal
    ),
    createData(
      "Reverse Document Number",
      "The document number of the corresponding reversal document or the reversed document",
      "String",
      false,
      "REVERSE_DOCUMENT_NUMBER",
      reverse_Document_Number
    ),
  ];
  const handleBackButton = () => {
    props.handleback();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseAction = () => {
    setOpen(false);
  };

  const updateDataLists = ( title:string, id:string, group?:any, assigned?:any) => {
    console.log(props.headers,"headerData",group)
    if (id === "automap") {
      let copyGroupData = [...group];
      let copyAssignData = [...assigned];
      console.log(copyGroupData,"data's",typeof copyGroupData)
      copyGroupData = copyGroupData.filter(obj => obj !== title);
      console.log(copyGroupData, "copyGroupData automap")
      copyAssignData.push(title);
      console.log(copyAssignData, "copyAssignData automap")
      return {group: [...copyGroupData], assigned: [...copyAssignData]};
    }
    else {
      let copyGroupData = [...headerData];
      console.log("copyGroupData",copyGroupData , typeof copyGroupData)
      let copyAssignData = [...assignedData];
      if (id.search("combo-box-demo") !== -1) {
          copyGroupData = copyGroupData.filter(obj =>  obj !== title);
          console.log(copyGroupData,"copyGroupData1")
          copyAssignData.push(title);
        }
        else {
        const obj = copyAssignData.find(obj =>  obj.title === title);
        console.log(obj,"obj")
        copyGroupData.push(title);
        console.log(copyGroupData,"copyGroupData")
        copyAssignData = copyAssignData.filter(obj =>obj?.title !== title);
        }
        // update the state
        setHeaderData(copyGroupData);
        setAssignedData(copyAssignData);
    }

  };
  const handleChange = (set: any, event: any, val: any, rowState: any) => {
   // console.log("set:",set,"event:",event,"val:",val,"rowState:",rowState)
    updateDataLists( set, event.target.id);
    if (val === "Accounting Doc") {
      setAccounting_DOC(set as string);
    } else if (val === "Transaction Description") {
      SetTransaction(set as string);
    } else if (val === "Journal Type") {
      SetDocument_Type_Id(set as string);
    } else if (val === "Journal Type description") {
      SetDocument_Type_Description(set as string);
    } else if (val === "Amount") {
      SetLine_Amt_LOC(set as string);
    } else if (val === "Entered by user") {
      SetParking_Username(set as string);
    } else if (val === "Posted by user") {
      SetUsername(set as string);
    } else if (val === "Account Number") {
      SetGl_Account_ID(set as string);
    } else if (val === "Account Name") {
      SetGL_Account_Name(set as string);
    } else if (val === "Company") {
      setCompany(set as string);
    } else if (val === "Posting Location") {
      SetPosting_Location(set as string);
    } else if (val === "Entered Location") {
      SetEntered_Location(set as string);
    } else if (val === "Accounting date") {
      SetPosting_Date(set as string);
    } else if (val === "Transaction ID GA") {
      SetLine_Item_Id_PK(set as string);
    } else if (val === "Debit Amount") {
      SetLine_Debit_Amt_LOC(set as string);
    } else if (val === "Credit Amount") {
      SetLine_Credit_Amt_LOC(set as string);
    } else if (val === "Debit Credit Indicator") {
      setCreditFlag("");
      setDebitFlag("");
      setIsCreditDebitIndicatorSelected(true);
      SetDebit_Credit_Flag(set as string);
    } else if (val === "Entered Date") {
      SetEntry_Date(set as string);
    } else if (val === "Entered Time") {
      SetEntry_Time(set as string);
    }
    else if (val === "Manual Entry") {
      setIsManualEntrySelected(true)
      SetManual_Entry(set as string);
    }
    else if (val === "Posted Position") {
      setPosted_Position(set as string);
    }
    else if (val === "Posted department") {
      setPosted_Department(set as string);
    }
    else if (val === "Entered by Position") {
      setEntered_By_Position(set as string);
    }
    else if (val === "Entered by Department") {
      setEntered_By_Department(set as string);
    }
    else if (val === "Reversal") {
      setReversal(set as string);
    }
    else if (val === "Reverse Document Number") {
      setReverse_Document_Number(set as string);
    }
    else {
    }
  };
  const handleState = () => {
    validateDataApiCall();
  };
  const glCheckApiData = {
    UNIQ_IDEN: props.apiCallVal,
    DEBIT_FLAGS: props.debitFlags ? props.debitFlags : "",
    CREDIT_FLAGS: props.creditFlags ? props.creditFlags : "",
    MANUAL_ENTRY: isManualEntrySelected
  };

  const API_OUTPUT = {
    ACCOUNTING_DOC: Accounting_Doc,
    TRANSACTION_DESCRIPTION: Transaction,
    DOC_TYPE: Document_Type_Id,
    DOC_TYPE_DESCRIPTION: Document_Type_Description,
    AMOUNT: Line_Amt_LOC,
    ENTERED_BY: Parking_Username,
    POSTED_BY: Username,
    SAP_ACCOUNT: Gl_Account_ID,
    ACCOUNT_DESCRIPTION: GL_Account_Name,
    SAP_COMPANY: company,
    POSTED_LOCATION: Posting_Location,
    ENTERED_LOCATION: Entered_Location,
    POSTING_DATE: Posting_Date,
    LINE_ITEM_IDENTIFIER: Line_Item_Id_PK,
    DEBIT_AMOUNT: Line_Debit_Amt_LOC,
    CREDIT_AMOUNT: Line_Credit_Amt_LOC,
    ENTRY_DATE: Entry_Date,
    ENTRY_TIME: Entry_Time,
    MANUAL_ENTRY: Manual_Entry,
    DEBIT_CREDIT_INDICATOR: Debit_Credit_Flag,
    POSTED_POSITION: posted_Position,
    POSTED_DEPARTMENT: posted_Department,
    ENTERED_BY_POSITION: entered_By_Position,
    ENTERED_BY_DEPARTMENT: entered_By_Department,
    REVERSAL: reversal,
    REVERSE_DOCUMENT_NUMBER: reverse_Document_Number

  };

  const validateDataApiCall = async () => {
    let formData = new FormData();
    formData.append("id", props.UniqueId);
    // formData.append("datamodule", "gltransactions");
    formData.append("mapping", JSON.stringify(API_OUTPUT));
    formData.append("config", JSON.stringify(glCheckApiData));
    let tempResult = {
      message: {
        Result: "Success",
        data: [
          {
            check: "requiredColumnPresent",
            status: "Pass",
            message: "Missing 0 columns",
            data: [],
          },
          {
            check: "dataTypeCheck",
            status: "Fail",
            message: [
              "The column SAP_COMPANY has a dtype of int64 which is not a subclass of the required type object",
              "The column LINE_ITEM_IDENTIFIER has a dtype of int64 which is not a subclass of the required type object",
              "The column DEBIT_CREDIT_INDICATOR has a dtype of int64 which is not a subclass of the required type object",
              "The column MANUAL_ENTRY has a dtype of object which is not a subclass of the required type int64",
            ],
            data: [],
          },
          {
            check: "uniqueIdentifier",
            status: "Pass",
            message: "Given Column is unique identifier",
            data: ["TRANSACTION_ID_GA"],
          },
          {
            check: "nullCheck",
            status: "Pass",
            message: "0 Null column Detected",
            data: [],
          },
          {
            check: "creditDebitIndicator",
            status: "Pass",
            message:
              "DEBIT_AMOUNT and CREDIT_AMOUNT already present in the Data columns",
            data: [["DEBIT_AMOUNT", "CREDIT_AMOUNT"]],
          },
          {
            check: "creditDebitBalance",
            status: "Pass",
            message: "The debit and credit amount are balanced",
            data: [],
          },
          {
            check: "dateCheck",
            status: "Pass",
            message: "The date format is correct",
            data: [
              { column: "POSTING_DATE", count: 0, rows: [] },
              { column: "ENTRY_DATE", count: 0, rows: [] },
              { column: "ENTRY_TIME", count: 0, rows: [] },
            ],
          },
          {
            check: "manualEntryFlag",
            status: "Pass",
            message: "Manual entry flag is not provided for the data",
            date: {},
            data: [],
          },
          { check: "dueDateCheck", status: "", message: "", data: [] },
        ],
      },
    };
    let tempResult1 = {
      data: [
        { check: "requiredColumnPresent", status: "Pass", message: "Missing 0 columns", data: [] },
        { check: "dataTypeCheck", status: "Fail", message: ["The column SAP_COMPANY has a dtype of int64 which is not a subclass of the required type object", "The column LINE_ITEM_IDENTIFIER has a dtype of int64 which is not a subclass of the required type object", "The column DEBIT_CREDIT_INDICATOR has a dtype of int64 which is not a subclass of the required type object", "The column MANUAL_ENTRY has a dtype of object which is not a subclass of the required type int64"], data: [] },
        { check: "uniqueIdentifier", status: "Pass", message: "Given Column is unique identifier", data: ["TRANSACTION_ID_GA"] },
        { check: "nullCheck", status: "Pass", message: "0 Null column Detected", data: [] },
        { check: "creditDebitIndicator", status: "Pass", message: "DEBIT_AMOUNT and CREDIT_AMOUNT already present in the Data columns", data: [["DEBIT_AMOUNT", "CREDIT_AMOUNT"]] },
        { check: "creditDebitBalance", status: "Pass", message: "The debit and credit amount are balanced", data: [] },
        { check: "dateCheck", status: "Pass", message: "The date format is correct", data: [{ "column": "POSTING_DATE", "count": 0, "rows": [] }, { "column": "ENTRY_DATE", "count": 0, "rows": [] }, { "column": "ENTRY_TIME", "count": 0, "rows": [] }] },
        { check: "manualEntryFlag", status: "Pass", message: "Manual entry flag is not provided for the data", "date": {}, data: [] },
        { check: "dueDateCheck", status: "", message: "", data: [] }]
    };
    ;
    try {
      setIsLoading(true)
      const getvalidateDataApiCallResponse = await Axios.post(
        VALIDATE_DATA,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        }
      );
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      console.log(getvalidateDataApiCallResponse.data, "obj");
      let convertedString = getvalidateDataApiCallResponse.data.toString().replaceAll("'", '"');
      var obj;
      try {
         obj = JSON.parse(convertedString)
         props.setStatus(obj?.[0].Result)
         //console.log(obj,"object")
        setMappingErrData('');
        // Do something with the parsed JSON data...
      } catch (error) {
        setIsMappingError(true)
        setMappingErrData(getvalidateDataApiCallResponse.data);
        console.log( getvalidateDataApiCallResponse.data,"invalid json obj")
      }
      const lastObject = obj?.[0].data?.slice(-1)[0];
      let status = lastObject.checks?.[0].status;
      if (status === "Pass") {
        props.setActiveStep(activeStep + 2);
        props.setIsShowCheckDataHealth(true);
        props.setIsShowMap(false)
        props.setMappingPayload(API_OUTPUT)
        props.setHealthReportData(obj?.[0].data)
        props.setStatus(obj?.[0].Result)
      }
      else if (status === "Fail") {
        let data = lastObject.checks?.[0].data
        setIsMappingError(true)
        setMappingErrData(`Unique Identifier Check Failed (${data})`)
      }
      else {
        setIsMappingError(true)
        if(obj?.[0]?.data?.[0].DUPLICATE_MAPPING_FOUND)
        setMappingErrData(`Duplicate Mapping Found (${obj?.[0]?.data?.[0].DUPLICATE_MAPPING_FOUND})`)
        else if(obj?.[0]?.data?.[0].Not_Found){
          setMappingErrData(`Not Found (${obj?.[0]?.data?.[0].Not_Found})`)
        }
        else{
        
        }
      }
    }
    catch (err: any) {
      console.log(err.response,"error")
      if (err.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
      else if (err.response.status === 500 || err.response==undefined ) {
        setIsMappingError(true)
        setMappingErrData("Something Went Wrong")
      }
      else {
        console.log("err:", err);
        setIsMappingError(true)
        //setMappingErrData(temData?.[0].data)
        handleClick();
      }

      // setTimeout(() => {
      //   props.setActiveStep(activeStep + 2);
      //   props.setIsShowMap(false);
      //   props.setIsShowCheckDataHealth(true);
      //   props.setDataHealthMsg("Data File is not compliant");
      // }, 2000);

    }  
  };
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const handleErrMappingDialogCloseAction = () => {
    setIsMappingError(false);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const autoPopulate = (db_key: any) => {
    // console.log("row:",row);
    let elements = Object.keys(sampleData);
    let itemToBeReturned: any = {};
    let indexOfItem = db_key as keyof typeof sampleData;
    itemToBeReturned = props.headers.find(
      (item: any) => item === sampleData[indexOfItem]
    );
    if (itemToBeReturned !== undefined) {
      // let val = row.name;
      // let set = itemToBeReturned;
      // localStorage.setItem(`${indexOfItem}`, sampleData[indexOfItem]);
      // if (val === "Accounting Doc") {
      //   localStorage.setItem(`${indexOfItem}`, sampleData[indexOfItem]);
      //   // setAccounting_DOC(set as string);
      // } else if (val === "Transaction Description") {
      //   // SetTransaction(set as string);
      // } else if (val === "Journal Type") {
      //   // SetDocument_Type_Id(set as string);
      // } else if (val === "Journal Type description") {
      //   // SetDocument_Type_Description(set as string);
      // } else if (val === "Amount") {
      //   // SetLine_Amt_LOC(set as string);
      // } else if (val === "Entered by user") {
      //   // SetParking_Username(set as string);
      // } else if (val === "Posted by user") {
      //   // SetUsername(set as string);
      // } else if (val === "Account Number") {
      //   // SetGl_Account_ID(set as string);
      // } else if (val === "Account Name") {
      //   // SetGL_Account_Name(set as string);
      // } else if (val === "Company") {
      //   // setCompany(set as string);
      // } else if (val === "Posting Location") {
      //   // SetPosting_Location(set as string);
      // } else if (val === "Entered Location") {
      //   // SetEntered_Location(set as string);
      // } else if (val === "Accounting date") {
      //   // SetPosting_Date(set as string);
      // } else if (val === "Transaction ID GA") {
      //   // SetLine_Item_Id_PK(set as string);
      // } else if (val === "Debit Amount") {
      //   // SetLine_Debit_Amt_LOC(set as string);
      // } else if (val === "Credit Amount") {
      //   // SetLine_Credit_Amt_LOC(set as string);
      // } else if (val === "Debit Credit Indicator") {
      //   // SetDebit_Credit_Flag(set as string);
      // } else if (val === "Entered Date") {
      //   // SetEntry_Date(set as string);
      // } else if (val === "Entered Time") {
      //   // SetEntry_Time(set as string);
      // } else if (val === "Manual Entry") {
      //   // SetManual_Entry(set as string);
      // } else {
      // }

      return itemToBeReturned;
    } else {
      return "";
    }
  };

  const handleConfirm = () => {
    setIsCreditDebitIndicatorSelected(false);
  };

  const handleCredit = (event: any) => {
    props.setCreditFlags(event.target.value);
  };
  const handleDebit = (event: any) => {
    props.setDebitFlags(event.target.value);
  };

  useEffect(() => {
    let group = [...headerData];
    console.log(group,"useffectgroupData")
    let assigned = assignedData;
    props.previousMapping.forEach((item: any) => {
      if (item.value === "ACCOUNTING_DOC" && props.headers.includes(item.key)) {
        setAccounting_DOC(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "TRANSACTION_DESCRIPTION" && props.headers.includes(item.key)) {
        SetTransaction(item.key);
        const tmp: any = updateDataLists(String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      } 
      else if (item.value === "DOC_TYPE" && props.headers.includes(item.key)) {
        SetDocument_Type_Id(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "DOC_TYPE_DESCRIPTION" && props.headers.includes(item.key)) {
        SetDocument_Type_Description(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "AMOUNT" && props.headers.includes(item.key)) {
        SetLine_Amt_LOC(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "ENTERED_BY" && props.headers.includes(item.key)) {
        SetParking_Username(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "POSTED_BY" && props.headers.includes(item.key)) {
        SetUsername(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "SAP_ACCOUNT" && props.headers.includes(item.key)) {
        SetGl_Account_ID(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "ACCOUNT_DESCRIPTION" && props.headers.includes(item.key)) {
        SetGL_Account_Name(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "SAP_COMPANY" && props.headers.includes(item.key)) {
        setCompany(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "POSTED_LOCATION" && props.headers.includes(item.key)) {
        SetPosting_Location(item.key);
      }
       else if (item.value === "ENTERED_LOCATION" && props.headers.includes(item.key)) {
        SetEntered_Location(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      } 
      else if (item.value === "POSTING_DATE" && props.headers.includes(item.key)) {
        SetPosting_Date(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      } 
      else if (item.value === "LINE_ITEM_IDENTIFIER" && props.headers.includes(item.key)) {
        SetLine_Item_Id_PK(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "DEBIT_AMOUNT" && props.headers.includes(item.key)) {
        SetLine_Debit_Amt_LOC(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "CREDIT_AMOUNT" && props.headers.includes(item.key)) {
        SetLine_Credit_Amt_LOC(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "DEBIT_CREDIT_INDICATOR" && props.headers.includes(item.key)) {
        SetDebit_Credit_Flag(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "ENTRY_DATE" && props.headers.includes(item.key)) {
        SetEntry_Date(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
       else if (item.value === "ENTRY_TIME" && props.headers.includes(item.key)) {
        SetEntry_Time(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
      else if (item.value === "MANUAL_ENTRY" && props.headers.includes(item.key)) {
        setIsManualEntrySelected(true)
        SetManual_Entry(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
      else if (item.value === "POSTED_POSITION" && props.headers.includes(item.key)) {
        console.log('inside posted position')
        setPosted_Position(item.key);
        console.log(item.key,"posted position",props.headers)
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
      else if (item.value === "POSTED_DEPARTMENT" && props.headers.includes(item.key)) {
        setPosted_Department(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
      else if (item.value === "ENTERED_BY_POSITION" && props.headers.includes(item.key)) {
        setEntered_By_Position(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
      else if (item.value === "ENTERED_BY_DEPARTMENT" && props.headers.includes(item.key)) {
        setEntered_By_Department(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
      else if (item.value === "REVERSAL" && props.headers.includes(item.key)) {
        setReversal(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
      else if (item.value === "REVERSE_DOCUMENT_NUMBER" && props.headers.includes(item.key)) {
        setReverse_Document_Number(item.key);
        const tmp: any = updateDataLists( String(item.key), "automap",group,assigned);
        group = tmp.group;
        assigned = tmp.assigned;
      }
      else {
      }
    });
    setHeaderData(group);
    setAssignedData(assigned);
  }, []);

  useEffect(() => {
    if (Debit_Credit_Flag !== "") {
      if (props.isShowAutoMapping === true) {
        setIsCreditDebitIndicatorSelected(true);
      }
    }
  }, [props.isShowAutoMapping]);
  useEffect(() => {
    
    const fetchingRequiredIsTrueListFromArray = [
      Accounting_Doc,
      Document_Type_Id,
      Document_Type_Description,
      Line_Amt_LOC,
      Username,
      Gl_Account_ID,
      GL_Account_Name,
      company,
      Posting_Date,
      Line_Item_Id_PK,
      Debit_Credit_Flag,
    ]
    const isDisabled = fetchingRequiredIsTrueListFromArray.some((value) => value === '' || value === null);
    setIsButtonDisabled(isDisabled)
  },[ Accounting_Doc,
    Document_Type_Id,
    Document_Type_Description,
    Line_Amt_LOC,
    Username,
    Gl_Account_ID,
    GL_Account_Name,
    company,
    Posting_Date,
    Line_Item_Id_PK,
    Debit_Credit_Flag,])
  // useEffect(()=>{
  //   setHeaderData(props.headers)
  // },[props.headers]) 
  return (
    <>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Eorror Parsing File"
        action={action}
      />
      <TableContainer component={Paper} sx={{ maxHeight: "65vh" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ border: 1, borderColor: "#e0e0e0" }}>
              <TableCell className="bg-[#FFE198]" sx={{ fontWeight: 600 }}>
                Think Risk Columns
              </TableCell>
              <TableCell
                className="bg-[#FFE198]"
                align="left"
                sx={{ fontWeight: 600 }}
              >
                Source Columns
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index: number) => (
              <TableRow
                key={row.name}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ width: "50%", alignItems: "center" }}
                >
                  <div>
                    <span>{row.name}</span>{" "}
                    <span>
                      <Tooltip title={row.description}>
                        <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                      </Tooltip>
                    </span>{" "}
                    {row.required ? (
                      <span style={{ color: "red" }}>*</span>
                    ) : null}
                  </div>
                  <div className="mt-1">
                    <span className="text-green-700 bg-green-200 p-1 rounded-lg">
                      {row.datatype}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Autocomplete
                    disablePortal
                    id={`combo-box-demo-${index}`}
                    options={headerData}
                    sx={{ width: 250 }}
                    size="small"
                    value={row.state}
                    onChange={(event, newValue, name) => {
                      handleChange(newValue, event, row.name, row.state);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={row.name} />
                    )}
                  />
                  {/* <FormControl fullWidth>
                  <InputLabel id={row.name}>{row.name}</InputLabel>
                  <Select
                    labelId={row.name}
                    id={row.name}

                    label={row.name}
                    onChange={handleChange}
                  >
                    {props.headers.map((header) => (

                      <MenuItem value={row.name+":"+header} >{header}</MenuItem>))}
                  </Select>
                </FormControl> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div>
        <Dialog
          open={isCreditDebitIndicatorSelected}
          onClose={handleCloseAction}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: { borderRadius: 20 },
          }}
        >
          <DialogTitle id="alert-dialog-title">
            <p
              style={{ fontSize: "15px", fontWeight: "bold", maxHeight: "6vh" }}
            >
              Gl Transaction Data Onboarding
            </p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div style={{ marginTop: "-2vh" }}>
                <p style={{ display: "flex" }}>
                  <Typography
                    display=" flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    Credit Flag
                  </Typography>
                  &nbsp; &nbsp;
                  <span>
                    <TextField value={props.creditFlags} onChange={(e: any) => handleCredit(e)} />
                  </span>
                </p>
                <p style={{ display: "flex" }}>
                  <Typography
                    display=" flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    Debit Flag
                  </Typography>
                  &nbsp; &nbsp;&nbsp;
                  <span>
                    <TextField value={props.debitFlags} onChange={(e: any) => handleDebit(e)} />
                  </span>
                </p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleConfirm}
              disabled={!props.debitFlags || !props.creditFlags}
              sx={{ textTransform: "capitalize" }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Stack
        direction="row"
        spacing={2}
        style={{ display: "flex", float: "right", marginTop: "5vh" }}
      >
        <div>
          {isLoading == true
            ?
            <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
            :
            ''
          }
        </div>
        <Button
          sx={{ borderRadius: "10px" }}
          variant="contained"
          onClick={handleBackButton}
        >
          Back
        </Button>
        {/* <Button
                    sx={{ borderRadius: "10px" }}
                    variant="contained"
                    disabled
                >
                    View Data
                </Button> */}

        <Button
          sx={{ borderRadius: "10px", textTransform: "capitalize" }}
          variant="contained"
          onClick={handleState}
          disabled={isButtonDisabled === true}
        >
          Data Quality Check
        </Button>
      </Stack>
      <Dialog
        open={isMappingError}
        onClose={handleErrMappingDialogCloseAction}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: { borderRadius: 20 },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontSize: "15px", fontWeight: "bold", maxHeight: "6vh" }}>
            GL Transaction Data Onboarding
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p style={{ color: 'red' }}>{mappingErrData}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrMappingDialogCloseAction}
            sx={{ textTransform: "capitalize" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
