import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import thinkriskLogo from "../../../assets/logo/TR2.login-header.webp";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "../../../api/axios";
import { Encrypt } from "../../auth/Encrypt";
import useAuth from "../../auth/useAuth";
import { useAppDispatch } from "../../../hooks";
import { updateStartDate } from "../gl-slice/GLSlice";
import { updateAPStartDate, updateAPInvoiceStartDate } from "../ap-slice/APSlice";

const LOGIN_URL = "v1/login";


const LoginForm = (props: any) => {
    //auth & request related constants
    const navigate = useNavigate();
    const Axios = axios;
    const dispatch = useAppDispatch();
    
    const { setAuth, storeUser } = useAuth();
    
    //form related constants
    const [checked, setChecked] = useState(false);
    const [passwordToggle, setPasswordToggle] = useState("password");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);


    const isUsernameValid = (value: string) => {
        let usernameValid = value.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
        if (usernameValid) {
            setValidUsername(true);
        } else {
            setValidUsername(false);
        }
    };

    const isPasswordValid = (value: string) => {
        if (value.length > 7) {
            setValidPassword(true);
        } else {
            setValidPassword(false);
        }
    };

    const handleCheckBoxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setChecked(event.target.checked);
    };

    const handlePasswordToggle = () => {
        if (passwordToggle === "password") {
            setPasswordToggle("text");
        } else {
            setPasswordToggle("password");
        }
    };

    const handleUserNameUpdate = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUsername(event.target.value);
        isUsernameValid(event.target.value);
    };

    const handlePasswordUpdate = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value);
        isPasswordValid(event.target.value);
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password/verify-email");
    };

    useEffect(() => {
        setAuth(false)
    }, [])

    const handleLogin = async (event: any) => {
        event.preventDefault();
        let data = {
            Username: username,
            Password: password,
        };
        let encrypted = Encrypt(JSON.stringify(data));
        let formData = new FormData();
        formData.append("Data", encrypted);
        formData.append("keep_login", checked ? "1" : "0");

        try {
            const response = await Axios.post(LOGIN_URL, formData);
            if (response?.data?.message === "Login success.") {
                //store the token in localStorage
                storeUser(response?.data, false);
                setAuth(true)
                let month = localStorage.getItem('Month')
                const currentMonth = new Date().getMonth();
                var financialYear = new Date().getFullYear();
                if (currentMonth < 3) {
                    financialYear = financialYear - 1;
                }
                let updatedMonth = `${financialYear}-${month}-01`
                dispatch(updateStartDate(updatedMonth));
                dispatch(updateAPStartDate(updatedMonth));
                dispatch(updateAPInvoiceStartDate(updatedMonth));
                props.onAuthenticate();
            }
        } catch (err : any) {
            props.onAuthenticateFail(err);
            setUsername("");
            setPassword("");
            setValidUsername(false);
            setValidPassword(false);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="items-center m-auto">
                <img
                    className="object-scale-down h-80 w-80"
                    src={thinkriskLogo}
                    alt="thinkrisk-logo"
                />
            </div>
            <div className="flex flex-col p-6 items-center">
                <section className="flex flex-col w-8/12">
                    <form className="flex flex-col w-full space-y-6">
                        <div className="flex flex-col space-y-3">
                            <label
                                className="font-raleway text-sm"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                className={`p-2 border border-solid rounded-md hover:border-sky-500 focus:outline-none ${validUsername
                                    ? "border-slate-300"
                                    : "border-red-500"
                                    }`}
                                type="text"
                                name="email"
                                id="email"
                                autoComplete="off"
                                onChange={handleUserNameUpdate}
                                value={username}
                                required
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="flex flex-col space-y-3">
                            <label
                                className="font-raleway text-sm"
                                htmlFor="passw"
                            >
                                Password
                            </label>
                            <div className="relative flex flex-row">
                                <input
                                    className={`p-2 w-full border border-solid  rounded-md hover:border-sky-500 focus:outline-none ${validPassword
                                        ? "border-slate-300"
                                        : "border-red-500"
                                        }`}
                                    type={passwordToggle}
                                    name="passw"
                                    id="passw"
                                    onChange={(event) => {
                                        handlePasswordUpdate(event);
                                    }}
                                    value={password}
                                    autoComplete="off"
                                    placeholder="Enter password"
                                ></input>
                                <span className="absolute right-2  top-1 m-auto cursor-pointer">

                                    {passwordToggle === "password" ?
                                        <VisibilityOffIcon
                                            onClick={handlePasswordToggle}
                                        ></VisibilityOffIcon>
                                        : <VisibilityIcon
                                            onClick={handlePasswordToggle}
                                        ></VisibilityIcon>}
                                </span>
                            </div>
                            <div className="flex flex-col items-center md:flex-row lg:flex-row">
                                <div className="flex flex-row w-full md:w-1/2 items-center space-x-1">
                                    <Checkbox
                                        checked={checked}
                                        onChange={handleCheckBoxChange}
                                        inputProps={{
                                            "aria-label": "controlled",
                                        }}
                                    />

                                    <label className="font-raleway text-sm text-center">
                                        Keep me logged in
                                    </label>
                                </div>
                                <div
                                    className="w-full md:w-1/2"
                                    onClick={handleForgotPassword}
                                >
                                    <label className="font-raleway font-semibold text-sm text-sky-500 cursor-pointer pl-3">
                                        Forgot Password
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-center md:items-start md:justify-start">
                            <button
                                type="submit"
                                disabled={!(validUsername && validPassword)}
                                className="w-24 border border-solid border-white bg-sky-500 rounded-md py-2 text-white font-raleway font-semibold cursor-pointer disabled:bg-slate-400 disabled:cursor-auto"
                                onClick={handleLogin}
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default LoginForm;

