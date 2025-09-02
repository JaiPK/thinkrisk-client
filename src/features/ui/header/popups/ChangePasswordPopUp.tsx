import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../../../shared/models/user";
import axios from "../../../../api/axios";
import AlertComponent from "../../alert-component/AlertComponent";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { Encrypt } from "../../../auth/Encrypt";

const POST_CHANGE_PASSWD_URL = "v1/users/passwordreset";

export interface Props {
  title: string;
  open: boolean;
  setOpen: (action: string) => void;
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

const ChangePasswordPopUp = ({ title, open, setOpen }: Props) => {
  const [updates, setUpdates] = useState([
    {
      name: "First character should be a letter",
      status: false,
    },
    {
      name: "Should contain atleast one lowercase character",
      status: false,
    },
    {
      name: "Should contain atleast one uppercase character",
      status: false,
    },
    {
      name: "Should contain atleast one special character",
      status: false,
    },
    {
      name: "Should contain atleast one digit character",
      status: false,
    },
    {
      name: "Should contain atleast eight characters",
      status: false,
    },
  ]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [isConfirmNewPasswordValid, setIsConfirmNewPasswordValid] =
    useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  //for alert popup
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  //axios
  const Axios = axios;

  const checkNewPasswordValidity = (password: string) => {
    let format = /[!#%&*<=>?@_~]/;
    let format1 = /[a-z]/;
    let format2 = /[A-Z]/;
    let format3 = /[0-9]/;
    let format4 = /[a-zA-Z]/;

    let updatesCopy = [...updates];
    updatesCopy[0].status = format4.test(password.charAt(0));

    updatesCopy[1].status = format1.test(password);
    // return 'should contain atleast one lowercase character'

    updatesCopy[2].status = format2.test(password);
    // return 'should contain atleast one uppercase character'

    updatesCopy[3].status = format.test(password);
    // return 'should contain atleast one special character'

    updatesCopy[4].status = format3.test(password);
    // return 'should contain atleast one digit character'

    updatesCopy[5].status = password.length > 8;
    // return 'should contain atleast eight characters'

    setUpdates([...updatesCopy]);
  };

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const handleCurrentPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setCurrentPassword(event.target.value);
    if (event.target.value.length >= 8) {
      setIsCurrentPasswordValid(true);
    } else {
      setIsCurrentPasswordValid(false);
    }
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    let valid = new RegExp(
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}"
    );
    event.preventDefault();
    setNewPassword(event.target.value);
    if (valid.test(event.target.value) === true) {
      checkNewPasswordValidity(event.target.value);
      setIsNewPasswordValid(true);
    } else {
      checkNewPasswordValidity(event.target.value);
      setIsNewPasswordValid(false);
    }
  };

  const handleConfirmNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setConfirmNewPassword(event.target.value);
    if (event.target.value === newPassword && event.target.value !== "") {
      setIsConfirmNewPasswordValid(true);
    } else {
      setIsConfirmNewPasswordValid(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      //submit code
      let formData = new FormData();
      let data = {
        userid: (
          JSON.parse(localStorage.getItem("THR_USER") ?? "") as User
        ).userId.toString(),
        password: currentPassword,
        newpassword: newPassword,
      };
      const encrypted = Encrypt(JSON.stringify(data));
      formData.append("Data", encrypted);

      const response = await Axios.post(POST_CHANGE_PASSWD_URL, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });

      if (response.data.data === 1) {
        setAlertMessage(response.data.message);
        setOpenAlert(true);
        setSubmitLoading(false);
        setOpen("close");
      } else {
        setAlertMessage("An Error occured");
        setOpenAlert(true);
        setSubmitLoading(false);
        setOpen("close");
      }
    } catch (error: any) {
      setAlertMessage("An Error occured");
      setOpenAlert(true);
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setIsCurrentPasswordValid(false);
    setIsNewPasswordValid(false);
    setIsConfirmNewPasswordValid(false);
    setUpdates([
      {
        name: "First character should be a letter",
        status: false,
      },
      {
        name: "Should contain atleast one lowercase character",
        status: false,
      },
      {
        name: "Should contain atleast one uppercase character",
        status: false,
      },
      {
        name: "Should contain atleast one special character",
        status: false,
      },
      {
        name: "Should contain atleast one digit character",
        status: false,
      },
      {
        name: "Should contain atleast eight characters",
        status: false,
      },
    ]);
  }, [open]);

  return (
    <div>
      <BootstrapDialog
        aria-labelledby={`customized-dialog-title-changes-password-popup`}
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <BootstrapDialogTitle
          id={`customized-dialog-title-changes-password-popup`}
          onClose={() => {
            setOpen("close");
          }}
        >
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ minHeight: "400px" }}>
          <Box sx={{ flexDirection: "column" }}>
            <Box
              component="form"
              sx={{
                width: "100%",
              }}
              autoComplete="off"
            >
              <TextField
                id="standard-basic"
                label="Current Password"
                variant="standard"
                sx={{
                  width: "100%",
                }}
                value={currentPassword}
                type="password"
                onChange={handleCurrentPasswordChange}
                error={!isCurrentPasswordValid}
                helperText={
                  !isCurrentPasswordValid
                    ? "Password should have minimum 8 characters"
                    : ""
                }
              />
            </Box>
            <Box
              component="form"
              sx={{
                width: "100%",
                marginTop: 3,
              }}
              autoComplete="off"
            >
              <TextField
                id="new-password"
                label="New Password"
                variant="standard"
                sx={{
                  width: "100%",
                }}
                value={newPassword}
                type="password"
                onChange={handleNewPasswordChange}
                error={!isNewPasswordValid}
              />
              {updates.map((update, index: number) => {
                return (
                  <Box sx={{ marginTop: 2, flexDirection: "row" }} key={index}>
                    {/* <Box sx={{maxWidth: 10}}>{update.status?<CheckIcon/>: <ClearIcon/>}</Box>
                        <Box>:{update.name} </Box> */}
                    {/* <span className="my-auto">{update.status?<CheckIcon fontSize="small"/>: <ClearIcon fontSize="small"/>}</span>
                        <span>:{update.name} </span> */}
                    <Stack direction="row" alignItems="center" gap={1}>
                      {update.status ? (
                        <CheckIcon
                          fontSize="medium"
                          style={{ color: "green" }}
                        />
                      ) : (
                        <CloseIcon
                          fontSize="medium"
                          style={{ color: "#dc2626" }}
                        />
                      )}
                      <Typography variant="body1">{update.name}</Typography>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
            <Box
              component="form"
              sx={{
                width: "100%",
                marginTop: 3,
              }}
              autoComplete="off"
            >
              <TextField
                id="new-password-confirm"
                label="Confirm Password"
                variant="standard"
                sx={{
                  width: "100%",
                }}
                value={confirmNewPassword}
                type="password"
                onChange={handleConfirmNewPassword}
                error={!isConfirmNewPasswordValid}
                helperText={
                  !isConfirmNewPasswordValid
                    ? "Passwords do not match"
                    : "Passwords match"
                }
                required={true}
              />
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
              setOpen("close");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isCurrentPasswordValid &&
              isNewPasswordValid &&
              isConfirmNewPasswordValid &&
              !submitLoading
                ? false
                : true
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

export default ChangePasswordPopUp;
