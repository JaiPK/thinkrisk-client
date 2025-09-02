import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import axios from "../../../../api/axios";
import numberSuffixPipe from "../../../../shared/helpers/numberSuffixPipe";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { alpha } from "@mui/material/styles";
import AssignTaskPopUp from "./popups/ApAssignTaskPopUp";
import FeedBackPopUp from "./popups/APFeedBackPopUp";
import CloseTaskPopUp from "./popups/APCloseTaskPopUp";
import { apWorkFlow } from "../../../../shared/helpers/workFlow";
import { ActionButton } from "../../../../shared/models/workFlowItems";
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { RiskLevelItem, RiskLevel } from "../../../../shared/models/records";
import PositionedMenu from "../../dashboard/generalLedger/transactions/components/TransactionExport";
import {
    Badge, Checkbox, CircularProgress, Stack, TableSortLabel,
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import CommentsPopOver from "../../../../shared/ui/pop-overs/CommentsPopOver";
import { styled } from '@mui/system';
import { getPath } from "../../../../shared/helpers/getPath";


const RISK_TRANSACTIONS = "/v1/ap/transactions";
const GET_FILTERS_URL = "v1/ap/get_filters";
const PRINT_TOKEN = 'v1/print/token';

const POST_ASSIGN_TASK_URL = "v1/ap/assignuser";
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
    ACCOUNT_DOC_ID: number,
    ACCOUNT_PAYABLE_ENTRY: string,
    INVOICE_NUMBER: string,
    COMPANY: string,
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
    SELECTED: any[],

) {
    return {
        ACCOUNT_DOC_ID,
        ACCOUNT_PAYABLE_ENTRY,
        INVOICE_NUMBER,
        COMPANY,
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
    fontSize: "11px"
});

const StyledTableHead = styled(TableHead)({ fontSize: "11px", fontWeight: 700 });


function Row(props: { row: ReturnType<typeof createData>, reviewStatus: string, riskLevel: any}) {

    const GET_ASSIGN_COMMENTS = 'v1/apcasemgt/getassigncomments'
    const GET_REVIWE_COMMENT = 'v1/apcasemgt/getreviewcomments'
    const SAVE_REVIWE_COMMENT = 'v1/casemgmt/savereviewcomment'

    const currencySymbol = localStorage.getItem("CurrencySymbol");

    const { row } = props;
    const [open1, setOpen1] = React.useState(false);
    const [isShowAssigner, setIsShowAssigner] = useState(false)
    const [isShowAssignee, setIsShowAssignee] = useState(false)
    const [isAssigner, setIsAssigner] = useState(false)
    const [docKey, setDocKey] = useState<any>()
    const [assignComments, setAssignComments] = useState<any>([])
    const [reviewComments, setReviewComments] = useState<any>()
    const [transactions, setTransactions] = React.useState<any>([]);
    const [eventVal, setEventVal] = useState<any>()
    const [isShow, setIsShow] = useState(false)
    const [isButtonEnable, setIsButtonEnable] = useState(false)
    const [isSave, setIsSave] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const Axios = axios;
    const [documentID, setDocumentID] = React.useState<any>(0);
    const [riskLevel, setRiskLevel] = useState<RiskLevel>(props.riskLevel);

    const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
        const { numSelected, actionButtons, initSelected, reviewStatusId } =
            props;
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
                    {isLoading == true
                        ?
                        <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                        :
                        ''
                    }
                    {actionButtons.length
                        ? actionButtons.map((actionButton) => (
                            <Button
                                className={`bg-[#0091ea] text-white  disabled:bg-slate-300 disabled:text-slate-500 ${actionButton.show ? "flex" : "hidden"
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
            formData.append("ACCOUNT_DOC_ID", dockey.toString());
            formData.append("audit_id",  getPath.getPathValue("audit_id"));
            formData.append("exp", explain ? explain.toString(): "");

            const getUsersResponse = await Axios.post(
                RISK_TRANSACTIONS,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            setTransactions(getUsersResponse.data.data.records);
            setReviewTotal(getUsersResponse.data.data.totalrecords)

            setTotalSum({ totalcredit: getUsersResponse.data.data.totalcreditamount, totaldebit: getUsersResponse.data.data.totaldebitamount }
            );
            setExplain(getUsersResponse.data.data.explainability[0]);
            const listOfKeys = Object.keys(getUsersResponse.data.data.explainability[0]);
            const listOfExplain = [{}];
            listOfKeys.forEach((element: string) => {
                if (Number(getUsersResponse.data.data.explainability[0][element]) > 0) {
                    let Obj: { value: string, text: string } = { value: "", text: "" };
                    Obj.value = element;
                    Obj.text = element + " " + getUsersResponse.data.data.explainability[0][element];
                    listOfExplain.push(Obj);
                };
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

    }

    const handleOpen1 = (dockey: number) => {

        const userId: number = Number(
            JSON.parse(localStorage.getItem("THR_USER")!)?.userId
        );
        // console.log(row, "row", userId)
        if (userId == row.ASSIGNED_BY) {
            setIsShowAssigner(true)
            getAssignComments(dockey)

        }
        if (userId == row.ASSIGNED_TO) {
            setIsShowAssignee(true)
            getAssignComments(dockey)
            getReviewComment(dockey)

        }
        if (userId == row.ASSIGNED_BY && userId == row.ASSIGNED_TO) {
            setIsShowAssignee(false)
            setIsAssigner(true)
            getAssignComments(dockey)
        }
        getReviewComment(dockey)
        setDocKey(dockey)
        tranactionHandler(dockey,null,reviewPage,reviewRowsPerPage);
        setOpen1(!open1);
    };

    const getAssignComments = async (docId: any) => {
        let formData = new FormData();
        formData.append("ACCOUNT_DOC_ID", docId);
        try {
            const getAssignComments = await Axios.post(
                GET_ASSIGN_COMMENTS,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            // console.log(getAssignComments, "getAssignComments")
            setAssignComments(getAssignComments.data.data[0].COMMENTS)
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }
    const getReviewComment = async (docKey: any) => {
        let formData = new FormData();
        formData.append("ACCOUNT_DOC_ID", docKey);
        try {
            const getReviewComments = await Axios.post(
                GET_REVIWE_COMMENT,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            // console.log(getReviewComments, "getReviewComments")
            setReviewComments(getReviewComments.data?.data[0]?.REVIEWCOMMENTS
            )
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }
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
        console.log("acc_commentid invoked");
        setSelectedAccDocCommentId(transId);
    };
    const setNewTransactionId = (transId: number) => {
        setSelectedCommentId(transId);
    };

    const [anchorEl_ACCDOC, setAnchorEl_ACCDOC] = useState<HTMLButtonElement | null>(null);
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

    const getPathValue = (key: any) => {
        const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
        return pathHistory?.["audit"]?.[key]
    }


    const handleRecallAction = async () => {
        try {
            setIsLoading(true)
            let formData = new FormData();
            formData.append("ACCOUNT_DOC_ID", row.ACCOUNT_DOC_ID.toString());
            formData.append("COMMENTS", "Recalled");
            formData.append("TRANSACTIONS", "null");
            formData.append("ASSIGNED_TO", userId.toString());
            formData.append("audit_id", getPath.getPathValue("audit_id"))
            const recallResponse = await Axios.post(
                POST_ASSIGN_TASK_URL,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem("TR_Token") as string,
                    },
                }
            ).catch((error) => {
                console.log("error:", error);
                return;
            });
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
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
        catch (error: any) {
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
        apWorkFlow(
            row.REVIEWSTATUSID,
            row.SUBRSTATUSID,
            roleId,
            userId,
            row.ASSIGNED_BY,
            row.ASSIGNED_TO
        )
    );
    const [reviewPage, setReviewPage] = React.useState(0);
    const [reviewRowsPerPage, setReviewRowsPerPage] = React.useState(10);
    const [reviewTotal, setReviewTotal] = React.useState(0);
    const [totalSum, setTotalSum] = React.useState({ totalcredit: 0, totaldebit: 0 });
    const [explain, setExplain] = React.useState<any>({});
    const [explainValue, setExplainValue] = React.useState('');
    const [explainFinal, setExplainFinal] = React.useState<any>([]);
    const [csvToken, setCsvToken] = useState('');
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setReviewPage(newPage);
        tranactionHandler(row.ACCOUNT_DOC_ID,null,newPage,reviewRowsPerPage);

    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setReviewRowsPerPage(parseInt(event.target.value, 10));
        setReviewPage(0);
        tranactionHandler(row.ACCOUNT_DOC_ID,null,0,parseInt(event.target.value, 10));

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

    const csv = async () => {
        //console.log("csv triggered");
        try {
            const response = await Axios.get(PRINT_TOKEN, {
                headers: {
                    Authorization: localStorage.getItem(
                        "TR_Token"
                    ) as string,
                },
            });
            setCsvToken(response.data.data.Token)
            const REACT_APP_BASE_URL = "https:" + "//" + window.location.hostname + ":8443/public/index.php/"
            // const REDIRECT = `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${accountDocCode}`
            //window.location.href = `${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${accountDocCode}`
            //     console.log(REDIRECT,"REDIRECT")
            // navigate(REDIRECT)
            const u = encodeURIComponent(JSON.stringify(""));
            //console.log("u",u);
            window.open(`${REACT_APP_BASE_URL}v1/print/${response.data.data.Token}/csvriskaccdoc?ACCOUNTDOCID=${props.row.ACCOUNT_DOC_ID}`);



        }
        catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    const getCsvData = (() => {
        csv()
    })

    useEffect(() => {
        setActionButtons(
            apWorkFlow(
                row.REVIEWSTATUSID,
                row.SUBRSTATUSID,
                roleId,
                userId,
                row.ASSIGNED_BY,
                row.ASSIGNED_TO
            )
        );
    }, [row]);

    const handleMessageChange = (event: any) => {
        setEventVal(event.target.value)
        setIsButtonEnable(true)
    }
    const saveComments = async () => {
        let formData = new FormData();
        formData.append("accdoc_id", docKey);
        formData.append("rcomment", eventVal);
        try {
            const saveComments = await Axios.post(
                SAVE_REVIWE_COMMENT,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            setIsSave(true)
            setIsShow(true)
            setTimeout(() => {
                setIsShow(false)
            }, 3000)
            //console.log(saveComments, "saveComments")
            getReviewComment(docKey)
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }
    const nestedTableHeaders: any = [
        {
            id: '',
            title: ''
        },
        {
            id: 'ACCOUNT_NAME',
            title: 'Account'
        },
        {
            id: 'TRANSACTION_ID',
            title: 'Transaction ID'
        },
        {
            id: '',
            title: 'Transaction Text'
        },
        {
            id: 'ENTRY_DATE',
            title: 'Entry Date'
        },
        {
            id: 'ENTRY_LOCATION',
            title: 'Entry Location'
        },
        {
            id: 'ENTERED_BY_NAME',
            title: 'Entry User'
        },
        {
            id: 'DEBIT_AMOUNT',
            title: 'Debit Amount'
        },
        {
            id: 'CREDIT_AMOUNT',
            title: 'Credit Amount'
        },
        {
            id: 'BLENDED_RISK_SCORE',
            title: 'Risk Score'
        },
        {
            id: 'SUB_R_STATUS_CODE',
            title: 'Review Status'
        },
        {
            id: 'COMMENTS',
            title: 'Comments'
        },
    ]
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const [order, setOrder] = useState<any>("asc");
    const [orderBy, setOrderBy] = useState<any>("TRANSACTIONID");

    const createNestedSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            const sortBy = property
            if (sortBy) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                transactions.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
                    if (sortDirection === 'asc') {

                        if (String(sortBy) === 'DEBIT_AMOUNT' || String(sortBy) === 'CREDIT_AMOUNT') {
                            if (Number(a[sortBy]) < Number(b[sortBy])) {
                                return -1;
                            }
                            if (Number(a[sortBy]) > Number(b[sortBy])) {
                                return 1;
                            }
                        }
                        else {

                            if (a[sortBy] < b[sortBy]) {
                                return -1;
                            }
                            if (a[sortBy] > b[sortBy]) {
                                return 1;
                            }
                        }
                    }
                    if (sortDirection === 'desc') {
                        if (String(sortBy) === 'DEBIT_AMOUNT' || String(sortBy) === 'CREDIT_AMOUNT') {
                            if (Number(a[sortBy]) > Number(b[sortBy])) {
                                return -1;
                            }
                            if (Number(a[sortBy]) < Number(b[sortBy])) {
                                return 1;
                            }
                        }
                        else {
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
            }
            else {
                setSortDirection('asc');
            }
        };
    return (

        <React.Fragment>
            <AssignTaskPopUp
                open={open}
                handleClose={handleClose}
                title={popupTitle}
                transactions={
                    initSelectedTrans?.length
                        ? initSelectedTrans
                        : selectedTransIds
                }
                accountDocCodeId={Number(row?.ACCOUNT_PAYABLE_ENTRY)}
                accountDoc_Code={String(row?.ACCOUNT_DOC_ID)}
            />
            <CloseTaskPopUp
                open={closeTaskOpen}
                handleClose={handleClose}
                title={popupTitle}
                transactions={
                    initSelectedTrans?.length
                        ? initSelectedTrans
                        : selectedTransIds
                }
                accountDocCodeId={Number(row?.ACCOUNT_PAYABLE_ENTRY)}
                accountDoc_Code={String(row.ACCOUNT_DOC_ID)}
                isDeviation={row.ISDEVIATION}
            />
            <FeedBackPopUp
                open={feedbackOpen}
                handleClose={handleClose}
                title={popupTitle}
                transactions={
                    initSelectedTrans?.length
                        ? initSelectedTrans
                        : selectedTransIds
                }
                accountDocCodeId={Number(row?.ACCOUNT_PAYABLE_ENTRY)}
                accountDoc_Code={String(row.ACCOUNT_DOC_ID)}
            />
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>

                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{row.ACCOUNT_PAYABLE_ENTRY}</StyledTableCell>
                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{row.INVOICE_NUMBER}</StyledTableCell>
                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{row.COMPANY}</StyledTableCell>
                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{row.POSTED_BY_NAME}</StyledTableCell>
                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{row.POSTED_DATE}</StyledTableCell>
                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{currencySymbol}{numberSuffixPipe(Number(row.DEBIT_AMOUNT))}</StyledTableCell>
                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{currencySymbol}({numberSuffixPipe(Number(row.CREDIT_AMOUNT))})</StyledTableCell>
                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{row.ASSIGNED_BY_NAME}</StyledTableCell>
                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{row.ASSIGNED_TO_NAME}</StyledTableCell>
                <TableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{row.ASSIGNED_ON.split(" ")[0]}</TableCell>

                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)} className={
                    Number(row.BLENDED_RISK_SCORE) * 100 >= riskLevel.range_high ? "bg-[#ff4b3d] opacity-80 text-white" :
                        Number(row.BLENDED_RISK_SCORE) * 100 >= riskLevel.range_medium ? "bg-[#f2641a] opacity-80 text-white" :
                            Number(row.BLENDED_RISK_SCORE) * 100 >= riskLevel.range_low ? "bg-[#f5af2d] opacity-80 text-white" : "bg-[#00A4DF]"} >{(Number(row.BLENDED_RISK_SCORE) * 100).toFixed(2)}%</StyledTableCell>
                <StyledTableCell onClick={() => handleOpen1(row.ACCOUNT_DOC_ID)}>{row.SUB_R_STATUS_CODE}</StyledTableCell>
                <StyledTableCell>
                    <Button onClick={(event)=>{
                        setNewAccDocTransactionId(Number(row.ACCOUNT_DOC_ID));
                        handleClick_ACCDOC(event);}}>
                        <Badge
                            className="flex"
                            badgeContent={String(row?.COMMENTS)}
                            color="primary"
                        >
                            <ForumIcon color="action" />
                        </Badge>
                    </Button>
                    
                </StyledTableCell>
                
                <CommentsPopOver
                        open={open_comments_ACCDOC}
                        anchorEl={anchorEl_ACCDOC}
                        handleClose={
                            handleClose_comments_ACCDOC}
                        module={"ap"}
                        docId={selectedAccDocCommentId}
                        type={"doc"}
                    />
            </TableRow>
            <TableRow>
                <StyledTableCell style={{ paddingBottom: 1, paddingTop: 1 }} colSpan={13}>
                    <Collapse in={open1} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 0, width: '100%' }}>
                            <Typography variant="h6" gutterBottom component="div">
                                INVOICE NUMBER # {row.INVOICE_NUMBER}
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

                                    {explainFinal.length > 0 && explainFinal.map((item: any) => { return <MenuItem key={item.value} value={item.value}>{item.text}</MenuItem> })}

                                </Select>
                            </FormControl>
                            {/* <PositionedMenu getCsvData = {getCsvData} /> */}
                            <Table size="medium" >
                                <StyledTableHead style={{ backgroundColor: '#e3e4e6' }}>
                                    <TableRow sx={{ margin: 1, width: "100%" }}>

                                        {nestedTableHeaders?.map((nestedHeader: any) => (
                                            <StyledTableCell>
                                                <TableSortLabel
                                                    direction={sortDirection}
                                                    onClick={createNestedSortHandler(nestedHeader.id)}
                                                >
                                                    {nestedHeader.title}
                                                </TableSortLabel>
                                            </StyledTableCell>
                                        ))}

                                        {/* <StyledTableCell></StyledTableCell>
                                        <StyledTableCell>Account</StyledTableCell>
                                        <StyledTableCell>Transaction ID</StyledTableCell>
                                        <StyledTableCell>Transaction Text</StyledTableCell>
                                        <StyledTableCell>Entry Date</StyledTableCell>
                                        <StyledTableCell>Entry Location</StyledTableCell>
                                        <StyledTableCell>Entry User</StyledTableCell>
                                        <StyledTableCell>Debit Amount</StyledTableCell>
                                        <StyledTableCell>Credit Amount</StyledTableCell>
                                        <StyledTableCell>Risk Score</StyledTableCell>
                                        <StyledTableCell>Review Status</StyledTableCell>
                                        <StyledTableCell>Comments</StyledTableCell> */}
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody sx={{ margin: 1 }}>

                                    {transactions.length > 0 &&

                                        transactions.map((transRow: any, index: number) => (

                                            <TableRow key={index}>
                                                <StyledTableCell><Checkbox disabled={true} checked={row.SELECTED.includes(transRow.TRANSACTION_ID
                                                    .toString())} /></StyledTableCell>
                                                <StyledTableCell component="th" scope="row">
                                                    {transRow.ACCOUNT_NAME

                                                    }
                                                </StyledTableCell>

                                                <StyledTableCell>{transRow.TRANSACTION_ID}</StyledTableCell>
                                                <StyledTableCell>{transRow.TRANSACTION_DESC}</StyledTableCell>
                                                <StyledTableCell>{transRow.ENTRY_DATE
                                                }</StyledTableCell>
                                                <StyledTableCell>{transRow.ENTRY_LOCATION
                                                }</StyledTableCell>
                                                <StyledTableCell>{transRow.ENTERED_BY_NAME}</StyledTableCell>
                                                <StyledTableCell>{currencySymbol}{numberSuffixPipe(transRow.DEBIT_AMOUNT)}</StyledTableCell>
                                                <StyledTableCell>{currencySymbol}({numberSuffixPipe(transRow.CREDIT_AMOUNT)})</StyledTableCell>
                                                <StyledTableCell className={
                                                    Number(transRow.BLENDED_RISK_SCORE) * 100 >= riskLevel.range_high ? "bg-[#ff4b3d] opacity-80 text-white" :
                                                        Number(transRow.BLENDED_RISK_SCORE) * 100 >= riskLevel.range_medium ? "bg-[#f2641a] opacity-80 text-white" :
                                                            Number(transRow.BLENDED_RISK_SCORE) * 100 >= riskLevel.range_low ? "bg-[#f5af2d] opacity-80 text-white" : "bg-[#00A4DF]"}>{(Number(transRow.BLENDED_RISK_SCORE) * 100).toFixed(2)}%</StyledTableCell>
                                                <StyledTableCell>{row.SUB_R_STATUS_CODE}</StyledTableCell>
                                                <StyledTableCell>                      <Button onClick={(event)=>{
                                                    setNewTransactionId(Number(transRow.TRANSACTION_ID));
                                                    handleClick(event);
                                                }}>
                                                    <Badge
                                                        className="flex"
                                                        badgeContent={String(transRow?.COMMENTS)}
                                                        color="primary"
                                                    >
                                                        <ForumIcon color="action" />
                                                    </Badge>
                                                </Button></StyledTableCell>

                                            </TableRow>
                                        ))}

                                </TableBody>
                                <TableFooter style={{ backgroundColor: '#ddf5fc' }}>
                                    <StyledTableCell>Total</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>

                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell >{currencySymbol}{numberSuffixPipe(totalSum.totaldebit)}</StyledTableCell>
                                    <StyledTableCell>{currencySymbol}({numberSuffixPipe(totalSum.totalcredit)})</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableFooter>
                            </Table>

                            <div className="flex flex-wrap" style={{ margin: 9 }}>
                                {isShowAssigner || isAssigner
                                    ?
                                    <div style={{ marginTop: '2vh' }}>
                                        <label htmlFor="message">Assigner Comments...</label>
                                        <div style={{ backgroundColor: '#efefef', borderTop: '1px solid', borderBottom: '1px solid', padding: '8px', margin: 6 }}>
                                            <Box >
                                                <p>{assignComments}</p>
                                                <textarea
                                                    style={{ border: 'none', backgroundColor: '#efefef' }}
                                                    id="message"
                                                    name="message"
                                                    // value={assignComments}
                                                    onChange={(e: any) => handleMessageChange(e)}
                                                    readOnly
                                                >

                                                </textarea>
                                            </Box>
                                        </div>
                                    </div>
                                    :
                                    ''
                                }
                                {isShowAssignee == true
                                    ?
                                    <>
                                        <div style={{ marginTop: '2vh' }}>
                                            <label htmlFor="message">Assigner Comments...</label>
                                            <div style={{ backgroundColor: '#efefef', borderTop: '1px solid', borderBottom: '1px solid', padding: '8px', margin: 6 }}>
                                                <Box >
                                                    <p>{assignComments}</p>
                                                    <textarea
                                                        style={{ border: 'none', backgroundColor: '#efefef' }}
                                                        id="message"
                                                        name="message"
                                                        // value={assignComments}
                                                        onChange={(e: any) => handleMessageChange(e)}
                                                        readOnly
                                                    >

                                                    </textarea>
                                                </Box>
                                            </div>
                                        </div>

                                        <div style={{ marginLeft: '2%' }}>
                                            <div style={{ margin: 9 }}>
                                                <label htmlFor="message">   Assignee Comments...</label>
                                                <div style={{ backgroundColor: '#efefef', borderTop: '1px solid', borderBottom: '1px solid', padding: '8px', margin: 6 }}>
                                                    <Box >
                                                        <p>{reviewComments}</p>
                                                        <textarea
                                                            style={{ border: 'none', backgroundColor: '#efefef' }}
                                                            id="message"
                                                            name="message"
                                                            // value=''
                                                            // defaultValue={reviewComments}
                                                            onChange={(e: any) => handleMessageChange(e)} >

                                                        </textarea>
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>

                                    </>
                                    :
                                    ''
                                }
                                {/* save */}
                                {/* {isShowAssignee
                                    ?
                                    <div style={{ margin: '10vh' }}>
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                        >
                                            <Button
                                                sx={{ borderRadius: "5px", textTransform: "capitalize", margin: 'auto', display: 'flex' }}
                                                variant="contained"
                                                onClick={saveComments}
                                                disabled={!isButtonEnable}
                                            >
                                                Save
                                            </Button>
                                        </Stack>

                                    </div>
                                    :
                                    ''
                                } */}
                            </div>

                            {/* {isShow
                                ?
                                <p style={{ fontWeight: 'bold', color: 'green' }}>Saved successfully</p>
                                :
                                ''
                            } */}
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
                            {/* <CommentsPopOver
                        open={open_comments_ACCDOC}
                        anchorEl={anchorEl_ACCDOC}
                        handleClose={
                            handleClose_comments_ACCDOC}
                        module={"ap"}
                        docId={selectedAccDocCommentId}
                        type={"doc"}
                    /> */}

<CommentsPopOver
                                                        open={open_comments}
                                                        anchorEl={anchorEl}
                                                        handleClose={handleClose_comments}
                                                        module={"ap"}
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
    data: any;
    reviewStatus: string;
    sumData: any;
    riskLevel: any;
}


export default function CollapsibleTable({ data, reviewStatus, sumData, riskLevel }: Props) {
    useEffect(() => {
    }, [data])
    const currencySymbol = localStorage.getItem("CurrencySymbol");

    const headers: any = [
        {
            id: 'ACCOUNT_PAYABLE_ENTRY',
            title: 'Accounts Payable Entry'
        },
        {
            id: 'INVOICE_NUMBER',
            title: 'Invoice Number'
        },
        {
            id: 'COMPANY',
            title: 'Company'
        },
        {
            id: 'POSTED_BY_NAME',
            title: 'Posted By'
        },
        {
            id: 'DUE_DATE',
            title: 'Posted Date'
        },
        {
            id: 'DEBIT_AMOUNT',
            title: 'Debit Amount'
        },
        {
            id: 'CREDIT_AMOUNT',
            title: 'Credit Amount'
        },
        {
            id: 'ASSIGNED_BY_NAME',
            title: 'Assigned By'
        },
        {
            id: 'ASSIGNED_TO_NAME',
            title: 'Assigned To'
        },
        {
            id: 'ASSIGNED_ON',
            title: 'Assigned Date'
        },
        {
            id: 'BLENDED_RISK_SCORE',
            title: 'Risk Score'
        },
        {
            id: 'SUB_R_STATUS_CODE',
            title: 'Review Status'
        },
        {
            id: 'COMMENTS',
            title: 'Comments'
        }
    ]
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const [order, setOrder] = useState<any>("asc");
    const [orderBy, setOrderBy] = useState<any>("TRANSACTIONID");

    const createSortHandler =
        (property: keyof Data, header: any) => (event: React.MouseEvent<unknown>) => {
            const sortBy = property
            if (sortBy) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                data.sort((a: any, b: any) => {

                    if (sortDirection === 'asc') {

                        if (String(sortBy) === 'DEBIT_AMOUNT' || String(sortBy) === 'CREDIT_AMOUNT') {
                            if (Number(a[sortBy]) < Number(b[sortBy])) {
                                return -1;
                            }
                            if (Number(a[sortBy]) > Number(b[sortBy])) {
                                return 1;
                            }
                        }
                        else {

                            if (a[sortBy] < b[sortBy]) {
                                return -1;
                            }
                            if (a[sortBy] > b[sortBy]) {
                                return 1;
                            }
                        }
                    }
                    if (sortDirection === 'desc') {
                        if (String(sortBy) === 'DEBIT_AMOUNT' || String(sortBy) === 'CREDIT_AMOUNT') {
                            if (Number(a[sortBy]) > Number(b[sortBy])) {
                                return -1;
                            }
                            if (Number(a[sortBy]) < Number(b[sortBy])) {
                                return 1;
                            }
                        }
                        else {
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
            }
            else {
                setSortDirection('asc');
            }
        };
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <StyledTableHead style={{ backgroundColor: '#e3e4e6' }}>
                    <TableRow>
                        {headers.map((header: any) => (

                            <StyledTableCell>
                                <TableSortLabel
                                    // active={orderBy === header.id}
                                    direction={sortDirection}
                                    onClick={createSortHandler(header.id, header)}
                                >
                                    {header.title}
                                    {/* {orderBy === header.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null} */}
                                </TableSortLabel>
                            </StyledTableCell>
                        ))}
                        {/* <StyledTableCell>Invoice Number</StyledTableCell>
                        <StyledTableCell>Company</StyledTableCell>
                        <StyledTableCell>Posted By</StyledTableCell>
                        <StyledTableCell>Posted Date</StyledTableCell>
                        <StyledTableCell>Debit Amount</StyledTableCell>
                        <StyledTableCell>Credit Amount</StyledTableCell>
                        <StyledTableCell>Assigned By</StyledTableCell>
                        <StyledTableCell>Assigned To</StyledTableCell>
                        <StyledTableCell>Assigned Date</StyledTableCell>
                        <StyledTableCell>Risk Score</StyledTableCell>
                        <StyledTableCell>Review Status</StyledTableCell>
                        <StyledTableCell>Comments</StyledTableCell> */}
                    </TableRow>
                </StyledTableHead>
                <TableBody>
                    {data.length > 0 &&
                        data.map((row: any, index: number) => (
                            <Row key={index} row={row} reviewStatus={reviewStatus} riskLevel={riskLevel}/>
                        ))}
                </TableBody>
                <TableFooter style={{ backgroundColor: '#ddf5fc' }}>
                    <StyledTableCell>Total</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell >{currencySymbol}{numberSuffixPipe(sumData.totaldebit)}</StyledTableCell>
                    <StyledTableCell>{currencySymbol}({numberSuffixPipe(sumData.totalcredit)})</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>

                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}