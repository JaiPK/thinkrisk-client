import axios from "../../api/axios";
import CryptoJS from "crypto-js";

const encryptQuery = (query: string) => {
  var derived_key = CryptoJS.enc.Base64.parse("dDFOayNSMXNLXzBfZDB3bkwwYWQhMDEyMzQ1Njc4OSE=");
  var iv = CryptoJS.enc.Utf8.parse("1234567890123412");
  var payload = CryptoJS.AES.encrypt(query, derived_key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
  }).toString();
  return payload
}

export const downloadExcel = async (token: any, filters: any, api: any, info?: any, module?: any) => {
  let url = `v1/excel/${token}/${api}?filters=${encodeURIComponent(JSON.stringify(filters))}&query=1`
  axios.get(url).then((response: any) => {
    window.open(`${process.env.REACT_APP_ML_URL}/download_file?query=${encodeURIComponent(encryptQuery(response.data.query))}&api=${info}&type=excel&module=${module}`)
    console.log(response)
  }).catch((error: any) => {
    console.log(error)
  })
}

export const downloadCSV = async (token: any, filters: any, api: any, info?: any, module?: any) => {
  let url = `v1/print/${token}/${api}?filters=${encodeURIComponent(JSON.stringify(filters))}&query=1`
  axios.get(url).then((response: any) => {
    window.open(`${process.env.REACT_APP_ML_URL}/download_file?query=${encodeURIComponent(encryptQuery(response.data.query))}&api=${info}&type=csv&module=${module}`)
    console.log(response)
  }).catch((error: any) => {
    console.log(error)
  })
}