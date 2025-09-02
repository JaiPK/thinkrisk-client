import {
  AppBar,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { toggle } from "./toggleSideNavSlice";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import thinkriskLogo from "../../../assets/V2NewUI-logo.png";
import SpreadSheet from "../../modules/dataonboarding/SpreadSheet/SpreadSheet";
import GLConfiguration from "../../modules/configuration/components/GLConfiguration";
import APConfiguration from "../../modules/configuration/components/APConfiguration";
import ChangePasswordPopUp from "./popups/ChangePasswordPopUp";
import axios from "../../../api/axios";
import AlertComponent from "../alert-component/AlertComponent";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const openMobileMenu = useSelector(
    (state: RootState) => state.toggleSideNav.open
  );

  const [isInitial, setIsInitial] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElCase, setAnchorElCase] = useState<null | HTMLElement>(null);
  const [anchorElTools, setAnchorElTools] = useState<HTMLButtonElement | null>(
    null
  );
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [userType, setUserType] = useState("");
  const [openGeneralNestedMenu, setopenGeneralNestedMenu] = useState(false);
  const [openTeNestedMenu, setopenTeNestedMenu] = useState(false);
  const [openApNestedMenu, setopenApNestedMenu] = useState(false);
  const [openNestedMenu, setOpenNestedMenu] = useState(false);
  const open = Boolean(anchorEl);
  //for Change Password popup
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const handleChangePasswordPopUp = (action: string) => {
    if (action === 'open') {
      handleClose();
      setOpenChangePassword(true);
    }
    if (action === 'close') {
      setOpenChangePassword(false);
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElCase(null);
  };

  const handleToolsMenuClicked = (menu: string) => {
    if (menu === "gl-transactions") {
      setAnchorElTools(null)
      navigate("gl-transactions-data-onboarding");
    } else if (menu === "ap-transactions") {
      setAnchorElTools(null)
      navigate("ap-transactions-data-onboarding");
    } else if (menu === "gl-trial-balance") {
    } else if (menu === "gl-configuration") {
      setAnchorElTools(null);
      navigate("/home/configurations/gl/config");
    } else if (menu === "te-dashboard") {
    } else if (menu === "te-cc-transactions") {
    } else if (menu === "te-cc-user-details") {
    } else if (menu === "te-active-cc") {
    } else if (menu === "te-configuration") {
      setAnchorElTools(null);
      navigate("/home/configurations/te");
    } else if (menu === "ap-accounts-payable") {
    } else if (menu === "ap-configuration") {
      setAnchorElTools(null);
      navigate("/home/configurations/ap/config");
    } else if (menu === "admin-jobs") {
    } else if (menu === "manage-users") {
      setAnchorElTools(null);
      navigate("/home/manage-users");
    }else if(menu === 'manage-clients'){
      setAnchorElTools(null);
      navigate("/home/manage-clients");
    } 
    else if (menu === "manage-roles") {
      setAnchorElTools(null);
      navigate("/home/manage-roles");
    } else if (menu === "case-management-general-ledger") {
      setAnchorElCase(null);
      navigate("/home/gl-case-management");
    } else if (menu === "case-management-accounts-payable") {
      setAnchorElCase(null);
      navigate("/home/ap-case-management");
    } else if (menu === "gl-configuration-version-history") {
      setAnchorElTools(null);
      navigate("/home/configurations/gl/version/history");
    } else if (menu === "ap-configuration-version-history") {
      setAnchorElTools(null);
      navigate("/home/configurations/ap/version/history");
    } else if (menu === "gl-management-table") {
      setAnchorElTools(null);
      navigate("/home/gl-transactions-data-onboarding-management-table");
    } else if (menu === "ap-management-table") {
      setAnchorElTools(null);
      navigate("/home/ap-transactions-data-onboarding-management-table");
    } else {
      setAnchorElTools(null);
      navigate("/home/site-settings");
    }
  };
  
  const showCaseManagement = () => {
    return (location.pathname.split("/").length > 6 && location.pathname.split("/")[5] == "audit") 
      || location.pathname == "/home/gl-case-management" || location.pathname == "/home/ap-case-management";
  }
  const logOut = () => {
    setAnchorEl(null);
    localStorage.clear();
    navigate("/login");
  };

  const stringAvatar = (name: string) => {
    return {
      children: name.charAt(0),
    };
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  useEffect(() => {
    setName(JSON.parse(localStorage.getItem("THR_USER")!).name);
    setUserType(JSON.parse(localStorage.getItem("THR_USER")!).userType);
    setShortName(JSON.parse(localStorage.getItem("THR_USER")!).shortName);
  }, []);

  const timeAgoOrFromNow = (utcDate: any) => {
    const now: any = new Date();
    const date: any = new Date(utcDate + (window.location.hostname.includes('localhost')? "" : " UTC"));
    const diffInSeconds = Math.floor((date - now) / 1000);

    let result;

    if (diffInSeconds < 0) {
        // Past time
        const absDiff = Math.abs(diffInSeconds);
        const minutes = Math.floor(absDiff / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            result = days + (days === 1 ? ' day ago' : ' days ago');
        } else if (hours > 0) {
            result = hours + (hours === 1 ? ' hour ago' : ' hours ago');
        } else if (minutes > 0){
            result = minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
        }
        else {
          result = "just now";
        }
    } else {
        // Future time
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            result = days + (days === 1 ? ' day from now' : ' days from now');
        } else if (hours > 0) {
            result = hours + (hours === 1 ? ' hour from now' : ' hours from now');
        } else if (minutes > 0){
            result = minutes + (minutes === 1 ? ' minute from now' : ' minutes from now');
        }
        else {
          result = "just now";
        }
    }

    return result;
}


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className="bg-[#212121] z-20">
          <Toolbar sx={{ minHeight: "50px !important" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              className="mr-2"
              onClick={() => dispatch(toggle())}
            >
              <MenuIcon />
            </IconButton>
            {/* <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        className="mr-2"
        onClick={() => dispatch(toggle())}
    >
        <img src="assets/V2NewUI-logo.png" alt="thinkrisk_logo"/>
    </IconButton> */}
            <Typography
              component="span"
              sx={{ flexGrow: 1 }}
              className="font-roboto font-medium hover:text-yellow-400"
            >
              <IconButton
                size="small"
                edge="start"
                color="inherit"
                aria-label="menu"
                className="mr-2"
                onClick={handleHomeClick}
              >
                <img src={thinkriskLogo} alt="thinkrisk_logo" />
              </IconButton>
            </Typography>
            {
              showCaseManagement() && 
              <div className="flex flex-row items-center">
                <Button
                  aria-controls="simple-menu2"
                  aria-haspopup="true"
                  onClick={(e) => setAnchorElCase(e.currentTarget)}
                  className="hidden md:flex text-center text-white font-roboto font-medium h-full mr-2"
                  style={{ textTransform: "none", fontSize: "16px" }}
                >
                  <div className="hover:text-yellow-400">Case Management</div>
                </Button>
                <Menu
                  anchorEl={anchorElCase}
                  open={Boolean(anchorElCase)}
                  onClose={() => setAnchorElCase(null)}
                  MenuListProps={{
                    "aria-labelledby": "simple-menu2",
                  }}
                  className="z-10"
                >
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClicked("case-management-general-ledger");
                    }}
                  >
                    General Ledger
                  </MenuItem>
                  {/* <MenuItem onClick={handleClose}>
          Travel and Expense
      </MenuItem> */}
                  <MenuItem
                    onClick={() => {
                      handleToolsMenuClicked("case-management-accounts-payable");
                    }}
                  >
                    Accounts Payable
                  </MenuItem>
                </Menu>
              </div>
            }
            <div className="hidden md:flex md:flex-row items-center">
              <Button
                aria-describedby={
                  Boolean(anchorElTools) ? "simple-popover" : undefined
                }
                variant="contained"
                onClick={(e) => setAnchorElTools(e.currentTarget)}
                className="font-roboto font-medium bg-transparent"
                style={{ textTransform: "none", fontSize: "16px" }}
              >
                <div className="hover:text-yellow-400">Tools & Settings</div>
              </Button>

              <Popover
                id={Boolean(anchorElTools) ? "simple-popover" : undefined}
                open={Boolean(anchorElTools)}
                anchorEl={anchorElTools}
                onClose={() => setAnchorElTools(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                PaperProps={{
                  style: {
                    width: "800px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "row",
                  },
                }}
              >
                {/* <Box> */}
                <div style={{ width: "33%" }}>
                  <Typography
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                    component={"span"}
                  >
                    <div style={{ fontWeight: "bold" }}>General Ledger</div>
                    <div>
                      <List dense={true}>
                        {/* <ListItemButton
                          onClick={() => {
                            setopenGeneralNestedMenu(!openGeneralNestedMenu);
                          }}
                        >
                          <ListItemText primary="Data" />
                          {openGeneralNestedMenu ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </ListItemButton>

                        <Collapse
                          in={openGeneralNestedMenu}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding dense={true}>
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={() => {
                                handleToolsMenuClicked("gl-transactions");
                              }}
                            >
                              <ListItemText primary="Transactions" />
                            </ListItemButton>
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={() => {
                                handleToolsMenuClicked("gl-trial-balance");
                              }}
                            >
                              <ListItemText primary="Trial Balance" />
                            </ListItemButton>
                          </List>
                        </Collapse> */}
                        <ListItemButton
                          onClick={() => {
                            handleToolsMenuClicked("gl-configuration");
                          }}
                        >
                          <ListItemText primary="Configuration" />
                        </ListItemButton>
                        {/* <ListItemButton
        onClick={() => {
            handleToolsMenuClicked(
                "gl-configuration-version-history"
            );
        }}
    >
        <ListItemText primary="Version History" />
    </ListItemButton> */}
                      </List>
                    </div>
                  </Typography>
                </div>

                {/* <Divider
        orientation="vertical"
        flexItem
        style={{ marginRight: "10px" }}
    />
    <div style={{ width: "25%" }}>
        <Typography
            style={{ fontWeight: "bold" }}
            component={"span"}
        >
            <div style={{ fontWeight: "bold" }}>
                Travel & Expense
            </div>
            <div>
                <List dense={true}>
                    <ListItemButton
                        onClick={() => {
                            handleToolsMenuClicked(
                                "te-dashboard"
                            );
                        }}
                    >
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => {
                            setopenTeNestedMenu(
                                !openTeNestedMenu
                            );
                        }}
                    >
                        <ListItemText primary="Data" />
                        {openTeNestedMenu ? (
                            <ExpandLess />
                        ) : (
                            <ExpandMore />
                        )}
                    </ListItemButton>
                    <Collapse
                        in={openTeNestedMenu}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List
                            component="div"
                            disablePadding
                            dense={true}
                        >
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => {
                                    handleToolsMenuClicked(
                                        "te-cc-transactions"
                                    );
                                }}
                            >
                                <ListItemText primary="CC Transactions" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => {
                                    handleToolsMenuClicked(
                                        "te-cc-user-details"
                                    );
                                }}
                            >
                                <ListItemText
                                    primary="
                                CC User Details"
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => {
                                    handleToolsMenuClicked(
                                        "te-active-cc"
                                    );
                                }}
                            >
                                <ListItemText
                                    primary="
                                Active CC"
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton
                        onClick={() => {
                            handleToolsMenuClicked(
                                "te-configuration"
                            );
                        }}
                    >
                        <ListItemText primary="Configuration" />
                    </ListItemButton>
                </List>
            </div>
        </Typography>
    </div> */}
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{ marginRight: "10px" }}
                />
                <div style={{ width: "33%" }}>
                  <Typography style={{ fontWeight: "bold" }} component={"span"}>
                    Accounts Payable
                  </Typography>
                  <div>
                    <List dense={true}>
                      {/* <ListItemButton
                        onClick={() => {
                          setopenApNestedMenu(!openApNestedMenu);
                        }}
                      >
                        <ListItemText primary="Data" />
                        {openApNestedMenu ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>

                      <Collapse
                        in={openApNestedMenu}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding dense={true}>
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleToolsMenuClicked("ap-transactions");
                            }}
                          >
                            <ListItemText primary="Accounts Payable" />
                          </ListItemButton>
                        </List>
                      </Collapse> */}
                      <ListItemButton
                        onClick={() => {
                          handleToolsMenuClicked("ap-configuration");
                        }}
                      >
                        <ListItemText primary="Configuration" />
                      </ListItemButton>
                      {/* <ListItemButton
        onClick={() => {
            handleToolsMenuClicked(
                "ap-configuration-version-history"
            );
        }}
    >
        <ListItemText primary="Version History" />
    </ListItemButton> */}
                    </List>
                  </div>
                </div>
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{ marginRight: "10px" }}
                />
                <div style={{ width: "33%" }}>
                  <Typography style={{ fontWeight: "bold" }} component={"span"}>
                    <div style={{ fontWeight: "bold" }}>Extras</div>
                    <div>
                      <List dense={true}>
                        <ListItemButton
                          onClick={() => {
                            setOpenNestedMenu(!openNestedMenu);
                          }}
                        >
                          <ListItemText primary="Admin Jobs" />
                          {openNestedMenu ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse
                          in={openNestedMenu}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding dense={true}>
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={() => {
                                handleToolsMenuClicked("gl-management-table");
                              }}
                            >
                              <ListItemText primary="Gl Management Table" />
                            </ListItemButton>
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={() => {
                                handleToolsMenuClicked("ap-management-table");
                              }}
                            >
                              <ListItemText primary="Ap Management Table" />
                            </ListItemButton>
                          </List>
                        </Collapse>

                        <ListItemButton
                          onClick={() => {
                            handleToolsMenuClicked("manage-users");
                          }}
                        >
                          <ListItemText primary="Manage Users" />
                        </ListItemButton>
                        
                        <ListItemButton
                          onClick={() => {
                            handleToolsMenuClicked("manage-clients");
                          }}
                        >
                          <ListItemText primary="Manage Clients" />
                        </ListItemButton>

                        <ListItemButton
                          onClick={() => {
                            handleToolsMenuClicked("manage-roles");
                          }}
                        >
                          <ListItemText primary="Manage Roles" />
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            handleToolsMenuClicked("site-settings");
                          }}
                        >
                          <ListItemText primary="Site Settings" />
                        </ListItemButton>
                      </List>
                    </div>
                  </Typography>
                </div>
                {/* </Box> */}
              </Popover>
            </div>
            <Button
              className="hidden md:flex text-center text-white font-roboto font-medium cursor-default"
              disableRipple
              style={{ textTransform: "none", fontSize: "16px" }}
            >
              {`${name} | ${userType} `}
            </Button>
            <div className="flex flex-row items-center">
              <Button
                id="basic-button"
                aria-controls="basic-button"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="p-0 "
              >
                <Avatar
                  className="bg-indigo-600"
                  {...stringAvatar(shortName)}
                  sx={{ width: 32, height: 32 }}
                />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                className="z-10"
              >
                <MenuItem onClick={() => { handleChangePasswordPopUp('open') }}>Change Password</MenuItem>
                <MenuItem onClick={logOut}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>

        <section
          id="mobile-menu"
          className={`fixed top-0 w-full flex-col justify-center z-50 origin-top animate-open-menu backdrop-blur-xl md:hidden ${openMobileMenu ? "flex" : "hidden"
            }`}
        >
          <Button
            className="self-end px-6 text-white"
            onClick={() => dispatch(toggle())}
          >
            <CloseIcon sx={{ fontSize: "50px" }} />
          </Button>
          <nav
            className="flex flex-col min-h-screen items-center py-8"
            aria-label="mobile"
          >
            <div className="flex flex-col w-full m-auto mt-16 gap-5 items-center">
              {/* <Link
                onClick={() => dispatch(toggle())}
                to="/home/executive-dashboard"
                className="text-black no-underline font-roboto font-medium text-4xl hover:opacity-90"
              >
                Executive Dashboard
              </Link> */}
              <Link
                onClick={() => dispatch(toggle())}
                to="/home/gl"
                className="text-black no-underline font-roboto font-medium text-4xl"
              >
                General Ledger
              </Link>
              <Link
                onClick={() => dispatch(toggle())}
                to="/home/ap"
                className="text-black no-underline font-roboto font-medium text-4xl"
              >
                Accounts Payable
              </Link>
            </div>
          </nav>
        </section>
        <ChangePasswordPopUp title={"Change Password"} open={openChangePassword} setOpen={handleChangePasswordPopUp} />
      </Box>
      {/* <Routes>
                <Route path="/home/configurations/gl" element={<GLConfiguration />} />
                <Route path="/home/configurations/ap" element={<APConfiguration />} />

            </Routes> */}
    </>
  );
};

export default Header;
