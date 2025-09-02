import {
    Avatar,
    Box,
    Button,
    Popover,
    TextField,
    Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import axios from "../../../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import isContainSpecialChar from "../../helpers/inputValidator";

interface Props {
    open: boolean;
    anchorEl: HTMLButtonElement | null;
    handleClose: () => void;
    module: string;
    docId: number;
    type: string;
    count?: number;
}

const CommentsPopOver = (props: Props) => {
    const commentsRef = useRef<any>(null);
    const [comment, setComment] = useState("");
    const [commentsArray, setCommentsArray] = useState<any[]>([]);
    const [auditId, setAuditId] = useState<any>(null);

    const Axios = axios;

    const handleCommentChange = (event: any) => {
        setComment(event.target.value);
    };

    const getComments = async () => {
        console.log("props.type:",props.type);
        console.log("props.module:",props.module);

        let url = `v1/${props.module}/${
            props.type === "doc" ? "accdoccomment" : (props.module === 'je'? "transcomment" : "trcomment")
        }/${props.docId}`;
        if(props.module === "ap" || props.type === "doc"){
            const queryParams = new URLSearchParams();
            queryParams.append("audit_id", auditId);
            url = `${url}?${queryParams.toString()}`
        }
        const getCommentsResponse = await Axios.get(
            url,
            {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            }
        ).catch((error) => {
            console.log("error:", error);
            return;
        });


        if (getCommentsResponse?.data?.data.length) {
            setCommentsArray([...getCommentsResponse?.data?.data]);
        } else {
            setCommentsArray([]);
        }
    };

    const postComment = async () => {
        
        if (isContainSpecialChar(comment))
            return;

        let formData = new FormData();
        if (props.type === "doc") {
            if (props.module === "ap") {
                formData.append("ACCOUNT_DOC_ID", props.docId.toString());
                formData.append("audit_id", auditId);
            }
            if (props.module === "je") {
                formData.append("accdoc_id", props.docId.toString());
            }
        }
        if (props.type === "tr") {
            formData.append("trans_id", props.docId.toString());
            formData.append("audit_id", auditId);
        }
        formData.append("comment", comment);

        const commentResponse = await Axios.post(
            `v1/${props.module}/${
                props.type === "doc" ? "accdoccomment" : (props.module === 'je'? "transcomment" : "trcomment")
            }`,
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


        setComment("");
        getComments();
    };

    const deleteComment = async (id: number) => {
        const deleteCommentResponse = await Axios.delete(
            `v1/${props.module}/${
                props.type === "doc" ? "accdoccomment" : (props.module === 'je'? "transcomment" : "trcomment")
            }/${id}`,
            {
                headers: {
                    Authorization: localStorage.getItem("TR_Token") as string,
                },
            }
        ).catch((error) => {
            console.log("error:", error);
            return;
        });

        getComments();
    };

    useEffect(() => {
        setCommentsArray([]);
        const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
        if (pathHistory && props.module == "ap"){
            setAuditId(pathHistory["audit"]["audit_id"])
        }
        if (props.open === true && props.docId !== 0) {
            getComments();
        }
    }, [props.open]);

    return (
        <Popover
            open={props.open}
            anchorEl={props.anchorEl}
            onClose={props.handleClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            PaperProps={{
                style: { width: "40%" },
            }}
        >
            <Box sx={{ px: 2, pt: 1 }}>
                <Typography>Comments</Typography>
            </Box>
            <Box
                sx={{
                    flexDirection: "row",
                    px: 2,
                    pt: 1,
                    alignItems: "center",
                }}
            >
                <TextField
                    id={`${props.docId}-outlined-basic`}
                    name={`${props.docId}-outlined-basic`}
                    variant="outlined"
                    sx={{ width: "100%" }}
                    onChange={handleCommentChange}
                    value={comment}
                />
            </Box>
            <Box
                sx={{
                    width: "auto",
                    px: 2,
                }}
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <Button sx={{ mt: 1 }} onClick={postComment}>
                    Post Comment
                    <SendIcon sx={{ ml: 1 }} />
                </Button>
            </Box>
            <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                {commentsArray.map((element, index: number) => {
                    return (
                        <Box
                            sx={{
                                justifyContent: "space-between",
                                width: "auto",
                                pt: 1,
                            }}
                            display="flex"
                            key={index}
                        >
                            <Box display="flex" alignItems="center">
                                <Avatar
                                    sx={{
                                        width: 35,
                                        height: 35,
                                        p: 1,
                                        mr: 1,
                                        backgroundColor: "#9fc1f1",
                                        color: "black",
                                    }}
                                >
                                    {element.USER_SHORT_NAME}
                                </Avatar>
                                <Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: "bold" }}>
                                            {element.USER_FIRST_NAME}{" "}
                                            {element.USER_LAST_NAME}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: 12 }}>
                                            {element.COMMENTS}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box display="flex" justifyContent="flex-end">
                                <Box display="flex" alignItems="center">
                                    <Typography
                                        sx={{ fontSize: 12, color: "#a39e9e" }}
                                    >
                                        {element.CREATED_DATE}
                                    </Typography>
                                </Box>
                                <Button
                                    onClick={() => {
                                        deleteComment(
                                            
                                            (props.type === 'tr')? element.TRANSCOMID :(props.module === "ap"
                                            ? element.ACCDOC_COMMENT_ID
                                            : element.ACCDOCCOMID)
                                        );
                                    }}
                                >
                                    <DeleteIcon />
                                </Button>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Popover>
    );
};

export default CommentsPopOver;
