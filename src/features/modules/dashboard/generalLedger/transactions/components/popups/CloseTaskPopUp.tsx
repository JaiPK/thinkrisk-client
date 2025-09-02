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
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import axios from "../../../../../../../api/axios";
import { AssignUser } from "../../../../../../../shared/models/user";
import SaveIcon from "@mui/icons-material/Save";
import AlertComponent from "../../../../../../ui/alert-component/AlertComponent";
import isContainSpecialChar from "../../../../../../../shared/helpers/inputValidator";
import { getPath } from "../../../../../../../shared/helpers/getPath";

const POST_CLOSE_DEVIATION_URL = "v1/je/closedeviation";
const PATH = {
    saveUrl: "https:" + "//" + window.location.hostname + ":8443/public/index.php/"+POST_CLOSE_DEVIATION_URL
}

const buttons = { browse: 'Choose File' };

export interface Props {
  open: boolean;
  handleClose(actionCode: number, popup: string): void;
  title: string;
  transactions: number[];
  accountDocCodeId: number;
  accountDoc_Code: string;
  isDeviation: number | null;
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

const CloseTaskPopUp = ({
  open,
  handleClose,
  title,
  transactions,
  accountDocCodeId,
  accountDoc_Code,
  isDeviation,
}: Props) => {
  const [value, setValue] = useState(isDeviation === 1 ? "1" : "0");
  const [isAssignUsersValid, setIsAssignUsersValid] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommentValid, setIsCommentValid] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  //for alert popup
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChangeRadioGroup = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleChange = (event: SelectChangeEvent) => {
    // setSelectedUser(event.target.value as string);
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

  const handleFileRemoved = () => {
    setFileSelected(false);
  };

  const handleFileSelected = () => {
    setFileSelected(true);
  };

  const onUploadStatus = (args: any) => {
  };

  const onUpload = (args: any) => {
    // const user = this.profileservice.getUser();
    const token = localStorage.getItem("TR_Token") as string;
    args.currentRequest.setRequestHeader('Authorization', token);
    // args.customFormData = [...this.customData];
    // this.tempUniqueId = tempUniqueId;
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
    let subrstatusid = "1";
    let roleId = Number(
        JSON.parse(localStorage.getItem("THR_USER")!).roleId
    );


    if(title === "Recommend to Closure"){
      subrstatusid = "3";
    }
    // if the user is accountant2
    if (title === "Send to Manager" && roleId === 5) {
      subrstatusid = "3";
    }
    if (title === "Send to Manager" && roleId === 4) {
      subrstatusid = "3";
    }
    if (title === "Close Issue" && roleId === 2) {
      subrstatusid = "1";
    }

    setSubmitLoading(true);
    //submit code
    let formData = new FormData();
    formData.append("ACCOUNTDOCID", accountDocCodeId.toString());
    formData.append("COMMENTS", comment);
    formData.append("SUBRSTATUSID", subrstatusid);
    formData.append("ISDEVIATION", value);
    formData.append("audit_id", getPath.getPathValue("audit_id"));
    const response = await Axios.post(POST_CLOSE_DEVIATION_URL, formData, {
      headers: {
        Authorization: localStorage.getItem("TR_Token") as string,
      },
    });

    setAlertMessage(response.data.message);
    setOpenAlert(true);

    if (title === "Close Issue") {
      handleClose(2, "closetask");
    } else {
      handleClose(2, "sendtomanager");
    }
  };

  useEffect(() => {
    if (open) {
      //getting the assign users list for the dropdown
      setValue(isDeviation === 1 ? "1" : "0");
      setComment("");
    }
  }, [
    open,
    handleClose,
    title,
    transactions,
    accountDocCodeId,
    accountDoc_Code,
    isDeviation,
  ]);

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
                aria-labelledby={`customized-dialog-title`+ accountDocCodeId.toString()}
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <BootstrapDialogTitle
                    id={`customized-dialog-title`+ accountDocCodeId.toString()}
          onClose={() => {
            handleClose(1, "sendtomanager");
          }}
        >
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ minHeight: "400px" }}>
          <Box sx={{ flexDirection: "column" }}>
            <Box>
              <span>Accounting Doc:</span>
              <span>{accountDoc_Code}</span>
            </Box>
            {title === "Close Issue" ? (
              <Box>
                <span>
                    {isDeviation
                        ? "Is a deviation."
                        : "Is not a deviation"}
                </span>
              </Box>
            ) : null}
            {title !== "Close Issue" ? (
              <Box sx={{ mt: "20px" }}>
                <FormControl>
                  <RadioGroup
                    id="close-task-row-radio-buttons-group"
                    row
                    aria-labelledby="close-task-row-radio-buttons-group"
                    name="close-task-row-radio-buttons-group"
                    // defaultValue="1"
                    value={value}
                    onChange={handleChangeRadioGroup}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="With Deviation"
                    />
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Without Deviation"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            ) : null}
            <Box sx={{ mt: "20px" ,display: 'block'}}>
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
                  name={`outlined-multiline-flexible`+ accountDocCodeId.toString()}
                />
              </FormControl>
            </Box>

            {/* <Box sx={{ mt: "20px" }}>
                            <UploaderComponent
                                allowedExtensions=".png,.xlsx,.xls,.csv,.doc,.docx,.pdf,.jpg,.jpeg"
                                multiple={false}
                                minFileSize={1}
                                maxFileSize={2000000}
                                removing={handleFileRemoved}
                                selected={handleFileSelected}
                                autoUpload={false}
                                name="datafile"
                                asyncSettings={PATH}
                                success={onUploadStatus}
                                failure={onUploadStatus}
                                uploading={onUpload}
                                buttons={buttons}
                            />
                        </Box> */}
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
              handleClose(1, "sendtomanager");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
                isCommentValid && !submitLoading ? false : true
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

export default CloseTaskPopUp;
