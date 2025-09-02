import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AddCommentIcon from "@mui/icons-material/AddComment";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import IosShareIcon from "@mui/icons-material/IosShare";
import ChatBubbleOutlineTwoToneIcon from "@mui/icons-material/ChatBubbleOutlineTwoTone";
import Popover from "@mui/material/Popover";
import axios from "../../api/axios";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import { glWorkFlow } from "../../shared/helpers/workFlow";
import { ActionButton } from "../../shared/models/workFlowItems";
import {
    Box,
    Checkbox,
    CircularProgress,
    Collapse,
    TablePagination,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AssignTaskPopUp from "./popups/AssignTaskPopUp";
import FeedBackPopUp from "./popups/FeedBackPopUp";
import { transformSelectedTrans } from "../../shared/helpers/transformSelectedTrans";
import CloseTaskPopUp from "./popups/CloseTaskPopUp";
import AlertComponent from "../../features/ui/alert-component/AlertComponent";
import { useNavigate, useParams } from "react-router-dom";
import numberSuffixPipe from "../../shared/helpers/numberSuffixPipe";



const POST_ASSIGN_TASK_URL = "v1/je/assignuser";
export interface Props {
    trans: any;
    docId: number;
    userID: any;
    roleID: any;
    doc_data: any;
    reviewStatus: any;
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
    name: string
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
    };
}


interface EnhancedTableToolbarProps {
    numSelected: number;
    actionButtons: ActionButton[];
    initSelected: number[];
    reviewStatusId: number;
}

const RiskTransactions = ({
    trans,
    docId,
    userID,
    roleID,
    doc_data,
    reviewStatus
}: Props) => {
    const Axios = axios;
    const RISK_DOC_COMMENTS = `/v1/je/transcomment`;
    const ASSIGNER_COMMENT = "/v1/casemgmt/getassigncomments";
    const SAVE_COMMENT = "/v1/casemgmt/savereviewcomment";
    const REVIEW_COMMENT = "/v1/casemgmt/getreviewcomments";
    const [assignerComments, SetAssignerComments] = React.useState("");
    const [reviewerComments, SetReviewerComments] = React.useState("");
    const [reviewComments, SetReviewComments] = React.useState("");
    const [age, setAge] = React.useState("");
    const [actionButtons, setActionButtons] = useState<ActionButton[]>(
        glWorkFlow(
            doc_data.REVIEWSTATUSID,
            doc_data.SUBRSTATUSID,
            roleID,
            userID,
            doc_data.ASSIGNED_BY,
            doc_data.ASSIGNED_TO
        )
    );
    const [transLoading, setTransLoading] = useState(false);
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
   
    //for case management
    const roleId: number = Number(
        JSON.parse(localStorage.getItem("THR_USER")!)?.roleId
    );
    const userId: number = Number(
        JSON.parse(localStorage.getItem("THR_USER")!)?.userId
    );

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };
    const RiskCommentDisplay = (transId: any) => {
        // setRiskCommentAnchorEl(event.currentTarget);
        // setRiskCommentsRecordOpen(true);
    };
    const ReviewComment = (event: any) => {
        // console.log(event.target.value)
        SetReviewerComments(event.target.value);
    };

    

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
    formData.append("ACCOUNTDOCID", doc_data.ACCOUNTDOCID.toString());
    formData.append("COMMENTS", "Recalled");
    formData.append("TRANSACTIONS", "null");
    formData.append("ASSIGNED_TO", userId.toString());
    setTransLoading(true);
    const recallResponse = await Axios.post(
        POST_ASSIGN_TASK_URL,
        formData,
        {
            headers: {
                Authorization: localStorage.getItem("TR_Token") as string,
            },
        }
    ).catch((error) => {
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
            // Run after 100 milliseconds

            handleNavigateBack();
        }, 2000);
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




    useEffect(() => {
        setActionButtons(
            glWorkFlow(
                doc_data.REVIEWSTATUSID,
            doc_data.SUBRSTATUSID,
            roleID,
            userID,
            doc_data.ASSIGNED_BY,
            doc_data.ASSIGNED_TO
            )
        );
    
        // setActionButtons(
        //     glWorkFlow(
        //         document.REVIEWSTATUSID,
        //         1,
        //         roleID,
        //         userID,
        //         assignedBy,
        //         assignedTo
        //     )
        // );
    }, [ ]);
    return (
        <div className="flex-row px-4 w-full">
            <div>Accounting Doc # {doc_data.ACCOUNTDOC_CODE}</div>
            <div>Transaction Details</div>
            <div className="flex-row">
                <FormControl fullWidth variant="standard">
                    <div className="flex-row absolute w-full left-1/2">
                        <div className="flex-row absolute pt-[25px]">
                            Explainability :
                        </div>
                        <div className="flex-row absolute left-[10%] w-1/4 pt-[14px]">
                            <Select
                                id="demo-simple-select"
                                value={age}
                                onChange={handleChange}
                                sx={{ width: "35%" }}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                <MenuItem value={20}>
                                    Late Night Posting - 0
                                </MenuItem>
                                <MenuItem value={30}>
                                    Weekend Posting - 0
                                </MenuItem>
                                <MenuItem value={40}>
                                    Same User Posting - 0
                                </MenuItem>
                            </Select>
                        </div>
                    </div>
                </FormControl>
                <AssignTaskPopUp
                open={open}
                handleClose={handleClose}
                title={popupTitle}
                transactions={
                    initSelectedTrans?.length
                        ? initSelectedTrans
                        : selectedTransIds
                }
                accountDocCodeId={Number(doc_data.ACCOUNTDOCID)}
                accountDoc_Code={Number(doc_data.ACCOUNTDOC_CODE)}
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
                accountDocCodeId={Number(doc_data.ACCOUNTDOCID)}
                accountDoc_Code={Number(doc_data.ACCOUNTDOC_CODE)}
                isDeviation={Number(doc_data.ISDEVIATION)}
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
                accountDocCodeId={Number(doc_data.ACCOUNTDOCID)}
                accountDoc_Code={Number(doc_data.ACCOUNTDOC_CODE)}
            />
                <div className="flex absolute w-full left-3/4">
                    <button
                        className="flex relative border-hidden bg-white"
                        // onClick={printRiskUnderReview}
                    >
                        <LocalPrintshopIcon />
                    </button>

                    <button
                        className="flex relative border-hidden bg-white"
                        // onClick={printRiskUnderReview}
                    >
                        <IosShareIcon />
                    </button>
                </div>
            </div>
            <div className="w-full text-xs pt-[30px]">
                <TableContainer className="overflow-hidden">
                    <Table
                        // sx={{ minWidth: 400, width: 500 }}
                        aria-label="simple table"
                    >
                        <TableHead className="bg-slate-200  h-[10px]">
                            <TableRow>
                                <TableCell>Transaction Number</TableCell>
                                <TableCell align="right">
                                    Entered Location
                                </TableCell>
                                <TableCell align="right">
                                    Entered Function
                                </TableCell>
                                <TableCell align="right">Entered By</TableCell>
                                <TableCell align="right">
                                    Entered Date
                                </TableCell>
                                <TableCell align="right">Account</TableCell>
                                <TableCell align="right">
                                    Account Description
                                </TableCell>
                                <TableCell align="right">
                                    Debit Amount
                                </TableCell>
                                <TableCell align="right">
                                    Credit Amount
                                </TableCell>
                                <TableCell align="right">Risk Score</TableCell>
                                <TableCell align="right">
                                    Control Deviations
                                </TableCell>
                                <TableCell align="right">
                                    Review Status
                                </TableCell>
                                <TableCell align="right">Comments</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(trans).map((key: any) => {
                                let transData = trans[key];
                                let transId =
                                    transData.TRANSACTIONID &&
                                    transData.TRANSACTIONID;
                                return (
                                    <TableRow
                                    key={transId}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell
                                            
                                            component="th"
                                            scope="row"
                                        >
                                            {transId}
                                        </TableCell>
                                        <TableCell align="right">
                                            {transData.LOCATION_CODE}
                                        </TableCell>

                                        <TableCell align="right">
                                            {transData.ENTERED_FUNCTION}
                                        </TableCell>
                                        <TableCell align="right">
                                            {transData.ENTERED_BY_NAME}
                                        </TableCell>
                                        <TableCell align="right">
                                            {transData.ENTERED_DATE &&
                                                transData.ENTERED_DATE.split(
                                                    " "
                                                )[0]}
                                        </TableCell>
                                        <TableCell align="right">
                                            {transData.ACCOUNT_CODE}
                                        </TableCell>
                                        <TableCell align="right">
                                            {transData.DESCRIPTION}
                                        </TableCell>
                                        <TableCell align="right">
                                            ${numberSuffixPipe(transData.DEBIT_AMOUNT)}
                                        </TableCell>
                                        <TableCell align="right">
                                            $({numberSuffixPipe(transData.CREDIT_AMOUNT)})
                                        </TableCell>
                                        <TableCell align="right">
                                            {transData.BLENDED_RISK_SCORE}%
                                        </TableCell>
                                        <TableCell align="right">
                                            {transData.CONTROL_DEVIATION}
                                        </TableCell>
                                        <TableCell align="right">
                                            {reviewStatus}
                                        </TableCell>
                                        <TableCell align="right">
                                            <ChatBubbleOutlineTwoToneIcon
                                                onClick={(transId) =>
                                                    RiskCommentDisplay(transId)
                                                }
                                            />
                                            {/* {Object.keys(commentsRecord).length} */}
                                            {/* <div>
                                                <Popover
                                                    id="simple-popover"
                                                    anchorEl={commentAnchorEl}
                                                    open={commentsRecordOpen}
                                                    onClose={commentRecordClose}
                                                    anchorOrigin={{
                                                        vertical: "top",
                                                        horizontal: "right",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            p: 2,
                                                            width: "400px",
                                                            height: "400px",
                                                        }}
                                                    >
                                                        <Box className="flex-row w-[25px]">
                                                            <Box className="mt-0.5 text-base">
                                                                Comments
                                                            </Box>
                                                            <Box>
                                                                <TextField
                                                                    id="standard-basic"
                                                                    variant="standard"
                                                                    placeholder="Enter your comments!....."
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setCommentDataHandler(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment:
                                                                            (
                                                                                <InputAdornment position="end">
                                                                                    <SendIcon
                                                                                        onClick={
                                                                                            AddCommentHandler
                                                                                        }
                                                                                    />
                                                                                </InputAdornment>
                                                                            ),
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: false,
                                                                    }}
                                                                    sx={{
                                                                        width: "45%",
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Box>
                                                                {commentsRecord &&
                                                                    Object.keys(
                                                                        commentsRecord
                                                                    ).length &&
                                                                    commentsRecord.map(
                                                                        (
                                                                            comment: any
                                                                        ) => {
                                                                            return (
                                                                                <Box className="flex">
                                                                                    <Box
                                                                                        sx={{
                                                                                            backgroundColor:
                                                                                                "#9fc1f1",
                                                                                            fontSize: 24,
                                                                                            width: "40px",
                                                                                            height: "40px",
                                                                                            borderRadius:
                                                                                                "50%",
                                                                                            alignItems:
                                                                                                "center",
                                                                                            mt: 4,
                                                                                            mb: 4,
                                                                                            fontWeight:
                                                                                                "medium",
                                                                                            display:
                                                                                                "inline",
                                                                                            component:
                                                                                                "div",
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            comment.USER_SHORT_NAME
                                                                                        }
                                                                                    </Box>
                                                                                    <Box
                                                                                        sx={{
                                                                                            display:
                                                                                                "inline",
                                                                                            component:
                                                                                                "div",
                                                                                        }}
                                                                                    >
                                                                                        {comment.USER_FIRST_NAME +
                                                                                            " " +
                                                                                            comment.USER_LAST_NAME}
                                                                                    </Box>
                                                                                    <Box
                                                                                        sx={{
                                                                                            display:
                                                                                                "inline",
                                                                                            component:
                                                                                                "div",
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            comment.COMMENTS
                                                                                        }
                                                                                    </Box>
                                                                                    <Box
                                                                                        sx={{
                                                                                            display:
                                                                                                "inline",
                                                                                            component:
                                                                                                "div",
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            comment.CREATED_DATE
                                                                                        }
                                                                                    </Box>
                                                                                    {comment.ACCDOCCOMID && (
                                                                                        <div
                                                                                            onClick={() =>
                                                                                                commentDeleteHandler(
                                                                                                    comment.ACCDOCCOMID
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <Box
                                                                                                sx={{
                                                                                                    display:
                                                                                                        "inline",
                                                                                                    component:
                                                                                                        "div",
                                                                                                }}
                                                                                            >
                                                                                                <DeleteIcon />
                                                                                            </Box>
                                                                                        </div>
                                                                                    )}
                                                                                </Box>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Box>
                                                        </Box>
                                                    </Typography>
                                                </Popover>
                                            </div> */}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div>
                <div>
                    <div className="inline-flex">
                        <div className="">Assigner Comments...</div>
                        <div className="block">
                            <TextareaAutosize
                                aria-label="empty textarea"
                                disabled
                                style={{ width: "200px", height: "50px" }}
                                value={assignerComments}
                            />
                        </div>
                    </div>
                    <div className="inline-flex">
                        <div className="">Assignee Comments...</div>
                        <div className="block">
                            <div>{reviewComments}</div>
                            <TextareaAutosize
                                aria-label={reviewerComments}
                                style={{ width: "200px", height: "50px" }}
                                value={reviewerComments}
                                onChange={ReviewComment}
                            />
                        </div>
                    </div>
                    <div className="inline-flex">


                        <div>
                        <EnhancedTableToolbar
                        numSelected={2}
                        actionButtons={actionButtons}
                        initSelected={[]}
                        reviewStatusId={doc_data.REVIEW_STATUS_ID}
                    />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RiskTransactions;
