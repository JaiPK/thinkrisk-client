import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import { List, ListItemButton, ListItemText, TextField } from "@mui/material";
import axios from "../../../api/axios";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../../features/ui/alert-component/AlertComponent";
import { CheckPicker } from 'rsuite';

const GET_CLIENTS = "v1/clients";
const GET_USER_BY_ROLE = "v1/users/getbyrole";
const ASSIGN_USERS = "v1/client/assignusers";

function AssignUsers() {

  const navigate = useNavigate();

  const [selectAll, setSelectAll] = useState(false);
  const [client, setClient] = useState([{clients: {client_name: "",client_id: 0,is_checked: false,},},]);
  const [backup,setbackup] = useState([{clients: {client_name: "",client_id: 0,is_checked: false,},},]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [AuditselectedValue, AuditsetSelectedValue] = useState([]);
  const [AuditorselectedValue, AuditorsetSelectedValue] = useState([]);
  const [AccountantIselectedValue, AccountantIsetSelectedValue] = useState([]);
  const [AccountantIIselectedValue, AccountantIIsetSelectedValue] = useState([]);


  useEffect(() => {
    getuserByRole();
    getClient();
  }, []);


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
        users: response.data.Manager.map((value: any) => ({
          value: value.USERID,
          label: value.USER_FIRST_NAME,
        })),
        values: [],
      };
      if (auditManagerData.users.length > 0) {
        newData.push(auditManagerData);
      }

      const auditorData = {
        label: "Auditor",
        users: response.data.Auditor.map((value: any) => ({
          value: value.USERID,
          label: value.USER_FIRST_NAME,
        })),
        values: [],
      };
      if (auditorData.users.length > 0) {
        newData.push(auditorData);
      }

      const accountant1Data = {
        label: "Accountant 1",
        users: response.data["Accountant 1"].map((value: any) => ({
          value: value.USERID,
          label: value.USER_FIRST_NAME,
        })),
        values: [],
      };
      if (accountant1Data.users.length > 0) {
        newData.push(accountant1Data);
      }

      const accountant2Data = {
        label: "Accountant 2",
        users: response.data["Accountant 2"].map((value: any) => ({
          value: value.USERID,
          label: value.USER_FIRST_NAME,
        })),
        values: [],
      };
      if (accountant2Data.users.length > 0) {
        newData.push(accountant2Data);
      }

      setUsersData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const getClient = async () => {
    setClient([]);
    setbackup([]);
    try {
      const response = await axios.get(GET_CLIENTS, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      const newData = response.data.data.map((item: any) => ({
        clients: {
          client_name: item.client_name,
          client_id: item.client_id,
          is_checked: false,
        },
      }));
      setClient((prevData: any) => [...prevData, ...newData]);
      setbackup((prevData: any) => [...prevData, ...newData]);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };




  const handleToggle = (value: number, client_id: any) => () => {
    setClient((prevClientName) =>
      prevClientName.map((clientWrapper) =>
        clientWrapper.clients.client_id === client_id
          ? {
              ...clientWrapper,
              clients: {
                ...clientWrapper.clients,
                is_checked: !clientWrapper.clients.is_checked,
              },
            }
          : clientWrapper
      )
    );
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    setClient((prevClientName) =>
      prevClientName.map((clientWrapper) => ({
        ...clientWrapper,
        clients: {
          ...clientWrapper.clients,
          is_checked: !selectAll,
        },
      }))
    );
  };

  const fields = { text: "USER", value: "ID" } as const;


  let arrays: any[] = [];
  const UsersDropDownChange = (
    e: any,
    item: any,
    clear?: boolean
  ) => {
    console.log("Length:", e);

    // setSelectedUsers((users: any) => {
    //   if (e.oldValue?.length){
    //     users = users.filter((value: any) => !e.oldValue.includes(value))
    //   }
    //   if (e.value.length) {
    //     users = users.concat(e.value)
    //   }
    //   return users;
    // })
    // console.log("Selected Users:", selectedUsers);


    if (item === "Audit Manager") {
      if (clear) {
        AuditsetSelectedValue([]);
      } else {
        AuditsetSelectedValue(e);
      }
    }
    if (item === "Auditor") {
      if (clear) {
        AuditorsetSelectedValue([]);
      } else {
        AuditorsetSelectedValue(e);
      }
    }
    if (item === "Accountant 1") {
      if (clear) {
        AccountantIsetSelectedValue([]);
      } else {
        AccountantIsetSelectedValue(e);
      }
    }
    if (item === "Accountant 2") {
      if (clear) {
        AccountantIIsetSelectedValue([]);
      } else {
        AccountantIIsetSelectedValue(e);
      }
    }
  };

  const handleCancel = () => {
    navigate("/home/manage-clients/");
  };


  
  const handleSubmit = async () => {
    const clients: any[] = [];
    client.map((value) => {
      if (value.clients.is_checked) {
        clients.push(value.clients.client_id);
      }
    });
    console.log(AuditselectedValue);
    const formdata = {
      clients: clients,
      users:[
        ...AuditselectedValue,
        ...AuditorselectedValue,
        ...AccountantIselectedValue,
        ...AccountantIIselectedValue

      ],
    };
    console.log("Form Data:", formdata);
    try {
      const response = await axios.post(ASSIGN_USERS, formdata, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      if (response.status === 200) {
        setAlertMessage("Users Assigned Successfully");
        setOpenAlert(true);
        UsersDropDownChange({ value: null },"Audit Manager",true);
        UsersDropDownChange({ value: null },"Auditor",true);
        UsersDropDownChange({ value: null },"Accountant 1",true);
        UsersDropDownChange({ value: null },"Accountant 2",true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e: any) => {
    const searchValue = e.target.value;
    if (searchValue === "") {
      setClient(backup);
    } else {
      const filteredData = backup.filter((item: any) =>
        item.clients.client_name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setClient(filteredData);
    }
  };


  return (
    <div className="assign-user-container  m-10 w-11/9">
      <style jsx>
        {`
          .no-focus-border:focus {
            outline: none;
            border: none;
            border-bottom: 2px solid green;
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
        `}
      </style>
      <Grid container spacing={2} sx={{ padding: "10px" }}>
        <Grid xs={12} sx={{ padding: "10px" }}>
          <h1
            style={{
              fontFamily: "Raleway",
              fontWeight: 500,
              fontSize: "1.33rem",
            }}
          >
            Assign Users
          </h1>
          <p
            className="text-gray"
            style={{
              fontFamily: "roboto",
              fontSize: "1rem",
              fontWeight: 400,
              color: "#8C8C8C",
            }}
          >
            Select single/multiple clients and map users accordingly
          </p>
        </Grid>
        <Grid xs={4} sx={{ padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid xs={12} sx={{ paddingLeft: "10px" }}>
              <h1
                style={{
                  fontFamily: "Raleway",
                  fontWeight: 500,
                  fontSize: "1rem",
                }}
              >
                Clients
              </h1>
            </Grid>
            <Grid xs={12} sx={{ paddingLeft: "10px" }}>
              <TextField
                margin="dense"
                id="name"
                label="Search Client"
                type="text"
                fullWidth
                variant="standard"
                autoComplete="off"
                placeholder="Search Client"
                onChange={(e) => {
                  handleSearch(e);
                }}
                sx={{
                  fontSize: "1rem",
                  fontFamily: "Roboto",
                  fontWeight: 400,
                  width: "90%",
                }}
              />
            </Grid>
            <Grid xs={12} sx={{ padding: "20px" }}>
              <ListItem key="select-all" disablePadding>
                <ListItemButton
                  disableTouchRipple
                  role={undefined}
                  onClick={handleSelectAll}
                  sx={{
                    padding: "0px",
                    margin: "-1px",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectAll}
                      tabIndex={-1}
                      icon={
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            background: "#fff",
                            border: "1px solid #1565C0",
                          }}
                        />
                      }
                      checkedIcon={
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            background: "#fff",
                            border: "1px solid #1565C0",
                            borderRadius: "10%",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 8,
                              height: 8,
                              background: "#1565C0",
                            }}
                          />
                        </span>
                      }
                      sx={{
                        color: "#1565C0",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Select All"
                    sx={{
                      fontFamily: "roboto",
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: selectAll ? "#1565C0" : "#8C8C8C",
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {isLoading ? (
                  <CircularProgress
                    style={{ color: " rgb(116, 187, 251)" }}
                    size={20}
                    color="secondary"
                  />
                ) : (
                  client.map((value, index) => {
                    const labelId = `checkbox-list-label-${value}`;
                    if (
                      value.clients.client_name !== "" &&
                      value.clients.client_id !== 0
                    ) {
                      return (
                        <ListItem key={index} disablePadding>
                          <ListItemButton
                            role={undefined}
                            disableTouchRipple
                            onClick={handleToggle(
                              index,
                              value.clients.client_id
                            )}
                            dense
                            sx={{
                              padding: "0px",
                              margin: "-1px",
                              "&:hover": {
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={value.clients.is_checked}
                                tabIndex={-1}
                                icon={
                                  <span
                                    style={{
                                      width: 16,
                                      height: 16,
                                      background: "#fff",
                                      border: "1px solid #1565C0",
                                    }}
                                  />
                                }
                                checkedIcon={
                                  <span
                                    style={{
                                      width: 16,
                                      height: 16,
                                      background: "#fff",
                                      border: "1px solid #1565C0",
                                      borderRadius: "10%",
                                      position: "relative",
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 8,
                                        height: 8,
                                        background: "#1565C0",
                                      }}
                                    />
                                  </span>
                                }
                                inputProps={{ "aria-labelledby": labelId }}
                                sx={{
                                  color: "#1565C0",
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              id={labelId}
                              primary={value.clients.client_name}
                              sx={{
                                fontFamily: "roboto",
                                fontSize: "1rem",
                                fontWeight: 500,
                                color: value.clients.is_checked
                                  ? "#1565C0"
                                  : "black",
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    }
                  })
                )}
              </List>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={8}>
          <Grid container spacing={2}>
            <Grid xs={12} sx={{ padding: "20px" }}>
              <h1
                style={{
                  fontFamily: "Raleway",
                  fontWeight: 500,
                  fontSize: "1rem",
                }}
              >
                Users
              </h1>
            </Grid>
            <Grid xs={12} sx={{ padding: "20px" }}>
              <Grid container spacing={2} sx={{ border: "1px solid #E0E0E0" }}>
                <Grid xs={10} sx={{ padding: "20px" }}>
                  <div style={{ padding: "10px" }}>
                    {usersData.map((item: any, index: any) => (
                      <div className="m-5 dropDown1" key={index}>
                        <label
                          style={{
                            color: "#8C8C8C",
                            fontFamily: "Archivo",
                            fontWeight: 400,
                            fontSize: "14px",
                          }}
                        >
                          {item.label}
                        </label>
                        <CheckPicker
                          data={item.users}
                          value = {
                            item.label === "Audit Manager"
                              ? AuditselectedValue
                              : item.label === "Auditor"
                              ? AuditorselectedValue
                              : item.label === "Accountant 1"
                              ? AccountantIselectedValue
                              : AccountantIIselectedValue
                          }
                          searchable={false}
                          placeholder=" "
                          menuStyle={{
                            zIndex: 9999,
                          }}
                          onChange={(e:any) => {
                            UsersDropDownChange(e, item.label, false)
                          }}
                          style={{ width: "100%", height: 40, borderBottom: "solid 1px black", padding: 0 }}
                        />
                      </div>
                    ))}
                  </div>
                </Grid>
                <Grid xs={12} sx={{ padding: "20px", marginTop: "30px" }}>
                  <Grid container spacing={2} sx={{ padding: "20px" }}>
                    <Grid xs={8}>
                      <button
                        className="w-36 h-12   px-4 rounded cursor-pointer"
                        style={{
                          backgroundColor: "white",
                          color: "#FF0000",
                          border: 0,
                          fontFamily: "Roboto",
                          fontWeight: 400,
                          fontSize: "1rem",
                        }}
                        onClick={() => {
                          UsersDropDownChange(
                            { value: null },
                            "Audit Manager",
                            true
                          );
                          UsersDropDownChange(
                            { value: null },
                            "Auditor",
                            true
                          );
                          UsersDropDownChange(
                            { value: null },
                            "Accountant 1",
                            true
                          );
                          UsersDropDownChange(
                            { value: null },
                            "Accountant 2",
                            true
                          );
                        }}
                      >
                        Clear All
                      </button>
                    </Grid>
                    <Grid xs={4} display={"flex"}>
                      <button
                        className="w-36 h-12   px-4 rounded cursor-pointer"
                        style={{
                          backgroundColor: "white",
                          color: "#1565C0",
                          border: 0,
                          fontFamily: "Roboto",
                          fontWeight: 400,
                          fontSize: "1rem",
                        }}
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        className="w-36 h-12   px-4 rounded cursor-pointer"
                        style={{
                          backgroundColor: "white",
                          color: "#1565C0",
                          border: 0,
                          fontFamily: "Roboto",
                          fontWeight: 600,
                          fontSize: "1rem",
                        }}
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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

export default AssignUsers;
