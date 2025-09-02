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
import { AccDocument } from "../../shared/models/records";
import numberSuffixPipe from "../../shared/helpers/numberSuffixPipe";
//import { data } from "../../features/modules/dashboard/generalLedger/insights/BarChart";

export interface Props {
    trans: any;
    docId: number;
    userID: any;
    roleID: any;
    doc_data: any;
    reviewStatus: any;
}

const RiskTransactions = ({
    trans,
    docId,
    userID,
    roleID,
    doc_data,
    reviewStatus,
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
    const [selected, setSelected] = useState<readonly string[]>([]);
    // const [document, setDocument] = useState<AccDocument>({
    //     ACCOUNTDOCID: 0,
    //     ACCOUNTDOC_CODE: "",
    //     ACCOUNT_DOC_ID: "",
    //     ASSIGNED_BY: null,
    //     ASSIGNED_TO: null,
    //     BLENDED_RISK_SCORE: 0,
    //     BLENDED_SCORE_INDEXED: 0,
    //     COMMENTS: 0,
    //     COMPANY_CODE_NAME: null,
    //     CONTROL_DEVIATION: null,
    //     CREDIT_AMOUNT: 0,
    //     DEBIT_AMOUNT: 0,
    //     ENTRY_ID: 0,
    //     INVOICE_NUMBER: "",
    //     ISDEVIATION: null,
    //     POSTED_BY_NAME: null,
    //     POSTED_DATE: "",
    //     POSTED_LOCATION_NAME: "",
    //     REVIEWSTATUSID: 0,
    //     REVIEW_STATUS_CODE: "",
    //     SELECTED_TRANSACTIONS: null,
    //     SUBRSTATUSID: 0,
    //     SUB_R_STATUS_CODE: null,
    //     riskScore: 0,
    // });
    // const [actionButtons, setActionButtons] = useState(
    //     glWorkFlow(
    //         data.REVIEWSTATUSID,
    //         1,
    //         roleID,
    //         userID,
    //         assignedBy,
    //         assignedTo
    //     )
    // );
    const [riskCommentsRecordOpen, setRiskCommentsRecordOpen] =
        React.useState(false);
    const [riskCommentsRecord, setRiskCommentsRecord] = React.useState<
        object[]
    >([]);
    const [commentDataHandler, setCommentDataHandler] = React.useState("");
    const [riskCommentAnchorEl, setRiskCommentAnchorEl] =
        React.useState<SVGSVGElement | null>(null);
    const assignToAccountantSave = () => {
    };
    const assignToAccountantAssign = () => {
    };
    const assignToAccountantSend = () => {
    };
    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };
    const RiskCommentDisplay = (transId: any) => {
        // setRiskCommentAnchorEl(event.currentTarget);
        // setRiskCommentsRecordOpen(true);
    };
    const ReviewComment = (event: any) => {
        SetReviewerComments(event.target.value);
    };
    const AssignerComments = async () => {
        // let data = { accdoc_id: docId };
        let formData: any = new FormData();
        formData.append("accdoc_id", JSON.stringify(docId));
        try {
            const getUsersResponse = await Axios.post(
                ASSIGNER_COMMENT,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            SetAssignerComments(getUsersResponse.data.data[0].COMMENTS);
        } catch (err) {
            console.log(err);
        }
    };
    const SaveComments = async () => {
        // let data = { accdoc_id: docId };
        let formData: any = new FormData();
        formData.append("accdoc_id", JSON.stringify(docId));
        formData.append("rcomment", JSON.stringify(reviewerComments));
        try {
            const getUsersResponse = await Axios.post(SAVE_COMMENT, formData, {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            });
            SetReviewerComments("");
            ReviewComments();
            // SetAssignerComments(getUsersResponse.data.data[0].COMMENTS);
        } catch (err) {
            console.log(err);
        }
    };
    const ReviewComments = async () => {
        // let data = { accdoc_id: docId };
        let formData: any = new FormData();
        formData.append("accdoc_id", JSON.stringify(docId));
        try {
            const getUsersResponse = await Axios.post(
                REVIEW_COMMENT,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            // SetReviewComments("")
            SetReviewComments(getUsersResponse.data.data[0].REVIEWCOMMENTS);
        } catch (err) {
            console.log(err);
        }
    };
    const RiskCommentHandler = async () => {
        try {
            const getUsersResponse = await Axios.get(RISK_DOC_COMMENTS, {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            });
            setRiskCommentsRecord(getUsersResponse.data.data);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        // RiskCommentHandler();
        AssignerComments();
        ReviewComments();
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
    }, []);
    return (
        <div className="flex-row px-4 w-full">
            <div>Accounting Doc # {doc_data.ACCOUNT_PAYABLE_ENTRY}</div>
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
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Account
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Transaction ID 8
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Transaction Text
                                </TableCell>

                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Entry Date
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Entry Location
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Entry User
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Debit Amount
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Credit Amount
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Risk Score
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Review Status
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Comment
                                </TableCell>
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
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell
                                            sx={{ fontSize: 12 }}
                                            key={transId}
                                            component="th"
                                            scope="row"
                                        >
                                            {transData.ACCOUNT_NAME}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
                                            {transData.TRANSACTION_ID}
                                        </TableCell>

                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
                                            {transData.TRANSACTION_TEXT_EMPTY}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
                                            {transData.ENTRY_DATE &&
                                                transData.ENTRY_DATE.split(
                                                    " "
                                                )[0]}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
                                            {transData.ENTRY_LOCATION}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
                                            {transData.ENTERED_BY_NAME}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
                                            ${numberSuffixPipe(transData.DEBIT_AMOUNT)}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
                                            $({numberSuffixPipe(transData.CREDIT_AMOUNT)})
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
                                            {transData.BLENDED_RISK_SCORE}%
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
                                            {reviewStatus}
                                        </TableCell>

                                        <TableCell
                                            align="right"
                                            sx={{ fontSize: 12 }}
                                        >
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
                            <Button variant="contained" onClick={SaveComments}>
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                onClick={assignToAccountantAssign}
                            >
                                Assign Task
                            </Button>
                            <Button
                                variant="contained"
                                onClick={assignToAccountantSend}
                            >
                                Send to Manager
                            </Button>
                        </div>

                        <div>
                            {/* <div className="flex flex-row-reverse min-w-max gap-3">
                                {actionButtons.length
                                    ? actionButtons.map((actionButton) => (
                                          <Button
                                              className={`bg-[#0091ea] text-white  disabled:bg-slate-300 disabled:text-slate-500 ${
                                                  actionButton.show
                                                      ? "flex"
                                                      : "hidden"
                                              }`}
                                              disabled={
                                                  actionButton.disabled
                                                      ? true
                                                      : !actionButton.disabled
                                                      ? false
                                                      : selected.length === 0
                                                      ? true
                                                      : false

                                                  // numSelected===0? (actionButton.text === "Recall" || (actionButton.text === "Assign Task" && reviewStatusId === 2) || actionButton.text === "Send to Manager" || (actionButton.text === "Recommend to Closure")): actionButton.disabled ? true : false

                                                  //   actionButton.disabled
                                                  //       ? true
                                                  //       : selected.length === 0
                                                  //       ? true
                                                  //       : (initSelected.length === 0? true : false)
                                              }
                                              style={{ textTransform: "none" }}
                                              key={actionButton.text}
                                            //   onClick={() => {
                                            //       handlePopUp(
                                            //           actionButton.text
                                            //       );
                                            //   }}
                                          >
                                              {actionButton.text}
                                          </Button>
                                      ))
                                    : null}
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RiskTransactions;
