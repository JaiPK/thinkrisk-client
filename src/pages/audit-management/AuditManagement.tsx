import React, { useState, useEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Grid,
  Modal,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleIcon from '@mui/icons-material/Circle';
import IconButton from "@mui/material/IconButton";
import AuditAction from "./audit-action/AuditAction";
import axios from "../../api/axios";
import "./DateRange.css";
import { useAppSelector } from "../../hooks";
import { updateAccounts, updateCompanies, updateRiskLevel, updateRules } from "../../features/modules/gl-slice/GLSlice";
import { useDispatch } from "react-redux";
import { updateAPCompanies, updateAPRiskLevel, updateAPRules, updateAPVendors } from "../../features/modules/ap-slice/APSlice";
import { RiskLevel, RiskLevelItem } from "../../shared/models/records";
import { Config } from "../../shared/models/filters";
import { Download, FileUpload } from "@mui/icons-material";
import { getPath } from "../../shared/helpers/getPath";
import { SelectPicker } from 'rsuite';
import Chip from '@mui/material/Chip';
import AlertComponent from "../../features/ui/alert-component/AlertComponent";
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import { DateRangePicker } from "rsuite";
interface DateRangePickerValue {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
interface Item {
  title: string;
  subitems?: Item[];
  ACCOUNT_CODE?: string;
  id?: number;
}
let id = 1;
const addId = (item: Item) => {
  item.id = id++;
  if (item.subitems) {
    item.subitems.forEach(subitem => addId(subitem));
  }
};
let chartOfAccount = localStorage.getItem('chartOfAccHLimit')

const removeAccountCode = (item: Item, level = 0) => {
  if (level > Number(chartOfAccount)) {
    return;
  }
  if (!item.title) {
    item.title = item.id!.toString();
  }
  if (item.subitems) {
    item.subitems = item.subitems.filter(subitem => {
      if (subitem.ACCOUNT_CODE) {
        return false;
      }
      removeAccountCode(subitem, level + 1);
      return true;
    });
  }
};


const GL_GET_FILTERS_URL = "v1/je/get_filters";
const AP_GET_FILTERS_URL = "v1/ap/get_filters";
const GET_ACCOUNT_GROUPS_URL = "v1/config/getaccountgroupsall";

function AuditManagement() {
  const [showAudits, setShowAudits] = useState(true);
  const [showEditAudit, setShowEditAudit] = useState(false);
  const [ongoingAudits, setOngoingAudits] = useState<GridRowsProp>([]);
  const [pastAudits, setPastAudits] = useState<GridRowsProp>([]);
  const [backupOngoingAudits, setBackupOngoingAudits] = useState<GridRowsProp>([]);
  const [backupPastAudits, setBackupPastAudits] = useState<GridRowsProp>([]);
  const [historicalData, setHistoricalData] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [AuditId, setEditAuditId] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deleteAuditId, setDeleteAuditId] = useState("");
  const [deleteAuditName, setDeleteAuditName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isHistoricalRefresh, setIsHistoricalRefresh] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [total, settotal] = useState() as any;
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [uidModalOpen, setUidModalOpen] = useState(false);
  const [erp, setErp] = useState([]) as any[];
  const [currentErp, setCurrentErp] = useState(null) as any;
  const [currentFieldLabel, setCurrentFieldLabel] = useState([]) as any[];
  const [fieldData, setFieldData]: any = useState([])
  const [fieldDropDownData, setFieldDropDownData] = useState([]) as any[];
  const [selectedFieldDropDown, setSelectedFieldDropDown] = useState([]) as any[];
  const [selectedDateRange, setSelectedDateRange] = useState<any[]>([]);
  const [selectedCreatedDateRange, setSelectedCreatedDateRange] = useState<any[]>([]);

  let postedStartDate = useAppSelector(
    (state) => state.GLDataSlice.posted_date_start_selected
  );
  let postedEndDate = useAppSelector(
    (state) => state.GLDataSlice.posted_date_end_selected
  );

  const Axios = axios;
  let accounts = useAppSelector((state) => state.GLDataSlice.accounts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
    let client = pathHistory["audits"];
    setClientId(client.client_id);
    setClientName(client.client_name);

  }, []);

  useEffect(() => {
    if (clientId) {
      getErpData();
      getAllFieldsListData();
      getOngoingAudits();
      getPastAudits();
      getHistoricalData();
    }
  }, [clientId, perPage, page, selectedDateRange, selectedCreatedDateRange])

  useEffect(() => {
    if (currentFieldLabel?.length) {
      setFieldList()
    }
  }, [currentFieldLabel])

  useEffect(() => {
    if (currentErp)
      getFieldsListData()
  }, [currentErp])

  const handleCellClick = (name: string, id: string) => {
    const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");

    pathHistory["audit"] = {
      audit_name: name,
      audit_id: id,
      client_id: clientId,
      url: window.location.pathname + '/audit',
    };
    localStorage.setItem("pathHistory", JSON.stringify(pathHistory));
    getAccountGroupsAll();
    GLgetFilters();
    APgetFilters();
    getRiskConfig();
    getRiskConfigAP();
    navigate("audit");
  };

  const setGLInitData = () => {
    let config = [
      {
        label: "Company",
        data: [],
        filterName: "companies",
        filterType: "multi-dropdown",
        selected: undefined,
        active: true,
      },
      {
        label: "Controls",
        data: [],
        filterName: "rules",
        filterType: "multi-dropdown",
        selected: undefined,
        active: true,
      },
      {
        label: "Posted Date",
        data: [
          {
            posted_date_start: postedEndDate,
            posted_date_end: postedEndDate,
          },
        ],
        filterName: "posted-date",
        filterType: "date-picker",
        selected: {
          posted_date_start: postedStartDate,
          posted_date_end: postedEndDate,
        },
        active: true,
      },
      {
        label: "Analysis Data Set",
        data: [
          { text: "Above Materiality", value: 1 },
          { text: "Above Threshold", value: 2 },
          { text: "Below Threshold", value: 3 },
        ],
        filterName: "toggle",
        filterType: "single-dropdown",
        selected: undefined,
        active: true,
      },
      {
        label: "Accounts",

        data: [
          {
            dataSource: [],
            value: "title",
            text: "title",
            child: "subitems",
          },
        ],
        filterName: "accounts",
        filterType: "dropdown-tree",
        selected: undefined,
        active: true,
      },
      {
        label: "Risk Level",
        data: [
          { text: "High", value: "1" },
          { text: "Medium", value: "2" },
          { text: "Low", value: "3" },
        ],
        filterName: "risk",
        filterType: "multi-dropdown",
        selected: undefined,
        active: true,
      },
      {
        label: "Transaction Type",
        data: [
          {
            text: "Asset posting",
            value: 27,
          },
          {
            text: "Accounting document",
            value: 28,
          },
          {
            text: "Customer document",
            value: 29,
          },
          {
            text: "Customer credit memo",
            value: 30,
          },
          {
            text: "Customer invoice",
            value: 31,
          },
          {
            text: "Customer payment",
            value: 32,
          },
          {
            text: "Vendor document",
            value: 33,
          },
          {
            text: "Vendor credit memo",
            value: 34,
          },
          {
            text: "Vendor invoice",
            value: 35,
          },
          {
            text: "Vendor payment",
            value: 36,
          },
          {
            text: "Invoice - gross",
            value: 37,
          },
          {
            text: "G/L account document",
            value: 38,
          },
        ],
        filterName: "git",
        filterType: "multi-dropdown",
        selected: undefined,
        active: true,
      },
    ];

    // const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth();
    // const currentDay = new Date().getDate();
    // var financialYear = new Date().getFullYear();
    // if (currentMonth < 3) {
    //     financialYear = financialYear - 1;
    // }

    // let configCopy = [...config];
    // configCopy[2].data[0] = {
    //     posted_date_start: `${financialYear}-04-01`,
    //     posted_date_end: `${currentYear}-${currentMonth + 1}-${currentDay}`,
    // };
    // configCopy[2].selected = {
    //     posted_date_start: `${financialYear}-04-01`,
    //     posted_date_end: `${currentYear}-${currentMonth + 1}-${currentDay}`,
    // };


    return config;
  };
  const setAPInitData = () => {
    let config = [
      {
        label: "Company",
        data: [],
        filterName: "apcompanies",
        filterType: "multi-dropdown",
        selected: undefined,
        active: true,
      },
      {
        label: "Controls",
        data: [],
        filterName: "aprules",
        filterType: "multi-dropdown",
        selected: undefined,
        active: true,
      },
      {
        label: "Posted Date",
        data: [
          {
            posted_date_start: postedStartDate,
            posted_date_end: postedEndDate,
          },
        ],
        filterName: "posted-date",
        filterType: "date-picker",
        selected: {
          posted_date_start: postedStartDate,
          posted_date_end: postedEndDate,
        },
        active: true,
      },
      {
        label: "Analysis Data Set",
        data: [
          { text: "Above Materiality", value: 1 },
          { text: "Above Threshold", value: 2 },
          { text: "Below Threshold", value: 3 },
        ],
        filterName: "toggle",
        filterType: "single-dropdown",
        selected: undefined,
        active: true,
      },
      {
        label: "Accounts",

        data: [
          {
            dataSource: [],
            value: "title",
            text: "title",
            child: "subitems",
          },
        ],
        filterName: "accounts",
        filterType: "dropdown-tree",
        selected: undefined,
        active: true,
      },
      {
        label: "Risk Level",
        data: [
          { text: "High", value: '1' },
          { text: "Medium", value: '2' },
          { text: "Low", value: '3' },
        ],
        filterName: "risk",
        filterType: "multi-dropdown",
        selected: undefined,
        active: true,
      },
      {
        label: "Transaction Type",
        data: [
        ],
        filterName: "transaction-type",
        filterType: "multi-dropdown",
        selected: undefined,
        active: true,
      },
      {
        label: "Vendors",
        data: [],
        filterName: "apvendors",
        filterType: "multi-dropdown",
        selected: undefined,
        active: true,
      },
    ];

    // const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth();
    // const currentDay = new Date().getDate();
    // var financialYear = new Date().getFullYear();
    // if (currentMonth < 3) {
    //     financialYear = financialYear - 1;
    // }

    // let configCopy = [...config];
    // configCopy[2].data[0] = {
    //     posted_date_start: `${financialYear}-04-01`,
    //     posted_date_end: `${currentYear}-${currentMonth + 1}-${currentDay}`,
    // };
    // configCopy[2].selected = {
    //     posted_date_start: `${financialYear}-04-01`,
    //     posted_date_end: `${currentYear}-${currentMonth + 1}-${currentDay}`,
    // };

    return config;
  };

  const clean = (data: any[]) => {
    const free: any[] = [];
    data.map((item) => {
      const modifiedObject = { ...item };
      addId(modifiedObject);
      removeAccountCode(modifiedObject);
      free.push(modifiedObject);
    });

    dispatch(updateAccounts(free));
  };

  const GLgetFilters = async () => {
    try {
      let getFilterArray: string[] = [];
      setGLInitData().forEach((item) => {
        if (item.filterName) {
          getFilterArray.push(item.filterName);
        }
      });
      let formData = new FormData();
      formData.append("filtertype", getFilterArray.join(","));
      const pathHistory = JSON.parse(
        localStorage.getItem("pathHistory") ?? "{}",
      );
      if (pathHistory) {
        formData.append("audit_id", pathHistory["audit"]["audit_id"]);
        formData.append("client_id", pathHistory["audits"]["client_id"]);
      }
      const response = await Axios.post(GL_GET_FILTERS_URL, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      GLgenerateFilterConfig(response.data.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  const GLgenerateFilterConfig = (data: any) => {
    let response = data;
    let keys = Object.keys(response);
    let configCopy: Config[] = [...setGLInitData()];

    configCopy[4].data[0].dataSource = accounts;
    keys.forEach((key: any) => {
      setGLInitData().forEach((filter, index) => {
        if (filter.filterName === key) {
          let Obj: any[] = [];
          switch (key) {
            case "companies":
              response[key].forEach((companyItem: any) => {
                companyItem.text = companyItem.COMPANY_CODE;
                companyItem.value = companyItem.COMPANYID;
                delete companyItem.COMPANY_CODE;
                delete companyItem.COMPANYID;
                Obj.push(companyItem);
              });
              dispatch(updateCompanies([...Obj]));
              configCopy[index].data = [...Obj];
              break;
            case "rules":
              response[key].forEach((rulesItem: any) => {
                rulesItem.value = rulesItem.CONTROL_KEY;
                rulesItem.text = rulesItem?.CONTROL_NAME;
                // delete rulesItem.CONTROL_KEY;
                // delete rulesItem.CONTROL_NAME;
                Obj.push(rulesItem);
              });
              dispatch(updateRules([...Obj]));
              configCopy[index].data = [...Obj];
              break;
            case "transaction-type":
              response[key].forEach((rulesItem: any) => {
                rulesItem.value = rulesItem.CONTROL_KEY;
                rulesItem.text = rulesItem?.CONTROL_NAME;
                delete rulesItem.CONTROL_KEY;
                delete rulesItem.CONTROL_NAME;
                Obj.push(rulesItem);
              });

              configCopy[index].data = [...Obj];
              break;
            default:
              break;
          }
        }
      });
    });
  };

  const APgenerateFilterConfig = (data: any) => {
    let response = data;
    let keys = Object.keys(response);
    let configCopy: Config[] = [...setAPInitData()];
    keys.forEach((key: any) => {
      setAPInitData().forEach((filter, index) => {
        if (filter.filterName === key) {
          let Obj: any[] = [];
          switch (key) {
            case "apcompanies":
              response[key].forEach((companyItem: any) => {
                Obj.push(companyItem);
              });
              configCopy[index].data = [...Obj];
              dispatch(updateAPCompanies([...Obj]));
              break;
            case "aprules":
              response[key].forEach((rulesItem: any) => {
                Obj.push(rulesItem);
              });
              configCopy[index].data = [...Obj];
              dispatch(updateAPRules([...Obj]));
              break;
            case "apvendors":
              response[key].forEach((vendorItem: any) => {
                Obj.push(vendorItem);
              });
              configCopy[index].data = [...Obj];
              dispatch(updateAPVendors([...Obj]));
              break;
            default:
              break;
          }
        }
      });
    });
  };

  const APgetFilters = async () => {
    try {
      let getFilterArray: string[] = [];
      setAPInitData().forEach((item) => {
        if (item.filterName) {
          getFilterArray.push(item.filterName);
        }
      });
      let formData = new FormData();
      formData.append("filtertype", getFilterArray.join(","));
      const pathHistory = JSON.parse(
        localStorage.getItem("pathHistory") ?? "{}",
      );
      if (pathHistory) {
        formData.append("audit_id", pathHistory["audit"]["audit_id"]);
        formData.append("client_id", pathHistory["audits"]["client_id"]);
      }
      const response = await Axios.post(AP_GET_FILTERS_URL, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      APgenerateFilterConfig(response.data.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getRiskConfig = async () => {
    try {
      let formData = new FormData();
      formData.append("filtertype", "riskweights");
      const pathHistory = JSON.parse(
        localStorage.getItem("pathHistory") ?? "{}",
      );
      if (pathHistory) {
        formData.append("audit_id", pathHistory["audit"]["audit_id"]);
        formData.append("client_id", pathHistory["audits"]["client_id"]);
      }
      const response = await Axios.post(GL_GET_FILTERS_URL, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      if (response.data.data) {
        let Obj: RiskLevel = {
          range_high: 0,
          range_low: 0,
          range_medium: 0,
        };
        response?.data?.data?.riskweights?.forEach((element: RiskLevelItem) => {
          switch (element.KEYNAME) {
            case "range_high":
              Obj.range_high = Number(element.KEYVALUE) * 100;
              break;
            case "range_medium":
              Obj.range_medium = Number(element.KEYVALUE) * 100;
              break;
            case "range_low":
              Obj.range_low = Number(element.KEYVALUE) * 100;
              break;
            default:
              break;
          }
        });
        dispatch(updateRiskLevel(Obj));
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getRiskConfigAP = async () => {
    try {
      let formData = new FormData();
      formData.append("filtertype", "riskweights");
      const pathHistory = JSON.parse(
        localStorage.getItem("pathHistory") ?? "{}",
      );
      if (pathHistory) {
        formData.append("audit_id", pathHistory["audit"]["audit_id"]);
        formData.append("client_id", pathHistory["audits"]["client_id"]);
      }
      const response = await Axios.post(AP_GET_FILTERS_URL, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });

      if (response.data.data) {
        let Obj: RiskLevel = {
          range_high: 0,
          range_low: 0,
          range_medium: 0,
        };
        response?.data?.data?.riskweights?.forEach((element: RiskLevelItem) => {
          switch (element.KEYNAME) {
            case "range_high":
              Obj.range_high = Number(element.KEYVALUE) * 100;
              break;
            case "range_medium":
              Obj.range_medium = Number(element.KEYVALUE) * 100;
              break;
            case "range_low":
              Obj.range_low = Number(element.KEYVALUE) * 100;
              break;
            default:
              break;
          }
        });
        dispatch(updateAPRiskLevel(Obj));
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAccountGroupsAll = async () => {
    try {
      const response = await Axios.get(GET_ACCOUNT_GROUPS_URL, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });

      if (response.data.data.length) {
        clean(response.data.data);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getOngoingAudits = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("module", location.pathname.split("/")[2]);
      if (selectedCreatedDateRange.length && selectedCreatedDateRange[0]) {
        queryParams.append("createFrom", formatDate(selectedCreatedDateRange[0][0]));
        queryParams.append("createTo", formatDate(selectedCreatedDateRange[0][1]));
      }
      const queryString = queryParams.toString();
      const response = await axios.get(
        `v1/client/${clientId}/audits/ongoing?${queryString}`,
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        },
      );
      setIsLoading(false);
      if (!response.data.data) {
        return;
      }
      let responseAudits = response.data.data.map((value: any) => ({
        ...value,
        id: value.audit_id,
      }));
      setBackupOngoingAudits(responseAudits);
      setOngoingAudits(responseAudits);
      setIsRefresh(false);
    } catch (error) {
      console.log(error);
    }
  };

  const startIngest = async (auditId: any) => {
    try {
      const response = await axios.get(
        `v1/client/${clientId}/audit/${auditId}/${getPath.callListID() == 1 ? "startingestap" : "startingestgl"}`,
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        },
      );
      if (response.data.statusCode == 200) {
        setOngoingAudits((audits: any) => {
          return audits.map((audit: any) => {
            if (audit.id == auditId) {
              audit.status = "Started";
            }
            return audit;
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTimeTaken = (timeTaken: any) => {
    let timeArr = timeTaken.toString().split(".");
    let seconds = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    let response = "";
    if (numdays) {
      response = response + numdays + " days ";
    }
    if (numhours) {
      response = response + numhours + " hrs ";
    }
    if (numminutes) {
      response = response + numminutes + " mins ";
    }
    if (numseconds) {
      response = response + numseconds + " secs ";
    }
    return response;
  };

  const getPastAudits = async (q?: any) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams();
    if (selectedDateRange.length && selectedDateRange[0]) {
      queryParams.append("from", formatDate(selectedDateRange[0][0]));
      queryParams.append("to", formatDate(selectedDateRange[0][1]));
    }
    if (selectedCreatedDateRange.length && selectedCreatedDateRange[0]) {
      queryParams.append("createFrom", formatDate(selectedCreatedDateRange[0][0]));
      queryParams.append("createTo", formatDate(selectedCreatedDateRange[0][1]));
    }
    queryParams.append("perpage", perPage.toString());
    queryParams.append("page", page.toString());
    queryParams.append("module", location.pathname.split("/")[2]);

    const queryString = queryParams.toString();
    try {
      const response = await axios.get(
        `v1/client/${clientId}/audits/processed?${queryString}`,
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
        },
      );
      setPastAudits([]);
      setBackupPastAudits([]);
      settotal(response.data.data.total);
      response.data.data.audits.forEach((value: any) => {
        const data = {
          id: value.audit_id,
          audit_name: value.audit_name,
          started_at: value.started_at,
          data_time_pd: value.data_time_pd,
          created_by: value.created_by,
          acc_doc: value.acc_doc,
          data_path: value.data_path,
          time_taken: value.time_taken ? getTimeTaken(value.time_taken) : "-",
          status: value.status,
        };
        setPastAudits((prev) => [...prev, data]);
        setBackupPastAudits((prev) => [...prev, data]);
      });
      if (response.data.message === "Data fetched successfully.") {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
    setIsRefresh(false);
  };

  const ongoingcolumns: GridColDef[] = [
    { field: "id", hide: true },
    {
      field: "audit_name",
      headerName: "Audit Name",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "started_at",
      headerName: "Start Date",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "data_time_pd",
      headerName: "Date Time Period",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "created_by",
      headerName: "Created By",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "data_path",
      headerName: "Data Path",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "col8",
      headerName: "Action",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
      renderCell: (params) => (
        <>
          <IconButton
            className="start-ingest"
            title="Play"
            disabled={["Ongoing", "Started"].includes(params.row.status)}
            onClick={() => startIngest(params.row.id)}
          >
            <PlayCircleFilledWhiteIcon style={{ color: "green" }} />
          </IconButton>
          <IconButton title="Edit">
            <EditIcon
              onClick={() => {
                if (!["Ongoing", "Started"].includes(params.row.status)) {
                  setEditAuditId(params.row.id);
                  setShowEditAudit(true);
                  setShowAudits(false);
                }
              }}
            />
          </IconButton>
        </>
      ),
    },
  ];

  const pastcolumns: GridColDef[] = [
    { field: "id", hide: true },
    {
      field: "audit_name",
      headerName: "Audit Name",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
      renderCell: (params) => (
        <>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: "400",
              fontFamily: "roboto",
              cursor: "pointer",
            }}
            className=""
            onClick={() => {
              if (params.row.status == "Completed")
                handleCellClick(params.value, params.row.id);
            }}
          >
            {params.value}
          </div>
        </>
      ),
    },
    {
      field: "started_at",
      headerName: "Start Date",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "data_time_pd",
      headerName: "Date Time Period",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "created_by",
      headerName: "Created By",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "acc_doc",
      headerName: "Number of ACC doc.",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "data_path",
      headerName: "Data Path",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "col7",
      headerName: "Time Taken For Audit",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "status",
      headerName: "Logs",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "col9",
      headerName: "Action",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
      renderCell: (params) => (
        <>
          <IconButton
            title="Delete"
            onClick={() => {
              setDeleteAuditId(params.row.id);
              setDialogVisible(true);
              setDeleteAuditName(params.row.audit_name);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const historicalcolumns: GridColDef[] = [
    { field: "id", hide: true },
    {
      field: "erp_name",
      headerName: "ERP Name",
      flex: 2,
      sortable: false,
      headerClassName: "font-medium font-roboto text-base text-black",
    },
    {
      field: "time_range_start_date",
      headerName: "Start Date",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "time_range_end_date",
      headerName: "End Date",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "number_of_records",
      headerName: "Number of ACC doc.",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "created_by",
      headerName: "Created By",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "created_at",
      headerName: "Created Date",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
    },
    {
      field: "temp_folder_location",
      headerName: "Data Path",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
      renderCell: (params) => (
        <>
          {params.row.temp_folder_location?.split("/").at(-1)}
        </>
      ),
    },
    {
      field: "status_name",
      headerName: "Status",
      flex: 2,
      headerClassName: "font-medium font-roboto text-base text-black",
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            title={params.row.status_name}
          >
            <CircleIcon style={{ width: "10px", color: params.row.status_id == 1 ? 'grey' : params.row.status_id == 2 ? "#4AC74A" : params.row.status_id == 3 ? '#1565c0' : "#F35E5E" }} />
          </IconButton>
          {params.row.status_name}
        </>
      ),
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim().toLowerCase();
    if (searchValue) {
      setOngoingAudits((audits) => {
        return backupOngoingAudits.filter((audit: any) =>
          audit.audit_name.toLowerCase().includes(searchValue),
        );
      });
    } else {
      setOngoingAudits(backupOngoingAudits);
    }
  };

  const navigateViaPathHistory = (key: any) => {
    const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
    let path = pathHistory[key];
    navigate(path.url);
  };

  const handleCreateAuditClick = () => {
    setShowAudits(false);
    localStorage.setItem("showCreateAudit", "true");
  };

  const handleDialogDelete = async () => {
    setIsDeleting(true);
    const response = await axios.delete(
      `v1/client/${clientId}/audit/${deleteAuditId}`,
      {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      },
    );
    if (response.status === 200) {
      setDialogVisible(false);
      getPastAudits();
    }
    setIsDeleting(false);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  const handleCreatedDateRangeFilter = (range: { startDate: Date; endDate: Date }) => {
      setSelectedCreatedDateRange([range]); 
  }

  const handleDateRangeFilter = (range: { startDate: Date; endDate: Date }) => {
    setSelectedDateRange([range]);
  }


  
  const handleDownload = async () => {
    try {
      const response = await axios.post(
        "v1/templateFile",
        { module: getPath.callListID() },
        {
          headers: {
            Authorization: localStorage.getItem("TR_Token") as string,
          },
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data], { type: "text/csv" });
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download =
        getPath.callListID() === 1 ? "AP_Template" : "GL_Template" + ".csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setOpenAlert(true);
      setAlertMessage("Error downloading file");
      console.error("Error downloading file:", error);
    }
  };
  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const getHistoricalData = async () => {
    try {
      const module = getPath.callListID();
      const response = await axios.get(`v1/client/${clientId}/historicaldata/${module}`, {
        headers: { Authorization: localStorage.getItem("TR_Token") as string },
      });
      let responseData = response.data.historicalData.map((value: any) => ({
        ...value,
        id: value.client_historical_data_id,
      }));
      setHistoricalData(responseData);
      setIsHistoricalRefresh(false)
    } catch (error) {
      console.error(error);
    }
  };


  //getErpData
  const getErpData = async () => {
    let erpData: { [key: string]: Object }[] = [];
    try {
      const response = await axios.get(`v1/client/${clientId}`, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      if (response.data.erp_data) {
        response.data.erp_data.map((value: any) => {
          erpData.push({ value: value.erp_id, label: value.erp_name });
        });
      }
      setErp(erpData);
      setCurrentErp(erpData[0].value || "");
    } catch (error) {
      console.log(error);
    }
  }

  const handleFieldDropdownChange = (e: any) => {
    setCurrentFieldLabel([...currentFieldLabel, {
      field_id: e,
      display_name: fieldDropDownData.filter((value: any) => value.value === e)[0].label,
    }])
    setSelectedFieldDropDown(e);
  }

  const getFieldsListData = async () => {
    if (!clientId || !currentErp) {
      console.error("Client ID or ERP ID is not defined.");
      return;
    }
    try {
      const response = await axios.get(`/v1/client/${clientId}/fieldslist/${currentErp}`, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setCurrentFieldLabel(response.data.field_data);
    } catch (error: any) {
      console.error("Error fetching field list data:", error.message);
    }
  };

  const getAllFieldsListData = async () => {
    try {
      const response = await axios.get(`v1/client/${clientId}/getfieldslist`, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });

      setFieldData(response.data.field_data);
    } catch (error: any) {
      console.error(error);
    }

  };

  const setFieldList = () => {
    let fieldDropDownDataModified: { [key: string]: Object }[] = [];

    const filteredData = fieldData.filter((value: any) => {
      return !currentFieldLabel.some((itemA: any) => itemA.field_id === value.field_id);
    });
    filteredData.map((value: any) => {
      fieldDropDownDataModified.push({ value: value.field_id, label: value.display_name });
    });
    setFieldDropDownData(fieldDropDownDataModified);
  }


  const openConfigureUidModal = () => {
    setUidModalOpen(true);
    setSelectedFieldDropDown("");
    getFieldsListData()
  }

  const handleFieldUpdate = () => {
    try {
      const formData = new FormData();
      formData.append("erp_id", currentErp);
      formData.append("field_data", JSON.stringify(currentFieldLabel.map((field: any) => field['field_id'])));
      const response = axios.post(`v1/client/${clientId}/updatefieldslist`, formData, {
        headers: {
          Authorization: localStorage.getItem("TR_Token") as string,
        },
      });
      setUidModalOpen(false);
      setAlertMessage("Field list updated successfully");
      setOpenAlert(true);
    } catch (error: any) {
      setAlertMessage("Failed to update field");
    }

  }
  return (
    <>
      {showAudits && (
        <div className="m-10">
          <style jsx>{`
            .no-focus-border:focus {
              outline: none;
              border: none;
              border-bottom: 2px solid green;
            }
            .tableCell {
              border-right: 1px solid #8c8c8c;
            }
            .e-input-group:not(.e-success):not(.e-warning):not(.e-error),
            .e-input-group.e-control-wrapper:not(.e-success):not(
                .e-warning
              ):not(.e-error) {
              border: none !important;
              box-shadow: none !important;
            }
            .MuiDataGrid-cellContent {
              font-size: 1rem !important;
            }
          `}</style>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-3"
            id="tableContainer"
          >
            <div className="col-span-full flex justify-between items-center w-full">
              <div className="flex items-center space-x-1">
                <div
                  onClick={() => navigateViaPathHistory("clients")}
                  className="app-path inactive"
                >
                  Clients&nbsp;&nbsp;{">"}&nbsp;&nbsp;
                </div>
                <div className="app-path active">{`${clientName}`}</div>
              </div>
              {/* Data range picker */}
              <div className="col-span-2 sm:col-start-1 md:col-start-2 flex gap-5 font-Raleway justify-end mt-1">
                <Tooltip title="Download Template">
                  <button
                    className="w-36 h-12 text-white rounded border-0 hover:bg-blue-900 cursor-pointer "
                    style={{
                      background: "transparent",
                      border: "solid 1px #1565C0",
                      color: "#1565C0",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                    onClick={handleDownload}
                  >
                    <Download />
                    Template
                  </button>
                </Tooltip>
                <button
                  className="w-36 h-12 text-white rounded border-0 hover:bg-blue-900 cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "solid 1px #1565C0",
                    color: "#1565C0",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                  onClick={() => { navigate("/home/ap/clients/hist-data/management") }}
                >
                  <FileUpload />
                  Upload Data
                </button>
                <button
                  className="w-max h-12 text-white rounded border-0 hover:bg-blue-900 cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "solid 1px #1565C0",
                    color: "#1565C0",
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    padding: "0 10px",
                  }}
                  onClick={openConfigureUidModal}
                >
                  <ManageHistoryIcon />
                  Configure UID
                </button>


                <button
                  className="w-36 h-12 text-white rounded border-0 hover:bg-blue-900 cursor-pointer"
                  style={{ background: "#1565C0" }}
                  onClick={handleCreateAuditClick}
                >
                  Create New Audit
                </button>
              </div>

            </div>
            <div className="col-span-full flex justify-between items-center w-full mt-4">
              <Stack spacing={2} direction="row" className="w-2/5">
                <TextField
                  id="standard-basic"
                  sx={{ width: "100%" }}
                  onKeyUp={(e: any) => handleSearch(e)}
                  label="Search Ongoing Audits"
                  placeholder="Search by name"
                  variant="standard"
                />
              </Stack>
              <div className="w-1/5 drborder audit-date-filter">
                <DateRangePicker
                  className="white-rsuit-bg"
                  label=""
                  placeholder="Select Created Date"
                  size="md"
                  onChange={(value: any) => handleCreatedDateRangeFilter(value)}
                  style={{ width: "100%", height: "100%", backgroundColor: "white" }}
                  gap-10
                  format="yyyy-MM-dd"
                  placement="bottomEnd"
                />
              </div>
            </div>
            {/* <div className="col-span-2 sm:col-start-1 md:col-start-2 flex gap-5 font-Raleway justify-end mt-1">
              <Tooltip title="Download Template">
                <button
                  className="w-36 h-12 text-white rounded border-0 hover:bg-blue-900 cursor-pointer "
                  style={{
                    background: "transparent",
                    border: "solid 1px #1565C0",
                    color: "#1565C0",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                  onClick={handleDownload}
                >
                  <Download />
                  Template
                </button>
              </Tooltip>
              <button
                className="w-36 h-12 text-white rounded border-0 hover:bg-blue-900 cursor-pointer"
                style={{
                  background: "transparent",
                  border: "solid 1px #1565C0",
                  color: "#1565C0",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
                onClick={() => { navigate("/home/ap/clients/hist-data/management") }}
              >
                <FileUpload />
                Upload Data
              </button>
              <button
                className="w-max h-12 text-white rounded border-0 hover:bg-blue-900 cursor-pointer"
                style={{
                  background: "transparent",
                  border: "solid 1px #1565C0",
                  color: "#1565C0",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  padding: "0 10px",
                }}
                onClick={openConfigureUidModal}
              >
                <ManageHistoryIcon />
                Configure UID
              </button>


              <button
                className="w-36 h-12 text-white rounded border-0 hover:bg-blue-900 cursor-pointer"
                style={{ background: "#1565C0" }}
                onClick={handleCreateAuditClick}
              >
                Create New Audit
              </button>
            </div> */}

            <Modal
              open={uidModalOpen}
              onClose={() => { setUidModalOpen(false) }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontFamily: 'Raleway',
                  }}>Configure UID</h3>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <label style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    fontFamily: 'Raleway',
                  }}>
                    ERP :
                  </label>
                  <SelectPicker
                    className="custom-audit-dropdown"
                    data={erp}
                    searchable={false}
                    onChange={(e) => {
                      setCurrentErp(e)
                    }}
                    style={{ width: "100%" }}
                    placeholder="Select ERP"
                    value={currentErp}
                    cleanable={false}
                    menuStyle={{
                      zIndex: 9999,
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <label style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    fontFamily: 'Raleway',
                  }}>
                    Fields :
                  </label>
                  <div style={{
                    background: "#f3f3f3",
                    width: "100%",
                    height: "auto",
                    display: 'flex',
                    flexWrap: 'wrap',
                    padding: '10px 5px',
                    borderRadius: '5px',
                    minHeight: '92px'
                  }}>
                    {
                      currentFieldLabel.length > 0 ?
                        (currentFieldLabel.map((field: { field_id: number; selected_name: string; display_name: string }) => (
                          <Chip
                            key={field.field_id}
                            label={field.display_name}
                            variant="outlined"
                            color="default"
                            style={{ margin: "5px" }}
                            onDelete={() => {
                              setCurrentFieldLabel(currentFieldLabel.filter((item: { field_id: number; selected_name: string; display_name: string }) => item.field_id !== field.field_id));
                              setFieldDropDownData([...fieldDropDownData, { value: field.field_id, label: field.display_name }]);
                            }}
                          />
                        ))) : (<p style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          marginBottom: '5px',
                          fontFamily: 'Raleway',
                          padding: '5px',
                          textAlign: 'center',
                        }}>No fields added</p>)
                    }
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <label style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    fontFamily: 'Raleway',
                  }}>
                    Add Fields :
                  </label>
                  <SelectPicker
                    className="custom-audit-dropdown"
                    data={fieldDropDownData}
                    searchable={false}
                    onChange={handleFieldDropdownChange}
                    style={{ width: "100%" }}
                    placeholder="Select Field"
                    value={selectedFieldDropDown}
                    menuStyle={{
                      zIndex: 9999,
                    }}
                  />
                </div>
                <br />
                <div style={{
                  display: 'flex',
                  justifyContent: 'end',
                  gap: '10px',
                }}>
                  <button style={{
                    width: '100px',
                    height: '40px',
                    background: 'white',
                    color: '#1565c0',
                    border: 'solid 1px #1565C0',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }} onClick={() => setUidModalOpen(false)}>Cancel</button>
                  <button style={{
                    width: '100px',
                    height: '40px',
                    background: '#1565C0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }} onClick={handleFieldUpdate}>submit</button>
                </div>
              </Box>
            </Modal>
            <div className="col-span-2 mt-8 mb-3 text-black heading-txt">
              Ongoing Audits
            </div>
            <div
              className="col-start-3 flex justify-end items-end pb-3 cursor-pointer"
              onClick={() => {
                setIsRefresh(true);
                getOngoingAudits();
                getPastAudits();
              }}
            >
              <RefreshIcon
                className={isRefresh ? "refresh-start" : ""}
              ></RefreshIcon>
            </div>
            <div
              className="col-span-2 lg:col-span-3 rounded overflow-x-auto"
              style={{
                fontFamily: "Roboto",
                position: "relative",
              }}
            >
              {isLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <CircularProgress size={24} />
                </div>
              )}
              <DataGrid
                className="selected-border"
                localeText={{ noRowsLabel: isLoading ? "" : "No Audits" }}
                rows={ongoingAudits}
                autoHeight
                columns={ongoingcolumns}
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                disableExtendRowFullWidth
                disableVirtualization
                disableIgnoreModificationsIfProcessingProps
                hideFooter
                sx={{
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                }}
              />
            </div>
            <div
              className="col-span-2 lg:col-span-3 mt-8 mb-3 text-black xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid"
              style={{
                fontFamily: "Raleway",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              <div className="flex items-end">Past Audits</div>
              <div className="w-full md:col-start-4 lg:col-start-5 items-center border-0 border-b border-black no-focus-border">
                <span className="mr-2 "></span>
                <div className="drborder audit-date-filter">
                  {/* <div className="">Started Date</div> */}
                  {/* <DateRangePickerComponent
                    className="borde"
                    startDate={selectedDateRange.startDate}
                    endDate={selectedDateRange.endDate}
                    placeholder="Select Started Date"
                    change={handleDateRangeFilter}
                  /> */}
                  <DateRangePicker
                    className="white-rsuit-bg"
                    label=""
                    placeholder="Select Started Date"
                    size="md"
                    onChange={(value: any) => handleDateRangeFilter(value)}
                    style={{ width: "100%", height: "100%", backgroundColor: "white" }}
                    gap-10
                    format="yyyy-MM-dd"
                    placement="bottomEnd"
                  // value={
                  //     filter.selected.posted_date_start && filter.selected.posted_date_end
                  //     ? [new Date(filter.selected.posted_date_start), new Date(filter.selected.posted_date_end)]
                  //     : null
                  // }
                  />
                </div>
              </div>
            </div>
            <div
              className="col-span-2 lg:col-span-3 rounded overflow-x-auto"
              style={{
                fontFamily: "Roboto",
                width: "100%",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "16px",
                position: "relative",
              }}
            >
              {isLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <CircularProgress size={24} />
                </div>
              )}
              <DataGrid
                rows={pastAudits}
                autoHeight
                columns={pastcolumns}
                localeText={{ noRowsLabel: isLoading ? "" : "No Audits" }}
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                disableExtendRowFullWidth
                disableVirtualization
                disableIgnoreModificationsIfProcessingProps
                pageSize={perPage}
                rowsPerPageOptions={[5, 10, 25, 100]}
                onPageChange={(newPage) => {
                  setPage(newPage + 1);
                }}
                onPageSizeChange={(newPageSize) => {
                  setPerPage(newPageSize);
                }}
                pagination
                paginationMode="server"
                rowCount={total}
                sx={{
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                }}
              />
            </div>
          </div>
          <div
            className="col-span-2 lg:col-span-3 mt-8 mb-3 text-black xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid"
          >
            <div className="flex items-end">Data Management</div>
            <div
              className="col-start-5 flex justify-end items-end cursor-pointer"
              onClick={() => {
                setIsHistoricalRefresh(true);
                getHistoricalData()
              }}
            >
              <RefreshIcon
                className={isHistoricalRefresh ? "refresh-start" : ""}
              ></RefreshIcon>
            </div>
          </div>
          <div
            className="col-span-2 lg:col-span-3 rounded overflow-x-auto"
            style={{
              fontFamily: "Roboto",
              width: "100%",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "16px",
              position: "relative",
            }}
          >
            {isLoading && (
              <div
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <CircularProgress size={24} />
              </div>
            )}
            <DataGrid
              className="selected-border"
              localeText={{ noRowsLabel: isLoading ? "" : "No Audits" }}
              rows={historicalData}
              autoHeight
              columns={historicalcolumns}
              disableColumnFilter
              disableColumnMenu
              disableColumnSelector
              disableDensitySelector
              disableExtendRowFullWidth
              disableVirtualization
              disableIgnoreModificationsIfProcessingProps
              hideFooter
              sx={{
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
              }}
            />
          </div>
        </div>
      )}
      {/* <DialogComponent
        width="auto"
        height="auto"
        target=".App"
        visible={dialogVisible}
        close={handleDialogClose}
        position={{ X: "center", Y: "center" }}
        isModal={true}
        overlayClick={handleDialogClose}
        style={{
          backgroundColor: "white",
          maxHeight: "90vh",
          maxWidth: "36rem",
          overflow: "hidden !important",
        }}
      >
        <div
          className=""
          style={{
            fontFamily: "Raleway",
            fontWeight: 600,
            fontSize: "1rem",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          Delete Audit
        </div>
        <div
          style={{
            fontFamily: "Raleway",
            fontWeight: 400,
            fontSize: "1rem",
            textAlign: "center",
            padding: "1rem 2rem 2rem 2rem",
          }}
        >
          Are you sure want to delete{" "}
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            {deleteAuditName}
          </span>{" "}
          ?
        </div>
        <Grid item xs={12} container justifyContent="flex-end">
          <button
            className="w-36 h-12 rounded cursor-pointer"
            disabled={isDeleting}
            onClick={handleDialogClose}
            style={{
              backgroundColor: "white",
              color: "#1565C0",
              border: 0,
              fontFamily: "Roboto",
              fontWeight: 400,
              fontSize: "1rem",
              marginLeft: "8px",
            }}
          >
            Cancel
          </button>
          <button
            disabled={isDeleting}
            className="w-36 h-12 rounded cursor-pointer"
            onClick={handleDialogDelete}
            style={{
              backgroundColor: "white",
              color: "#1565C0",
              border: 0,
              fontFamily: "Roboto",
              fontWeight: 600,
              fontSize: "1rem",
              marginLeft: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isDeleting && (
              <CircularProgress
                style={{ color: " rgb(116, 187, 251)", marginRight: "10px" }}
                size={20}
                color="secondary"
              />
            )}
            {isDeleting ? "Deleting" : "Delete"}
          </button>
        </Grid>
      </DialogComponent> */}
      {!showAudits && (
        <AuditAction
          auditId={showEditAudit ? AuditId : ""}
          clientId={clientId}
        />
      )}
      <AlertComponent
        openAlert={openAlert}
        handleClose={handleAlertClose}
        message={alertMessage}
        vertical={"bottom"}
        horizontal={"center"}
      />
    </>
  );
}

export default AuditManagement;
