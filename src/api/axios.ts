import axios from "axios";
import { User } from "../shared/models/user";

export const isTokenValid = () => {
    let Obj = JSON.parse(localStorage.getItem('THR_USER') ?? '') as User;
    if(Obj){
        return Obj?.exp > Date.now() / 1000;
    }
    else{
        return false;
    }
}

export default axios
    .create({
        baseURL: "http:" + "//" + window.location.hostname + ":8443/public/index.php/",
        // headers: {
        //      Authorization: localStorage.getItem('TR_Token')
        // }
    });

// export const privateAxios = axios.create({
//         baseURL: "https:" + "//" + window.location.hostname + ":8443/public/index.php/",
//         headers: {
//              Authorization: localStorage.getItem('TR_Token')!
//         } 
//     });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {
        localStorage.removeItem('THR_USER');
        localStorage.removeItem('THR_Token');
        window.location.href = '/login';
    }
    //return Promise.reject(error);

  });