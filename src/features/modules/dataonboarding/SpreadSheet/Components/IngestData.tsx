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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Props {
  getHeads(data: any, dataRows: any): void;
  setActiveStep(activeStep: number): void;
  setIsShowMap: any;
  setIsShowIngestData: any;
  setUniqueId: any;
  setOpen: any;
  setPreviousMapping(previousMappings: any[]): void;
  setUniqIden: any;
  setFileUploadApiRes: any
}

export default function Ingest(props: Props) {
  const Axios = axios;
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = React.useState(0);
  const [isViewData, setIsViewData] = React.useState<any>(false);
  const [isBackBtn, setIsBackBtn] = React.useState<any>(false);
  const [parsedData, setParsedData] = React.useState<any>([]);
  const [tableRows, setTableRows] = React.useState([]);
  const [values, setValues] = React.useState<any>([]);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [isViewDataEnable, setIsViewDataEnable] = React.useState<any>(false);
  const [apiResUniqueId, setApiResUniqueId] = React.useState<any>();
  const [uploadMesg, setUploadMesg] = React.useState<any>("");
  const [isShowMesg, setIsShowMesg] = React.useState<any>(false);
  const [dropZoneMsg, setDropZoneMsg] = React.useState<string>(
    "Drag & drop some files here,or click to select files"
  );
  const [previousMapping, setPreviousMapping] = useState<any[]>([]);
  const [uniqueIdKey, setUniqueIdKey] = useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const DATA_UPLOAD = "v1/je/dataupload";

  //Setup boolean for showing the data's
  const viewData = () => {
    setIsViewData(true);
  };

  //View headers with data
  const handleStepperStep = () => {
    props.setActiveStep(activeStep + 1);
    props.setOpen(true);
    props.setIsShowIngestData(false);
    props.setIsShowMap(true);
  };

  //File upload fuctionalities and getting header
  const changeHandler = async (event: any) => {
    if (event[0].type === 'text/csv' &&  event[0].name.length > 32)  {
      setDropZoneMsg("Please limit the file name to 32 characters");
      setIsViewDataEnable(false);
      setIsShowMesg(false);
     }
   else if (event[0].type === "text/csv") {
      Papa.parse(event[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rowsArray: any = [];
          const valuesArray: any = [];
          results.data.map((d: any) => {
            rowsArray.push(Object.keys(d));
            valuesArray.push(Object.values(d));
          });

          // Parsed Data Response in array format
          setParsedData(results.data);
          // Filtered Column Names
          setTableRows(rowsArray[0]);
          props.getHeads(rowsArray[0], results.data);

          // Filtered Values
          setValues(valuesArray);
        },
      });
      setIsLoading(true);
      let formData = new FormData();
      formData.append("datafile", event[0]);
      formData.append("datamodule", "GL");
      formData.append("uniqueId", JSON.stringify(new Date()));
      try {
        const getDataUploadResponse = await Axios.post(DATA_UPLOAD, formData, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
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
        props.setUniqueId(getDataUploadResponse?.data.data.id);
        setApiResUniqueId(getDataUploadResponse?.data.data.id);
        setDropZoneMsg(
          getDataUploadResponse?.data.message === "response.upload_successfull"
            ? `${getDataUploadResponse?.data.data.FILE_NAME}`
            : "Upload Failed."
        );
        setIsViewDataEnable(true);
        setIsShowMesg(true);
        setUploadMesg(
          getDataUploadResponse?.data.message === "response.upload_successfull"
            ? "Uploaded Successfully"
            : "Upload Failed."
        );
        setIsLoading(false);
      } catch (error: any) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setIsLoading(false);
      }
    } else {
      setDropZoneMsg("Please upload csv file only");
      setIsViewDataEnable(false);
      setIsShowMesg(false);
    }
  };

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
              <Dropzone
                onDrop={(acceptedFiles) => {
                  changeHandler(acceptedFiles);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <section
                    {...getRootProps()}
                    style={{
                      border: "3px dotted skyblue",
                      padding: 16,
                    }}
                  >
                    <div>
                      <input {...getInputProps()} />
                      <div className="text-center">
                        {!isLoading ? (
                          <img src={uploadCsvIcon} alt="upload_csv_icon" />
                        ) : (
                          <CircularProgress size={20} />
                        )}
                        <p className="font-roboto">{dropZoneMsg}</p>
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>

              <div>
                {" "}
                <>
                  {isShowMesg ? (
                    <div
                      className={`w-full ${uploadMesg === "Uploaded Successfully"
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
              </div>
              <div className="font-roboto text-xs pt-4">
                <strong>Remarks:</strong>Do not use any kind of symbols /
                special characters in heading of uploading file.
              </div>

              <hr />
              <Stack
                direction="row"
                spacing={2}
                style={{
                  display: "flex",
                  float: "right",
                  marginTop: "2%",
                }}
              >
                <Button
                  sx={{
                    borderRadius: "10px",
                    borderColor: "#7F7F7F",
                    color: "#7F7F7F",
                  }}
                  variant="outlined"
                  disabled={isViewDataEnable == false}
                  onClick={viewData}
                >
                  View Data
                </Button>
                <Button
                  sx={{ borderRadius: "10px" }}
                  variant="contained"
                  disabled={isViewDataEnable == false}
                  onClick={handleStepperStep}
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
                  (value: any[], index: React.Key | null | undefined) => {
                    return (
                      <TableRow key={index}>
                        {value.slice(1, 100).map((val, i) => {
                          return (
                            <TableCell key={String(i).concat(val)}>
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
      {/* <CSVParser /> */}
    </>
  );
}
