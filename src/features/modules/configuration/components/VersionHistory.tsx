import React, { useEffect, useState } from "react";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import axios from "../../../../api/axios";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const VersionHistory = (props: any) => {

    // window.location.reload()
    const navigate = useNavigate();
    const Axios = axios

    const GET_MODULE_VERSIONS = 'v1/config/getmoduleversions';
    const SAVE_CHANGES = 'v1/config/restoremoduleversion';

    const [glModuleVersion, setGlModuleVersion] = useState<any>([]);
    const [expanded, setExpanded] = useState('');
    const [revisionData, setRevisionData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pathname, setPathname] = useState<any>()


    const getGlModuleVersion = async () => {

        let formData = new FormData();
        if (props.name === 'ap') {
            formData.append("module", "apframework");
        }
        else if (props.name === 'gl') {
            formData.append("module", "framework");
        }

        try {
            setIsLoading(true)
            const getGlModuleVersion = await Axios.post(
                GET_MODULE_VERSIONS,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },

                }
            )
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
            let apiRes = getGlModuleVersion.data.data
            let data = apiRes.slice(0, 4)
            setGlModuleVersion(getGlModuleVersion.data.data)
        } catch { }
    }
    useEffect(() => {
        // if(props.args?.selectingIndex==1)
        setTimeout(() => {

            getGlModuleVersion()
        }, 1000)
    }, [props.name])


    const handleChange = (panel: any) => (event: any, newExpanded: any) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleAccordionTableData = (revisionData: any, index: any) => {
        let dataSource: any = [];
        let data = JSON.parse(glModuleVersion[index].REVISIONDATA)
        data.forEach((element: any) => {
            dataSource.push({
                data: element.KEYNAME,
                value: element.KEYVALUE,
            });
        });
        setRevisionData(data)
    }

    const saveChangesApi = async (revisionId: any) => {
        let formData = new FormData();
        formData.append("revisionid", revisionId);
        try {
            const saveApiResc = await Axios.post(
                SAVE_CHANGES,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },

                }
            )

        }
        catch { }
    }
    const customColumnStyle = { maxWidth: "52vw", maxHeight: '5vh', overflow: 'auto' };


    return (
       
        <div style={{ height: '77vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2vh' }}>
                {isLoading == true
                    ?
                    <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                    :
                    ''
                }
            </div>
            {glModuleVersion?.map((version: any, index: number) => (
                <Accordion
                    key={index}
                    expanded={expanded === `panel${index}`}
                    onChange={handleChange(`panel${index}`)}
                    onClick={() => handleAccordionTableData(version.REVISIONDATA, index)}
                    style={{ maxHeight: '34vh', overflow: 'auto' }}

                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={'panel' + { index } + 'd - content'}
                        id={'panel' + { index } + 'd-header'}

                    >
                        <Typography sx={{ width: '23%', flexShrink: 0 }}> {version.CREATED_DATE.split(" ")[0]} &nbsp;  &nbsp; {version.CREATED_DATE.split(" ")[1]}</Typography>
                        <Typography sx={{ width: '63%', flexShrink: 0 }}>{version.USER_FIRST_NAME + " " + version.USER_LAST_NAME}</Typography>
                        <Typography><Stack spacing={2} direction="row">
                            <Button size="small" variant="contained" sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => saveChangesApi(version.CONFREVISIONID)}>Apply</Button>
                        </Stack>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table sx={{ maxWidth: "5px", maxHeight: '19vh', overflow: 'auto' }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>Key</TableCell>
                                        <TableCell align="left" style={customColumnStyle} sx={{ fontWeight: 'bold', overflow: 'auto' }} >Value</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {revisionData?.map((data: any) => {
                                        return (
                                            <>
                                                <TableRow sx={{ textAlign: 'left' }}>
                                                    <TableCell sx={{ textAlign: 'left' }}>{data?.KEYNAME}</TableCell>
                                                    <TableCell style={customColumnStyle} >{data?.KEYVALUE?.toString()}</TableCell>
                                                    <TableCell>{data?.STATUS === 1 ? 'Active' : 'Inactive'}</TableCell>
                                                </TableRow>
                                            </>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    )
}
export default VersionHistory;










