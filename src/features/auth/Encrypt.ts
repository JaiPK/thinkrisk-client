import CryptoJS from "crypto-js";

const environment = {
    production: true,
    api: {
        base:
            "https:" + "//" + window.location.hostname + ":8443/public/index.php/",
    },
    AES_KEY:process.env.REACT_APP_AES_KEY ?? 't1Nk#R1sK_0',
    adRedirectUrl: "https:" + "//" + window.location.hostname + "/dashboard",
    msalClientId:process.env.REACT_APP_msalClientId ?? 'c4b631ae-65f6-461c-81b6-b20787fe54af',
    msalTenentId:process.env.REACT_APP_msalTenentId ?? '97987208-1fc0-4130-92d6-08a8417d81b5'
};
export const Encrypt = (str: string) => {
    let key_string=environment.AES_KEY.toUpperCase()
        let key = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(key_string).toString());//Secret key
        let iv= CryptoJS.enc.Utf8.parse('1234567890123412');//vector iv
        let encrypted = CryptoJS.AES.encrypt(str, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
        return encrypted.toString();
}
