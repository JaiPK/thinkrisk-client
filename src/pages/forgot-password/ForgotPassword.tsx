import { useState } from "react";
import axios from "../../api/axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockIcon from "@mui/icons-material/Lock";
import InputAdornment from "@mui/material/InputAdornment";
import ErrorIcon from "@mui/icons-material/Error";
import DoneIcon from "@mui/icons-material/Done";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { Encrypt } from "../../features/auth/Encrypt";
import thinkriskLogo from "../../assets/cropped-Logo_black.webp";

const ForgotPassword = () => {
    const navigate = useNavigate();
    let [title, setTitle] = useState({
        component: "email",
        title: "Enter your registered email",
        subtitle: "We will send you an email for resetting the password",
    });
    let [showNewPassword, setShowNewPassword] = useState(false);
    let [showReNewPassword, setShowReNewPassword] = useState(false);
    let [buttonEmailState, setButtonEmailState] = useState(true);
    let [buttonOtpState, setButtonOtpState] = useState(true);
    let [buttonUpdatePasswordState, setButtonUpdatePasswordState] =
        useState(true);
    let [emailInput, setEmailInput] = useState("");
    let [otpInput, setOtpInput] = useState("");
    let [passwordInput, setPasswordInput] = useState("");
    let [newSamePassInput, setNewSamePassInput] = useState("");

    let [token, setToken] = useState("");
    let [emailInputError, setEmailInputError] = useState({
        error: false,
        errorLabel: "",
    });
    let [otpInputError, setOtpInputError] = useState({
        error: false,
        errorLabel: "",
    });
    let [newPassError, setNewPassError] = useState({
        error: false,
        errorLabel: "",
    });
    let [newSamePassError, setNewSamePassError] = useState({
        error: false,
        errorLabel: "",
    });
    const VERIFY_EMAIL = "/v1/password_reset";
    const VERIFY_OTP = "/v1/checkotp";
    const UPDATE_PASSWORD = "/v1/updatepassword";

    const Axios = axios;

    const emptyEmailCheck = () => {
        setButtonEmailState(true);
        setEmailInputError({
            error: true,
            errorLabel: "Email is required",
        });
    };
    const handleOtpInput = async () => {
        setTitle({
            component: "loading",
            title: "Verifying OTP",
            subtitle: "Getting back to you ASAP!",
        });
        let data = {
            otp: otpInput,
            email: emailInput,
        };
        let encrypted = Encrypt(JSON.stringify(data));
        let formData = new FormData();
        formData.append("Data", encrypted);
        try {
            const getUsersResponse = await Axios.post(VERIFY_OTP, formData);
            if (getUsersResponse.data.data !== null) {
                setToken(getUsersResponse.data.data.TOKEN);
                setTimeout(() => {
                    setTitle({
                        component: "update-password",
                        title: "Change your password",
                        subtitle: "Enter your shiny new password!",
                    });
                }, 3000);
                setTitle({
                    component: "change-initiated",
                    title: "OTP Verified",
                    subtitle: "Redirecting you to the password update screen",
                });
            } else {
                throw "Invalid Otp";
            }
        } catch (err) {
            setTitle({
                component: "error",
                title: "Oops!",
                subtitle: "Something went wrong",
            });
        }
    };
    const handleUpdatePassword = async () => {
        let data = {
            email: emailInput,
            password: passwordInput,
            token: token,
        };
        let encrypted = Encrypt(JSON.stringify(data));
        let formData = new FormData();
        formData.append("Data", encrypted);
        try {
            const getUsersResponse = await Axios.post(
                UPDATE_PASSWORD,
                formData
            );
            if (getUsersResponse.data.data !== null) {
                setTimeout(() => {
                    setTitle({
                        component: "change-initiated",
                        title: "Password Change Successful",
                        subtitle: "Redirecting you to the login page",
                    });
                }, 3000);
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
                setTitle({
                    component: "loading",
                    title: "Processing your password change",
                    subtitle: "We know.Nobody likes password changes",
                });
            } else {
                throw getUsersResponse.data.data.message;
            }
        } catch (err) {
            setTitle({
                component: "error",
                title: "Oops!",
                subtitle: "Something went wrong",
            });
        }
    };
    const handleEmailInput = async () => {
        setTitle({
            component: "loading",
            title: "Processing your request",
            subtitle: "Doing some backend magic!",
        });

        let formData = new FormData();
        formData.append("email", emailInput);
        try {
            const getUsersResponse = await Axios.post(VERIFY_EMAIL, formData);
            if (
                getUsersResponse.data.data &&
                getUsersResponse.data.data.email === emailInput
            ) {
                setTimeout(() => {
                    setTitle({
                        component: "otp",
                        title: "Verify OTP",
                        subtitle:
                            "Enter the OTP we send to your registered email",
                    });
                }, 3000);
                setTitle({
                    component: "change-initiated",
                    title: "Password Change Initiated",
                    subtitle:
                        "We will send you an email for resetting the password",
                });
            } else {
                throw getUsersResponse.data.data.message;
            }
        } catch (err) {
            setTitle({
                component: "error",
                title: "Oops!",
                subtitle: "Something went wrong",
            });
        }
    };
    const isValidEmail = (email: string) => {
        if (/\S+@\S+\.\S+/.test(email)) {
            setEmailInputError({
                error: false,
                errorLabel: "",
            });
            setButtonEmailState(false);
        } else {
            setEmailInputError({
                error: true,
                errorLabel: "Email is invalid",
            });
            setButtonEmailState(true);
        }
    };
    const handleOtpValidate = (event: { target: { value: any } }) => {
        var pattern = /[a-zA-Z]/g;
        var letters = event.target.value.match(pattern);
        if (letters) {
            setOtpInputError({
                error: true,
                errorLabel: "Not a valid OTP",
            });
            setButtonOtpState(true);
        } else if (
            event.target.value.length < 4 ||
            event.target.value.length > 4
        ) {
            setOtpInputError({
                error: true,
                errorLabel: "Not a valid OTP",
            });
            setButtonOtpState(true);
        } else {
            setOtpInputError({
                error: false,
                errorLabel: "",
            });
            setButtonOtpState(false);
            setOtpInput(event.target.value);
        }
    };
    const handleNewPassword = (event: { target: { value: any } }) => {
        setPasswordInput(event.target.value);
        if (
            newSamePassInput !== "" &&
            event.target.value !== newSamePassInput
        ) {
            setNewSamePassError({
                error: true,
                errorLabel: "The passwords you entered do not match",
            });
            setButtonUpdatePasswordState(true);
        } else {
            setNewSamePassError({
                error: false,
                errorLabel: "",
            });
            newSamePassInput !== "" && setButtonUpdatePasswordState(false);
        }
        let passwordPattern =
            /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
        if (!passwordPattern.test(event.target.value)) {
            setNewPassError({
                error: true,
                errorLabel:
                    "Password should be at least 8 characters and maximum 20 characters in length, should include at least one upper case letter, one number and one special character",
            });
            setButtonUpdatePasswordState(true);
        } else {
            setNewPassError({
                error: false,
                errorLabel: "",
            });
        }
    };
    const handleSamePassword = (event: { target: { value: any } }) => {
        if (event.target.value === passwordInput) {
            if (newPassError.error === true) {
                setButtonUpdatePasswordState(true);
            } else {
                setButtonUpdatePasswordState(false);
            }
            setNewSamePassError({
                error: false,
                errorLabel: "",
            });
        } else {
            setButtonUpdatePasswordState(true);
            setNewSamePassError({
                error: true,
                errorLabel: "The passwords you entered do not match",
            });
        }
        setNewSamePassInput(event.target.value);
    };
    const handleEmailValidate = (event: { target: { value: any } }) => {
        setEmailInput(event.target.value);
        event.target.value == ""
            ? emptyEmailCheck()
            : isValidEmail(event.target.value);
    };
    const toggleReNewPassword = () => {
        setShowReNewPassword(!showReNewPassword);
    };
    const toggleNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };
    return (
        <div className="bg-[#c5d3f0] flex h-screen w-screen absolute font-['Helvetica']">
            <div className="flex-col rounded p-4 bg-white relative w-6/12 sm:w-4/12 inset-x-1/4 sm:inset-x-1/3 min-h-[500px] sm:min-h-[400px] h-[400px] inset-y-[10%] shadow-xl">
                <div>
                    <img
                        src={thinkriskLogo}
                        className="ml-12 mb-8 mt-8 w-32 h-12"
                        alt="Think-risk-logo"
                    />
                </div>
                <div>
                    <div className="text-[19px] font-black block my-2.5 ml-12 text-[#142741]">
                        {title.title}
                    </div>
                    <div className="my-2.5 ml-12 text-base font-medium block flex-col">
                        {title.subtitle}
                    </div>
                    <div className="flex-col my-2.5 ml-12">
                        {title.component == "email" && (
                            <TextField
                                type="email"
                                id="standard-helperText"
                                label="Email"
                                variant="standard"
                                value={emailInput}
                                onChange={handleEmailValidate}
                                error={emailInputError.error === true}
                                helperText={emailInputError.errorLabel}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <AlternateEmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: "90%" }}
                            />
                        )}
                        {title.component == "otp" && (
                            <TextField
                                type="tel"
                                className="form-control"
                                id="otp-input"
                                label="OTP"
                                variant="standard"
                                onChange={handleOtpValidate}
                                error={otpInputError.error === true}
                                helperText={otpInputError.errorLabel}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: "90%" }}
                            />
                        )}
                        {title.component == "error" && (
                            <div className="relative pl-40 my-[10%]">
                                <ErrorIcon
                                    style={{ color: "#f04f24" }}
                                    sx={{ width: 56, height: 56 }}
                                />
                            </div>
                        )}
                        {title.component == "change-initiated" && (
                            <div className="relative pl-40 my-[10%]">
                                <DoneIcon
                                    style={{ color: "#33cc33" }}
                                    sx={{ width: 56, height: 56 }}
                                />
                            </div>
                        )}
                        {title.component == "update-password" && (
                            <div>
                                <TextField
                                    type={
                                        showNewPassword === true
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control"
                                    id="password-new"
                                    label="Password"
                                    variant="standard"
                                    onChange={handleNewPassword}
                                    error={newPassError.error === true}
                                    helperText={newPassError.errorLabel}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className="cursor-pointer"
                                                onClick={toggleNewPassword}
                                            >
                                                {showNewPassword == true ? (
                                                    <VisibilityIcon />
                                                ) : (
                                                    <VisibilityOffIcon />
                                                )}
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ width: "90%" }}
                                />
                                <TextField
                                    type={
                                        showReNewPassword === true
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control"
                                    id="re-password-new"
                                    label="Confirm Password"
                                    variant="standard"
                                    onChange={handleSamePassword}
                                    error={newSamePassError.error === true}
                                    helperText={newSamePassError.errorLabel}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className="cursor-pointer"
                                                onClick={toggleReNewPassword}
                                            >
                                                {showReNewPassword == true ? (
                                                    <VisibilityIcon />
                                                ) : (
                                                    <VisibilityOffIcon />
                                                )}
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ width: "90%" }}
                                />
                            </div>
                        )}
                        {title.component == "loading" && (
                            <div className="relative pl-40 my-[10%]">
                                <CircularProgress />
                            </div>
                        )}
                    </div>
                    <div className="flex-col my-16 ml-12">
                        {title.component == "email" && (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={buttonEmailState}
                                sx={{ width: "90%" }}
                                onClick={handleEmailInput}
                            >
                                Send Link
                            </Button>
                        )}
                        {title.component == "otp" && (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={buttonOtpState}
                                sx={{ width: "90%" }}
                                onClick={handleOtpInput}
                            >
                                Send Link
                            </Button>
                        )}
                        {title.component == "update-password" && (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={buttonUpdatePasswordState}
                                sx={{ width: "90%" }}
                                onClick={handleUpdatePassword}
                            >
                                Update Password
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
