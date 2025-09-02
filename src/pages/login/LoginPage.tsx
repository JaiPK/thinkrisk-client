import LoginForm from "../../features/modules/login/LoginForm";
import thinkriskBackground from "../../assets/TR2.login-page-background.webp";
import thinkriskLaptop from "../../assets/home-loginpage-laptop.webp";
import LoginSSOForm from "../../features/modules/login/LoginSSOForm";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAppDispatch } from "../../hooks";
import { setTrModel } from "../../features/modules/Rbac/Rbac";
import { isLoggedIn } from "../../features/auth/RequireAuth";
import AlertComponent from "../../features/ui/alert-component/AlertComponent";

const LOGIN_CONFIG_URL = "v1/getloginconfig";
const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const Axios = axios;
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [loginConfig, setLoginconfig] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");


    useEffect(()=>{
        const EndDate = new Date(2043, 4, 3)
        const CurrentDate: any = new Date();
        if (CurrentDate > EndDate) {
            setAlertMessage("Your subscription has ended. Please Contact ThinkRisk.")
            handleAlertOpen()
            return
        }
        if (isLoggedIn()){
            authenticateUser()
        }
        else {
            getLoginConfig();
        }
        setIsAdmin(location.pathname.split("/").length <= 2)
    }, [])
    
    const getLoginConfig = async () => {
        try {
            const response = await Axios.get(LOGIN_CONFIG_URL);
            setLoginconfig(true);
        } catch (err) { }
    };

    const handleAlertOpen = () => {
        setOpenAlert(true);
    };

    const handleAlertClose = (
        event?: React.SyntheticEvent | Event
    ) => {
        setOpenAlert(false);
    };


    const authenticateUser = () => {
        setAlertMessage("Login success.");
        handleAlertOpen();
        getTrmodel();
        navigate("/home/ap");
    };

    const authenticateFail = (err: any) => {
        if([403, 423].includes(err?.request?.status)){
            setAlertMessage(JSON.parse(err.request.response)['message'])
        }
        else{
            setAlertMessage("Login failed.");
        }
        handleAlertOpen();
    }

    const getTrmodel = async () => {
        let Obj = JSON.parse(localStorage.getItem("THR_USER")!);
        const response = await axios.get(`v1/users/userrole/${Obj?.roleId}`, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
        console.log(response);
        if (response.status !== 403) {
          const allowedRoutes = [] as string[];
          response.data.data.map((item: any) => {
            if (item?.["TR_MODULE_DESCRIPTION"]) {
              allowedRoutes.push(item?.["TR_MODULE_DESCRIPTION"]);
            }
          });
          dispatch(setTrModel(allowedRoutes));
        }else{
          localStorage.clear();
          navigate("/login");
        }
      };

    return (
        <div className="flex flex-row relative h-screen items-center">
            <div className="flex w-full md:w-1/2 md:z-10">
            {
                isAdmin ? <LoginSSOForm onAuthenticate={authenticateUser} onAuthenticateFail={authenticateFail}/> : <LoginForm onAuthenticate={authenticateUser} onAuthenticateFail={authenticateFail}/>
            }
                
            </div>
            <div className="hidden md:flex w-full md:w-1/2 md:z-10">
                <img
                className="object-contain h-full w-full"
                    src={thinkriskLaptop}
                    alt="thinkrisk-laptop"
                />
            </div>
            <img
                className="invisible md:visible absolute right-0 object-cover h-screen w-screen"
                src={thinkriskBackground}
                alt="thinkrisk-background"
            ></img>
            <AlertComponent
                openAlert={openAlert}
                handleClose={handleAlertClose}
                message={alertMessage}
                vertical={"bottom"}
                horizontal={"center"}
            />
        </div>
    );
};

export default LoginPage;
