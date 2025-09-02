import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Papa from "papaparse";
import axios from "../../../../../api/axios";
import Dropzone from "react-dropzone";
import uploadCsvIcon from "../../../../../assets/upload_csv_icon.png";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../../../ui/alert-component/AlertComponent";

export interface Props {
    getHeads(data: any, dataRows: any): void;
    getSecondHeads(data: any, dataRows: any): void;
    setActiveStep(activeStep: number): void;
    setIsShowMap: any;
    setIsShowIngestData: any;
    setPreviousMapping(previousMappings: any[]): void;
    setUniqueId: any;
    setUniqueId1: any;
    setOpen: any;
    setJobID: any;
    setFileUploadApiRes: any
}

export default function Ingest(props: Props) {
    const navigate = useNavigate();
    const Axios = axios;
    const [activeStep, setActiveStep] = React.useState(0);
    const [isViewData, setIsViewData] = React.useState<any>(false);
    const [isBackBtn, setIsBackBtn] = React.useState<any>(false);
    const [parsedData, setParsedData] = React.useState<any>([]);
    const [secondParsedData, setSecondParsedData] = React.useState<any>([]);
    const [tableRows, setTableRows] = React.useState([]);
    const [secondTableRows, setSecondTableRows] = React.useState([]);
    const [values, setValues] = React.useState<any>([]);
    const [secondValues, setSecondValues] = React.useState<any>([]);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});
    const [isViewDataEnable, setIsViewDataEnable] = React.useState<any>(false);
    const [apiResUniqueId, setApiResUniqueId] = React.useState<any>();
    const [uploadMesg, setUploadMesg] = React.useState<any>("");
    const [isShowMesg, setIsShowMesg] = React.useState<any>(false);
    const [dropZoneMsg, setDropZoneMsg] = React.useState<string>("Drag & drop AP Transaction files here");
    const [secondDropZoneMsg, setSecondDropZoneMsg] = React.useState<string>("Drag & drop Invoice open or closed files here");
    const [fileData, setFileData] = React.useState<any>([]);
    const [secondFileData, setSecondFileData] = React.useState<any>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSecondFileLoading, setIsSecondFileLoading] = React.useState(false);

    const DATA_UPLOAD = "v1/ap/dataupload";

    const viewData = () => {
        setIsViewData(true);
    };

    // Handle stepper steps
    const handleStepperStep = () => {
        props.setActiveStep(activeStep + 1);
        props.setIsShowIngestData(false);
        props.setIsShowMap(true);
        props.setOpen(true)
    };

    // File1 upload functionalities
    const changeHandler = async (event: any) => {
        const fileName = event[0].name.split(".")
        const extension = fileName[fileName.length -1]
        
        if ((event[0].type === 'text/csv' || (event[0].type === 'application/vnd.ms-excel' && extension === 'csv') ) &&  event[0].name.length > 32)  {
            setDropZoneMsg("Please limit the file name to 32 characters");
            setIsViewDataEnable(false);
            setIsShowMesg(false);
        }
        else if (event[0].type === 'text/csv' || (event[0].type === 'application/vnd.ms-excel' && extension === 'csv') ) {
            Papa.parse(event[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const rowsArray: any = [];
                    const valuesArray: any = [];

                    // Iterating data to get column name and their values
                    results.data.map((d: any) => {
                        rowsArray.push(Object.keys(d));
                        valuesArray.push(Object.values(d));
                    });
                    // Parsed Data Response in array format
                    //setParsedData(results.data);
                    // Filtered Column Names
                    setTableRows(rowsArray[0]);
                    props.getHeads(rowsArray[0], results.data);

                    // Filtered Values
                    setValues(valuesArray);
                    setDropZoneMsg(event[0].path + " is ready to upload");

                },
            });
            setFileData(event[0]);
        } else {
            setDropZoneMsg("Please upload csv file only");
            setIsViewDataEnable(false);
            setIsShowMesg(false);

        };
    };

    // File2 upload functionalities
    const changeSecondFileHandler = async (event: any) => {
        const fileName = event[0].name.split(".")
        const extension = fileName[fileName.length -1]
        if ((event[0].type === 'text/csv' || (event[0].type === 'application/vnd.ms-excel' && extension === 'csv') ) &&  event[0].name.length > 32)  {
            setSecondDropZoneMsg("Please limit the file name to 32 characters");
            setIsViewDataEnable(false);
            setIsShowMesg(false);
        }
        else if (event[0].type === 'text/csv' || (event[0].type === 'application/vnd.ms-excel' && extension === 'csv') ) {
            Papa.parse(event[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const rowsArray: any = [];
                    const valuesArray: any = [];

                    // Iterating data to get column name and their values
                    results.data.map((d: any) => {
                        rowsArray.push(Object.keys(d));
                        valuesArray.push(Object.values(d));
                    });
                    // Parsed Data Response in array format
                    //setSecondParsedData(results.data);
                    // Filtered Column Names
                    setSecondTableRows(rowsArray[0]);
                    props.getSecondHeads(rowsArray[0], results.data);

                    // Filtered Values
                    setSecondValues(valuesArray);
                    setSecondDropZoneMsg(event[0].path + " is ready to upload");
                },
            });
            setSecondFileData(event[0]);
        } else {
            setSecondDropZoneMsg("Please upload csv file only");
            setIsViewDataEnable(false);
            setIsShowMesg(false);

        };
    };

    // File1 nad File2 upload functionality
    const uploadHandler = async () => {
        setIsLoading(true);
        setIsShowMesg(false);
        let formData = new FormData();
        formData.append("datafile", fileData);
        formData.append("datafile2", secondFileData);
        formData.append("datamodule", "AP");
        formData.append("uniqueId", JSON.stringify(new Date()));
        try {
            const getDataUploadResponse = await Axios.post(
                DATA_UPLOAD,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            let dataUploadRes = getDataUploadResponse?.data?.data.configs
            props.setFileUploadApiRes(dataUploadRes)
            let tempPreviousMapping: any[] = [];
            if (getDataUploadResponse?.data?.data?.records?.length) {
                getDataUploadResponse?.data?.data?.records.forEach((record: any) => {
                    let Obj = {
                        value: record.TR_FIELDNAME,
                        key: record.SOURCE_FIELDNAME,
                    };
                    tempPreviousMapping.push(Obj);
                });
                props.setPreviousMapping([...tempPreviousMapping]);
            }
            props.setUniqueId(getDataUploadResponse?.data.data.FILE_NAME.split(",")[1]);
            props.setUniqueId1(getDataUploadResponse?.data.data.FILE_NAME.split(",")[1]);
            props.setJobID(getDataUploadResponse?.data.data.id);
            // setApiResUniqueId(getDataUploadResponse?.data.data);
            // setDropZoneMsg(getDataUploadResponse?.data.data);
            // setIsViewDataEnable(true);
            setIsShowMesg(true);
            setIsLoading(false);
            setUploadMesg(getDataUploadResponse?.data.message === "response.upload_successfull" ? "Uploaded Successfully" : "Upload Failed.");
            // setIsLoading(false);
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }
    return (
        <>
            {!isViewData || isBackBtn ? (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        "& > :not(style)": {
                            width: 560,
                            height: "100% ",
                            borderRadius: "20px",
                            padding: 1,
                        },
                    }}
                >
                    <Paper elevation={3}>
                        <div
                            style={{
                                paddingLeft: 16,
                                paddingRight: 16,
                                paddingTop: 16,
                                paddingBottom: 8,
                                fontWeight: "bold",
                            }}
                            className="font-roboto text-2xl"
                        >
                            Ingest Data
                        </div>
                        <span
                            style={{
                                paddingLeft: 16,
                                paddingRight: 16,
                                paddingTop: 8,
                                paddingBottom: 16,
                                fontWeight: "normal",
                            }}
                            className="font-roboto text-xs"
                        >
                            Upload a CSV to import data
                        </span>
                        <Paper sx={{ height: "13vh", margin: 2 }} elevation={0}>
                            <div className="flex flex-row w-full">
                                <div className="flex w-1/2">
                                    <Dropzone
                                        onDrop={(acceptedFiles) => {
                                            changeHandler(acceptedFiles);
                                        }
                                        }
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}
                                                style={{
                                                    border: "3px dotted skyblue",
                                                    padding: 16,
                                                }}
                                            >
                                                <div >
                                                    <input {...getInputProps()} />
                                                    <div className="text-center">
                                                        <img
                                                            src={uploadCsvIcon}
                                                            alt="upload_csv_icon"
                                                        />
                                                        {/* {!isLoading?
                                              <img
                                              src={uploadCsvIcon}
                                              alt="upload_csv_icon"
                                              /> :
                                              <CircularProgress size={20} />
                                              } */}
                                                        <p className={`font-roboto ${dropZoneMsg === 'Drag & drop AP Transaction files here'  ? 'text-black' : 'text-green-500'}`}>
                                                            {dropZoneMsg}

                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Dropzone>
                                </div>
                                <div className="flex w-1/2">
                                    <Dropzone


                                        onDrop={(acceptedFiles) => {
                                            changeSecondFileHandler(acceptedFiles);
                                        }
                                        }
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}
                                                style={{
                                                    border: "3px dotted skyblue",
                                                    padding: 16,
                                                }}
                                            >
                                                <div >
                                                    <input {...getInputProps()} />
                                                    <div className="text-center">
                                                        <img
                                                            src={uploadCsvIcon}
                                                            alt="upload_csv_icon"
                                                        />
                                                        {/* {!isSecondFileLoading?
                                              <img
                                              src={uploadCsvIcon}
                                              alt="upload_csv_icon"
                                              /> :
                                              <CircularProgress size={20} />
                                              } */}
                                                        <p className={`font-roboto ${secondDropZoneMsg === 'Drag & drop Invoice open or closed files here' ? 'text-black' : 'text-green-500'}`}>
                                                            {secondDropZoneMsg}

                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Dropzone>
                                </div>
                            </div>

                            <div>
                                {" "}
                                <>
                                    {isShowMesg ? (
                                        <div
                                            className={`w-full ${uploadMesg ===
                                                "Uploaded Successfully"
                                                ? "text-green-600"
                                                : "text-red-500"
                                                } font-roboto text-center pt-4`}
                                        >
                                            {" "}
                                            {uploadMesg}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </>
                                <>
                                    {isLoading ? (
                                        <div
                                            className={`w-full font-roboto text-center pt-4`}
                                        >
                                            <CircularProgress />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </>
                            </div>
                            <div className="font-roboto text-xs pt-4">
                                <strong>Remarks:</strong>Do not use any kind of
                                symbols / special characters in heading of
                                uploading file.
                            </div>

                            <hr />
                            <Stack
                                direction="row"
                                spacing={2}
                                style={{
                                    display: "flex",
                                    float: "right",
                                    marginTop: "2%",
                                    // align
                                }}
                            >
                                {/* {true?
                                             <CircularProgress size={20} /> :
                                              null
                                              } */}
                                <Button
                                    sx={{
                                        borderRadius: "10px",
                                        borderColor: "#7F7F7F",

                                    }}
                                    variant="contained"
                                    onClick={uploadHandler}
                                    disabled={secondDropZoneMsg !== 'Drag & drop Invoice open or closed files here'  && dropZoneMsg !== 'Drag & drop AP Transaction files here' ? false : true}
                                >
                                    Upload
                                </Button>
                                <Button
                                    sx={{ borderRadius: "10px" }}
                                    variant="contained"
                                    onClick={handleStepperStep}
                                    disabled={uploadMesg ===
                                        "Uploaded Successfully" ? false : true}
                                >
                                    Next
                                </Button>
                            </Stack>
                        </Paper>
                    </Paper>
                </Box>
            ) : (
                <>
                    <TableContainer
                        sx={{
                            maxWidth: "65vw",
                            margin: "auto",
                            maxHeight: "54vh",
                            overflow: "scroll",
                            marginTop: "-2vh",
                        }}
                        component={Paper}
                    >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {tableRows?.map((header: any) => (
                                        <TableCell
                                            sx={{
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                backgroundColor: "skyblue",
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {values.map(
                                    (
                                        value: any[],
                                        index: React.Key | null | undefined
                                    ) => {
                                        return (
                                            <TableRow key={index}>
                                                {value
                                                    .slice(1, 100)
                                                    .map((val, i) => {
                                                        return (
                                                            <TableCell
                                                                key={String(
                                                                    i
                                                                ).concat(val)}
                                                            >
                                                                {val}
                                                            </TableCell>
                                                        );
                                                    })}
                                            </TableRow>
                                        );
                                    }
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            display: "flex",
                            margin: "auto",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "-9vh",
                        }}
                    >
                        <Button
                            sx={{
                                borderRadius: "10px",
                                textTransform: "capitalize",
                                padding: 1,
                                minWidth: "6vw",
                            }}
                            variant="contained"
                            onClick={() => setIsBackBtn(true)}
                        >
                            Back
                        </Button>
                    </Stack>
                    
                </>
            )}
        </>
    );
}
