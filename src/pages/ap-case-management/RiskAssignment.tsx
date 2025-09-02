import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import RiskTransactions from "./RiskTransactions";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import IosShareIcon from "@mui/icons-material/IosShare";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachmentIcon from "@mui/icons-material/Attachment";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import axios from "../../api/axios";
import numberSuffixPipe from "../../shared/helpers/numberSuffixPipe";

import ChatBubbleOutlineTwoToneIcon from "@mui/icons-material/ChatBubbleOutlineTwoTone";
import { PropaneSharp } from "@mui/icons-material";
import isContainSpecialChar from "../../shared/helpers/inputValidator";

export interface Props {
    data: any;
    reviewStatus: string;
}

const RiskAssignment = ({ data, reviewStatus }: Props) => {
    const environment = {
        production: true,
        api: {
            base: "https:" + "//" + window.location.hostname + ":8443/public/index.php/"
        },
        AES_KEY: "t1Nk#R1sK_0",
        adRedirectUrl: "https://cloudqa.thinkrisk.ai/dashboard",
        msalClientId: "c4b631ae-65f6-461c-81b6-b20787fe54af",
        msalTenentId: "97987208-1fc0-4130-92d6-08a8417d81b5",
    };

    const Axios = axios;
    const [age, setAge] = React.useState("");
    const [exportHideStatus, setExportHideStatus] = React.useState(false);
    const [transactions, setTransactions] = React.useState([]);
    const [documentKey, setDocumentKey] = React.useState(0);
    const [riskData, setRiskData] = React.useState("");
    const [commentsRecord, setCommentsRecord] = React.useState<object[]>([]);
    const [commentsRecordOpen, setCommentsRecordOpen] = React.useState(false);
    const [commentDataHandler, setCommentDataHandler] = React.useState("");
    const [commentAnchorEl, setCommentAnchorEl] =
        React.useState<SVGSVGElement | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const RISK_TRANSACTIONS = "/v1/ap/transactions";
    const PDF_EXPORT = "/v1/print/token";
    const DOC_COMMENTS = `/v1/ap/accdoccomment/${documentKey}`;
    const ADD_COMMENT = "v1/ap/accdoccomment";
    const DELETE_COMMENT = "/v1/ap/accdoccomment/";

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    const apiFilters = () => {};
    const roleId: number = Number(
        JSON.parse(localStorage.getItem("THR_USER")!)?.roleId
    );
    const userId: number = Number(
        JSON.parse(localStorage.getItem("THR_USER")!)?.userId
    );
    const printRiskUnderReview = async () => {
        try {
            const getUsersResponse = await Axios.get(PDF_EXPORT, {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            });
            let encodedFilters = encodeURIComponent(JSON.stringify(apiFilters));
            let url = `${environment.api.base}v1/print/${getUsersResponse.data.data.Token}/apcasemanagement?filters=${encodedFilters}`;
            window.open(url, "_blank");
        } catch (err) {
            console.log(err);
        }
    };
    const printRiskClosed = async () => {
    };
    const commentRecordClose = () => {
        setCommentsRecordOpen(false);
    };
    const exportRiskUnderReview = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget);

        setExportHideStatus(true);
    };
    const exportRiskClosed = () => {
    };
    const CommentDisplay = (event: React.MouseEvent<SVGSVGElement>) => {
        setCommentAnchorEl(event.currentTarget);
        setCommentsRecordOpen(true);
    };
    const CommentHandler = async () => {
        try {
            const getUsersResponse = await Axios.get(DOC_COMMENTS, {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            });
            setCommentsRecord(getUsersResponse.data.data);
        } catch (err) {
            console.log(err);
        }
    };
    const commentDeleteHandler = async (val: React.MouseEvent<any>) => {
        try {
            const getUsersResponse = await Axios.delete(DELETE_COMMENT + val, {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            });
        } catch (err) {
            console.log(err);
        }
    };
    const AddCommentHandler = async () => {
        try {
            if (isContainSpecialChar(commentDataHandler)) return;
            let formData = new FormData();
            formData.append("accdoc_id", JSON.stringify(documentKey));
            formData.append("comment", commentDataHandler);

            const getUsersResponse = await Axios.post(
                ADD_COMMENT,

                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            CommentHandler();
        } catch (err) {
            console.log(err);
        }
    };
    const popOverClose = () => {
        setExportHideStatus(false);
    };
    const excelExportHandler = () => {
    };
    const csvExportHandler = () => {};
    const tranactionHandler = async (dockey: number, riskData: any) => {
        try {
            let formData = new FormData();
            formData.append("page", "1");
            formData.append("perpage", "5");
            formData.append("sortkey", "BLENDED_RISK_SCORE");
            formData.append("sortorder", "desc");
            formData.append("ACCOUNT_DOC_ID", dockey.toString());
            formData.append("exp", "");
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
            setRiskData(riskData);
            setDocumentKey(dockey);
            setTransactions(getUsersResponse.data.data.records);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        CommentHandler();
    }, []);
    return (
        <div className="flex-row px-4 w-full">
            <div className="flex-row">
                <FormControl fullWidth variant="standard">
                    <div className="">
                        <TextField
                            id="standard-basic"
                            label="Search Accounting Documents"
                            variant="standard"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: "45%" }}
                        />
                    </div>

                    <div className="flex-row absolute w-full left-1/2">
                        <div className="flex-row absolute pt-[25px]">
                            Deviation Status :
                        </div>
                        <div className="flex-row absolute left-[10%] w-1/6 pt-[14px]">
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
                                    Manager Review With Deviation
                                </MenuItem>
                                <MenuItem value={30}>
                                    Manager Review Without Deviation
                                </MenuItem>
                                <MenuItem value={40}>
                                    Assigned to Auditor
                                </MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className="flex absolute w-full left-3/4">
                        <button
                            className="flex relative border-hidden bg-white"
                            onClick={printRiskUnderReview}
                        >
                            <LocalPrintshopIcon />
                        </button>
                        <button
                            className="flex border-hidden bg-white"
                            onClick={exportRiskUnderReview}
                        >
                            <IosShareIcon />
                            <Popover
                                id="simple-popover"
                                open={exportHideStatus}
                                anchorEl={anchorEl}
                                onClose={popOverClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                            >
                                <Typography
                                    sx={{ p: 2, backgroundColor: "#579bfc" }}
                                    component={"div"}
                                >
                                    <div className="flex-row w-[25px]">
                                        <div className="">
                                            <CancelIcon
                                                onClick={popOverClose}
                                            />
                                        </div>
                                        <div>
                                            <div>
                                                <DescriptionIcon
                                                    onClick={excelExportHandler}
                                                />
                                                <div>Excel</div>
                                            </div>
                                            <div className="flex-row absolute">
                                                <AttachmentIcon
                                                    onClick={csvExportHandler}
                                                />
                                                <div>CSV</div>
                                            </div>
                                        </div>
                                    </div>
                                </Typography>
                            </Popover>
                        </button>
                    </div>
                </FormControl>
            </div>
            <div className="pt-[30px]">
                <TableContainer>
                    <Table
                        sx={{ minWidth: 100, width: 100, fontSize: 10 }}
                        aria-label="simple table"
                        size="small"
                    >
                        <TableHead
                            className="bg-slate-200"
                            sx={{ width: "100%", fontSize: 10 }}
                        >
                            <TableRow>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Accounts Payable Entry
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Invoice Number
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Company
                                </TableCell>

                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Posted By
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Posted Date
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Debit Amount
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Credit Amount
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Assigned By
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Assigned To
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Assigned Date
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Risk Score
                                </TableCell>

                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Review Status
                                </TableCell>

                                <TableCell align="right" sx={{ fontSize: 12 }}>
                                    Comments
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {Object.keys(data).length > 0 &&
                                    Object.keys(data).map((key: any) => {
                                let riskData = data[key];
                                let docId =
                                    riskData.ACCOUNT_DOC_ID &&
                                    riskData.ACCOUNT_DOC_ID;
                                return (
                                    <TableRow
                                    className="text-xs"
                                    key={key}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                        onClick={() =>
                                            tranactionHandler(docId, riskData)
                                        }
                                    >
                                        <TableCell
                                              sx={{ fontSize: 12 }}
                                            key={docId}
                                            component="th"
                                            scope="row"
                                        >
                                            {riskData.ACCOUNT_PAYABLE_ENTRY}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            {riskData.INVOICE_NUMBER}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            {riskData.COMPANY}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            {riskData.POSTED_BY_NAME}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            {riskData.POSTED_DATE.split(" ")[0]}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            
                                                ${numberSuffixPipe(riskData.DEBIT_AMOUNT)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            $({numberSuffixPipe(riskData.CREDIT_AMOUNT)})
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            {riskData.ASSIGNED_BY_NAME}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            {riskData.ASSIGNED_TO_NAME}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            {riskData.ASSIGNED_ON.split(" ")[0]}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            {(
                                                Number(
                                                    riskData.BLENDED_RISK_SCORE
                                                ) * 100
                                            ).toFixed(2)}%
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            {riskData.SUB_R_STATUS_CODE ||
                                                riskData.REVIEW_STATUS_CODE}
                                        </TableCell>

                                        <TableCell align="right" sx={{ fontSize: 12 }}>
                                            <ChatBubbleOutlineTwoToneIcon
                                                onClick={(event) =>
                                                    CommentDisplay(event)
                                                }
                                            />
                                            {Object.keys(commentsRecord).length}
                                            <div>
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
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        {/* <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[
                                        5,
                                        10,
                                        25,
                                        { label: "All", value: -1 },
                                    ]}
                                    colSpan={3}
                                    count={5}
                                    rowsPerPage={5}
                                    page={0}
                                    SelectProps={{
                                        inputProps: {
                                            "aria-label": "rows per page",
                                        },
                                        native: true,
                                    }}
                                    // onPageChange={handleChangePage}
                                    // onRowsPerPageChange={
                                    //     handleChangeRowsPerPage
                                    // }
                                    // ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter> */}
                    </Table>
                </TableContainer>
            </div>
            {transactions.length > 0 && (
                <RiskTransactions
                    doc_data={riskData}
                    trans={transactions}
                    docId={documentKey}
                    userID={userId}
                    roleID={roleId}
                    reviewStatus={reviewStatus}
                />
            )}
        </div>
    );
};
export default RiskAssignment;
