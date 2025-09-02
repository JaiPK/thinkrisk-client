import ThinkriskLogo from "../../assets/cropped-Logo_black.webp";
import EmailLogo from "../../assets/Email.svg";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useEffect, useState } from "react";

const GET_VERIFY_EMAIL_URL = "v1/emailverify";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing");
  const [verificationStage, setVerificationStage] = useState(1);
  const queryParameters = new URLSearchParams(window.location.search);
  const token = queryParameters.get("token");

  const Axios = axios;
  const navigateToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const validateToken = async (token: string) => {
      let formData = new FormData();
      formData.append("token", token);
      try {
        const response = await Axios.post(GET_VERIFY_EMAIL_URL, formData, 
        //   {
        //   headers: {
        //     Authorization: localStorage.getItem("TR_Token") as string,
        //   },
        // }
        );
        if (response.data.error) {
          //set fail
          setVerificationStage(3);
          setMessage(response.data.message);
        } else {
          //set success
          setVerificationStage(2);
          setMessage(response.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (token !== null && token !== undefined) {
      validateToken(token);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex bg-[#f2f2f2] items-center justify-center">
      <div className="flex flex-col bg-white w-full md:w-1/3 p-7 items-center justify-center gap-3">
        <div>
          <img
            className="w-full md:w-32 object-contain min-h-0"
            src={ThinkriskLogo}
            alt="thinkrisk-logo"
          />
        </div>
        <div>
          <img
            className="w-full md:w-48 object-contain min-h-0"
            src={EmailLogo}
            alt="thinkrisk-logo"
          />
        </div>
        <div
          className={`font-roboto text-md ${
            verificationStage === 3
              ? "text-red-500"
              : verificationStage === 2
              ? "text-green-600"
              : "text-black"
          }`}
        >
          {message}
        </div>
        <div>
          <button
            className="w-32 border border-solid border-white bg-sky-500 rounded-md py-2 text-white font-raleway font-semibold cursor-pointer disabled:bg-slate-400 disabled:cursor-auto"
            onClick={navigateToLogin}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
