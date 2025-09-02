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
import { styled, lighten, darken } from '@mui/system';
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import { AnyARecord } from "dns";
import { useNavigate } from "react-router-dom";

function createData(
  name: string,
  description: string,
  dataType: string,
  required: boolean,
  state: any
) {
  return { name, description, dataType, required, state };
}

const GroupHeader = styled('div')(() => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',

}));

const GroupItems = styled('ul')({
  padding: 0,
});

export interface Props {
  headers: any[];
  headers1: any[];
  setActiveStep: any;
  setIsShowMap: any;
  setIsShowCheckDataHealth: any;
  previousMapping: any[];
  UniqueId: any;
  UniqueId1: any;
  handleback: any;
  setDataHealthMsg: any;
  setApiCallVal: any;
  isShowAutoMapping: any;
  apiCallVal: any;
  secondFileApiCallVal: any;
  jobID: any;
  debitFlags: any;
  creditFlags: any;
  setDebitFlags: any;
  setCreditFlags: any;
  setMappingPayload: any;
  setCheckDataHealth: any
  setStatus: any
}


const VALIDATE_DATA = "v1/ap/setMapping";

export default function TRMappingTable(props: Props) {
  const Axios = axios;

  const [Accounting_Doc, setAccounting_DOC] = React.useState("");
  const [Accounting_Doc2, setAccounting_DOC2] = React.useState("");
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
  const [Invoice_Date, SetInvoice_Date] = React.useState("");
  const [Invoice_Number, SetInvoice_Number] = React.useState("");
  const [Invoice_Amount, SetInvoice_Amount] = React.useState("");
  const [Due_Date, SetDue_Date] = React.useState("");
  const [Payment_Date, SetPayment_Date] = React.useState("");
  const [Vendor_Id, SetVendor_Id] = React.useState("");
  const [Vendor_Name, SetVendor_Name] = React.useState("");
  const [Payment_Terms, SetPayment_Terms] = React.useState("");
  const [Discount_Percentage, SetDiscount_Percentage] = React.useState("");
  const [Discount_Taken, SetDiscount_Taken] = React.useState("");
  const [Posting_Location, SetPosting_Location] = React.useState("");
  const [Entered_Location, SetEntered_Location] = React.useState("");
  const [Posting_Date, SetPosting_Date] = React.useState("");
  const [Line_Item_Id_PK, SetLine_Item_Id_PK] = React.useState("");
  const [Payment_Amount, SetPayment_Amount] = React.useState("");
  const [Line_Debit_Amt_LOC, SetLine_Debit_Amt_LOC] = React.useState("");
  const [Line_Credit_Amt_LOC, SetLine_Credit_Amt_LOC] = React.useState("");
  const [Debit_Credit_Flag, SetDebit_Credit_Flag] = React.useState("");
  const [Discount_Period, SetDiscount_Period] = React.useState("");
  const [Credit_Period, SetCredit_Period] = React.useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedHeaders, setSelectedHeaders] = React.useState<any>();
  const [creditFlag, setCreditFlag] = useState<any>();
  const [debitFlag, setDebitFlag] = useState<any>();
  const [Status, setStatus] = useState("");
  const [Clearing_Document_Number, setClearing_Document_Number] =
    useState("");

  const [isCreditDebitIndicatorSelected, setIsCreditDebitIndicatorSelected] =
    useState(false);
  const [groupData, setGroupData] = useState<any>([]);
  const [assignedData, setAssignedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [balance_Amount, setBalance_Amount] = useState("");
  // const [invoice_Status, setInvoice_Status] = useState("");
  const [purchase_Order_Number, setPurchase_Order_Number] = useState("");
  const [payment_Method, setPayment_Method] = useState("");
  const [bank_Account_Number, setBank_Account_Number] = useState("");
  const [payment_Term_Description, setPayment_Term_Description] = useState("");
  const [grn_Id, setGrn_Id] = useState("");
  const [grn_Date, setGrn_Date] = useState("");
  const [purchase_Order_Date, setPurchase_Order_Date] = useState("");
  const [baseline_Date, setBaseline_Date] = useState("");
  const [requisition_Date, setRequisition_Date] = useState("");
  const [purchase_Request_Number, setPurchase_Request_Number] = useState("");
  const [account_Id, setAccount_Id] = useState("");
  const [entered_Date, setEntered_Date] = useState("");
  const [lineItem_Identifier, setLineItem_Identifier] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isMappingError, setIsMappingError] = useState(false);
  const [mappingErrData, setMappingErrData] = useState("");
  const [apiRes, setApiRes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUniqueIdeError, setIsUniqueIdeError] = useState(false);
  const [getValidateApiRes, setGetValidateApiRes] = useState<any>()
  const [approval1, setApproval1] = useState("");
  const [approval2, setApproval2] = useState("");
  const [approval3, setApproval3] = useState("");
  const [approval4, setApproval4] = useState("");
  const [approval5, setApproval5] = useState("");
  const navigate = useNavigate();

  const [dataloaded, setDataloaded] = useState(false);

  const rows = [
    createData("Accounting Doc File 1", "Accounting document /Journal entry identifier - Used to uniquely identify an AP entry", "String", true, Accounting_Doc),
    createData("Accounting Doc File 2", "Accounting document /Journal entry identifier - Used to uniquely identify an AP entry", "String", true, Accounting_Doc2),
    createData(
      "Journal Type",
      "ID used to uniquely identify a journal",
      "String",
      true,
      Document_Type_Id
    ),
    createData(
      "Journal Type description",
      "Description of the document type or the entry type",
      "String",
      true,
      Document_Type_Description
    ),
    createData(
      "Amount",
      "Amount pertaining to a line item - Debits will be positive and Credits will be negative",
      "Float",
      true,
      Line_Amt_LOC
    ),
    createData(
      "Posted by user",
      "Username/User ID of the user who approved and posted the transaction",
      "String",
      true,
      Username
    ),
    createData(
      "Account Number",
      "Account Number to which the entry is posted",
      "String",
      true,
      Gl_Account_ID
    ),

    createData(
      "Account Name",
      "Account Name to which the entry is posted.",
      "String",
      true,
      GL_Account_Name
    ),

    createData("Invoice Date", "Date mentioned in the invoice", "Date", true, Invoice_Date),
    createData("Invoice Number", "Invoice number recorded in the invoice submitted by the vendor", "String", true, Invoice_Number),
    createData("Invoice Amount", "Amount mentioned in the invoice", "Number", true, Invoice_Amount),
    createData("Due Date", "Date on which the invoice payment is due.If due date is stored in the table then baseline date need not be considered for deriving this date.", "Date", true, Due_Date),
    createData("Payment Date", "Date on which payment was made to the vendor", "Date", true, Payment_Date),
    createData("Vendor ID", "Unique vendor number pertaining to the vendor who submitted the invoice", "Number", true, Vendor_Id),
    createData("Vendor Name", "Unique vendor name pertaining to the vendor who submitted the invoice", "String", true, Vendor_Name),
    createData("Payment Terms", "Payment terms will indicate the credit period offered by the supplier & any disount/rebate if any  Eg: 1% 20 Net 60 days.", "String", true, Payment_Terms),
    createData("Company", "An entity will have different sub companies. Company code will helps to identify the company to which the transaction is posted", "String", true, company),
    createData(
      "Accounting date",
      "Date on which transaction will be accounted and reflected on the GL/TB/FS",
      "Date",
      true,
      Posting_Date
    ),
    createData(
      "Transaction ID GA",
      "ID used to uniquely identify a line item in a journal",
      "String",
      true,
      Line_Item_Id_PK
    ),
    createData("Invoice Status", "Paid/Unpaid/Voided (Reversed/Cancelled)", "String", true, Status),
    createData("Debit Credit Indicator", "Indicating the Debit / credit impact of a line item in a Accouting Document", "String", true, Debit_Credit_Flag),
    createData("Payment Amount", "Payment amount made against the invoice", "Number", true, Payment_Amount),
    createData("Credit Period", "Credit period within which payment of the invoice is toi completed", "Number", true, Credit_Period),
    createData("Entered Date", "Date on which the entry was entered or posted in the system", "String", true, entered_Date),
    createData(
      "Transaction Description",
      "Description of the transaction / Narration or a transaction text",
      "String",
      false,
      Transaction
    ),
    createData(
      "Entered by user",
      "Username/User ID of the user who entered the transaction",
      "String",
      false,
      Parking_Username
    ),
    createData("Discount Percentage", "", "Float", false, Discount_Percentage),
    createData("Discount Taken", "", "String", false, Discount_Taken),
    createData("Posting Location", "", "String", false, Posting_Location),
    createData("Entered Location", "Location from where entry was entered", "String", false, Entered_Location),
    createData(
      "Debit Amount",
      "Debit $ Amount pertaining to the transaction",
      "Float",
      false,
      Line_Debit_Amt_LOC
    ),
    createData(
      "Credit Amount",
      "Credit $ Amount pertaining to the transaction",
      "Float",
      false,
      Line_Credit_Amt_LOC
    ),
    createData("Discount Period", "If Discount is applicable then , Period within which discount can be avaialed.E.g : 1% 20 Net 60 days, here 20 days would be period of discount", "Number", false, Discount_Period),
    createData("Clearing Document Number", "Unique reference number mentioned against each payment made to the vendor", "Number", false, Clearing_Document_Number),

    createData("Balance Amount", "If it’s a part payment or residual payment the balance amount that’s yet to be paid", "Number", false, balance_Amount),
    // createData("Invoice Status", "", "String", false, invoice_Status),
    createData("Purchase Order Number/Id", "PO number against which the invoice was booked", "String", false, purchase_Order_Number),
    createData("Payment Method", "The payment method used for making the payment Eg:CS-CashON- Online/ACH CH - ChequeOT - Other", "String", false, payment_Method),
    createData("Bank Account Number", "The bank account number where the payment is transferred ", "String", false, bank_Account_Number),
    createData("Payment Terms Description", "Description of the payment terms", "String", false, payment_Term_Description),
    createData("Grn Id/Number", "Date on which goods where received at the orgnization (store)", "String", false, grn_Id),
    createData("GRN Date", "Date on which the invoice was received and itesm where delivered", "Date", false, grn_Date),
    createData("Purchase Order date", "Date on which the PO realting this invocie was generated", "Date", false, setPurchase_Order_Date),
    createData("Baseline Date ( For Due Date)", "Date used to calculate the due date. (Baseline date + Credit Period )", "Date", false, baseline_Date),
    createData("Requisition Date ", "Date on which purchase requestions was intiated for this purchase order in this invoice", "Date", false, requisition_Date),
    createData("Purchase Request Number", "Date on which purchase requestions was intiated for this purchase order in this invoice", "String", false, purchase_Request_Number),
    createData("Approval 1", "", "String", false, approval1),
    createData("Approval 2", "", "String", false, approval2),
    createData("Approval 3", "", "String", false, approval3),
    createData("Approval 4", "", "String", false, approval4),
    createData("Approval 5", "", "String", false, approval5),
    // createData("Line Item Identifier", "", "String", false, lineItem_Identifier),
    // createData("Account ID", "", "String", false, account_Id),
  ];

  const handleBackButton = () => {
    props.handleback();
  };

  const updateDataLists = (file: string, title: string, id: string, group?: any, assigned?: any) => {
    console.log(file, "file", title, "title", id, "id")
    //console.log(groupData, "groupData")
    //console.log(assignedData, "assignedData")
    console.log(group, "copyGroupData", assigned)
    if (id === "automap") {
      console.log(id, "111")
      let copyGroupData = [...group];
      let copyAssignData = [...assigned];
      console.log(copyGroupData, copyAssignData, "data's")
      copyGroupData = copyGroupData.filter(obj => obj.file !== file || obj.title !== title);
      console.log(copyGroupData, "copyGroupData automap")
      copyAssignData.push({ title: title, file: file });
      console.log(copyAssignData, "copyAssignData automap")
      return { group: [...copyGroupData], assigned: [...copyAssignData] };
    }
    else {
      let copyGroupData = [...groupData];

      let copyAssignData = [...assignedData];
      if (id.search("combo-box-demo-option") !== -1) {
        // remove the selected item from the dropdown data
        //console.log(copyGroupData, "copyGroupData select");
        copyGroupData = copyGroupData.filter(obj => obj.file !== file || obj.title !== title);
        copyAssignData.push({ title: title, file: file });
        //console.log(copyGroupData, "copyGroupData after select");
      }
      else {
        // add the selected item to the top of the dropdown data
        //console.log(copyGroupData, "copyGroupData cancel");
        const obj = copyAssignData.find(obj => obj.title === title);
        console.log(obj, "obj")
        copyGroupData.push({ title: obj.title, file: obj.file });
        copyAssignData = copyAssignData.filter(obj => obj.file !== file || obj.title !== title);
        //console.log(copyGroupData, "copyGroupData after cancel");
      }


      // update the state
      setGroupData(copyGroupData);
      setAssignedData(copyAssignData);

    }

  };

  const handleChange = (setIN: any, event: any, val: any, rowState: any) => {
    console.log(setIN, "setIN")
    const set = setIN === null ? '' : setIN.title;
    //const set = event.target.value.split(":")[1];

    const title = setIN === null ? rowState : setIN.title;
    const file = setIN === null ? '' : setIN.file;
    console.log(typeof title, typeof file, "types")

    console.log(set, val, "check", event.target.id, "EVENT", title, "name", file, "fileNumber");

    updateDataLists(file, title, event.target.id);

    // create a copy of the dropdown data
    // let copyGroupData = [...groupData];

    // let copyAssignData = [...assignedData];


    // if (event.target.id.search("combo-box-demo-option") !== -1) {
    // // remove the selected item from the dropdown data
    //   //console.log(copyGroupData, "copyGroupData select");
    //   copyGroupData = copyGroupData.filter(obj => obj.file !== file || obj.title !== title);
    //   copyAssignData.push({ title: title, file: file});
    //   //console.log(copyGroupData, "copyGroupData after select");
    // }
    // else {
    //   // add the selected item to the top of the dropdown data
    // //console.log(copyGroupData, "copyGroupData cancel");
    // const obj = copyAssignData.find(obj =>  obj.title === title);
    // copyGroupData.push({ title: obj.title, file: obj.file });
    // copyAssignData = copyAssignData.filter(obj => obj.file !== file || obj.title !== title);
    // //console.log(copyGroupData, "copyGroupData after cancel");
    // }


    // // update the state
    // setGroupData(copyGroupData);
    // setAssignedData(copyAssignData);

    if (val === "Accounting Doc File 1") {
      setAccounting_DOC(set as string);
    } else if (val === "Accounting Doc File 2") {
      setAccounting_DOC2(set as string);
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
    } else if (val === "Invoice Date") {
      SetInvoice_Date(set as string);
    } else if (val === "Invoice Number") {
      SetInvoice_Number(set as string);
    } else if (val === "Invoice Amount") {
      SetInvoice_Amount(set as string);
    } else if (val === "Due Date") {
      SetDue_Date(set as string);
    } else if (val === "Payment Date") {
      SetPayment_Date(set as string);
    } else if (val === "Vendor ID") {
      SetVendor_Id(set as string);
    } else if (val === "Vendor Name") {
      SetVendor_Name(set as string);
    } else if (val === "Payment Terms") {
      SetPayment_Terms(set as string);
    } else if (val === "Discount Percentage") {
      SetDiscount_Percentage(set as string);
    } else if (val === "Discount Taken") {
      SetDiscount_Taken(set as string);
    } else if (val === "Posting Location") {
      SetPosting_Location(set as string);
    } else if (val === "Entered Location") {
      SetEntered_Location(set as string);
    } else if (val === "Accounting date") {
      SetPosting_Date(set as string);
    } else if (val === "Transaction ID GA") {
      SetLine_Item_Id_PK(set as string);
    } else if (val === "Payment Amount") {
      SetPayment_Amount(set as string);
    } else if (val === "Debit Amount") {
      SetLine_Debit_Amt_LOC(set as string);
    } else if (val === "Credit Amount") {
      SetLine_Credit_Amt_LOC(set as string);
    } else if (val === "Debit Credit Indicator") {
      setCreditFlag("");
      setDebitFlag("");
      setIsCreditDebitIndicatorSelected(true);
      SetDebit_Credit_Flag(set as string);
    } else if (val === "Discount Period") {
      SetDiscount_Period(set as string);
    } else if (val === "Invoice Status") {
      setStatus(set as string);
    } else if (val === "Clearing Document Number") {
      setClearing_Document_Number(set as string);
    }
    else if (val === "Credit Period") {
      SetCredit_Period(set as string);
    }
    else if (val === "Balance Amount") {
      setBalance_Amount(set as string);
    }
    else if (val === "Purchase Order Number/Id") {
      setPurchase_Order_Number(set as string);
    }
    else if (val === "Payment Method") {
      setPayment_Method(set as string);
    }
    else if (val === "Bank Account Number") {
      setBank_Account_Number(set as string);
    }
    else if (val === "Payment Terms Description") {
      setPayment_Term_Description(set as string);
    }
    else if (val === "Grn Id/Number") {
      setGrn_Id(set as string);
    }
    else if (val === "GRN Date") {
      setGrn_Date(set as string);
    }
    else if (val === "Purchase Order date") {
      setPurchase_Order_Date(set as string);
    }
    else if (val === "Baseline Date ( For Due Date)") {
      setBaseline_Date(set as string);
    }
    else if (val === "Requisition Date") {
      setRequisition_Date(set as string);
    }
    else if (val === "Purchase Request Number") {
      setPurchase_Request_Number(set as string);
    }
    // else if (val === "Line Item Identifier") {
    //   setLineItem_Identifier(set as string);
    // }
    // else if (val === "Account ID") {
    //   setAccount_Id(set as string);
    // }
    else if (val === "Entered Date") {
      setEntered_Date(set as string);
    }
    else if (val === "Approval 1") {
      setApproval1(set as string);
    }
    else if (val === "Approval 2") {
      setApproval2(set as string);
    }
    else if (val === "Approval 3") {
      setApproval3(set as string);
    }
    else if (val === "Approval 4") {
      setApproval4(set as string);
    }
    else if (val === "Approval 5") {
      setApproval5(set as string);
    }
    else {
    }
  };
  const handleState = () => {
    validateDataApiCall();
  };
  const ini = {
    ACCOUNTING_DOC: Accounting_Doc,
    INV_ACCOUNT_DOC: Accounting_Doc2,
    TRANSACTION_DESCRIPTION: Transaction,
    DOC_TYPE: Document_Type_Id,
    DOC_TYPE_DESCRIPTION: Document_Type_Description,
    AMOUNT: Line_Amt_LOC,
    ENTERED_BY: Parking_Username,
    POSTED_BY: Username,
    GL_ACCOUNT_TYPE: Gl_Account_ID,
    ACCOUNT_DESCRIPTION: GL_Account_Name,
    COMPANY_CODE: company,
    INVOICE_DATE: Invoice_Date,
    INVOICE_NUMBER: Invoice_Number,
    INVOICE_AMOUNT: Invoice_Amount,
    DUE_DATE: Due_Date,
    PAYMENT_DATE: Payment_Date,
    SUPPLIER_ID: Vendor_Id,
    SUPPLIER_NAME: Vendor_Name,
    PAYMENT_TERMS: Payment_Terms,
    DISCOUNT_PERCENTAGE: Discount_Percentage,
    DISCOUNT_TAKEN: Discount_Taken,
    LINE_ITEM_IDENTIFIER: Line_Item_Id_PK,
    PAYMENT_AMOUNT: Payment_Amount,
    POSTED_LOCATION: Posting_Location,
    ENTERED_LOCATION: Entered_Location,
    POSTED_DATE: Posting_Date,
    DISCOUNT_PERIOD: Discount_Period,
    CREDIT_PERIOD: Credit_Period,
    DEBIT_AMOUNT: Line_Debit_Amt_LOC,
    CREDIT_AMOUNT: Line_Credit_Amt_LOC,
    DEBIT_CREDIT_INDICATOR: Debit_Credit_Flag,
    INVOICE_STATUS: Status,
    CLEARING_DOC: Clearing_Document_Number,
    BALANCE_AMOUNT: balance_Amount,
    // INVOICE : invoice_Status,
    PURCHASE_ORDER_NUMBER: purchase_Order_Number,
    PAYMENT_METHOD: payment_Method,
    BANK_ACCOUNT_NUMBER: bank_Account_Number,
    PAYMENT_TERMS_DESCRIPTION: payment_Term_Description,
    GRN_NUMBER: grn_Id,
    GRN_DATE: grn_Date,
    PURCHASE_ORDER_DATE: purchase_Order_Date,
    BASELINE_DATE: baseline_Date,
    REQUISITION_DATE: requisition_Date,
    PURCHASE_REQUEST_NUMBER: purchase_Request_Number,
    // LINE_ITM_IDENTIFIER: lineItem_Identifier,
    // ACCOUNT_ID: account_Id,
    ENTERED_DATE: entered_Date,
    APPROVED_USER_1: approval1,
    APPROVED_USER_2: approval2,
    APPROVED_USER_3: approval3,
    APPROVED_USER_4: approval4,
    APPROVED_USER_5: approval5
  };

  const apCheckApiData = {
    UNIQ_IDEN: props.apiCallVal,
    // UNIQ_IDEN_FILE_2: props.secondFileApiCallVal,
    DEBIT_FLAGS: props.debitFlags ? props.debitFlags : "",
    CREDIT_FLAGS: props.creditFlags ? props.creditFlags : "",
    MANUAL_ENTRY: false
  };
  const validateDataApiCall = async () => {
    let data = ini;
    console.log(data,"data")
    let formData = new FormData();
    formData.append("filename", props.UniqueId);
    formData.append("filename1", props.UniqueId1);
    formData.append("config", JSON.stringify(apCheckApiData));
    formData.append("id", props.jobID);
    // formData.append("datamodule", "gltransactions");
    formData.append("mapping", JSON.stringify(data));
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
      let convertedString = getvalidateDataApiCallResponse.data.toString().replaceAll("'", '"');
      var obj;
      try {
        obj = JSON.parse(convertedString)
        props.setStatus(obj?.[0].Result)
        console.log(obj, "object")
        setMappingErrData('');
        // Do something with the parsed JSON data...
      } catch (error) {
        setIsMappingError(true)
        setMappingErrData(getvalidateDataApiCallResponse.data);
        console.log(getvalidateDataApiCallResponse.data, "invalid json obj")
      }
      const lastObject = obj?.[0].data?.slice(-1)[0];
      let status = lastObject.checks?.[0].status;

      if (status === 'Fail') {
        let data = lastObject.checks?.[0].data
        setIsMappingError(true)
        setMappingErrData(`Unique Identifier Check Failed (${data})`)
      }
      else if (status === 'Pass') {
        console.log(obj, "obj1")
        props.setActiveStep(activeStep + 2);
        props.setIsShowCheckDataHealth(true);
        props.setIsShowMap(false);
        props.setMappingPayload(data)
        props.setCheckDataHealth(obj?.[0].data)
        props.setStatus(obj?.[0].Result)

      }
      else {
        setIsMappingError(true)
        if (obj?.[0]?.data?.[0].DUPLICATE_MAPPING_FOUND)
          setMappingErrData(`Duplicate Mapping Found (${obj?.[0]?.data?.[0].DUPLICATE_MAPPING_FOUND})`)
        else if (obj?.[0]?.data?.[0].Not_Found) {
          setMappingErrData(`Not Found (${obj?.[0]?.data?.[0].Not_Found})`)
        }
        else {

        }
      }
    }
    catch (err: any) {
      console.log(err.response, "error")
      if (err.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
      else if (err.response.status === 500 || err.response == undefined) {
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

  function myFunction(input: string) {
    //return "File 1:" + input;
    return input;
  }
  function myFunction1(input: string) {
    //return "File 2:" + input;
    return input;
  }
  const handleCloseAction = () => {
    setOpen(false);
  };
  const handleCredit = (event: any) => {
    props.setCreditFlags(event.target.value)
  };
  const handleDebit = (event: any) => {
    props.setDebitFlags(event.target.value);
  };
  const handleConfirm = () => {
    setIsCreditDebitIndicatorSelected(false);
  };

  const RenderGroup = (header1: any[], header2: any[]) => {

    //const data = [...props.headers,...props.headers1]
    const options = header1.map((option) => {
      const file1 = "File 1";
      return {
        file: file1,
        title: option,
      };

    })
    const options1 = header2.map((option) => {
      const file2 = "File 2";
      return {
        file: file2,
        title: option,
      };
    })
    const data = [...options, ...options1]
    setDataloaded(true)
    return data
  };

  const handleErrMappingDialogCloseAction = () => {
    setIsMappingError(false);
  };

  useEffect(() => {
    let data = RenderGroup(props.headers, props.headers1);
    setGroupData(data)
  }, [])

  useEffect(() => {

    if (dataloaded === true) {
      setLoading(false);
      // console.log(props.UniqueId, "props.UniqueId")
      //console.log("props.headers:", RenderGroup(props.headers,props.headers1));
      let group = groupData;
      let assigned = assignedData;
      props.previousMapping.forEach((item: any) => {
        if (
          item.value === "ACCOUNTING_DOC" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          //const num = data.findIndex(x => x.title ===item.key);
          //console.log(data[num], "find index val")

          if (props.headers.includes(item.key)) {
            console.log(myFunction(item.key), "headers")
            setAccounting_DOC(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;



          }
          if (props.headers1.includes(item.key)) {
            console.log(myFunction1(item.key), "headers1")
            setAccounting_DOC(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "INV_ACCOUNT_DOC" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setAccounting_DOC2(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setAccounting_DOC2(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "TRANSACTION_DESCRIPTION" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetTransaction(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetTransaction(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "DOC_TYPE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetDocument_Type_Id(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetDocument_Type_Id(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "DOC_TYPE_DESCRIPTION" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetDocument_Type_Description(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetDocument_Type_Description(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "AMOUNT" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetLine_Amt_LOC(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetLine_Amt_LOC(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "ENTERED_BY" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetParking_Username(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetParking_Username(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "POSTED_BY" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetUsername(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetUsername(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "GL_ACCOUNT_TYPE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetGl_Account_ID(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetGl_Account_ID(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "ACCOUNT_DESCRIPTION" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetGL_Account_Name(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetGL_Account_Name(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "COMPANY_CODE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setCompany(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setCompany(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "INVOICE_DATE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetInvoice_Date(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetInvoice_Date(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "INVOICE_NUMBER" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetInvoice_Number(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetInvoice_Number(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "INVOICE_AMOUNT" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetInvoice_Amount(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetInvoice_Amount(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "DUE_DATE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetDue_Date(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetDue_Date(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "PAYMENT_DATE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetPayment_Date(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetPayment_Date(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "SUPPLIER_ID" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetVendor_Id(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;

          }
          if (props.headers1.includes(item.key)) {
            SetVendor_Id(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "SUPPLIER_NAME" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetVendor_Name(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetVendor_Name(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "PAYMENT_TERMS" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetPayment_Terms(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetPayment_Terms(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "DISCOUNT_PERCENTAGE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetDiscount_Percentage(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetDiscount_Percentage(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "DISCOUNT_TAKEN" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetDiscount_Taken(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetDiscount_Taken(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "POSTED_LOCATION" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetPosting_Location(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetPosting_Location(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "ENTERED_LOCATION" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetEntered_Location(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetEntered_Location(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "POSTED_DATE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetPosting_Date(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetPosting_Date(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "LINE_ITEM_IDENTIFIER" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetLine_Item_Id_PK(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetLine_Item_Id_PK(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "PAYMENT_AMOUNT" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetPayment_Amount(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetPayment_Amount(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "DEBIT_AMOUNT" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetLine_Debit_Amt_LOC(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetLine_Debit_Amt_LOC(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "CREDIT_AMOUNT" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetLine_Credit_Amt_LOC(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetLine_Credit_Amt_LOC(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "DEBIT_CREDIT_INDICATOR" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setCreditFlag("");
            setDebitFlag("");
            // setIsCreditDebitIndicatorSelected(true);
            SetDebit_Credit_Flag(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setCreditFlag("");
            setDebitFlag("");
            // setIsCreditDebitIndicatorSelected(true);
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
            SetDebit_Credit_Flag(myFunction1(item.key));
          }
        } else if (
          item.value === "DISCOUNT_PERIOD" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetDiscount_Period(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetDiscount_Period(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "INVOICE_STATUS" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {

          if (props.headers.includes(item.key)) {
            setStatus(item.key);
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setStatus(item.key);
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        } else if (
          item.value === "CLEARING_DOC" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setClearing_Document_Number(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setClearing_Document_Number(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        }
        else if (
          item.value === "CREDIT_PERIOD" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            SetCredit_Period(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            SetCredit_Period(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "BALANCE_AMOUNT" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setBalance_Amount(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setBalance_Amount(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        // else if (
        //   item.value === "INVOICE" &&
        //   (props.headers.includes(item.key) || props.headers1.includes(item.key))
        // ) {
        //   if (props.headers.includes(item.key)) {
        //     setInvoice_Status(myFunction(item.key));
        //   }
        //   if (props.headers1.includes(item.key)) {
        //     setInvoice_Status(myFunction1(item.key));
        //   }

        // }
        else if (
          item.value === "PURCHASE_ORDER_NUMBER" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setPurchase_Order_Number(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setPurchase_Order_Number(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "PAYMENT_METHOD" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setPayment_Method(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setPayment_Method(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "BANK_ACCOUNT_NUMBER" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setBank_Account_Number(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setBank_Account_Number(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "PAYMENT_TERMS_DESCRIPTION" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setPayment_Term_Description(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setPayment_Term_Description(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "GRN_NUMBER" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setGrn_Id(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setGrn_Id(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "GRN_DATE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setGrn_Date(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setGrn_Date(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "PURCHASE_ORDER_DATE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setPurchase_Order_Date(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setPurchase_Order_Date(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "BASELINE_DATE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setBaseline_Date(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setBaseline_Date(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "REQUISITION_DATE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setRequisition_Date(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setRequisition_Date(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "PURCHASE_REQUEST_NUMBER" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setPurchase_Request_Number(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setPurchase_Request_Number(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "LINE_ITM_IDENTIFIER" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setLineItem_Identifier(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setLineItem_Identifier(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "ACOUNT_ID" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setAccount_Id(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setAccount_Id(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "ENTERED_DATE" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setEntered_Date(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setEntered_Date(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }

        }
        else if (
          item.value === "APPROVED_USER_1" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setApproval1(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setApproval1(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        }
        else if (
          item.value === "APPROVED_USER_2" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setApproval2(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setApproval2(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        }
        else if (
          item.value === "APPROVED_USER_3" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setApproval3(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setApproval3(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        }
        else if (
          item.value === "APPROVED_USER_4" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setApproval4(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setApproval4(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        }
        else if (
          item.value === "APPROVED_USER_5" &&
          (props.headers.includes(item.key) || props.headers1.includes(item.key))
        ) {
          if (props.headers.includes(item.key)) {
            setApproval5(myFunction(item.key));
            const tmp: any = updateDataLists("File 1", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
          if (props.headers1.includes(item.key)) {
            setApproval5(myFunction1(item.key));
            const tmp: any = updateDataLists("File 2", String(item.key), "automap", group, assigned);
            group = tmp.group;
            assigned = tmp.assigned;
          }
        }
        else {
        }
      });
      setGroupData(group);
      setAssignedData(assigned);
    }
  }, [dataloaded]);

  useEffect(() => {
    if (Debit_Credit_Flag != "") {
      if (props.isShowAutoMapping == true) {
        setIsCreditDebitIndicatorSelected(true);
      }
    }
  }, [props.isShowAutoMapping]);

  useEffect(() => {
    console.log(groupData, "gourpData")
  }, [groupData]);

  useEffect(() => {
    const fetchingRequiredIsTrueListFromArray = [
      Accounting_Doc,
      Accounting_Doc2,
      Document_Type_Id,
      Document_Type_Description,
      Line_Amt_LOC,
      Username,
      Gl_Account_ID,
      GL_Account_Name,
      company,
      Invoice_Date,
      Invoice_Number,
      Invoice_Amount,
      Due_Date,
      Payment_Date,
      Vendor_Id,
      Vendor_Name,
      Payment_Terms,
      Line_Item_Id_PK,
      Payment_Amount,
      Posting_Date,
      Credit_Period,
      Debit_Credit_Flag,
      Status,
      entered_Date
    ]
    const isDisabled = fetchingRequiredIsTrueListFromArray.some((value) => value === '' || value === null);
    setIsButtonDisabled(isDisabled)
  }, [Accounting_Doc,
    Accounting_Doc2,
    Document_Type_Id,
    Document_Type_Description,
    Line_Amt_LOC,
    Username,
    Gl_Account_ID,
    GL_Account_Name,
    company,
    Invoice_Date,
    Invoice_Number,
    Invoice_Amount,
    Due_Date,
    Payment_Date,
    Vendor_Id,
    Vendor_Name,
    Payment_Terms,
    Line_Item_Id_PK,
    Payment_Amount,
    Posting_Date,
    Credit_Period,
    Debit_Credit_Flag,
    Status,
    entered_Date])

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
            {rows.map((row: any, index: any) => (
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
                      {row.dataType}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {/* <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={[
                      ...[""],
                      ...props.headers.map(myFunction),
                      ...props.headers1.map(myFunction1),
                    ]}
                    // groupBy={(option) => option.fileName}
                    // getOptionLabel={(option) => option.title}
                    // RenderGroup(props.headers,props.headers1)
                    sx={{ width: 240 }}
                    size="small"
                    value={row.state}
                    onChange={(event, newValue, name) => {
                      handleChange(newValue, event, row.name);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} key={row.index+row.name} label={row.name} />
                    )}
                  /> */}
                  {loading ?
                    <p>Loading data...</p>
                    :
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={groupData.sort((a: { file: any; }, b: { file: string; }) => -b.file.localeCompare(a.file))}
                      groupBy={(data) => data.file}
                      getOptionLabel={(data) => data.title}
                      // groupBy={(option) => option.fileName}
                      // getOptionLabel={(option) => option.title}
                      // RenderGroup(props.headers,props.headers1)
                      sx={{ width: 240 }}
                      size="small"
                      value={[...groupData, ...assignedData][[...groupData, ...assignedData].findIndex((x: { title: any; }) => x.title === row.state)]}
                      onChange={(event, newValue, name) => {
                        handleChange(newValue, event, row.name, row.state);
                      }}
                      // renderInput={(params) => (
                      //   <TextField {...params} key={row.index+row.name} label={row.name} />
                      // )}
                      renderInput={(params) => <TextField {...params} key={row.index + row.name} label={row.name} />}
                      renderGroup={(params) => (
                        <li key={params.key}>
                          <GroupHeader>{params.group}</GroupHeader>
                          <GroupItems>{params.children}</GroupItems>
                        </li>
                      )}
                    />
                  }

                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isCreditDebitIndicatorSelected === true
        ?
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
            <p style={{ fontSize: "15px", fontWeight: "bold", maxHeight: "6vh" }}>
              Ap Transaction Data Onboarding
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
        :
        ''
      }
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
            Ap Transaction Data Onboarding
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
