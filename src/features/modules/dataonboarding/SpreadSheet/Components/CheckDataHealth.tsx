import {
  Paper,
  Stack,
  Button,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Link,
  CircularProgress,
} from "@mui/material";
import { object } from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../../api/axios";
import PassLogo from "../../../../../assets/pass.svg";
import FailLogo from "../../../../../assets/fail.svg";
export interface Props {
  setActiveStep(activeStep: number): void;
  setIsShowMap: any;
  setIsShowCheckDataHealth: any;
  dataHealthMsg: string;
  srcRows: any;
  mappingPayload: any
  mappingConfig: any;
  UniqueId: any;
  healthReportData: any;
  status: any;
}


const CheckDataHealth = (props: Props) => {

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 200,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const navigate = useNavigate();
  const Axios = axios;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [result, setResult] = useState<any>({});
  const [mappingValue, setMappingValue] = useState<any[]>([])
  const [loading, setIsLoading] = useState(false);
  const [isMappingError, setIsMappingError] = useState(false);
  const [validRecords, setValidRecords] = useState<any>({ "entries": 0 })
  const [invalidRecords, setInvalidRecords] = useState<any>({ "entries": 0 })

  const handleGoToConfig = () => {
    //window.location.replace("https://cloudqa.thinkrisk.ai/configuration");
    navigate("/home/configurations/gl");
  };
  const handleGoToManagementTable = () => {
    navigate("/home/gl-transactions-data-onboarding-management-table");
  };
  const ERROR_FILE_DOWNLOAD = 'v1/je/csvonboard';

  const handleBack = () => {
    props.setActiveStep(1);
    props.setIsShowCheckDataHealth(false);
    props.setIsShowMap(true);
  };

  const dowloadErrorFile = async () => {
    const PRINT_TOKEN = 'v1/print/token'
    const REACT_APP_BASE_URL = "https:" + "//" + window.location.hostname + ":8443/public/index.php/";

    // const url = "Error_File_GL_2022_2000_healthy.csv";
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', 'myfile.csv');
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // let formData = new FormData();
    // formData.append('id', props.UniqueId);
    try {
      const printTokenresponse = await Axios.get(PRINT_TOKEN, {
        headers: {
          Authorization: localStorage.getItem(
            "TR_Token"
          ) as string,
        },
      });
      window.open(`${REACT_APP_BASE_URL}v1/print/${printTokenresponse.data.data.Token}/csvonboard?id=${props.UniqueId}`)
      // const errorFile = await Axios.post(
      //   ERROR_FILE_DOWNLOAD,
      //   formData,
      //   {
      //     headers: {
      //       Authorization: localStorage.getItem(
      //         "TR_Token"
      //       ) as string,
      //     },
      //   }
      // );

    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }
  function removeEmptyValues(obj: { [s: string]: unknown; } | ArrayLike<unknown>) {
    const entries = Object.entries(obj);
    const filteredEntries = entries.filter(([key, value]) => value !== "");
    const filteredObj = Object.fromEntries(filteredEntries);
    return filteredObj;
  }
  useEffect(() => {
    if (props.healthReportData) {
      let payload = props.mappingPayload
      // let config = props.mappingConfig
      const filteredObj = removeEmptyValues(payload);
      // const filteredObj1 = removeEmptyValues(config);
      const result = { ...filteredObj };
      let mappingValue = Object.values(result);
      let newMappingArray: any[] = [];
      mappingValue?.map((errorItem: any, index: number) => {
        const hasValue = props.healthReportData?.find((item: { srcName: any; }) => item.srcName === errorItem);
        if (hasValue) {
          let rowData: any = {};
          rowData.srcName = hasValue.srcName;
          if (hasValue?.checks?.[0] === undefined) {
            rowData.reports = [{ pass: true, reportText: 'Data quality check is passed' }];
          }
          if (hasValue?.checks?.length) {
            let checkData: any[] = [];
            hasValue.checks?.map((checkItem: any, index: number) => {
              let keys = Object.keys(checkItem);
              keys.map((val: any) => {
                let Obj = {
                  pass: (val.toString().includes('_PASS')) ? true : false,
                  reportText: checkItem[val]
                }
                if (val !== 'rows') {
                  checkData.push(Obj);
                }
              })
            });
            rowData.reports = [...checkData];
          }
          newMappingArray.push(rowData)
        }
        else {
          let rowData: any = {};
          rowData.srcName = errorItem;
          rowData.reports = [{ pass: true, reportText: 'null' }];
          newMappingArray.push(rowData);
        }
      });
      setMappingValue([...newMappingArray]);
    }
    if (props.healthReportData === undefined) {
      setIsMappingError(true)
    }
  }, [props.healthReportData]);


  const Records = async () => {
    const VALIDATE_DATA = `v1/je/errorSuccesCount?id=${props.UniqueId}`
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    try {
      setIsLoading(true)
      const getvalidateDataApiCallResponse = await Axios.get(
        VALIDATE_DATA,
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        }
      );
      console.log(getvalidateDataApiCallResponse, "getvalidateDataApiCallResponse")
      const resp_data = getvalidateDataApiCallResponse.data.data.GL[0];

      // const invoiceCounts = resp_data.ERROR_COUNT;
      // const entriesCounts = resp_data.SUCCESS_COUNT;

      setValidRecords({ "entries": resp_data.SUCCESS_COUNT, })
      setInvalidRecords({ "entries": resp_data.ERROR_COUNT, })
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)

    }
    catch (err: any) {
      console.log(err.response, "error")
      if (err.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    Records()
  }, [])

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          "& > :not(style)": {
            m: 1,
            width: 268,

          },
        }}
      >
        {/* <Paper elevation={3} sx={{ padding: 2 }}>
                    <p style={{ fontWeight: "bold" }}>Total Record Ingested</p>
                    <p>{props.dataHealthMsg === "Data File is not compliant" ? 0 : props.srcRows.length}</p>
                </Paper> */}

        <Paper elevation={3} sx={{ padding: 2 }}>
          <p style={{ fontWeight: "bold" }}>Total Valid Records
            <span style={{ marginLeft: '2vw' }}>
              {loading == true
                ?
                <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                :
                ''
              }
            </span>
          </p>
          <p>GL Entries : {validRecords.entries}</p>
          {/* <p>Invoices Open and Close : {validRecords.invoice}</p> */}
        </Paper>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <p style={{ fontWeight: "bold" }}>Total Invalid Records <span style={{ marginLeft: '2vw' }}>
            {loading == true
              ?
              <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
              :
              ''
            }
          </span></p>
          {/* <p>{props.dataHealthMsg === "Data File is not compliant" ? props.srcRows.length : 0}</p> */}
          <p>GL Entries : {invalidRecords.entries}</p>
          {/* <p>Invoices Open and Close : {invalidRecords.invoice}</p> */}
        </Paper>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& > :not(style)": {
            m: 1,
            width: '65vw',
            height: 'auto',
          },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: 2,
            backgroundColor: props.status == 'Failed' ? 'red' : 'green',
            color: 'white'
          }}
        >
          <div className="font-roboto">Data Quality Check {props.status}</div>
        </Paper>
      </Box>
      <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        </div><TableContainer component={Paper} sx={{ width: '68vw', margin: 'auto', marginTop: '1.5vh', maxHeight: '53vh' }}>
          <Table aria-label="simple table" stickyHeader sx={{ border: '1px solid gray' }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 100 }} sx={{ paddingX: '16px', paddingY: '8px', textAlign: 'left', fontWeight: 'bold', backgroundColor: 'skyblue', borderRight: '1px solid gray' }}>SI . No</TableCell>
                <TableCell align="right" style={{ width: '15vw' }} sx={{ paddingX: '16px', paddingY: '8px', textAlign: 'left', fontWeight: 'bold', backgroundColor: 'skyblue', borderRight: '1px solid gray' }}>Field List</TableCell>
                <TableCell align="right" sx={{ paddingX: '16px', paddingY: '8px', textAlign: 'left', fontWeight: 'bold', backgroundColor: 'skyblue', borderRight: '1px solid gray' }}>Health Report</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {mappingValue?.map((row: any, index: any) => (
                <TableRow key={index}
                >
                  <>
                    <TableCell sx={{ borderRight: '1px solid gray' }}>{index + 1}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid gray' }}>{row.srcName}</TableCell>
                    <TableCell>
                      {row?.reports?.map((reportData: any, index: number) => (
                        <div key={index} className="flex flex-row mt-4">

                          <span className="flex w-1/12 mt-0"><img width={18} height={18} src={reportData.pass ? PassLogo : FailLogo} alt="pass_or_fail_logo" /></span> <span className="flex w-11/12 my-auto">{reportData.reportText}</span>

                        </div>
                      ))}
                    </TableCell>
                  </>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Link href="#" onClick={dowloadErrorFile}>Download Error File</Link>
        </div>
      </>

      <Stack
        direction="row"
        spacing={2}
        sx={{ display: "flex", margin: "auto" }}
      >
        <Button
          sx={{ borderRadius: "10px", textTransform: "capitalize" }}
          variant="contained"
          onClick={handleBack}
        >
          Back
        </Button>
        {/* <Button
                    sx={{ borderRadius: "10px", textTransform: "capitalize" }}
                    disabled
                    variant="contained"
                >
                    View Data
                </Button>
                <Button
                    sx={{ borderRadius: "10px", textTransform: "capitalize" }}
                    disabled
                    variant="contained"
                >
                    View Invalid Data
                </Button> */}
        <Button
          sx={{ borderRadius: "10px", textTransform: "capitalize" }}
          variant="contained"
          onClick={handleGoToConfig}
        >
          Go To Configurations
        </Button>
        <Button
          sx={{ borderRadius: "10px", textTransform: "capitalize" }}
          variant="contained"
          onClick={handleGoToManagementTable}
        >
          Go To Management Table
        </Button>
      </Stack>
      {/* <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            > */}
      {/* <Box sx={style}>
                    <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Load Data ?
                    </Typography> */}
      {/* <Typography
                        id="keep-mounted-modal-description"
                        sx={{ mt: 2 }}
                    >
                        <Stack direction="row" spacing={2}>
                            <Button
                                sx={{
                                    borderRadius: "10px",
                                    textTransform: "capitalize",
                                }}
                                onClick={() => setOpen(false)}
                                variant="contained"
                            >
                                Cancel
                            </Button>
                            <Button
                                sx={{
                                    borderRadius: "10px",
                                    textTransform: "capitalize",
                                }}
                                disabled
                                variant="contained"
                            >
                                Confirm
                            </Button>
                        </Stack>
                    </Typography> */}
      {/* </Box> */}
      {/* </Modal> */}
    </>
  );
};

export default CheckDataHealth;
