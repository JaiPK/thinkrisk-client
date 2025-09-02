import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { CircularProgress, Paper } from "@mui/material";
import { SelectPicker } from 'rsuite';
import { useDropzone } from "react-dropzone";
import PageIcon from '@rsuite/icons/Page';
import SearchDataLiveIcon from '@rsuite/icons/SearchDataLive';

import axios from "../../../api/axios";
import closeIcon from "../../../assets/close.svg";
import uploadsvg from "../../../assets/upload.svg";
import formatDate from '../../../shared/helpers/dateFormatter';
import numberSuffixPipe from '../../../shared/helpers/numberSuffixPipe';
import { getPath } from '../../../shared/helpers/getPath';



function HistoricalMgmt() {


  const navigate = useNavigate();

  const [client, setClient] = useState() as any;

  const [erp, setErp] = useState([]) as any[];
  const [currentErp, setCurrentErp] = useState({}) as any;

  const [exitingFiles, setEXistingFiles] = useState([]);
  const [dataFiles, setDataFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [histMgmtData, setHistMgmtData] = useState<any>({
    clientName: "",
    clientId: "",
    erpOptions: [],
    currentErp: {},
    existingFiles: [],
    dataFiles: [],
    historicalData: [{
      erp_name: null,
      total_records: null,
      time_range_end_date: null,
      time_range_start_date: null
    }],
    lastUpload: {
      erp_name: null,
      last_uploaded_record: null,
      time_range_end_date: null,
      time_range_start_date: null
    }
  });


  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xlsx']
    },
    multiple: true,
    onDrop: (acceptedFiles: any) => {
      setDataFiles((datafile) => datafile.concat(acceptedFiles));
    },
  });

  useEffect(() => {
    const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
    setClient(pathHistory["audits"])
  }, []);

  useEffect(() => {
    if (client) {
      getErpData();
      getHistoricalData();
    }
  }, [client]);


  //handle Erp changes
  let erpdata: { [key: string]: Object }[] = [];
  const handleErpDropdownChange = (e: any) => {
    setCurrentErp(e);
  };

  //get ERP data
  const getErpData = async () => {
    try {
      const response = await axios.get(`v1/client/${client?.client_id}`, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      if (response.data.erp_data) {
        response.data.erp_data.map((value: any) => {
          erpdata.push({ value: value.erp_id, label: value.erp_name });
        });
      }
      setErp(erpdata);
    } catch (error) {
      console.log(error);
    }
  }

  const getHistoricalData = async () => {
    try {
      const response = await axios.get(`v1/client/${client?.client_id}/historical`, {
        headers: { Authorization: localStorage.getItem("TR_Token") as string },
      });
      const { historicalData, lastUpload } = response.data || {};
      setHistMgmtData((prev: any) => ({
        ...prev,
        historicalData: historicalData?.length ? historicalData : prev.historicalData,
        lastUpload: lastUpload?.length ? lastUpload[0] : prev.lastUpload,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const removeFile = (filename: string) => {
    setDataFiles((files: any) => files.filter((file: any) => file.name != filename))
  }

  const handleUpload = async () => {
    setIsLoading(true);
    const formData = new FormData();
    dataFiles.forEach((file: any, index: number) => {
      formData.append("datafiles[]", file);
    });
    formData.append("erp_id", currentErp);
    formData.append("module", getPath.callListID().toString())
    try {
      const response = await axios.post(`v1/client/${client?.client_id}/createhistorical`, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
          ContentType: 'multipart/form-data',
        },

      });
      setIsLoading(false)
      navigate(-1);
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      justifyContent: "end"
    }}>
      <div className='m-7 md:w-auto flex flex-col gap-4' >
        <div className='flex gap-[16px] items-center mb'>
          <span style={{
            fontSize: "1.5rem",
            fontFamily: "Raleway",
            fontWeight: 500
          }}>
            Data Management
          </span>
          <span>-</span>
          <span style={{
            fontSize: "1.333rem",
            fontFamily: "Raleway",
            fontWeight: 600,
          }}>
            {client?.client_name}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className='flex flex-col xl:w-[50%] md:w-[60%] w-full'>
            <div className="flex justify-between items-center">
              <div className="dropDown1" style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "start",
                alignItems: "center",
                width: "100%",
                margin: "1.5rem 0",
              }}>
                <label
                  style={{
                    color: "black",
                    fontFamily: "Roboto",
                    fontWeight: 500,
                    fontSize: "16px",
                  }}
                >
                  ERP:
                </label>
                <SelectPicker
                  data={erp}
                  searchable={false}
                  onChange={handleErpDropdownChange}
                  style={{ width: "50%" }}
                  menuStyle={{ zIndex: 9999 }}
                  placeholder="Select ERP"
                />
              </div>
            </div>

            <div className='flex flex-col gap-8 w-full'>
              <div className='w-full p-3 shadow-lg rounded-xl' style={{
                border: "1px solid #8c8c8c5a",
              }}>
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  margin: "1rem 0",
                  alignItems: "center",
                }}>
                  <PageIcon style={{ fontSize: 25, color: "#1565c0", rotate: "180deg" }} />
                  <p style={{
                    fontFamily: "Roboto",
                    fontWeight: 500,
                    fontSize: "1.3rem",
                    color: "black"
                  }}>Overview</p>
                </div>
                {
                  histMgmtData.historicalData.map((data: any) => {
                    return (
                      <div className='flex mt-4 gap-8 '>
                        <div className='bg-[#F9FAFB]  p-3 rounded-xl w-1/4'>
                          <p style={{
                            fontFamily: "Roboto",
                            fontWeight: 500,
                            fontSize: "1rem",
                            color: "#8c8c8c"
                          }}>ERP Name</p>
                          <p style={{
                            fontFamily: "Roboto",
                            fontWeight: 500,
                            fontSize: "1.15rem",
                            color: "black"
                          }}>{data.erp_name || "-"}</p>
                        </div>
                        <div className='bg-[#F9FAFB]  p-3 rounded-xl w-1/4'>
                          <p style={{
                            fontFamily: "Roboto",
                            fontWeight: 500,
                            fontSize: "1rem",
                            color: "#8c8c8c"
                          }}>Total Records</p>
                          <p style={{
                            fontFamily: "Roboto",
                            fontWeight: 500,
                            fontSize: "1.15rem",
                            color: "black"
                          }}>{numberSuffixPipe(data.total_records) || "-"}</p>
                        </div>
                        <div className='bg-[#F9FAFB]  p-3 rounded-xl w-1/2'>
                          <p style={{
                            fontFamily: "Roboto",
                            fontWeight: 500,
                            fontSize: "1rem",
                            color: "#8c8c8c"
                          }}>Upload Range</p>
                          <p style={{
                            fontFamily: "Roboto",
                            fontWeight: 500,
                            fontSize: "1.15rem",
                            color: "black"
                          }}>{`${data.time_range_start_date ? formatDate(data.time_range_start_date) + " To " + formatDate(data.time_range_end_date) : "-"}`}</p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <div className='w-full p-3 shadow-lg rounded-xl' style={{
                border: "1px solid #8c8c8c5a",
              }}>
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  margin: "1rem 0",
                  alignItems: "center",
                }}>
                  <SearchDataLiveIcon style={{ fontSize: 25, color: "#1565c0", rotate: "180deg" }} />
                  <p style={{
                    fontFamily: "Roboto",
                    fontWeight: 500,
                    fontSize: "1.3rem",
                    color: "black"
                  }}>Latest Upload</p>
                </div>
                <div className='flex   gap-8 '>
                  <div className='bg-[#F9FAFB]  p-3 rounded-xl w-1/2'>
                    <p style={{
                      fontFamily: "Roboto",
                      fontWeight: 500,
                      fontSize: "1rem",
                      color: "#8c8c8c"
                    }}>Records Count</p>
                    <p style={{
                      fontFamily: "Roboto",
                      fontWeight: 500,
                      fontSize: "1.15rem",
                      color: "black"
                    }}>{numberSuffixPipe(histMgmtData.lastUpload.last_uploaded_record) || "-"}</p>
                  </div>
                  <div className='bg-[#F9FAFB]  p-3 rounded-xl w-1/2'>
                    <p style={{
                      fontFamily: "Roboto",
                      fontWeight: 500,
                      fontSize: "1rem",
                      color: "#8c8c8c"
                    }}>Last Upload Range</p>
                    <p style={{
                      fontFamily: "Roboto",
                      fontWeight: 500,
                      fontSize: "1.15rem",
                      color: "black"
                    }}>{`${histMgmtData.lastUpload.time_range_start_date ? formatDate(histMgmtData.lastUpload.time_range_start_date) + " To " + formatDate(histMgmtData.lastUpload.time_range_end_date) : "-"}`}</p>
                  </div>
                </div>
              </div>
              <div className='w-full'>
                <div className='p-3 shadow-lg rounded-xl  w-full ' style={{
                  border: "1px solid #8c8c8c5a",
                }}>
                  <div className="flex">
                    <div
                      style={{
                        fontSize: "16px",
                        fontFamily: "Roboto",
                        fontWeight: 500,
                        marginRight: "8px",
                        color: "black",
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <img src={uploadsvg} alt="" className='w-[25px] h-[25px] text-[#1565c0]' />
                      {/* <FileUploadOutlinedIcon style={{ fontSize: 35, color: "#1565c0" }} />   */}
                      <p style={{
                        fontFamily: "Roboto",
                        fontWeight: 500,
                        fontSize: "1.7rem",
                        color: "black"
                      }}>Upload data</p>
                    </div>
                    <span></span>
                  </div>
                  <Paper sx={{ margin: 2 }} elevation={0} style={{ width: "100%", marginLeft: 0 }}>
                    <div
                      {...getRootProps()}
                      style={{
                        border: "3px dotted #8c8c8c5a",
                        padding: 16,
                        background: "#F9FAFB"
                      }}
                    >
                      <div>
                        <input {...getInputProps()} />
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <div className='bg-[#F3F4F6] p-4 rounded-full'>
                            <img src={uploadsvg} className='w-[40px] h-[40px]' alt="upload_csv_icon" />
                          </div>
                          <p className="font-roboto" style={{ opacity: 0.5 }}>Drag & drop some files here,or click to select files</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ marginTop: '16px' }}>
                        {dataFiles.map((file: any) => {
                          return (
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '4px ' }}>
                              {file.name}
                              <div style={{ display: 'flex', fontSize: '13px', gap: '14px', color: 'crimson', textWrap: 'nowrap', alignItems: 'center' }}> {file?.message}
                                <img src={closeIcon} style={{ height: '14px', cursor: "pointer" }} alt="uploaded" onClick={() => removeFile(file.name)} />
                              </div>
                            </div>);
                        })}
                      </div>{" "}
                      <div style={{ marginTop: '16px' }}>
                        {
                          exitingFiles.length > 0 && <div style={{
                            fontSize: "1rem",
                            fontFamily: "Roboto",
                            fontWeight: 600,
                            marginBottom: "0.5rem",
                          }}> Uploaded Files:</div>
                        }
                        {exitingFiles.map((file: any) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "4px ",
                              }}
                            >
                              {file}
                            </div>
                          );
                        })}
                      </div>{" "}
                    </div>
                    <hr />
                  </Paper>
                </div>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                alignItems: "center",
                width: "100%",
              }}>
                <button
                  style={{
                    padding: "0.5rem 1.5rem",
                    fontSize: "1rem",
                    fontFamily: "Roboto",
                    fontWeight: 500,
                    background: "transparent",
                    border: "1px solid #1565C0",
                    color: "#1565C0",
                    borderRadius: "5px",
                  }}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: "0.5rem 1.5rem",
                    fontSize: "1rem",
                    fontFamily: "Roboto",
                    fontWeight: 500,
                    background: "#1565C0",
                    color: "white",
                    borderRadius: "5px",
                  }}
                  onClick={handleUpload}
                >
                  submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
      {
        isLoading &&
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress size={24} />
        </div>
      }
    </div>
  )
}

export default HistoricalMgmt



