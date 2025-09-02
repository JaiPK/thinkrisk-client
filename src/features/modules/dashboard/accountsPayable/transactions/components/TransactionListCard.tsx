import {
    Avatar,
    Badge,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Popover,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {
    AccDocument,
    RiskLevel,
} from "../../../../../../shared/models/records";
import ForumIcon from "@mui/icons-material/Forum";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import Divider from "@mui/material/Divider";
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, SetStateAction, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import CommentsPopOver from "../../../../../../shared/ui/pop-overs/CommentsPopOver";
import axios from "../../../../../../api/axios";
import { Cancel } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Papa from 'papaparse';
import { DateRangePicker } from "rsuite";
import { getPath } from "../../../../../../shared/helpers/getPath";
import React from "react";


export interface Props {
    documentTitle: string;
    document: AccDocument;
    riskLevel: RiskLevel;
    handleTransDetails(
        transId: number,
        document: AccDocument,
        riskLevel: RiskLevel
    ): void;
}

interface vendorDetails {
    old: object,
    new: object
}
const POST_DOCUMENT_INFO_URL = "v1/ap/documentinfo";
const GET_VENDOR_DATA = "v1/ap/vendors";
const GET_VENDOR_HISTORY = "v1/ap/vendorHistory";
const DOWNLOAD_VENDOR_HISTORY = "v1/ap/csvvendohistory";

const TransactionListCard = (props: any) => {
    const currencySymbol = localStorage.getItem("CurrencySymbol");
    const [showPanel, setShowPanel] = useState(false);
    const controls =
        props?.document?.CONTROL_DEVIATION !== null &&
            props?.document?.CONTROL_DEVIATION.length
            ? props?.document?.CONTROL_DEVIATION.split(",").filter(
                (control: any) => control !== ""
            )
            : [];
    const [risk, setRisk] = useState<string>("High");
    const [totalRiskTrans, setTotalRiskTrans] = useState(0);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [isViewHistory, setIsViewHistory] = useState(false)
    const [postedData, setPostedData] = useState<any>();
    const [usersData, setUsersData] = useState<any>();
    const [userArray, setUserArray] = useState<any>();
    const [minMaxArray, setMinMaxArray] = useState<{ min: any; max: any; }[]>([]);
    const [userLevelsArray, setUserLevelsArray] = useState<string[]>([] as string[]);
    const [trueLevels, setTrueLevels] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null | any>(new Date());;
    const [filter, setFilter] = useState('all'); // initial filter state
    const [vendorData, setVendorData] = useState<any>([])
    const [vendorHistoryData, setVendorHistoryData] = useState<any>([]);
    const [sensitiveChangeData, setSensitiveChangeData] = useState<any>('');
    const [isShowVendorDataTable, setIsShowVendorDataTable] = useState(false)
    const [vendorDataApiFailureMessage, setVendorDataApiFailureMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState<any>();
    const [approvalMatrixMode, setApprovalMatrixMode] = useState<any>()
    const [downloadVendorHistoryData, setDownloadVendorHistoryData] = useState<any>()
    const [selectedOption, setSelectedOption] = useState('All');

    const downLoadHistoryText = 'Download History'
    const viewHistoryText = 'View History'

    const dateRangePickerStyle = {
        padding: '4px',
        height: '8.5vh',
        width: '15vw',
    };
    const options = ['Yes', 'No', "All"];
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const [documentInfo, setDocumentInfo] = useState<any>({
        activities: [],
        posted: [],
        riskiness: [],
        message: "",
    });
    const [isVendorPopUp, setIsVendorPopUp] = useState(false);
    const Axios = axios;

    const handleShowPanel = () => {
        if (!showPanel) {
            getDocumentInfo();
        }
        setShowPanel(!showPanel);
    };
    const getDocumentInfo = async () => {
        let formData = new FormData();
        const auditId = getPath.getPathValue('audit_id');
        formData.append("AUDIT_ID", auditId);
        formData.append("ACCDOC_ID", props?.document.ACCOUNT_DOC_ID.toString());
        const getDocumentInfoResponse = await Axios.post(
            POST_DOCUMENT_INFO_URL,
            formData,
            {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            }
        );
        let userArray: any = [];
        let minMaxArray = [];
        let userLevelsArray = [];
        const trueLevels = [];

        for (let key in getDocumentInfoResponse?.data?.data?.posted[0]) {
            if (key.startsWith('USER_') && getDocumentInfoResponse?.data?.data?.posted[0][key]) {
                let userParts = getDocumentInfoResponse?.data?.data?.posted[0][key].split('_');
                userArray.push(userParts[0]);
                userLevelsArray.push(userParts[1]);
                minMaxArray.push({ min: userParts[2], max: userParts[3] });
            }
            if (key.startsWith("LEVEL_") && getDocumentInfoResponse?.data?.data?.posted[0][key] === "TRUE") {
                const userParts = key.split("_");
                trueLevels.push(userParts[1]);
            }
        }
        setApprovalMatrixMode(getDocumentInfoResponse?.data?.data?.rule)
        setUserArray(userArray)
        setMinMaxArray(minMaxArray)
        setUserLevelsArray(userLevelsArray)
        setTrueLevels(trueLevels)
        if (
            getDocumentInfoResponse.data.data.activities.length ||
            getDocumentInfoResponse.data.data.riskiness.length
        ) {
            setDocumentInfo(getDocumentInfoResponse.data.data);
            setRisk(getDocumentInfoResponse.data.data.riskiness.risklevel);
            if (getDocumentInfoResponse.data.data.riskiness.length) {
                let Obj = 0;
                getDocumentInfoResponse.data.data.riskiness.forEach(
                    (element: any) => {
                        Obj = Obj + element.countval;
                    }
                );
                setTotalRiskTrans(Obj);
            }
        }
    };
    const convertDateFormat = (date: string) => {
        const dateObject = new Date(date).toLocaleString('en-us', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        return dateObject;
    }
    const getVendorData = async (vendorId: any) => {
        setIsVendorPopUp(true)
        setIsViewHistory(false)
        try {
            setIsLoading(true)
            const getVendorDetails = await Axios.get(
                GET_VENDOR_DATA,
                {
                    params: {
                        "vendorcode": vendorId
                    },
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            )
            if (getVendorDetails?.data?.message == 'success') {
                let data: any = []
                data.push(getVendorDetails?.data?.data)
                setVendorData(data)
            }
            // cehck if the message is "no records found!" and see if the data.error.new or data.error.old has data
            else if (getVendorDetails?.data?.message == 'no records found!' && getVendorDetails?.data?.error.new || getVendorDetails?.data?.error.old) {
                setVendorDataApiFailureMessage(getVendorDetails?.data?.message)
                let data: vendorDetails[] = []
                let obj: vendorDetails = { new: {}, old: {} }
                if (getVendorDetails?.data?.error.new) {
                    obj.new = getVendorDetails?.data?.error.new

                }
                else {
                    obj.new = {
                        "VENDORID": null,
                        "VENDORCODE": null,
                        "VENDOR_NAME": null,
                        "BANK_ACCOUNT_NUMBER": null,
                        "BANK_NAME": null,
                        "BENIFICIARY_NAME": null,
                        "PAYMENT_TERMS": null,
                        "CURRENCY": null,
                        "CONTACT_PERSON": null,
                        "VENDOR_ADDRESS": null,
                        "TAX_ID": null,
                        "DUNS_NUMBER": null,
                        "IS_SENSITIVE_CHANGE": 0,
                        "CREATED_DATE": null,
                        "CREATED_BY": null
                    }
                }
                if (getVendorDetails?.data?.error.old) {
                    obj.old = getVendorDetails?.data?.error.old
                }
                else {
                    obj.old = {
                        "VENDORID": null,
                        "VENDORCODE": null,
                        "VENDOR_NAME": null,
                        "BANK_ACCOUNT_NUMBER": null,
                        "BANK_NAME": null,
                        "BENIFICIARY_NAME": null,
                        "PAYMENT_TERMS": null,
                        "CURRENCY": null,
                        "CONTACT_PERSON": null,
                        "VENDOR_ADDRESS": null,
                        "TAX_ID": null,
                        "DUNS_NUMBER": null,
                        "IS_SENSITIVE_CHANGE": 0,
                        "CREATED_DATE": null,
                        "CREATED_BY": null
                    }
                }
                data.push(obj)
                setVendorData(data)
            }

            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
        catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
            }
        }
    }
    const vendorPopUpClose = () => {
        setIsVendorPopUp(false)
    }
    const ApprovalMatrixData = [
        {
            user_id: userArray,
            level: userLevelsArray,
            range: minMaxArray,
            Required_Approvel: trueLevels
        }
    ]
    const valueToCheck = Number(props?.document?.CREDIT_AMOUNT);
    const outOfRange: { min: number; max: number; }[] = [];

    ApprovalMatrixData[0]?.range?.forEach((range: any) => {
        if (valueToCheck >= Number(range.min) && valueToCheck < Number(range.max)) {
            return; // number is in range, so leave it
        } else {
            outOfRange.push({ min: range.min, max: range.max }); // number is out of range, so push range to outOfRange array
        }
    });
    var missingLevel: any = [];
    var unWantedLevel: any = [];
    ApprovalMatrixData.forEach((data) => {
        const levels = data.level;
        const requiredLevels = data.Required_Approvel;

        requiredLevels?.forEach((requiredLevel: any) => {
            if (!levels.includes(requiredLevel)) {
                missingLevel.push(requiredLevel);
            }
        });
        levels?.forEach((level: any) => {
            if (!requiredLevels.includes(level) && !unWantedLevel.includes(level)) {
                unWantedLevel.push(level);
            }
        });
    });
    const vendorDataNames = ["VENDORCODE", "VENDOR_NAME", "BANK_ACCOUNT_NUMBER", "BANK_NAME", "BENIFICIARY_NAME", "PAYMENT_TERMS", "CURRENCY", "CONTACT_PERSON", "VENDOR_ADDRESS"]

    const vendorHistoryDataNames = ["VENDORCODE", "VENDOR_NAME", "BANK_ACCOUNT_NUMBER", "BANK_NAME", "BENIFICIARY_NAME", "PAYMENT_TERMS", "CURRENCY", "CONTACT_PERSON", "VENDOR_ADDRESS", "CREATED_DATE", "CREATED_BY", "IS_SENSITIVE_CHANGE"]

    const handleBackArrow = () => {
        setIsViewHistory(false)
    }
    const handleVendorHistory = async (btnName: string, vendorId: any) => {
        if (btnName == viewHistoryText) {
            setSelectedOption('All')
            try {
                setIsLoading(true)
                const getVendorHistory = await Axios.get(
                    GET_VENDOR_HISTORY,
                    {
                        params: {
                            "vendorcode": vendorId
                        },
                        headers: {
                            Authorization: localStorage.getItem(
                                "TR_Token"
                            ) as string,

                        },

                    }
                )
                let history: any = []
                history.push(getVendorHistory?.data?.data?.history)
                setVendorHistoryData(history)
                setFilteredData(history)
                setTimeout(() => (
                    setIsLoading(false)
                ), 500)
            }
            catch (error: any) {
                if (error.response.status === 401) {
                    localStorage.clear();
                }
            }
        }
        if (btnName == downLoadHistoryText) {
            try {
                setIsLoading(true)
                const downloadVendorHistory = await Axios.get(
                    DOWNLOAD_VENDOR_HISTORY,
                    {
                        params: {
                            "vendorcode": vendorId
                        },
                        headers: {
                            Authorization: localStorage.getItem(
                                "TR_Token"
                            ) as string,

                        },

                    }
                )
                const csvString = Papa.unparse(downloadVendorHistory?.data);
                const blob = new Blob([csvString], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `vendor_history_${vendorId}.csv`;
                link.click();
                setDownloadVendorHistoryData(downloadVendorHistory.data)
                setTimeout(() => (
                    setIsLoading(false)
                ), 500)
            }
            catch (error: any) {
                if (error.response.status === 401) {
                    localStorage.clear();
                }
            }
        }
        setIsViewHistory(true)
    }
    const handleOptionChange = (e: any) => {
        setSelectedOption(e.target.value);
        let filteredTableData;
        let allData = [...vendorHistoryData]
        let data: any = []

        if (e.target.value === "Yes") {
            filteredTableData = vendorHistoryData[0].filter((row: { IS_SENSITIVE_CHANGE: number; }) => row.IS_SENSITIVE_CHANGE === 1);
            data.push(filteredTableData)
            setFilteredData(data)
        }
        else if (e.target.value === "All") {
            setFilteredData(allData)
        }
        else {
            filteredTableData = vendorHistoryData[0].filter((row: { IS_SENSITIVE_CHANGE: number; }) => row.IS_SENSITIVE_CHANGE === 0);
            data.push(filteredTableData)
            setFilteredData(data)
        }

    };
    const handleDateChange = (args: any) => {  
        if (args && args.length === 2) {
        const filteredVendorHistoryData = vendorHistoryData?.[0].filter((data: any) => {
            const date1 = new Date(args[0]);
            const createdDate = new Date(data.CREATED_DATE);
            return (
                createdDate.getDate() === date1.getDate() &&
                createdDate.getMonth() === date1.getMonth() &&
                createdDate.getFullYear() === date1.getFullYear()
            );
        });
        setSelectedDate(args.value);
        let data: any = []
        data.push(filteredVendorHistoryData)
        setFilteredData(data);
    };
}

    function formatTitle(title: string): string {
        let formattedTitle = title;
        // Replace underscores with spaces and capitalize words
        if (formattedTitle.includes("_")) {
            formattedTitle = formattedTitle
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        } else {
            // Capitalize the first letter of each word
            formattedTitle = formattedTitle
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        }

        return formattedTitle;
    }
    function shouldHighlightCell(vendor: string, newData: { [x: string]: any; IS_SENSITIVE_CHANGE: number; }) {
        const propertiesToCheck: any = {
            VENDOR_NAME: "VENDOR_NAME",
            BANK_ACCOUNT_NUMBER: "BANK_ACCOUNT_NUMBER",
            BANK_NAME: "BANK_NAME",
            BENIFICIARY_NAME: "BENIFICIARY_NAME",
            PAYMENT_TERMS: "PAYMENT_TERMS",
            CURRENCY: "CURRENCY"
        };

        if (newData.IS_SENSITIVE_CHANGE === 1 && newData[propertiesToCheck[vendor]] !== vendorData?.[0].old[propertiesToCheck[vendor]]) {
            return true;
        }

        return false;
    }
    useEffect(() => {
        if (vendorData?.length > 0)
            setIsShowVendorDataTable(true)
    }, [vendorData])

    return (
        <div className="flex flex-col w-full border border-solid border-slate-300 rounded-xl mb-4 shadow-lg ">
            <div className="flex flex-col p-5 min-w-fit h-full gap-3">
                <div className="w-full grow">
                    <div className="flex flex-col gap-2 md:flex-row w-full content-between">
                        <div className="flex grow content-between">
                            <span className="flex grow md:flex-grow-0 text-sm md:text-base font-roboto  text-slate-500">
                                {props?.documentTitle.toUpperCase()}
                            </span>
                            <span className="font-roboto text-sm md:text-base font-bold  text-slate-700 ">
                                &nbsp;&nbsp;{props?.document?.ENTRY_ID}
                            </span>
                        </div>
                        <div className="flex grow content-between">
                            <div className="flex grow md:flex-grow-0 font-roboto">
                                <span className="text-slate-500 text-sm md:text-base">
                                    INVOICE NUMBER
                                </span>
                            </div>
                            <div className="flex font-roboto font-bold text-sm md:text-base text-slate-700">
                                &nbsp;&nbsp;
                                {props?.document?.INVOICE_NUMBER?.toUpperCase()}
                            </div>
                        </div>
                        <div className="flex grow content-between">
                            <div className="flex grow md:flex-grow-0 font-roboto">
                                <span className="text-slate-500 text-sm md:text-base">
                                    {"company".toUpperCase()}
                                </span>
                            </div>
                            <div className="flex font-roboto font-bold text-sm md:text-base text-slate-700">
                                &nbsp;&nbsp;
                                {props?.document?.COMPANY_CODE_NAME?.toUpperCase()}
                            </div>
                        </div>
                        <div className="flex mt-2 md:mt-0 md:mr-4">
                            <div className="flex grow content-between">
                                <div className="flex grow font-roboto">
                                    <span className="text-slate-500 my-auto text-sm md:text-base flex md:hidden">
                                        COMMENTS
                                    </span>
                                </div>
                                <Button onClick={handleClick}>
                                    <Badge
                                        className="flex"
                                        badgeContent={
                                            props?.document?.COMMENTS > 0
                                                ? props?.document?.COMMENTS
                                                : '0'
                                        }
                                        color="primary"
                                    >
                                        <ForumIcon color="action" />
                                    </Badge>
                                </Button>
                                <CommentsPopOver
                                    open={open}
                                    anchorEl={anchorEl}
                                    handleClose={handleClose}
                                    module={"ap"}
                                    docId={Number(props?.document.ACCOUNT_DOC_ID)}
                                    type={"doc"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className="w-full grow">
                    <div className="flex flex-col gap-2 md:flex-row w-full content-between font-roboto">
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex text-sm md:text-base text-slate-500">
                                    POSTED DATE
                                </div>
                                <div className="flex font-bold text-sm md:text-base text-slate-700">
                                    {props?.document?.POSTED_DATE.split(" ")[0]}
                                </div>
                            </div>
                        </div>
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex text-sm md:text-base text-slate-500">
                                    DEBIT
                                </div>
                                <div className="flex font-bold text-sm md:text-base text-slate-700">
                                    <span>{currencySymbol}</span>{props?.document?.DEBIT_AMOUNT.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex text-sm md:text-base text-slate-500">
                                    CREDIT
                                </div>
                                <div className="flex font-bold text-sm md:text-base text-slate-700">
                                    <span>{currencySymbol}</span>({props?.document?.CREDIT_AMOUNT.toLocaleString()})
                                </div>
                            </div>
                        </div>
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex text-sm md:text-base text-slate-500">
                                    RISK LEVEL
                                </div>
                                <div className="flex font-bold text-sm md:text-base text-slate-700">
                                    {props?.document.riskScore >= props?.riskLevel.range_high
                                        ? "High"
                                        : props?.document.riskScore >=
                                            props?.riskLevel.range_medium
                                            ? "Medium"
                                            : props?.document.riskScore >=
                                                props?.riskLevel.range_low
                                                ? "Low"
                                                : "Lowest"}
                                </div>
                            </div>
                        </div>
                        <div className="flex grow">
                            <div className="flex flex-row w-full md:flex-col justify-between gap-1">
                                <div className="flex my-auto text-sm md:text-base text-slate-500">
                                    RISK SCORE
                                </div>
                                <div className="flex">
                                    <div
                                        className={`rounded-lg md:w-12 p-1 text-center text-white font-bold ${props?.document.riskScore >=
                                            props?.riskLevel.range_high
                                            ? "bg-[#d60000]"
                                            : props?.document.riskScore >=
                                                props?.riskLevel.range_medium
                                                ? "bg-[#f2641a]"
                                                : props?.document.riskScore >=
                                                    props?.riskLevel.range_low
                                                    ? "bg-[#f5af2d]"
                                                    : "bg-[#00A4DF]"
                                            }`}
                                    >
                                        {props?.document.riskScore}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className="w-full min-h-fit">
                    <Collapse in={showPanel}>
                        <div className="flex flex-col md:flex-row w-full gap-3 md:gap-2">
                            <div className="flex flex-col grow gap-3">
                                <div className="w-full flex flex-row md:flex-col gap-2">
                                    <div className="flex w-1/3 md:w-full mb-1 font-roboto text-sm">
                                        CONTROLS
                                    </div>
                                    <div className="flex flex-col w-2/3 md:w-full">
                                        {controls.map((control: any) => (
                                            <div
                                                key={control}
                                                className="flex flex-row w-full gap-2"
                                            >
                                                <span>
                                                    <WhatshotIcon
                                                        sx={{
                                                            fontSize: "18px",
                                                            color: "#EA907A",
                                                        }}
                                                    />
                                                </span>{" "}
                                                <span className="font-roboto text-sm">
                                                    {control}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full flex flex-row md:flex-col gap-1">
                                    <div className="flex w-1/3 md:w-full mb-1 font-roboto text-sm">
                                        INVOICE DATE
                                    </div>
                                    <div className="font-roboto font-bold text-sm">
                                        {convertDateFormat(props?.document?.INVOICE_DATE)}
                                    </div>
                                </div>
                                <div className="w-full flex flex-row md:flex-col gap-1">
                                    <div className="flex w-1/3 md:w-full mb-1 font-roboto text-sm">
                                        DUE DATE
                                    </div>
                                    <div className="font-roboto font-bold text-sm">
                                        {convertDateFormat(props?.document?.DUE_DATE
                                        )}
                                    </div>
                                </div>
                                <div className="w-full flex flex-row md:flex-col gap-1">
                                    <div className="flex w-1/3 md:w-full mb-1 font-roboto text-sm">
                                        PAYMENT DATE
                                    </div>
                                    <div className="font-roboto font-bold text-sm">
                                        {convertDateFormat(props?.document?.PAYMENT_DATE)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col grow">
                                <div className="w-full flex flex-row md:flex-col gap-2">
                                    <div className="flex w-1/3 md:w-full mb-1 font-roboto text-sm">
                                        RISKINESS
                                    </div>
                                    {documentInfo.riskiness.map(
                                        (element: any, index: number) => {
                                            return (
                                                <div className="flex flex-row w-2/3 md:w-full gap-2" key={index}>
                                                    {/* change the border colour dynamically after the new api changes */}
                                                    <div
                                                        className={`font-bold text-gray-700 rounded-full flex items-center justify-center font-mono h-5 w-5 my-auto md:h-10 md:w-10 border-3 border-solid text-lg ${element.risklevel ===
                                                            "High"
                                                            ? "border-red-700 "
                                                            : element.risklevel ===
                                                                "Medium"
                                                                ? "border-[#f2641a]"
                                                                : element.risklevel ===
                                                                    "Low"
                                                                    ? "border-[#f5af2d]"
                                                                    : "border-slate-400"
                                                            }`}
                                                    >
                                                        {element.countval}
                                                    </div>
                                                    {/* <div className="bg-red-300 h-30 w-30 w-min rounded-full">2</div> */}
                                                    <div className="flex flex-col my-auto gap-1">
                                                        <div className="font-roboto text-sm">
                                                            {risk} Risk
                                                        </div>
                                                        <div className="font-roboto text-sm">
                                                            Out of{" "}
                                                            {totalRiskTrans}{" "}
                                                            Transactions
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                                <div style={{ fontSize: '0.875rem', lineHeight: '1.25rem', marginTop: '4vh' }}>APPROVED USER LIST</div>
                                {ApprovalMatrixData?.map((data, indx) => (
                                    <>
                                        {data?.user_id?.map((id: any, idx: number) => {
                                            return (
                                            <div style={{ marginTop: '1vh' }} key={idx}>
                                                {approvalMatrixMode?.[0].KEYVALUE == 1 && (
                                                <>
                                                    <span style={{ fontWeight: '700', fontSize: '0.875rem', lineHeight: '1.25rem' }}>
                                                    {id} - 
                                                    </span>
                                                    <span
                                                    style={{
                                                        color: outOfRange.some(({ min, max }) => min === data?.range[idx]?.min && max === data?.range[idx]?.max)
                                                        ? 'red'
                                                        : 'black',
                                                        fontWeight: '600',
                                                        fontSize: '0.875rem',
                                                        lineHeight: '1.25rem',
                                                    }}
                                                    >
                                                    {Number(data?.range[idx]?.min).toLocaleString()} to {Number(data?.range[idx]?.max).toLocaleString()}
                                                    </span>
                                                </>
                                                )}
                                                {approvalMatrixMode?.[0].KEYVALUE == 2 && (
                                                <>
                                                    <span style={{ fontWeight: '700', fontSize: '0.875rem', lineHeight: '1.25rem' }}>
                                                    {id} - 
                                                    </span>
                                                    <span
                                                    style={{
                                                        color: unWantedLevel.includes(data?.level[idx]) ? 'red' : 'black',
                                                        fontWeight: '600',
                                                        fontSize: '0.875rem',
                                                        lineHeight: '1.25rem',
                                                    }}
                                                    >
                                                    Level {data?.level[idx]}
                                                    </span>
                                                </>
                                                )}
                                                {approvalMatrixMode?.[0].KEYVALUE == 3 && (
                                                <>
                                                    <span
                                                    style={{
                                                        color: unWantedLevel.includes(data?.level[idx]) ? 'red' : 'black',
                                                        fontWeight: '700',
                                                        fontSize: '0.875rem',
                                                        lineHeight: '1.25rem',
                                                    }}
                                                    >
                                                    {id} - 
                                                    </span>
                                                    <span
                                                    style={{
                                                        color: unWantedLevel.includes(data?.level[idx]) ? 'red' : 'black',
                                                        fontWeight: '600',
                                                        fontSize: '0.875rem',
                                                        lineHeight: '1.25rem',
                                                    }}
                                                    >
                                                    Level {data?.level[idx]} - 
                                                    </span>
                                                    <span
                                                    style={{
                                                        color: outOfRange.some(({ min, max }) => min === data?.range[idx]?.min && max === data?.range[idx]?.max)
                                                        ? 'red'
                                                        : 'black',
                                                        fontWeight: '600',
                                                        fontSize: '0.875rem',
                                                        lineHeight: '1.25rem',
                                                    }}
                                                    >
                                                    {Number(data?.range[idx]?.min).toLocaleString()} to {Number(data?.range[idx]?.max).toLocaleString()}
                                                    </span>
                                                </>
                                                )}
                                            </div>
                                            );
                                        })}
                                        </>
                                ))}
                                <div className="w-full flex flex-row md:flex-col gap-1" style={{ marginTop: '4vh' }}>
                                    <div className="flex w-1/3 md:w-full mb-1 font-roboto text-sm">
                                        VENDOR CODE
                                    </div>
                                    <div className="font-roboto font-bold text-sm">
                                        {props?.document?.VENDORCODE}
                                    </div>
                                </div>
                                <div className="w-full flex flex-row md:flex-col gap-1">
                                    <div className="flex w-1/3 md:w-full mb-1 font-roboto text-sm">
                                        VENDOR NAME
                                    </div>
                                    <div className="font-roboto font-bold text-sm">
                                        {props?.document?.VENDOR_NAME}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col grow gap-3">
                                <div className="w-full flex flex-row md:flex-col gap-1">
                                    <div className="flex w-1/2 md:w-full mb-1 font-roboto text-sm">
                                        POSTED LOCATION
                                    </div>
                                    <div className="flex flex-row-reverse md:flex-row w-1/2 md:w-full font-roboto font-bold text-sm">
                                        {props?.document?.POSTED_LOCATION_NAME}
                                    </div>
                                </div>
                                <div className="w-full flex flex-row md:flex-col gap-2">
                                    <div className="flex w-1/2 md:w-full mb-1 font-roboto text-sm">
                                        NEW ACTIVITY
                                    </div>
                                    <div className="flex flex-col md:flex-col w-1/2 md:w-full font-roboto text-sm">
                                        {documentInfo.activities.map(
                                            (element: any, index: number) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex flex-row gap-2 mt-1"
                                                    >
                                                        <div

                                                            className="my-auto"
                                                        >
                                                            <Avatar
                                                                sx={{
                                                                    width: 34,
                                                                    height: 34,
                                                                    bgcolor:
                                                                        "#00A4DF",
                                                                }}
                                                            >
                                                                <Typography
                                                                    fontSize={
                                                                        12
                                                                    }
                                                                >
                                                                    {
                                                                        element.ASSIGN_BY_SHORT_NAME
                                                                    }
                                                                </Typography>
                                                            </Avatar>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>
                                                                {
                                                                    element.ASSIGN_BY_NAME
                                                                }
                                                            </span>
                                                            <span className="font-bold">
                                                                {
                                                                    element.COMMENTS
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                                {approvalMatrixMode?.[0].KEYVALUE == 2 || approvalMatrixMode?.[0].KEYVALUE == 3

                                    ?
                                    <>
                                        <div style={{ fontSize: '0.875rem', lineHeight: ' 1.25rem', textTransform: 'uppercase', marginTop: '4vh' }}>Required Approval</div>
                                        {ApprovalMatrixData?.map((data) => (
                                            <div style={{ marginTop: '-1vh' }}>
                                                {data?.Required_Approvel?.map((item: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined) => (
                                                    <Typography style={{ color: missingLevel.includes(item) ? 'red' : 'black', fontWeight: '700', fontSize: '0.875rem', lineHeight: '1.25rem', marginTop: '1vh' }}>Level {item}</Typography>
                                                ))}
                                            </div>
                                        ))}
                                    </>
                                    :
                                    ''
                                }
                            </div>

                            <div className="flex flex-col grow gap-3">
                                <div className="w-full flex flex-row md:flex-col gap-1">
                                    <div className="flex w-full mb-1 font-roboto text-sm">
                                        POSTED BY
                                    </div>
                                    <div className="font-roboto font-bold text-sm">
                                        {props?.document?.POSTED_BY_NAME}
                                    </div>
                                </div>
                                <div className="w-full flex flex-row md:flex-col gap-1">
                                    <div className="flex w-full mb-1 font-roboto text-sm">
                                        PAYMENT TERMS
                                    </div>
                                    <div className="font-roboto font-bold text-sm">
                                        {documentInfo?.posted[0]?.PAYMENT_TERMS}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="w-full mt-2">
                            <Divider />
                        </div>
                    </Collapse>
                    <div className="w-full flex flex-row mt-1">
                        <Button
                            className="font-roboto text-sm font-semibold text-slate-700"
                            onClick={() =>
                                props?.handleTransDetails(
                                    props?.document.ENTRY_ID,
                                    props?.document,
                                    props?.riskLevel
                                )
                            }
                        >
                            <span className="hidden md:flex bg-[#1976d2] w-5 h-5 mr-2 text-white rounded-full items-center justify-center">
                                <ArrowForwardIosIcon
                                    sx={{ fontSize: "14px" }}
                                />
                            </span>
                            View Transactions
                        </Button>
                        <Button
                            onClick={handleShowPanel}
                            className="font-roboto text-sm font-semibold text-slate-700"
                        >
                            {!showPanel ? 'Show Document Info' : 'Hide Document Info'}
                        </Button>
                        <Button
                            onClick={() => getVendorData(props?.document?.VENDORCODE)}
                            className="font-roboto text-sm font-semibold text-slate-700"
                        >
                            Show vendor details
                        </Button>
                    </div>
                </div>
            </div>
            <Dialog open={isVendorPopUp} onClose={vendorPopUpClose}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#2a4574', fontWeight: '700' }}>{isViewHistory ? 'View Details' : 'Vendor Details'}</p>
                    <IconButton aria-label="close" onClick={vendorPopUpClose}>
                        <Cancel />
                    </IconButton>
                </DialogTitle>
                {isLoading == true
                    ?
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                    </div>
                    :
                    ''
                }
                <DialogContent>
                    <DialogContentText>
                        {isViewHistory ? <><ArrowBackIcon sx={{ cursor: 'pointer' }} onClick={handleBackArrow} />
                            <Grid container spacing={2}>

                                <Grid item xs={7} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div>
                                        <DateRangePicker 
                                            placeholder="Select a range"
                                            size='md'
                                            onChange={handleDateChange}
                                            menuStyle={{ zIndex: 1300 }}
                                        />
                                    </div>
                                </Grid>

                                <Grid item xs={5}>
                                    <FormControl sx={{ width: '13vw' }}>
                                        <InputLabel id="dropdown-label">Sensitive change</InputLabel>
                                        <Select
                                            labelId="dropdown-label"
                                            id="dropdown"
                                            value={selectedOption}
                                            onChange={(e: any) => handleOptionChange(e)}
                                        >
                                            {options.map((option, index) => (
                                                <MenuItem key={index} value={option}  >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                            : ''}

                        {isViewHistory
                            ?
                            <TableContainer component={Paper} style={{ marginTop: '2vh' }}>
                                <Table sx={{ border: '1px solid lightgray', boxShadow: 'none' }}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#d3dffa' }}>
                                            {vendorHistoryDataNames?.map((vendor: any) => (
                                                <TableCell width="10%" sx={{ width: '100px' }}>{formatTitle(vendor)}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData?.[0]?.length == 0
                                            ?
                                            <Typography sx={{ color: 'red' }}>No records found</Typography>
                                            :
                                            <>
                                                {filteredData?.[0]?.map((vendor: any, index: number) => (
                                                    <TableRow key={index}>
                                                        {vendorHistoryDataNames?.map((vendorProp: any) => (
                                                            <TableCell>{vendor[vendorProp] === 1 ? "Yes" : vendor[vendorProp] === 0 ? "No" : vendor[vendorProp]}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            : ""}
                        {isShowVendorDataTable && isViewHistory == false ?
                            <TableContainer component={Paper}>
                                <Table sx={{ border: '1px solid lightgray', boxShadow: 'none' }}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#d3dffa' }}>
                                            <TableCell></TableCell>
                                            <TableCell sx={{ fontSize: '11px', fontWeight: 'bold', color: 'black' }}>Previous</TableCell>
                                            <TableCell sx={{ fontSize: '11px', fontWeight: 'bold', color: 'black' }}>New</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {vendorDataNames?.map((vendor) => (
                                            <TableRow>
                                                <TableCell>{formatTitle(vendor)}</TableCell>
                                                <TableCell>{vendorData?.[0].old[vendor]}</TableCell>
                                                <TableCell>
                                                    {shouldHighlightCell(vendor, vendorData?.[0].new) ? (
                                                        <span style={{ color: 'red' }}>{vendorData?.[0].new[vendor]}</span>
                                                    ) : (
                                                        <span>{vendorData?.[0].new[vendor]}</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            :
                            ''}
                        <p>{vendorDataApiFailureMessage !== '' ? vendorDataApiFailureMessage : ''}</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Stack spacing={2} direction="row">
                        <Button onClick={() => handleVendorHistory(isViewHistory ? 'Download History' : 'View History', props?.document?.VENDORCODE)} variant="contained">{isViewHistory ? downLoadHistoryText : viewHistoryText}</Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </div >
    );
}

export default TransactionListCard;
