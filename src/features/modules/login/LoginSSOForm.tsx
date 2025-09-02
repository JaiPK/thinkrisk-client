import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import thinkriskLogo from "../../../assets/logo/TR2.login-header.webp";
import IBMLogo from "../../../assets/ibm.svg";

import axios from "../../../api/axios";
import useAuth from "../../auth/useAuth";
import { useAppDispatch } from "../../../hooks";
import { updateStartDate } from "../gl-slice/GLSlice";
import { updateAPStartDate, updateAPInvoiceStartDate } from "../ap-slice/APSlice";
import { beginAuth } from "./LoginSSO";
import { nanoid } from 'nanoid'

const IBM_CLOUD_LOGIN = "/v1/ibmcloudlogin";


const LoginSSOForm = (props:any) => {
    //auth & request related constants
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const Axios = axios;

    const { setAuth, storeUser } = useAuth();

    useEffect(() => {
        const url = window.location.href.replace("#", "?")
        const currentURL = new URL(url);
        const token = currentURL.searchParams.get("access_token");
        if(token){
            handleIBMLogin(token)
        }
        else {
            setAuth(false)
        }
    }, []);

    const triggerIBMAuth = async (event: any) => {
        event.preventDefault();
        beginAuth({
            state: nanoid(32),
            nonce: nanoid(32)
        })
    }

    const handleIBMLogin = async (token: any) => {

        let formData = new FormData();
        formData.append("token", token);

        try {
            const response = await Axios.post(IBM_CLOUD_LOGIN, formData);
            if (response?.data?.message === "Login success.") {
                storeUser(response?.data, false);
                setAuth(true);
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
            navigate("/admin/login")
        }
    };


    return (
        <div className="flex flex-col w-full">
            <div className="items-center m-auto">
                <img
                    className="object-scale-down w-80"
                    src={thinkriskLogo}
                    alt="thinkrisk-logo"
                />
            </div>
            <div className="flex flex-col items-center">
                <section className="flex flex-col w-8/12">
                    <div className="flex flex-row items-center justify-center">
                        <button className="social-btn" onClick={triggerIBMAuth}><span className="social-logo-wrapper"><img className="social-logo" src={IBMLogo} alt="IBM logo" /></span><span className="social-text">Sign-in with IBM</span></button>                               
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoginSSOForm;

