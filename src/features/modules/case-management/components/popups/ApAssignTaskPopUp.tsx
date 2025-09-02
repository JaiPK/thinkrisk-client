import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import axios from "../../../../../api/axios";
import { AssignUser } from "../../../../../shared/models/user";
import SaveIcon from "@mui/icons-material/Save";
import AlertComponent from "../../../../ui/alert-component/AlertComponent"
import isContainSpecialChar from "../../../../../shared/helpers/inputValidator";
import { getPath } from "../../../../../shared/helpers/getPath";

const GET_ASSIGN_USERS_URL = "v1/users/assigningusers";
const POST_ASSIGN_TASK_URL = "v1/ap/assignuser";

export interface Props {
    open: boolean;
    handleClose(actionCode: number, popup: string): void;
    title: string;
    transactions: number[];
    accountDocCodeId: number;
    accountDoc_Code: string;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const AssignTaskPopUp = ({
    open,
    handleClose,
    title,
    transactions,
    accountDocCodeId,
    accountDoc_Code
}: Props) => {
    const [selectedUser, setSelectedUser] = useState("");
    const [assignUsers, setAssignUsers] = useState<AssignUser[]>([]);
    const [isAssignUsersValid, setIsAssignUsersValid] = useState(false);
    const [comment, setComment] = useState("");
    const [isCommentValid, setIsCommentValid] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    //for alert popup
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedUser(event.target.value as string);
        if (
            event.target.value !== null &&
            event.target.value !== undefined &&
            event.target.value !== ""
        ) {
            setIsAssignUsersValid(true);
        }
    };

    const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
        let trimmedText = event.target.value.trim();
        if (
            trimmedText !== null &&
            trimmedText !== undefined &&
            trimmedText !== ""
        ) {
            setIsCommentValid(true);
        } else {
            setIsCommentValid(false);
        }
    };

    //axios
    const Axios = axios;

    const handleAlertClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert(false);
    };

    const handleSubmit = async () => {
        if (isContainSpecialChar(comment)) return;
        setSubmitLoading(true);
        //submit code
        let formData = new FormData();
        formData.append('ACCOUNT_DOC_ID', accountDoc_Code.toString());
        formData.append('COMMENTS', comment);
        formData.append('TRANSACTIONS', JSON.stringify(transactions));
        formData.append('ASSIGNED_TO', selectedUser);
        formData.append('audit_id', getPath.getPathValue("audit_id"));
        const response = await Axios.post(POST_ASSIGN_TASK_URL, formData, {
            headers: {
                Authorization: localStorage.getItem("TR_Token") as string,
            },
        });

        setAlertMessage(response.data.message);
        setOpenAlert(true);
        handleClose(2, "assigntask");
    }

    const getPathValue = (key: any) => {
        const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
        return pathHistory["audit"]?.[key];

    }

    useEffect(() => {
        const getUsers = async () => {
            setAssignUsers([]);
            setSelectedUser("");
            setIsAssignUsersValid(false);
            setComment("");
            setIsCommentValid(false);
            const response = await Axios.get(`${GET_ASSIGN_USERS_URL}?client_id=${getPath.getPathValue("client_id")}`, {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            });
            if (response.data.data.length) {
                let assignArray: AssignUser[] = [];
                response.data.data.forEach((user: AssignUser) => {
                    assignArray.push(user);
                });
                setAssignUsers(assignArray);
                setSubmitLoading(false);
            }
        };

        if (open) {
            //getting the assign users list for the dropdown
            getUsers();
        }
    }, [open, handleClose, title, transactions, accountDocCodeId, accountDoc_Code]);

    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby={"customized-dialog-title"+ accountDocCodeId.toString()}
                open={open}
                fullWidth={true}
                maxWidth={"sm"}
            >
                <BootstrapDialogTitle
                    id={"customized-dialog-title"+ accountDocCodeId.toString()}
                    onClose={() => {
                        handleClose(1, "assigntask");
                    }}
                >
                    {title}
                </BootstrapDialogTitle>
                <DialogContent dividers sx={{ minHeight: "400px" }}>
                    <Box sx={{ flexDirection: "column" }}>
                        <Box>
                            <span>Accounting Doc:</span>
                            <span>{accountDocCodeId}</span>
                        </Box>
                        <Box sx={{ mt: "20px" }}>
                            <span>Selected Transactions:</span>
                            <span>{transactions.join(", ")}</span>
                        </Box>
                        <Box sx={{ mt: "20px" }}>
                            {/* <span>Selected Transactions:</span> */}
                            <FormControl
                                fullWidth
                                size="small"
                                error={!isAssignUsersValid}
                            >
                                <InputLabel id="demo-simple-select-label">
                                    Choose a person
                                </InputLabel>
                                <Select
                                    required
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedUser}
                                    label={
                                        <Typography variant="h6" component="h6">
                                            Choose a person
                                        </Typography>
                                    }
                                    onChange={handleChange}
                                >
                                    {assignUsers.length
                                        ? assignUsers.map((user) => (
                                            <MenuItem
                                                key={user.USERID}
                                                value={user.USERID}
                                            >
                                                {user.USER_FIRST_NAME +
                                                    " " +
                                                    user.USER_LAST_NAME +
                                                    " (" +
                                                    user.ROLE_CODE +
                                                    ")"}
                                            </MenuItem>
                                        ))
                                        : null}

                                    {/* <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem> */}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ mt: "20px" }}>
                            <FormControl fullWidth size="small">
                                <TextField
                                    id={`outlined-multiline-flexible`+ accountDocCodeId.toString()}
                                    label="Leave a comment"
                                    multiline
                                    rows={8}
                                    sx={{ width: "100%" }}
                                    error={!isCommentValid}
                                    value={comment}
                                    onChange={handleCommentChange}
                                />
                            </FormControl>
                        </Box>
                        {submitLoading && (
                            <Box sx={{ mt: "20px" }}>
                                <span className="item-center justify-center invisible">
                                    <div className="pr-8">
                                        <CircularProgress size={20} />
                                    </div>
                                </span>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleClose(1, "assigntask");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={
                            isAssignUsersValid && isCommentValid &&
                                !submitLoading ? false : true
                        }
                    >
                        Submit
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <AlertComponent
                openAlert={openAlert}
                handleClose={handleAlertClose}
                message={alertMessage}
                vertical={"bottom"}
                horizontal={"center"}
                severity={"success"}
            />
        </div>
    );
};

export default AssignTaskPopUp;
