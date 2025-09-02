import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ManageUsersTable from "./ManageUsersTable";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../ui/alert-component/AlertComponent";

const GET_ALL_ROLES = "v1/role/getroles";
const CREATE_USERS = "v1/users/create";
const DELETE_USERS = "v1/users/delete";
const UPDATE_USERS = "v1/users/update";

const ManageUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]); //Data
  const [tempUsers, setTempUsers] = useState<any[]>([]); //Data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [userRoles, setUserRoles] = useState<any>();
  const [currentRoleCode, setCurrentRoleCode] = useState<any>();
  const [openAlert, setOpenAlert] = useState<any>(false);
  const [getCheckedUserRole, setGetCheckedUserRole] = useState<any>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false);
  const [getAllUser, setGetAllUser] = useState<any>();
  const [selectedRowId, setSelectedRowId] = useState<any>();
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [index, setIndex] = useState<any>();
  const [isCancelBtn, setIsCancelBtn] = useState(false);
  const [roleName, setRoleName] = useState<any>();
  const [status, setStatus] = useState<any>();
  const [isSingleDeletePopup, setIsSingleDeletePopup] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<any>();
  const [deleteUserName, setDeleteUserName] = useState<any>();
  const [editedUser, setEditedUser] = useState<any>();
  const [passwordToggle, setPasswordToggle] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteUserEmail, setDeleteUserEmail] = useState<any>();
  const [open, setOpen] = useState(false); //namechange
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [perPage, setPerPage] = useState(5) as any;
  const [page, setPage] = useState(1) as any;
  const [total, settotal] = useState() as any;
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  useEffect(() => {
    getUsers();
    getUserRoles();
  }, []);

  const getUsers = async (newPage?: any, newPerPage?: any, search?: any) => {
    try {
      setIsLoading(true);
      const currentPage = newPage !== undefined ? newPage : page;
      const currentPerPage = newPerPage !== undefined ? newPerPage : perPage;
      const currentSearch = search !== undefined ? search : "";
      if (newPage !== undefined) {
        setPage(newPage);
      }
      if (newPerPage !== undefined) {
        setPerPage(newPerPage);
      }
      const queryParams = new URLSearchParams();
      queryParams.append("perpage", currentPerPage.toString());
      queryParams.append("page", currentPage.toString());
      if (currentSearch) {
        queryParams.append("search", currentSearch.target.value);
      }
      const queryString = queryParams.toString();
      const getUsersResponse = await axios.get(`v1/users/all?${queryString}`, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setGetAllUser(getUsersResponse?.data?.data?.records);
      setIsLoading(false);
      console.log(getUsersResponse);
      settotal(getUsersResponse.data.data.total);
      if (getUsersResponse.data.data.records.length) {
        let Obj: any = [];
        getUsersResponse.data.data.records.forEach((record: any) => {
          let usersObj: any = [];
          usersObj.id = Number(record?.USERID);
          usersObj.user =
            record?.USER_FIRST_NAME + " " + record?.USER_LAST_NAME;
          usersObj.email = record?.USER_EMAIL_ID;
          usersObj.created_date = record?.CREATED_DATE;
          usersObj.created_by =
            record?.CREATED_FIRST_NAME + " " + record?.CREATED_LAST_NAME;
          setStatus(record?.STATUS);
          switch (record?.STATUS) {
            case 1:
              usersObj.status = "Active";
              break;
            case 2:
              usersObj.status = "Pending Verification";
              break;
            case 0:
              usersObj.status = "Deleted";
              break;
            default:
              break;
          }
          switch (record?.ROLEID) {
            case 1:
              usersObj.role = "Admin";
              break;
            case 2:
              usersObj.role = "Audit Manager";
              break;
            case 3:
              usersObj.role = "Auditor";
              break;
            case 4:
              usersObj.role = "Accountant 1";
              break;
            case 5:
              usersObj.role = "Accountant 2";
              break;
            default:
              break;
          }
          Obj.push(usersObj);
        });
        setUsers(Obj);
        setTempUsers(Obj);
      } else if (getUsersResponse.data.data.records.length === 0) {
        setUsers([]);
        setTempUsers([]);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getUserRoles = async () => {
    try {
      const getUserRolesResponse = await axios.get(GET_ALL_ROLES, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setUserRoles(getUserRolesResponse.data.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) ) {
      setIsEmailValid(true); 
    } else {
      setIsEmailValid(false); 
    }
  };
  
  const handleClose = () => {
    setIsCancelBtn(true);
    setOpen(false);
    let data = [...userRoles];
    data.length = 0;
    setIsChecked(false);
    setGetCheckedUserRole(data);
  };

  const getRoleId = (itm: any, index: any) => {
    if (itm.ROLEID === userRoles[index].ROLEID) {
      setRoleId(userRoles[index].ROLEID);
      setRoleName(userRoles[index].ROLE_CODE);
    }
  };

  const createUser = async () => {
    let formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("lastname", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("roleid", roleId);
    try {
      const getNewUsersResponse = await axios.post(CREATE_USERS, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      getUsers();
      setAlertMessage(getNewUsersResponse.data.message);
      setOpen(false);
      setShowAlertDialog(true);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else if (error.response.status === 500) {
        setAlertMessage("Something went wrong.");
        setShowAlertDialog(true);
      }
    }
  };

  const updateUser = async () => {
    let formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("lastname", lastName);
    formData.append("roleid", roleId);
    formData.append("userid", getAllUser[index].USERID);
    formData.append("password", password);
    formData.append("IS_ACTIVE", "1");
    try {
      const getNewUsersResponse = await axios.post(UPDATE_USERS, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setAlertMessage(getNewUsersResponse.data.message);
      setOpen(false);
      getUsers();
      setShowAlertDialog(true);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const deleteUserFromTable = async () => {
    let formData = new FormData();
    formData.append("users", JSON.stringify(selectedRowId));
    try {
      const getDeleteUsersResponse = await axios.post(DELETE_USERS, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setAlertMessage(getDeleteUsersResponse?.data?.message);
      setOpenAlert(false);
      getUsers();
      setShowAlertDialog(true);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const deleteSingleUserFromTable = async () => {
    let arr: any = [];
    let deleteId = [...arr];
    deleteId.push(deleteUserId);
    let formData = new FormData();
    formData.append("users", JSON.stringify(deleteId));
    try {
      const getDeleteUsersResponse = await axios.post(DELETE_USERS, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setAlertMessage(getDeleteUsersResponse?.data?.message);
      setIsSingleDeletePopup(false);
      getUsers();
      setShowAlertDialog(true);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    setSelectedUser([]);
    selectedRowId?.map((id: any) => {
      for (var i = 0; i < getAllUser.length; i++) {
        if (getAllUser?.[i]?.USERID === id) {
          setIndex(i);
          selectedUser.push({
            name:
              getAllUser[i]?.USER_FIRST_NAME +
              " " +
              getAllUser[i]?.USER_LAST_NAME,
            email: getAllUser[i]?.USER_EMAIL_ID,
          });
          setCurrentRoleCode(selectedUser);
        }
      }
      return null;
    });
    let spliteData = editedUser?.split(" ");
    setFirstName(spliteData?.[0]);
    setLastName(spliteData?.[1]);
  }, [getCheckedUserRole]);

  const handlePasswordToggle = () => {
    if (passwordToggle === "password") {
      setPasswordToggle("text");
    } else {
      setPasswordToggle("password");
    }
  };

  const handlePageChange = async (newPage: any) => {
    getUsers(newPage);
  };

  const handlePerPageChange = async (newPerPage: any) => {
    getUsers(page, newPerPage);
  };

  return (
    <div className="flex flex-col pl-7 pb-5">
      <div className="px-0 pt-7 pb-3 text-base font-raleway font-bold ">
        Manage Users
      </div>
      <Stack spacing={2} direction="row">
        <TextField
          id="standard-basic"
          sx={{ width: "60vw" }}
          onChange={(e: any) => getUsers(page, perPage, e)}
          label="Filter"
          placeholder="Search by email"
          variant="standard"
        />
        <Button
          variant="contained"
          onClick={() => {
            setRoleName("");
            setFirstName("");
            setLastName("");
            setEmail("");
            setIsEditUser(false);
            setOpen(true);
          }}
        >
          Add Users
        </Button>
        <Button
          variant="contained"
          disabled={!isChecked || getCheckedUserRole?.length === 0}
          onClick={() => {
            setOpenAlert(true);
          }}
        >
          Delete Users
        </Button>
      </Stack>
      <Dialog open={open} onClose={handleClose} sx={{ width: "100vw" }}>
        <DialogTitle>{isEditUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="First Name"
            type="fn"
            fullWidth
            variant="standard"
            value={firstName || ""}
            onChange={(e) => setFirstName(e.target.value)}
            inputProps={{
              autoComplete: "chrome-off",
            }}
          />
          <TextField
            margin="dense"
            id="name"
            label="Last Name"
            type="ln"
            fullWidth
            variant="standard"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName || ""}
            inputProps={{
              autoComplete: "chrome-off",
            }}
          />
          {isEditUser ? (
            <TextField
              margin="dense"
              id="name"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              value={email || ""}
              disabled
              inputProps={{
                autoComplete: "chrome-off",
              }}
            />
          ) : (
            <TextField
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setEmail(e.target.value); 
            }}
            helperText={isEmailValid ? "Enter a valid email address." : ""}
            error={isEmailValid}
            value={email || ""}
            inputProps={{
              autoComplete: "chrome-off",
            }}
          />
          
          )}
          <TextField
            margin="dense"
            id="name"
            label="Password"
            type={passwordToggle}
            fullWidth
            variant="standard"
            onChange={(e) => {
              if (e.target.value.length < 8 && e.target.value.length > 0) {
                setIsPasswordValid(true);
              } else {
                setIsPasswordValid(false);
                setPassword(e.target.value);
              }
            }}
            helperText={
              isPasswordValid
                ? "Password must be atleast 8 characters long."
                : ""
            }
            error={isPasswordValid}
            inputProps={{
              autocomplete: "new-password",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {passwordToggle === "password" ? (
                    <VisibilityOffIcon
                      sx={{ cursor: "pointer" }}
                      onClick={handlePasswordToggle}
                    ></VisibilityOffIcon>
                  ) : (
                    <VisibilityIcon
                      sx={{ cursor: "pointer" }}
                      onClick={handlePasswordToggle}
                    ></VisibilityIcon>
                  )}
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            style={{ width: "-webkit-fill-available", marginTop: "2vh" }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Role ID
            </InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={roleName || ""}
              label="Age"
              displayEmpty
              autoWidth
            >
              {userRoles?.map((itm: any, index: any) => (
                <MenuItem
                  sx={{
                    width: "550px",
                  }}
                  onClick={() => getRoleId(itm, index)}
                  key={index}
                  value={itm.ROLE_CODE}
                >
                  {itm.ROLE_CODE}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button sx={{ textTransform: "capitalize" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            sx={{ textTransform: "capitalize" }}
            disabled={!firstName || !lastName || !roleId}
            onClick={isEditUser ? updateUser : createUser}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAlert} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Delete User ?
        </DialogTitle>
        <DialogContent sx={{ width: "25vw" }}>
          {currentRoleCode?.map((deleteUser: any, index: any) => (
            <p style={{ textAlign: "center" }} key={index}>
              {deleteUser.name}&nbsp;-&nbsp;{deleteUser.email}
            </p>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: "capitalize" }}
            onClick={() => {
              setOpenAlert(false);
            }}
          >
            Cancel
          </Button>
          <Button
            sx={{ textTransform: "capitalize" }}
            onClick={() => deleteUserFromTable()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isSingleDeletePopup} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Delete User ?
        </DialogTitle>
        <DialogContent sx={{ width: "20vw" }}>
          <p style={{ textAlign: "center" }}>
            {deleteUserName} &nbsp;-&nbsp; {deleteUserEmail}
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: "capitalize" }}
            onClick={() => {
              setIsSingleDeletePopup(false);
            }}
          >
            Cancel
          </Button>
          <Button
            sx={{ textTransform: "capitalize" }}
            onClick={() => deleteSingleUserFromTable()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "4vh" }}
      >
        {isLoading === true ? (
          <CircularProgress
            style={{ color: " rgb(116, 187, 251)" }}
            size={20}
            color="secondary"
          />
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-row w-full mt-5 gap-5">
        <ManageUsersTable
          rowData={tempUsers}
          getCheckedUserRole={setGetCheckedUserRole}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          setIsEditUser={setIsEditUser}
          setOpen={setOpen}
          setOpenAlert={setOpenAlert}
          setSelectedRowId={setSelectedRowId}
          getAllUser={getAllUser}
          isCancelBtn={isCancelBtn}
          status={status}
          setIsSingleDeletePopup={setIsSingleDeletePopup}
          setDeleteUserId={setDeleteUserId}
          setDeleteUserName={setDeleteUserName}
          setEditedUser={setEditedUser}
          setRoleName={setRoleName}
          setDeleteUserEmail={setDeleteUserEmail}
          setEmail={setEmail}
          page={page}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          total={total}
        />
      </div>
      <AlertComponent
        openAlert={showAlertDialog}
        handleClose={() => {
          setShowAlertDialog(false);
        }}
        message={alertMessage}
        vertical={"bottom"}
        horizontal={"center"}
        severity={"success"}
      />
    </div>
  );
};

export default ManageUsers;
