import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
} from "@mui/material";
import axios from "../../../../../api/axios";
import AlertComponent from "../../../../ui/alert-component/AlertComponent"

const POST_CREATE_USER_FEEDBACK_URL = "v1/je/createUserFeedback";

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

const FeedBackPopUp = ({
    open,
    handleClose,
    title,
    transactions,
    accountDocCodeId,
    accountDoc_Code,
}: Props) => {
    const [submitLoading, setSubmitLoading] = useState(false);

    //for alert popup
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

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

    const feedback = async (action: string) => {
        let formData = new FormData();
        formData.append("DOCUMENTID", accountDoc_Code.toString());
        formData.append("MODULE", "ap");

        switch (action) {
            case "close":
                handleClose(1, "feedback");
                break;
            case "yes":
                formData.append("ISDEVIATION", "1");
                const response = await Axios.post(
                    POST_CREATE_USER_FEEDBACK_URL,
                    formData,
                    {
                        headers: {
                            Authorization: localStorage.getItem(
                                "TR_Token"
                            ) as string,
                        },
                    }
                );
                if (response.data.message === "Saved successfully.") {
                    //bring up the acknowledgement popup
                    setAlertMessage(response.data.message);
                    setOpenAlert(true);
                }
                handleClose(2, "feedback");
                break;
            case "no":
                formData.append("ISDEVIATION", "0");
                const response2 = await Axios.post(
                    POST_CREATE_USER_FEEDBACK_URL,
                    formData,
                    {
                        headers: {
                            Authorization: localStorage.getItem(
                                "TR_Token"
                            ) as string,
                        },
                    }
                );
                if (response2.data.message === "Saved successfully.") {
                    //bring up the acknowledgement popup
                    setAlertMessage(response2.data.message);
                    setOpenAlert(true);
                }
                handleClose(2, "feedback");
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (open) {
        }
    }, [
        open,
        handleClose,
        title,
        transactions,
        accountDocCodeId,
        accountDoc_Code,
    ]);

    return (
        <div>
            <BootstrapDialog
                onClose={() => {
                    handleClose(1, "feedback");
                }}
                aria-labelledby={"customized-dialog-title"+ accountDocCodeId.toString()}
                open={open}
                fullWidth={true}
                maxWidth={"sm"}
            >
                <BootstrapDialogTitle
                    id={"customized-dialog-title"+ accountDocCodeId.toString()}
                    onClose={() => {
                        handleClose(1, "feedback");
                    }}
                >
                    {title}
                </BootstrapDialogTitle>
                <DialogContent dividers sx={{ maxHeight: "400px" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 1,
                            m: 1,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ mx: 2 }}
                            onClick={() => {
                                feedback("yes");
                            }}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ mx: 2 }}
                            onClick={() => {
                                feedback("no");
                            }}
                        >
                            No
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ mx: 2 }}
                            onClick={() => {
                                feedback("close");
                            }}
                        >
                            Skip
                        </Button>
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
                </DialogContent>
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

export default FeedBackPopUp;
