import * as React from 'react';
import { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TablePagination } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import axios from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import AlertComponent from '../../ui/alert-component/AlertComponent';


export default function ManagementTable(props: any) {

    const GET_SRC_List_GL = 'v1/je/getsrclist'
    const GET_SRC_LIST_AP = 'v1/ap/getsrclist'
    const GET_RUN_JOB_GL = 'v1/je/startvm'
    const GET_RUN_JOB_AP = 'v1/ap/startvm'

    const Axios = axios;
    const navigate = useNavigate();

    const [srcList, setSrcList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowLoader, setIsShowLoader] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [runJobApiRes, setRunJobApiRes] = useState<any>()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalCount, setTotalCount] = useState<any>(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isButtonDisable, setIsButtonDisable] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const GET_API = props.name === 'gl' ? GET_SRC_List_GL : GET_SRC_LIST_AP
    const GET_RUN_JOB = props.name === 'gl' ? GET_RUN_JOB_GL : GET_RUN_JOB_AP

    const getSrcList = async (pageInput?: number, perPageInput?: number) => {
        console.log("inputs: ", pageInput, perPageInput)
        try {
            setIsLoading(true)
            console.log(page,"page",pageInput)
            let pageAPI = pageInput !== null ? pageInput : page
            console.log(pageAPI,"pageAPI")
            let rowsPerPageAPI = perPageInput ? perPageInput : rowsPerPage
            let formData = new FormData();
            formData.append("page", String(pageAPI));
            formData.append("perpage", String(rowsPerPageAPI));
            const getSrcList = await Axios.post(
                GET_API,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
            setSrcList(getSrcList.data.records)
            setTotalCount(getSrcList.data.totalcount)
        } 
        catch (err:any) {
            if (err.response.status === 401) {
              localStorage.clear();
              navigate("/login");
          }
    }
}
    const RunJob = async (jobId: any, index: any) => {
        let formData = new FormData();
        formData.append("module", props.name === 'gl' ? "gl" : "ap");
        formData.append("uniqueId", jobId);
        // setTimeout(() => {
        //     setAlertMessage(`Job Id : ${jobId}, Failed to start. Please contact Admin.`)
        //     setOpenAlert(true)
        //     setIsButtonDisable(true)
        // }, 1000)

        try {
            setIsLoading(true)
            const getRunJob = await Axios.post(
                GET_RUN_JOB,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            setRunJobApiRes(getRunJob.data.data)
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
            setOpen(true);
            getSrcList(page, rowsPerPage);
        } catch (error: any) {
            // setIsShowLoader(false)
            setAlertMessage(`Job Id : ${jobId}, Failed to start. Please contact Admin.`)
            setOpenAlert(true)
            setTimeout(() => {
                setOpenAlert(false)
            }, 3000)
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }

    // const handleChangePage = (
    //     event: React.MouseEvent<HTMLButtonElement> | null,
    //     newPage: number
    // ) => {
    //     console.log(newPage, "newPage")
    //     setReviewPage(newPage);
    //     // riskUnderReview(null, newPage);
    // };
    // const handleChangeRowsPerPage = (
    //     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    // ) => {
    //     setReviewRowsPerPage(parseInt(event.target.value, 10));
    //     setReviewPage(0);
    //     // riskUnderReview(null, 0, parseInt(event.target.value, 10));
    // };

    useEffect(() => {
        getSrcList(0)
        window.scrollTo(0, 0)
    }, [])
    const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
        console.log(newPage,"newPage")
        setPage(newPage);
        getSrcList(Number(newPage));
    };

    const handleChangeRowsPerPage = (event: { target: { value: string | number; }; }) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        getSrcList(0, Number(event.target.value));
    };
    const handleRefresh = () => {
        getSrcList(page, rowsPerPage)
    }

    const handleAlertClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert(false);
    };
    return (
        <>
            <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '4vh' }}>{props.name == 'gl' ? 'GL Management Table' : 'Ap Management Table'}</p>
            <Stack direction='row' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleRefresh}><AutorenewIcon /></Button>
            </Stack>
            <TableContainer style={{ maxHeight: 450, overflow: 'auto' }}
                className="GLJotableContainer" >
                <div style={{ display: 'flex', justifyContent: 'center' }} className="LoaderClass">
                    {isLoading
                        ?
                        <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                        :
                        ''
                    }
                </div>
                <Table stickyHeader sx={{ overflow: 'auto', border: '1px solid whitesmoke', margin: 'auto' }} aria-label="simple table">
                    <TableHead >
                        <TableRow>
                            <TableCell align="center" width="5%">Job ID</TableCell>
                            <TableCell align="center" width="15%">Upload Date</TableCell>
                            <TableCell align="center">Filename</TableCell>
                            <TableCell align="center" width="12%">Status​</TableCell>
                            <TableCell align="right" width="10%">Created By​</TableCell>
                            <TableCell align="center" width="10%">Number Of Records​</TableCell>
                            <TableCell align="center" width="30%">Rules​​</TableCell>
                            <TableCell align="center" width="15%">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >

                        {srcList?.map((job: any, index: any) => (
                            <TableRow
                                key={job.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                            >
                                <TableCell component="th" scope="row" >
                                    {job.id}
                                </TableCell>
                                <TableCell align="center" >{job.CREATED_DATE.split(" ")[0]} &nbsp;  &nbsp; {job.CREATED_DATE.split(" ")[1]}</TableCell>
                                <TableCell align="center" >
                                    {job.FILE_NAME ? job.FILE_NAME.split("_")[1] : ""}

                                </TableCell>
                                <TableCell align="center">{job.MESSAGE}</TableCell>
                                <TableCell align="center" >{job.USER_NAME}</TableCell>
                                <TableCell align="center">{job.NUM_RECORDS}</TableCell>
                                <TableCell align="center" className='rulesStyle' width="40%">

                                    {job.RULES_ENABLED ? job.RULES_ENABLED.split("'").map((rule: any, i: any) => (<div key={i} className="bg-blue-500 text-white px-3 py-1 m-1 rounded-full">{rule}</div>)) : ""}</TableCell>
                                <TableCell align="center" width="10%"><Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ display: "flex", margin: "auto" }}
                                >
                                    <Button
                                        sx={{ borderRadius: "5px", textTransform: "capitalize", width: "auto" }}
                                        variant="contained"
                                        disabled={job.RUN_JOB !==1  || isButtonDisable}
                                        onClick={() => RunJob(job.id, index)}
                                    >
                                        Run job
                                    </Button>
                                </Stack>
                                </TableCell>

                            </TableRow>
                        ))
                        }

                        {srcList.length < 0
                            ?
                            <p style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>No Records Found</p>
                            :
                            ''
                        }

                        {/* {srcList.map((job: any, index: any) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                            >
                                <TableCell component="th" scope="row" >
                                    {job.id}
                                </TableCell>
                                <TableCell align="center" >{job.CREATED_DATE.split(" ")[0]} &nbsp;  &nbsp; {job.CREATED_DATE.split(" ")[1]}</TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center">{job.RULES_ENABLED}</TableCell>
                                <TableCell align="center"><Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ display: "flex", margin: "auto" }}
                                >
                                    <Button
                                        sx={{ borderRadius: "5px", textTransform: "capitalize", width: "auto" }}
                                        variant="contained"
                                        disabled={job.RUN_JOB == 0}
                                        onClick={() => RunJob(job.id, index)}
                                    >
                                        Run job
                                    </Button>
                                </Stack>
                                </TableCell>

                            </TableRow>
                        ))} */}
                    </TableBody>

                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25, 100]}
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {/* {"Use Google's location service?"} */}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {JSON.stringify(runJobApiRes)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <AlertComponent
                openAlert={openAlert}
                handleClose={handleAlertClose}
                message={alertMessage}
                vertical={"bottom"}
                horizontal={"center"}
                severity={"success"}
            />
        </>
    );
}