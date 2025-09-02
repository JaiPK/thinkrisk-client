import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Button,
    Typography,
    Box,
    Link,
    CircularProgress,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import axios from "../../../../../api/axios";
import PassLogo from '../../../../../assets/pass.svg'
import FailLogo from '../../../../../assets/fail.svg'



export interface Props {
    // getHeads(data: any, dataRows: any): void;
    setActiveStep(activeStep: number): void;
    setIsShowMap: any;
    setIsShowCheckDataHealth: any;
    dataHealthMsg: string;
    srcRows: any;
    mappingPayload: any;
    jobID: any;
    checkDataHealth: any
    status: any
}
const CheckDataHealth = (props: Props) => {
    console.log(props.status, "status")
    const Axios = axios;
    const [mappedVal, setmappedVal] = useState<any>()
    const [isMappingError, setIsMappingError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [entries, setEntries] = useState(0);
    const [invoices, setInvoices] = useState(0);
    const [validRecords, setValidRecords] = useState<any>({ "entries": 0, "invoice": 0 })
    const [invalidRecords, setInvalidRecords] = useState<any>({ "entries": 0, "invoice": 0 })
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
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleBack = () => {
        props.setActiveStep(1);
        props.setIsShowCheckDataHealth(false);
        props.setIsShowMap(true);
    };
    const handleGoToManagementTable = () => {
        navigate("/home/ap-transactions-data-onboarding-management-table");
    };
    const handleGoToConfig = () => {
        //window.location.replace("https://cloudqa.thinkrisk.ai/ap-configuration");
        navigate("/home/configurations/ap");
    };

    useEffect(() => {
    }, [props.dataHealthMsg])

    function removeEmptyValues(obj: { [s: string]: unknown; } | ArrayLike<unknown>) {
        const entries = Object.entries(obj);
        const filteredEntries = entries.filter(([key, value]) => value !== "");
        const filteredObj = Object.fromEntries(filteredEntries);
        return filteredObj;
    }
    const dowloadErrorFile = async (option: string) => {
        const PRINT_TOKEN = 'v1/print/token'
        const REACT_APP_BASE_URL = "https:" + "//" + window.location.hostname + ":8443/public/index.php/";


        try {
            const printTokenresponse = await Axios.get(PRINT_TOKEN, {
                headers: {
                    Authorization: localStorage.getItem(
                        "TR_Token"
                    ) as string,
                },
            });

            window.open(`${REACT_APP_BASE_URL}v1/print/${printTokenresponse.data.data.Token}/csvonboard?id=${props.jobID}&&file=${option}`);

        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }
    let apiRes: any = [
        {
            "trName": "ACCOUNTING_DOC",
            "srcName": "Financial Doc Id - PK",
            "checks": [
                `{
              "creditDebitBalance":"There are 1 accounting docs with imbalance recordsAccounting Doc IDs[115172656,115172656]",
              "creditDebitBalance1":"There are 2 accounting docs with imbalance recordsAccounting Doc IDs[115172656,115172656]"
            }`
            ]
        },
        {
            "trName": "DOC_TYPE",
            "srcName": "Document Type Id",
            "checks": ['{"nullCheck":"Null Check Failed"}']
        },
    ]
    useEffect(() => {
        if (props.checkDataHealth) {
            let Payload = props.mappingPayload
            const filteredObj = removeEmptyValues(Payload);
            let mappingValue = Object.values(filteredObj);
            let newMappingArray: any[] = [];
            mappingValue?.map((errorItem: any, index: number) => {
                const hasValue = props.checkDataHealth.find((item: { srcName: any; }) => item.srcName === errorItem);
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
                            console.log(keys, "keys")
                            keys.map((val: any) => {
                                console.log(val, "value")
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
                        console.log(rowData, "rowData")
                    }
                    newMappingArray.push(rowData);
                }
                else {
                    let rowData: any = {};
                    rowData.srcName = errorItem;
                    rowData.reports = ['null'];
                    newMappingArray.push(rowData);
                }
            });
            setmappedVal([...newMappingArray])
        }
        // if (props.checkDataHealth === undefined) {
        //     setIsMappingError(true)
        // }
    }, [props.checkDataHealth])

    const Records = async () => {
        const VALIDATE_DATA = `v1/je/errorSuccesCount?id=${props.jobID}`
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
          const resp_data = getvalidateDataApiCallResponse.data.data;

          const invoiceCounts = resp_data.invoice[0];
          const entriesCounts = resp_data.AP[0];

            setValidRecords({ "entries": entriesCounts.SUCCESS_COUNT, "invoice": invoiceCounts.SUCCESS_COUNT })
            setInvalidRecords({ "entries": entriesCounts.ERROR_COUNT, "invoice": invoiceCounts.ERROR_COUNT })
          setTimeout(() => {
            setIsLoading(false)
          }, 1000)

        }
        catch (err: any) {
          console.log(err.response,"error")
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
                            {isLoading == true
                                ?
                                <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                                :
                                ''
                            }
                        </span>
                    </p>
                    {/* <p>{props.dataHealthMsg === "Data File is not compliant" ? 0 : props.srcRows.length}</p> */}
                    <p>AP Entries : {validRecords.entries}</p>
                    <p>Invoices Open and Close : {validRecords.invoice}</p>
                </Paper>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <p style={{ fontWeight: "bold" }}>Total Invalid Records <span style={{ marginLeft: '2vw' }}>
                        {isLoading == true
                            ?
                            <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                            :
                            ''
                        }
                    </span></p>
                    {/* <p>{props.dataHealthMsg === "Data File is not compliant" ? props.srcRows.length : 0}</p> */}
                    <p>AP Entries : {invalidRecords.entries}</p>
                    <p>Invoices Open and Close : {invalidRecords.invoice}</p>
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
            {/* {isMappingError
                ?
                <div style={{ display: 'flex', justifyContent: 'center' }} >
                    <p style={{ color: 'red' }}>Error in mapping columns, please check the manual</p>
                </div>
                : */}

            <>
                <TableContainer component={Paper} sx={{ width: '68vw', margin: 'auto', marginTop: '1.5vh', maxHeight: '53vh' }}>
                    <Table aria-label="simple table" stickyHeader sx={{ border: '1px solid gray' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: 100 }} sx={{ textAlign: 'left', fontWeight: 'bold', backgroundColor: 'skyblue', borderRight: '1px solid gray' }}>SI . No</TableCell>
                                <TableCell align="right" style={{ width: '15vw' }} sx={{ textAlign: 'left', fontWeight: 'bold', backgroundColor: 'skyblue', borderRight: '1px solid gray' }}>Field List</TableCell>
                                <TableCell align="right" sx={{ textAlign: 'left', fontWeight: 'bold', backgroundColor: 'skyblue', borderRight: '1px solid gray' }}>Health Report</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mappedVal?.map((row: any, index: any) => (
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
                </TableContainer><div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '1.5vh' }}>
                    <Link href="#" onClick={() => dowloadErrorFile('entries')}>Download AP Entries Error File</Link>
                    <Link href="#" onClick={() => dowloadErrorFile('invoice')}>Download AP Invoices Error File</Link>
                </div>
            </>
            {/* } */}
            <Stack
                direction="row"
                spacing={2}
                sx={{ display: "flex", margin: "auto", marginTop: '5vh', marginBottom: '3vh' }}
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
            >
                <Box sx={style}>
                    <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Load Data ?
                    </Typography>
                    <Typography
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
                    </Typography>
                </Box>
            </Modal> */}
        </>
    );
}

export default CheckDataHealth;
