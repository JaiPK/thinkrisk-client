import { Button, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Switch from '@mui/material/Switch';

import { useEffect, useState } from "react";

import axios from "../../../api/axios";

import './ManageRoles.css'
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks";
import { updateOtherPage } from "../app-slice/app-slice";

import * as React from 'react';
import AlertComponent from "../../ui/alert-component/AlertComponent";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const ManageRoles = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [roles, setRoles] = useState<any>();
    const [rolesRbac, setRolesRbac] = useState<any>();
    const [rolesMapping, setRolesMapping] = useState<any>();
    const [isSwitch, setIsSwitch] = useState(false);
    const [updateMapData, setUpdateMapData] = useState({});
    const [roleId, setRoleId] = useState<any>();
    const [rolesRbacParseData, setRolesRbacParseData] = useState<any>();
    const [dataSource, setDataSource] = useState<any>([]);
    const [modifiedData, setModifiedData] = useState<any>([]);
    const [isShowMesg, setIsShowMesg] = useState(false);
    const [saveApiRes, setSaveApiRes] = useState('')
    const [isChecked, setIsChecked] = useState(false);
    const [updateDataSource, setUpdateDataSource] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [open, setOpen] = useState(false);

    const GET_ROLES = 'v1/role/getroles';
    const GET_RBAC = 'v1/role/rbac';
    const GET_ROLE_MAPPING = 'v1/role/getrolemapping'
    const UPDATE_ROLE_MAPPING = 'v1/role/setrolemapping'
    const Axios = axios;
    var name: any;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const getRoles = async () => {
        try {
            setIsLoading(true)
            const getUserRolesResponse = await Axios.get(
                GET_ROLES,
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
            }, 2000)
            setRoles(getUserRolesResponse.data.data)
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }

    }
    const getRbac = async () => {
        try {
            setIsLoading(true)
            const getUserRolesRbacResponse = await Axios.get(
                GET_RBAC,
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
            }, 2000)
            setRolesRbac(getUserRolesRbacResponse.data.data)
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }

    }
    const getRolesMapping = async () => {
        try {
            setIsLoading(true)
            const getUserRolesMappingResponse = await Axios.get(
                GET_ROLE_MAPPING,
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
            }, 2000)
            let mapping = getUserRolesMappingResponse.data.data;
            for (var i = 0; i < mapping?.length; i++) {
                if (mapping[i]?.STATUS == 1) {
                    setIsSwitch(true)
                }
                else {
                    setIsSwitch(false)
                }
            }
            setRolesMapping(getUserRolesMappingResponse.data.data)
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }

    }
    const updateRoleMapping = async () => {
        let formData = new FormData();
        formData.append("rolemapping", JSON.stringify(modifiedData));
        setIsLoading(true)
        console.log("Modified Data", modifiedData)
        try {
            const getUpdatedRoleMapping = await Axios.post(
                UPDATE_ROLE_MAPPING,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },
                }
            );
            setOpenAlert(true)
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
            setSaveApiRes(getUpdatedRoleMapping.data.message)
            // updateData()
            setIsShowMesg(true)
            setTimeout(() => {
                setIsShowMesg(false)
            }, 1000)

        }
        catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }

    const handleSwitch = (data: any, index: number, event: any, name: any) => {
        data.STATUS = event.target.checked == true ? 1 : 0;
        let dataSourceCopy = [...dataSource];
        if (name == 'admin') {
            dataSourceCopy[index].Admin = data.STATUS
            setDataSource(dataSourceCopy)
            let roleMappingData = [...modifiedData]
            roleMappingData.push({
                RBACID: data.RBACID,
                TR_MODULE: data.TR_MODULE,
                ROLEID: 1,
                TR_MODULE_DESCRIPTION: data.TR_MODULE_DESCRIPTION,
                STATUS: data.STATUS
            })
            setModifiedData(roleMappingData)
        }
        if (name == 'manager') {
            dataSourceCopy[index][roles?.[1].ROLE_CODE] = data.STATUS
            setDataSource(dataSourceCopy)
            let roleMappingData = [...modifiedData]
            roleMappingData.push({
                RBACID: data.RBACID,
                TR_MODULE: data.TR_MODULE,
                TR_MODULE_DESCRIPTION: data.TR_MODULE_DESCRIPTION,
                ROLEID: 2,
                // ROLE_CODE: data.ROLE_CODE,
                STATUS: data.STATUS
            })
            setModifiedData(roleMappingData)
        }
        if (name == 'auditor') {
            dataSourceCopy[index][roles?.[2].ROLE_CODE] = data.STATUS
            setDataSource(dataSourceCopy)
            let roleMappingData = [...modifiedData]
            roleMappingData.push({
                RBACID: data.RBACID,
                TR_MODULE: data.TR_MODULE,
                ROLEID: 3,
                TR_MODULE_DESCRIPTION: data.TR_MODULE_DESCRIPTION,
                STATUS: data.STATUS
            })
            setModifiedData(roleMappingData)

        }
        if (name == 'Accountant1') {
            dataSourceCopy[index][roles?.[3].ROLE_CODE] = data.STATUS = data.STATUS
            setDataSource(dataSourceCopy)
            let roleMappingData = [...modifiedData]
            roleMappingData.push({
                RBACID: data.RBACID,
                TR_MODULE: data.TR_MODULE,
                ROLEID: 4,
                TR_MODULE_DESCRIPTION: data.TR_MODULE_DESCRIPTION,
                STATUS: data.STATUS
            })
            setModifiedData(roleMappingData)
        }
        if (name == 'Accountant2') {
            dataSourceCopy[index][roles?.[4].ROLE_CODE] = data.STATUS
            setDataSource(dataSourceCopy)
            let roleMappingData = [...modifiedData]
            roleMappingData.push({
                RBACID: data.RBACID,
                TR_MODULE: data.TR_MODULE,
                ROLEID: 5,
                TR_MODULE_DESCRIPTION: data.TR_MODULE_DESCRIPTION,
                STATUS: data.STATUS
            })
            setModifiedData(roleMappingData)
        }
    }
    useEffect(() => {
        getRoles()
        updateData()
        dispatch(updateOtherPage(true))
    }, [])

    const updateData = async () => {
        setModifiedData([])
        try {
            setIsLoading(true)
            const getUserRolesRbacResponse = await Axios.get(
                GET_RBAC,
                {
                    headers: {
                        Authorization: localStorage.getItem(
                            "TR_Token"
                        ) as string,
                    },

                }
            )
            setDataSource([]);
            getUserRolesRbacResponse.data.data.forEach((element: any) => {
                loadNode(element, 1);
            });
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
            setRolesRbac(getUserRolesRbacResponse.data.data)
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
        try {
            setIsLoading(true)
            const getUserRolesMappingResponse = await Axios.get(
                GET_ROLE_MAPPING,
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
            }, 2000)
            getUserRolesMappingResponse?.data.data.forEach((obj: { TR_MODULE: any; STATUS: null; ROLE_CODE: string | number; }) => {
                dataSource.forEach((node: { [x: string]: any; TR_MODULE: any; }) => {
                    if (node.TR_MODULE == obj.TR_MODULE) {
                        if (obj.STATUS == null) {
                            node[obj.ROLE_CODE] = 0;
                        } else {
                            node[obj.ROLE_CODE] = obj.STATUS;
                        }
                    }
                });
                // }
            });
            let mapping = getUserRolesMappingResponse.data.data;
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }
    const loadNode = (role: { role: any; subroles: any[]; }, level: number) => {
        let element = role.role;
        let node: any = {};
        roles?.forEach((elem: any) => {
            node[elem.ROLE_CODE] = 0;
        });
        let perm: any = {
            TR_MODULE: element.TR_MODULE,
            TR_MODULE_DESCRIPTION: element.TR_MODULE_DESCRIPTION,
            RBACID: element.RBACID,
            ROLEID: element.ROLEID || null,
            STATUS: element.STATUS,
            PARENT: element.PARENT,
            padding: 20 * level,
        };
        dataSource.push({ ...node, ...perm });
        setDataSource(dataSource)
        role.subroles.forEach((subrole) => {
            loadNode(subrole, level + 1);
        });
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

    const handleCancel = async (e: any) => {
        try {
            setIsLoading(true)
            const getUserRolesMappingResponse = await Axios.get(
                GET_ROLE_MAPPING,
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
            }, 2000)
            getUserRolesMappingResponse?.data.data.forEach((obj: { TR_MODULE: any; STATUS: null; ROLE_CODE: string | number; }) => {
                dataSource.forEach((node: { [x: string]: any; TR_MODULE: any; }) => {
                    if (node.TR_MODULE == obj.TR_MODULE) {
                        if (obj.STATUS == null) {
                            return;
                        } else {
                            node[obj.ROLE_CODE] = obj.STATUS;
                        }
                    }
                });
                // }
            });
            let mapping = getUserRolesMappingResponse.data.data;
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }
    return (
        <>
            <div style={{ margin: '4vh' }}>
                <div className="px-7 pt-3 pb-3 mb-5 text-base font-raleway font-bold bg-[#F5F5F5]">Manage Role</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {isLoading == true
                        ?
                        <CircularProgress style={{ color: ' rgb(116, 187, 251)' }} size={20} color="secondary" />
                        :
                        ''
                    }
                </div>
                {/* <span style={{ fontWeight: 'bold', fontSize: '19px' }}>Manage Role</span> */}
                <Stack spacing={2} direction="row" sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={() => {
                        setOpen(true);
                    }} sx={{ textTransform: 'capitalize', backgroundColor: 'black', color: 'white' }}>Save Changes</Button>
                    <Button variant="contained" sx={{ textTransform: 'capitalize', backgroundColor: 'lightgray', color: 'black' }} onClick={(e: any) => handleCancel(e)}>Cancel</Button>
                </Stack>
            </div>

            {/* {isShowMesg
                ?
                <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>{saveApiRes}</p>
                :
                ''
            } */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h5 style={{ textAlign: 'start', fontWeight: 'bold' }}>Role Mapping</h5>
                    {/* <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Please review the role mapping below before saving changes.</p> */}
                    <TableContainer >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>User</TableCell>
                                    <TableCell align="right">Role</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {modifiedData.length === 0
                                    ? <TableRow>
                                        <TableCell colSpan={3} style={{ textAlign: 'center' }}>No changes made</TableCell>
                                    </TableRow>
                                    :
                                    modifiedData?.map((row: any, index: number) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.ROLEID === 1 ? 'Admin' : row.ROLEID === 2 ? 'Manager' : row.ROLEID === 3 ? 'Auditor' : row.ROLEID === 4 ? 'Accountant1' : row.ROLEID === 5 ? 'Accountant2' : ''}
                                            </TableCell>
                                            <TableCell align="right">{row.TR_MODULE_DESCRIPTION}</TableCell>
                                            <TableCell align="right">{row.STATUS === 1 ? 'Active' : 'Inactive'}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginTop: '2vh',
                        gap: '0.5rem'
                    }}>
                        <Button variant="contained" onClick={updateRoleMapping} sx={{ textTransform: 'capitalize', backgroundColor: '#1565c0', color: 'white'}}>Save Changes</Button>
                        <Button variant="contained" sx={{ textTransform: 'capitalize', backgroundColor: 'lightgray', color: 'black' }} onClick={(e: any) => handleCancel(e)}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
            <div style={{ marginTop: '-5vh' }}>
                <TableContainer component={Paper} sx={{ margin: '4vh', maxWidth: '90vw', maxHeight: '60vh', overflow: 'auto' }}>
                    <Table sx={{ minWidth: 450 }} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#9FC1F1', border: 'none' }}>
                                <TableCell sx={{ width: '20vw' }}></TableCell>
                                {roles?.map((role: any, index: number) => (
                                    <TableCell key={index} align="right">{role.ROLE_CODE}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataSource?.map((rbac: any, index: number) => {
                                return (
                                    <TableRow sx={{ textAlign: 'center' }} key={index}>
                                        <TableCell component="th" scope="row" style={{ paddingLeft: rbac.padding }} >
                                            <span>{rbac.TR_MODULE_DESCRIPTION}</span>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}> <Switch {...label} value={rbac.Admin} checked={rbac.Admin === 1 ? true : false} onChange={(e) => handleSwitch(rbac, index, e, name = 'admin')} /></TableCell>

                                        <TableCell sx={{ textAlign: 'center' }}>  <Switch {...label} checked={rbac[roles?.[1].ROLE_CODE]} onChange={(e) => handleSwitch(rbac, index, e, name = 'manager')} /> </TableCell>

                                        <TableCell sx={{ textAlign: 'center' }}>  <Switch {...label} checked={rbac[roles?.[2].ROLE_CODE] == 1} onChange={(e) => handleSwitch(rbac, index, e, name = 'auditor')} /> </TableCell>

                                        <TableCell sx={{ textAlign: 'center' }}>  <Switch {...label} checked={rbac[roles?.[3].ROLE_CODE] == 1} onChange={(e) => handleSwitch(rbac, index, e, name = 'Accountant1')} /> </TableCell>

                                        <TableCell sx={{ textAlign: 'center' }}>  <Switch {...label} checked={rbac[roles?.[4].ROLE_CODE] == 1} onChange={(e) => handleSwitch(rbac, index, e, name = 'Accountant2')} /> </TableCell>
                                    </TableRow>
                                )
                                // ))
                                // ))
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AlertComponent
                    openAlert={openAlert}
                    handleClose={handleAlertClose}
                    message={saveApiRes}
                    vertical={"bottom"}
                    horizontal={"center"}
                    severity={"success"}
                />
            </div>
        </>
    );
};

export default ManageRoles;
