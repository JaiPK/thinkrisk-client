import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress,Grid,Switch, TextField} from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { EditOutlined as EditOutlinedIcon} from "@mui/icons-material";
import Stack from '@mui/material/Stack';
import Tooltip from "@mui/material/Tooltip";
import axios from "../../api/axios";
import AlertComponent from "../../features/ui/alert-component/AlertComponent";
import { SelectPicker } from 'rsuite';
import { CheckPicker } from 'rsuite';


import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

// url 
const CREATE_CLIENT = "v1/client";
const GET_USER_BY_ROLE = "v1/users/getbyrole";
const GET_ERP = "v1/config/erp";
const GET_CLIENTS = "v1/clients";



function ClientManagement(this: any) {


  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [dialogstatus, setDialogStatus] = React.useState(false);
  const [clientStatusDialog, setclientStatusDialog] = React.useState(false);
  const [currentClient, setCurrentClient] = React.useState({}) as any;
  const [clients, setClients] = useState<GridRowsProp>([]);
  const [clientBackup, setClientBackup] = useState<GridRowsProp>([]);
  const [erp, setErp] = useState([]) as any[];
  const [currentERP, setCurrentERP] = useState() as any;
  const [EditLoader, setEditLoader] = useState<boolean>(false);
  const [clientName, setClientName] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [AuditselectedValue, AuditsetSelectedValue] = useState([]) as any[];
  const [AuditorselectedValue, AuditorsetSelectedValue] = useState([]) as any[];
  const [AccountantIselectedValue, AccountantIsetSelectedValue] = useState([]) as any[];
  const [AccountantIIselectedValue, AccountantIIsetSelectedValue] = useState([]) as any[];
  const [usersData, setUsersData] = useState([]) as any[];
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selecedRow, setSelectedRow] = useState() as any;
  //Modal Style

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };


  useEffect(() => {
    getuserByRole();
    getClients();
  }, []);


  // Fields - User and ID for dropdown list in the form 
  const fields = { text: "USER", value: "ID" } as const;
  // ERP data for dropdown list in the form 
  let erpdata: { [key: string]: Object }[] = [];


  // Getuserbyrole - Audit Manager, Auditor, Accountant 1, Accountant 2 
  const getuserByRole = async () => {
    try {
      const response = await axios.get(GET_USER_BY_ROLE, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      const newData = [];
      const auditManagerData = {
        label: "Audit Manager",
        users: [] as any[],
        values: [] as any[],
      };
      response.data.Manager.map((value: any) => {
        auditManagerData.users.push({
          label: value.USER_FIRST_NAME,
          value: value.USERID+"",
        });
      });
      if (auditManagerData.users.length > 0) {
        newData.push(auditManagerData);
      }
      const auditorData = {
        label: "Auditor",
        users: [] as any[],
        values: [] as any[],
      };
      response.data.Auditor.map((value: any) => {
        auditorData.users.push({
          label: value.USER_FIRST_NAME,
          value: value.USERID+"",
        });
      });
      if (auditorData.users.length > 0) {
        newData.push(auditorData);
      }
      const accountant1Data = {
        label: "Accountant 1",
        users: [] as any[],
        values: [] as any[],
      };
      response.data["Accountant 1"].map((value: any) => {
        accountant1Data.users.push({
          label: value.USER_FIRST_NAME,
          value: value.USERID+"",
        });
      });
      if (accountant1Data.users.length > 0) {
        newData.push(accountant1Data);
      }
      const accountant2Data = {
        label: "Accountant 2",
        users: [] as any[],
        values: [] as any[],
      };
      response.data["Accountant 2"].map((value: any) => {
        accountant2Data.users.push({
          label: value.USER_FIRST_NAME,
          value: value.USERID+"",
        });
      });
      if (accountant2Data.users.length > 0) {
        newData.push(accountant2Data);
      }
      setUsersData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  // GetERP - Get ERP data from the API
  const getErp = async () => {
    try {
      const response = await axios.get(GET_ERP, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      response.data.map((value: any) => {
        erpdata.push({ value: value.erp_id, label: value.erp_name });
      });
      setErp(erpdata);
    } catch (error) {
      console.log(error);
    }
  };

  // GetClients - Get Clients data from the API
  const getClients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(GET_CLIENTS, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });

      // setClients([]);
      // setClientBackup([]);
      let responceClient = response.data.data.map((value: any) => {
        return {
          ...value,
          id: value.client_id,
          status: value.is_active ? "Active" : "Inactive",
          no_of_users: Array.isArray(value.users) ? value.users.length : 0,
        };
      });
      setClients(responceClient);
      setClientBackup(responceClient);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // ChangeClientStatus - Change the status of the client from active to inactive and vice versa
  const ChangeClientStatus = async () => {
    setEditLoader(true);
    const Id = currentClient.id;
    const status = currentClient.status;
    if (Id !== 0 && status === "Active") {
      var url = `v1/client/${Id}/deactivate`;
      var message = "Client Deactivated Successfully";
    } else {
      var url = `v1/client/${Id}/activate`;
      var message = "Client Activated Successfully";
    }
    const responseActive = await axios.get(url, {
      headers: {
        Authorization: localStorage.getItem("TR_Token") as string,
      },
    });
    if (responseActive.status === 200) {
      setEditLoader(false);
      setclientStatusDialog(false);
      setAlertMessage(message);
      setOpenAlert(true);
    }
    getClients();
  };

  // OpenModal - Open the modal to add a new client and Edit the client
  const OpenModal = () => {
    getErp();
    setDialogStatus(true);
  };
  const CloseModal = () => {
    setDialogStatus(false);
    const newData = usersData.map((item: any) => ({ ...item, values: [] }));
    setUsersData(newData);
    setClientName("");
    setCurrentERP(null);
    AuditsetSelectedValue([]);
    AuditorsetSelectedValue([]);
    AccountantIsetSelectedValue([]);
    AccountantIIsetSelectedValue([]);
  };

  // handleAlertClose - Close the alert message
  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  // CloseClientStatusModal - Close the client status modal
  const CloseClientStatusModal = () => {
    setclientStatusDialog(false);
    setSelectedRow(null);
  };

  // handleSearch - Search the client by client name
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    if (value !== "") {
      const filteredData = clientBackup.filter((row: any) =>
        row.client_name.toLowerCase().includes(value)
      );
      setClients(filteredData);
    } else {
      setClients(clientBackup);
    }
  };

  // handleEditClient - Edit the client
  const handleEditClient = async (row: any) => {
    OpenModal();
    // const newData = usersData.map((item: any) => ({ ...item, values: [] }));
    const responce = await axios.get(`v1/client/${row.id}`, {
      headers: {
        Authorization: localStorage.getItem("TR_Token") as string,
      },
    });
    setCurrentClient(row);
    let auditIds :any[]= [];
    let auditorIds :any[]= [];
    let accountantIIds:any[] = [];
    let accountantIIIds :any[]= [];

    setCurrentERP(responce.data.erp_data[0].erp_id);
    responce.data.client_data.map((value: any) => {
      setClientName(row.client_name);
      value.users.forEach((user:any) => {
        console.log(user);
        if (user.ROLEID === 2) {
          auditIds.push(user.USERID + "");
        }
        if (user.ROLEID === 3) {
          auditorIds.push(user.USERID + "");
        }
        if (user.ROLEID === 4) {
          accountantIIds.push(user.USERID + "");
        }
        if (user.ROLEID === 5) {
          accountantIIIds.push(user.USERID + "");
        }
      });
      AuditsetSelectedValue(auditIds);
      AuditorsetSelectedValue(auditorIds);
      AccountantIsetSelectedValue(accountantIIds);
      AccountantIIsetSelectedValue(accountantIIIds);
      // setUsersData(newData);
      setEditLoader(false);
    });
  };

  // handleErpDropdownChange - Handle the ERP dropdown change in the form
  const handleErpDropdownChange = (
    value: { value: React.SetStateAction<string | undefined>; } | null,
    event: React.SyntheticEvent<Element, Event>
  ) => {
    if (value) {
      setCurrentERP(value);
    }
  };

  // handleUserDropDownChange - Handle the user dropdown change in the form
  const handleUserDropDownChange = (e: any, Role: string) => {
    console.log(e);
    if (Role === "Audit Manager") {
      AuditsetSelectedValue([...e,e]);
    }
    if (Role === "Auditor") {
      AuditorsetSelectedValue([...e,e]);
    }
    if (Role === "Accountant 1") {
      AccountantIsetSelectedValue([...e,e]);
    }
    if (Role === "Accountant 2") {
      AccountantIIsetSelectedValue([...e,e]);
    }
  };


  // DataGrid columns
  const columns: GridColDef[] = [
    { field: "id", hide: true },
    {
      field: "client_name",
      headerName: "Client",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "created_at",
      headerName: "Created Date",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "created_by",
      headerName: "Created By",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "no_of_users",
      headerName: "Number of Users",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "col6",
      headerName: "Action",
      sortable: false,
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      renderCell: (params) => (
        <>
          <EditOutlinedIcon
            className="cursor-pointer"
            style={{
              color: "#808080",
            }}
            onClick={() => {
              handleEditClient(params.row);
              setEditLoader(true);
              setEdit(true);
            }}
          />
          <Tooltip
            title={
              params.row.status === "Active"
                ? "Deactivate"
                : "Activate"
            }
            sx={{
              marginLeft: "10px",
            }}
          >
          <Switch
            centerRipple={true}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#1565C0",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#1565C0",
            }, 
          }}
            onChange={() => {
              setCurrentClient(params.row);
              setclientStatusDialog(true);
              setSelectedRow(params.row.id);
            }}
            checked={params.row.status === "Active" ? true : false}
            inputProps={{ "aria-label": "controlled" }}
          />
          </Tooltip>
        </>
      ),
    },
  ];

  // ClientHandling - Add or Edit the client
  const ClientHandling = async () => {
    setEditLoader(true);
    let url;
    let message;
    let request;
    const data = {
      client_name: clientName,
      erp_id: currentERP,
      users: [
        ...AuditselectedValue,
        ...AuditorselectedValue,
        ...AccountantIselectedValue,
        ...AccountantIIselectedValue,
      ]
    };
    // console.log(data);
    try {
      if (isEdit) {
        url = `v1/client/${currentClient.id}`;
        message = "Client Updated Successfully";
        request = await axios.patch(url, data, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
        setEdit(false);
      } else {
        url = CREATE_CLIENT;
        message = "Client Created Successfully";
        request = await axios.post(url, data, {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        });
      }
      if (request && request.status === 200) {
        setEditLoader(false);
        CloseModal();
        getClients();
        setAlertMessage(message);
        setOpenAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" m-7 xl:w-11/9 md:w-auto" id="client-management">
      <style jsx>
        {`
          .e-ddl.e-input-group input[readonly].e-input,
          .e-ddl.e-input-group input[readonly],
          #client-management .e-ddl.e-input-group .e-dropdownlist {
            padding-left: 0px;
          }
          .e-input-group.e-input-focus:not(.e-success):not(.e-warning):not(
              .e-error
            ),
          .e-input-group.e-control-wrapper.e-input-focus:not(.e-success):not(
              .e-warning
            ):not(.e-error) {
            box-shadow: none;
            border-color: black !important;
            border-radius: 0;
          }
          .e-input-group .e-control-wrapper .e-ddl .e-lib .e-keyboard {
            background-color: white !important;
            color: white !important;
            padding: 50px;
          }

          .e-input-group:not(.e-success):not(.e-warning):not(.e-error),
          .e-input-group.e-control-wrapper:not(.e-success):not(.e-warning):not(
              .e-error
            ) {
            background-color: white !important;
            border-bottom: solid 1px black;
            border-top: none;
            border-left: none;
            border-right: none;
            border-radius: 0;
          }
          .e-ddl.e-input-group input[readonly].e-input,
          .e-ddl.e-input-group input[readonly],
          #client-management .e-ddl.e-input-group .e-dropdownlist {
            background-color: white !important;
            border: none;
          }

          .e-input-group .e-input-group-icon:last-child,
          .e-input-group.e-control-wrapper .e-input-group-icon:last-child {
            background-color: white !important;
          }
          .e-dlg-content {
            background-color: white;
          }
          .MuiDataGrid-cellContent{
            font-size: 1rem !important;
          }
          .activate-dialog {
            width: fit-content !important;
          }
        `}
      </style>


      <div className="grid">
        <div className="col-span-2 font-normal font-sans text-base">
          <div className="pb-3 text-base font-raleway font-bold"
          >
            Manage Clients{" "}
          </div>
        </div>

        <Modal
          open={dialogstatus}
          onClose={CloseModal}
        >
          <Box sx={{ ...style, width: "40%" }}>

          <div>
            {EditLoader === true ? (
              <div
                className="loader-overlay"
                style={{
                  position: "absolute",
                  top: "0%",
                  left: "0%",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  height: "100%",
                  zIndex: 8000,
                }}
              >
                <CircularProgress
                  style={{
                    color: "rgb(116, 187, 251)",
                    position: "absolute",
                    top: "50%",
                    left: "45%",
                    transform: "translate(-50%,-50%)",
                    zIndex: 9000,
                  }}
                />
              </div>
            ) : null}
            <div style={{ padding: "1rem 1.25rem" }}>
              <div className="ModelForm">
                <h3
                  style={{
                    fontFamily: "Raleway",
                    fontWeight: 500,
                    fontSize: "1.33rem",
                  }}
                >
                  {isEdit ? "Edit Client" : "Add Client"}
                </h3>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}>
                <span className="mt-3">
                  <label
                    style={{
                      color: "#8C8C8C",
                      fontFamily: "Archivo",
                      fontWeight: 400,
                      fontSize: "14px",
                    }}
                  >
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    id=""
                    value={clientName}
                    className="modelForm-input"
                    style={{
                      padding: "10px",
                      fontSize: "1rem",
                      fontFamily: "Roboto",
                      fontWeight: 400,
                      width: "97.5%",
                      paddingLeft: "0px",
                    }}
                    onChange={(e) => {
                      setClientName(e.target.value);
                    }}
                    autoComplete="off"
                  />
                </span>
                <div className="dropDown1 mt-3 mb-5 flex flex-col w-full gap-2">
                  <label
                    style={{
                      color: "#8C8C8C",
                      fontFamily: "Archivo",
                      fontWeight: 400,
                      fontSize: "14px",
                    }}
                  >
                    ERP
                  </label>
                    <SelectPicker 
                    data={erp} 
                      value={currentERP}
                      searchable={false}
                      menuStyle={{
                        zIndex: 9999,
                      }}
                      onChange={handleErpDropdownChange}
                      style={{ width: "100%", height: 40, borderBottom: "solid 1px black", padding: 0 }} 
                      placeholder=" "
                      />
                </div>
                </div>
                <h3
                  style={{
                    fontFamily: "Raleway",
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "#000000",
                    marginTop: "35px",
                  }}
                >
                  Assign Users (Optional)
                </h3>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}>
                  {usersData.map((value: any, index: number) => (
                    console.log(AuditselectedValue, AuditorselectedValue, AccountantIselectedValue, AccountantIIselectedValue),
                    <div className="dropDown1 mt-3 mb-5 flex w-full flex-col gap-2" key={index}>
                      <label
                        style={{
                          color: "#8C8C8C",
                          fontFamily: "Archivo",
                          fontWeight: 400,
                          fontSize: "14px",
                        }}
                      >
                        {value.label}
                      </label>
                      <CheckPicker
                        data={value.users}
                        searchable={false}
                        placeholder=" "
                        menuStyle={{
                          zIndex: 9999,
                        }} 
                        value={
                          value.label === "Audit Manager"
                            ? AuditselectedValue
                            : value.label === "Auditor"
                            ? AuditorselectedValue
                            : value.label === "Accountant 1"
                            ? AccountantIselectedValue
                            : AccountantIIselectedValue
                        }
                        className="client_dropdown"
                        onChange={(e) => {
                          handleUserDropDownChange(e, value.label);
                        }}
                        style={{ width: "100%" ,height:40,borderBottom:"solid 1px black",padding:0}}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  marginTop: "32px",
                }}
              >
                <button
                  className=" xl:ml-20  p-0 rounded cursor-pointer"
                  onClick={CloseModal}
                  style={{
                    backgroundColor: "white",
                    color: "#1565C0",
                    border: 0,
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    fontSize: "1rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="rounded xl:ml-12"
                  style={{
                    backgroundColor: "white",
                    border: 0,
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    fontSize: "1rem",
                    cursor:
                      clientName !== "" &&
                        currentERP !== undefined &&
                        currentERP !== "" &&
                        currentERP !== null
                        ? "pointer"
                        : "not-allowed",
                    color:
                      clientName !== "" &&
                        currentERP !== undefined &&
                        currentERP !== "" &&
                        currentERP !== null
                        ? "#1565C0"
                        : "gray",
                  }}
                  onClick={
                    clientName !== "" &&
                      currentERP !== undefined &&
                      currentERP !== "" &&
                      currentERP !== null
                      ? ClientHandling
                      : undefined
                  }
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          </Box>
        </Modal>
        <Modal
          open={clientStatusDialog}
          onClose={CloseClientStatusModal}
        >
          <Box sx={{ ...style, width: "20%" }}>
            <div>
              {EditLoader === true ? (
                <div
                  className="loader-overlay"
                  style={{
                    position: "absolute",
                    top: "0%",
                    left: "0%",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    height: "100%",
                    zIndex: 8000,
                  }}
                >
                  <CircularProgress
                    style={{
                      color: "rgb(116, 187, 251)",
                      position: "absolute",
                      top: "50%",
                      left: "45%",
                      transform: "translate(-50%,-50%)",
                      zIndex: 1001,
                    }}
                  />
                </div>
              ) : null}
              <div>
                <h4
                  style={{
                    fontFamily: "Raleway",
                    fontWeight: 900,
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  {currentClient.status === "Inactive"
                    ? "Activate"
                    : "Deactivate"}{" "}
                  Client
                </h4>
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: "Raleway",
                    fontWeight: 400,
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  Are you sure you want to{" "}
                  {currentClient.status === "Inactive"
                    ? "Activate"
                    : "Deactivate"}{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {currentClient.client_name}
                  </span>
                  ?
                </h4>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                gap: "1rem",
                marginTop: "2rem",
              }}>
                <button
                  className="w-36 h-12  ml-28  rounded cursor-pointer"
                  onClick={CloseClientStatusModal}
                  style={{
                    backgroundColor: "white",
                    color: "#1565C0",
                    border: 0,
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    fontSize: "1rem",
                  }}
                >
                  Close
                </button>
                <button
                  className="w-36 h-12    rounded cursor-pointer"
                  onClick={ChangeClientStatus}
                  style={{
                    backgroundColor: "white",
                    color: "#1565C0",
                    border: 0,
                    fontFamily: "Roboto",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
            </Box>
        </Modal>
        <Stack spacing={2} direction="row">
            <TextField id="standard-basic" sx={{ width: '100%' }} onChange={(e: any) => handleSearch(e)} label="Search Clients" placeholder="Search by name" variant="standard" />
        </Stack>
        <div className="col-span-1 flex justify-end mt-2">
          <button
            onClick={() => {
              navigate("/home/manage-clients/assign-clients");
            }}
            className="w-36 h-12 mx-2  font-roboto  py-2 px-4 border border-blue-500  rounded cursor-pointer"
            style={{
              border: "solid 1px #1565C0",
              color: "#1565C0",
              fontWeight: 500,
              fontSize: "1rem",
              backgroundColor: "#FFFFFF",
            }}
          >
            Assign Users
          </button>
          <button
            onClick={OpenModal.bind(this)}
            className="w-36 h-12 font-roboto py-2 px-4 rounded cursor-pointer"
            style={{
              backgroundColor: "#1565C0",
              border: 0,
              color: "#FFFFFF",
              fontWeight: 500,
              fontSize: "1rem",
              marginTop: "0px",
            }}
          >
            Add Client
          </button>
        </div>
       
          {isLoading ? (
             <div
             className="col-span-2 mt-10 rounded overflow-x-auto w-full"
             style={{
               fontFamily: "Roboto",
             }}
           >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress
                style={{ color: " rgb(116, 187, 251)" }}
                size={20}
                color="secondary"
              />
            </div>
            </div>
          ) : (
            null
          )}
        <div
          className="col-span-2 mt-10 rounded overflow-x-auto w-full"
          style={{
            fontFamily: "Roboto",
          }}
          id="dataGrid"
        >
          <DataGrid
            rows={clients}
            autoHeight={true}
            columns={columns}
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableExtendRowFullWidth
            disableSelectionOnClick
            disableVirtualization
            disableIgnoreModificationsIfProcessingProps
            hideFooter
            hideFooterPagination
            getRowClassName={(params) => {
              if(isLoading){
                return params.indexRelativeToCurrentPage === selecedRow-1 ? "bg-blue-100" : "";
              }else{
                return "";
              }
            }}
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </div>
      </div>
      <AlertComponent
        openAlert={openAlert}
        handleClose={handleAlertClose}
        message={alertMessage}
        vertical={"bottom"}
        horizontal={"center"}
      />
    </div>
  );
}

export default ClientManagement;
