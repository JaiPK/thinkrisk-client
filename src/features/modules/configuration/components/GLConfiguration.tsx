import React, { createRef, MutableRefObject, useEffect, useRef, useState } from "react";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Chip, IconButton, Table, TableContainer } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@material-ui/core/Grid'
import DeleteIcon from '@mui/icons-material/Delete';
import { DateRangePicker } from "rsuite";
import { useAppSelector, useAppDispatch } from "../../../../hooks";

import Tags from './Chips';

import axios from "../../../../api/axios";

import BasicTable from './RuleTable';

import './GLConfiguration.css';
import { updateAccounts } from "../../gl-slice/GLSlice";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../../ui/alert-component/AlertComponent";

const GET_CONFIG_MODULE = 'v1/config/getmoduleconfig';
const Get_USER_DEPARTMENT = 'v1/je/getfilters';
const GET_ACCOUNTS_GROUPS = 'v1/config/getaccountgroupsall';
const SAVE_ALL_DATA = 'v1/config/setmoduleconfig';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"

      hidden={value !== index}
      id={`gl-vertical-tabpanel-${index}`}
      aria-labelledby={`gl-vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, fontWeight: 'bold' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `gl-vertical-tab-${index}`,
    'aria-controls': `gl-vertical-tabpanel-${index}`,
  };
}

const GLConfiguration = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [ruleValue, setRuleValue] = React.useState<any>();
  const [statValue, setStatValue] = React.useState<any>();
  const [aiValue, setAiValue] = React.useState<any>();
  const [materialValue, setMaterialValue] = React.useState<any>();
  const [thresholdValue, setThresholdValue] = React.useState<any>();
  const [weekStart, setWeekStart] = React.useState<any>();
  const [weekEnd, setWeekEnd] = React.useState<any>();
  const [rangeHigh, setRangeHigh] = React.useState(0);
  const [rangeLow, setRangeLow] = React.useState(0);
  const [rangeMedium, setRangeMedium] = React.useState(0);
  const [startTime, setStartTime] = React.useState<any>();
  const [endTime, setEndTime] = React.useState<any>();
  const [quaterPostingValue, setQuaterPostingValue] = React.useState(12);
  const [periodStartValue, setPeriodStartValue] = React.useState(5);
  const [periodEndValue, setPeriodEndValue] = React.useState(25);
  const [anomalyTrendChartValue, setAnomalyTrendChartValue] = React.useState("");
  const [anomalyTrendChartFlag, setAnomalyTrendChartFlag] = React.useState(0);
  const [topTrendChartValue, setTopTrendChartValue] = React.useState("");
  const [topTrendChartFlag, setTopTrendChartFlag] = React.useState(0);
  const [documentTrendChartValue, setDocumentTrendChartValue] = React.useState("");
  const [documentTrendChartFlag, setDocumentTrendChartFlag] = React.useState(0);
  const [highVal, setHighVal] = React.useState<any>();
  const [mediumVal, setMediumVal] = React.useState<any>();
  const [isChecked, setIsChecked] = useState(false);
  const [getAllUsersDetails, setGetAllUsersDetails] = React.useState<any>();
  const [userIsChecked, setUserIsChecked] = useState<any>();
  const [singleUserDetail, setSingleUserDetail] = React.useState<any>();
  const [singleRowValue, setSingleRowValue] = React.useState<any>(false);
  const [totalSelectedCheckboxes, setTotalSelectedCheckboxes] = useState(0);
  const [isClickAddRowIcon, setIsClickAddRowIcon] = useState(false);
  const [receivers, setReceivers] = React.useState<string[]>([]);
  const [getSuspiciousKey, setGetSuspiciousKey] = React.useState<any>();
  const [getRoundOffData, setGetRoundOffData] = React.useState<any>();
  const [getFireFighterUser, setGetFireFighterUser] = React.useState<any>();
  const [FightUerIsChecked, setFightUserIsChecked] = React.useState<any>();
  const [totalSelectedFightUsersCheckboxes, setTotalSelectedFightUsersCheckboxes] = React.useState(0);
  const [isRangeCheckbox, setIsRangeCheckbox] = useState(false);
  const [accountGroup, setAccountGroup] = useState<any>([]);
  const [getModuleConfig, setGetModuleConfig] = useState<any>();
  const [glDashboardChart, setGlDashboardChart] = useState<any>();
  const [isDasChecked, setIsDasChecked] = useState(false);
  const [globalDas, setGlobalDas] = useState<any>()
  const [updatedDasChart, setUpdatedDasChart] = useState<any>()
  const [periodStartUpdateValue, setPeriodStartUpdateValue] = useState<any>()
  const [periodEndUpdateValue, setPeriodEndUpdateValue] = useState<any>()
  const [getSuspiciousUpdateKey, setGetSuspiciousUpdateKey] = useState<any>();
  const [updatedRoundVal, setUpdatedRoundVal] = useState<any>();
  const [holiday, setHoliday] = useState<any>();
  const [updatedDatesName, setUpdatedDatesName] = useState<any>();
  const [handleUpdatedVal, setHandleUpdatedVal] = useState<any>();
  const [updateHoliday, setUpdateHoliday] = useState<any>();
  const [updateAiValue, setUpdateAiValue] = useState<any>();
  const [updateStatValue, setUpdateStatValue] = useState<any>();
  const [updateRuleValue, setUpdateRuleValue] = useState<any>();
  const [updateMaterialValue, setUpdateMaterialValue] = useState<any>();
  const [updateThresholdValue, setUpdateThresholdValue] = useState<any>();
  const [autoPostingUser, setAutoPostingUser] = useState<any>();
  const [autoPostingUserId, setAutoPostingUserId] = useState<any>();
  const [assignWeights, setAssignWeights] = useState<any>();
  const [fireFighterUser, setFireFighterUser] = useState<any>();
  const [fireFighterUserId, setFireFighterUserId] = useState<any>();
  const [updateApiResMesg, setUpdateApiResMesg] = useState<any>();
  const [glDasChartStatus, setGlDasChartStatus] = useState<any>();
  const [updateGlDasCheckbox, setUpdateGlDasCheckbox] = useState<any[]>();
  const [lowVal, setLowVal] = useState<any>();
  const [bufferDays, setBufferDays] = useState<any>();
  const [manualJournalStatus, setManualJournalStatus] = useState<any>();
  const [manualJournalUpdateStatus, setManualJournalUpdateStatus] = useState<any>();
  const [isShowMesg, setIsShowMesg] = useState<any>(false)
  const [startDate, setStartDate] = useState<any>("10/7/2017");
  const [endDate, setEndDate] = useState<any>("11/15/2017");
  const [isEnableAddIcon, setIsEnableAddIcon] = useState(true);
  const [rangeIndex, setRangeIndex] = useState<any>()
  const [getAccCode, setGetAccCode] = useState<any>([])
  const [data, setData] = useState<any>([]);
  const [accountCode, setAccountCode] = useState<any>([])
  const [accountTitle, setAccountTitle] = useState<any>([])
  const [visible, setVisible] = useState(false);
  const [isShowCode, setIsShowCode] = useState(false);
  const [cashConcentration, setCashConcentration] = useState<any>();
  const [cashCredit, setCashCredit] = useState<any>();
  const [cashDebit, setCashDebit] = useState<any>();
  const [cashDisbursment, setCashDisbursment] = useState<any>();
  const [dbCredit, setDbCredit] = useState<any>();
  const [dbDebit, setDbDebit] = useState<any>();
  const [cashPayrole, setCashPayrole] = useState<any>();
  const [prCredit, setPrCredit] = useState<any>();
  const [prDebit, setPrDebit] = useState<any>();
  const [getNodeCheckedId, setGetNodeCheckedId] = useState<any>([]);
  const [isShowDeleteMesg, setIsShowDeleteMesg] = useState(false);
  const [activateTab, setActivateTab] = React.useState(false);
  const [financeData, setFinanceData] = useState<any>([]);
  const [lateNightPosting, setLateNightPosting] = useState<any>({});
  const [start, setStart] = useState<any>();
  const [end, setEnd] = useState<any>();
  const [currentStart, setCurrentStart] = useState<any>();
  const [curretEnd, setCurrentEnd] = useState<any>();



  setTimeout(() => {
    setActivateTab(true)
  }, 7000)

  const GET_USERS_DETAILS = 'v1/je/users'
  const min = 1;
  const max = 10;
  const Axios = axios;
  const dispatch = useAppDispatch();
  const [accounts, setAccounts] = useState<any[]>([]);
  // let accounts = useAppSelector((state) => state.GLDataSlice.accounts);
  const handleChangeWeekStart = (event: SelectChangeEvent) => {
    setWeekStart(event.target.value);
  };
  const handleChangeWeekEnd = (event: SelectChangeEvent) => {
    setWeekEnd(event.target.value);
  };
  const handleChangeStartTime = (newTime: any) => {
    // let startTimeFormat = new Date(1776, 6, 4, Number(newTime.$H), 0, 0, 0);
    setStartTime(newTime);
    setCurrentStart(newTime.$H)
    let data: any = {}
    data.start = newTime.$H
    data.end = curretEnd ? curretEnd : end
    setLateNightPosting(JSON.stringify(data))
  };
  const handleChangeEndTime = (newTime: any) => {
    setEndTime(newTime);
    setCurrentEnd(newTime.$H)
    let data: any = {}
    data.start = currentStart ? currentStart : start
    data.end = newTime.$H
    setLateNightPosting(JSON.stringify(data))
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  var name: any;
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

  //call an api to get the data
  const getConfigModule = async () => {

    let formData = new FormData();
    formData.append("module", "framework");

    try {
      const getModuleConfigResponse = await Axios.post(
        GET_CONFIG_MODULE,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem(
              "TR_Token"
            ) as string,
          },
        }
      );
      let dataRecord = getModuleConfigResponse.data.data;
      let result = dataRecord.filter((dataRecord: { KEYNAME: any; }) => String(dataRecord.KEYNAME).startsWith('WEIGHT_'));
      setAssignWeights(result)
      setGetModuleConfig(dataRecord)
      //loop to parse through response
      for (let i = 0; i < dataRecord.length; i++) {
        if (dataRecord[i].KEYNAME === "risk_weight_rule") {
          setRuleValue(dataRecord[i].KEYVALUE);
        }
        if (dataRecord[i].KEYNAME === "risk_weight_stat") {
          setStatValue(dataRecord[i].KEYVALUE);
        }
        if (dataRecord[i].KEYNAME === "risk_weight_ai") {
          setAiValue(dataRecord[i].KEYVALUE);
        }
        if (dataRecord[i].KEYNAME === "range_low") {
          setRangeLow(dataRecord[i].KEYVALUE * 100);
        }
        if (dataRecord[i].KEYNAME === "range_medium") {
          setRangeMedium(dataRecord[i].KEYVALUE * 100);
        }
        if (dataRecord[i].KEYNAME === "range_high") {
          setRangeHigh(dataRecord[i].KEYVALUE * 100);
        }
        if (dataRecord[i].KEYNAME === "threshold_amount") {
          setThresholdValue(dataRecord[i].KEYVALUE);
        }
        if (dataRecord[i].KEYNAME === "metiriality_amount") {
          setMaterialValue(dataRecord[i].KEYVALUE);
        }
        if (dataRecord[i].KEYNAME === "suspicious_words") {
          let data = JSON.parse(dataRecord[i].KEYVALUE)
          setGetSuspiciousKey(data);
        }

        if (dataRecord[i].KEYNAME === "roundOff_list") {
          let data = JSON.parse(dataRecord[i].KEYVALUE)
          setGetRoundOffData(data);
        }
        if (dataRecord[i]?.KEYNAME === "GL_Dashboard_Charts") {
          let data = JSON.parse(dataRecord[i]?.KEYVALUE)
          setGlDashboardChart(data);
          setGlDasChartStatus(dataRecord[i]?.STATUS);
        }
        if (dataRecord[i].KEYNAME === "business_hours") {
          setWeekStart(dataRecord[i].value.week_start);
          setWeekEnd(dataRecord[i].value.week_end);
        }
        if (dataRecord[i].KEYNAME === "LATE_NIGHT_POSTING") {
          setStart(JSON.parse(dataRecord[i].KEYVALUE).start)
          setEnd(JSON.parse(dataRecord[i].KEYVALUE).end)
          let data = lateNightPosting
          data.start = JSON.parse(dataRecord[i].KEYVALUE).start
          data.end = JSON.parse(dataRecord[i].KEYVALUE).end
          setLateNightPosting(JSON.stringify(data))
          const newStartTime = new Date(1776, 6, 4, Number(JSON.parse(dataRecord[i].KEYVALUE).start), 0, 0, 0);
          const newEndTime = new Date(1776, 6, 4, Number(JSON.parse(dataRecord[i].KEYVALUE).end), 0, 0, 0);
          setStartTime(newStartTime);
          setEndTime(newEndTime);
        }
        if (dataRecord[i].KEYNAME === "period_posting") {
          setQuaterPostingValue(dataRecord[i].value.quarter_posting);
        }
        if (dataRecord[i].KEYNAME === "Cash_negative_start") {
          setPeriodStartValue(dataRecord[i].KEYVALUE);
        }
        if (dataRecord[i].KEYNAME === "Cash_negative_end") {
          setPeriodEndValue(dataRecord[i].KEYVALUE);
        }
        if (dataRecord[i].KEYNAME === "holidays") {
          setHoliday(JSON.parse(dataRecord[i].KEYVALUE));
        }
        if (dataRecord[i].KEYNAME === "autoposting_users") {
          setAutoPostingUser(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "WEIGHT_FIREFIGHTER") {
          setFireFighterUser(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "bufferDays") {
          setBufferDays(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "Manual_Journal_Entries") {
          setManualJournalStatus(dataRecord[i])
        }
        if (dataRecord[i].KEYNAME === "CASH_CONCEN_A") {
          setCashConcentration(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "CASH_CONCEN_C") {
          setCashCredit(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "CASH_CONCEN_B") {
          setCashDebit(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "CASH_DB_A") {
          setCashDisbursment(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "CASH_DB_C") {
          setDbCredit(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "CASH_CONCEN_B") {
          setDbDebit(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "CASH_PR_A") {
          setCashPayrole(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "CASH_PR_B") {
          setPrDebit(dataRecord[i].KEYVALUE)
        }
        if (dataRecord[i].KEYNAME === "CASH_PR_C") {
          setPrCredit(dataRecord[i].KEYVALUE)
        }

      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  const getUsersDetails = async () => {

    try {

      const getAllUsersDetailsResponse = await Axios.get(
        GET_USERS_DETAILS,
        {
          headers: {
            Authorization: localStorage.getItem(
              "TR_Token"
            ) as string,
          },
        }
      );
      setGetAllUsersDetails(getAllUsersDetailsResponse.data.data)
      setGetFireFighterUser(getAllUsersDetailsResponse.data.data)

    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }
  const getAccount = async () => {
    try {

      const getAccountGroup = await Axios.get(
        GET_ACCOUNTS_GROUPS,
        {
          headers: {
            Authorization: localStorage.getItem(
              "TR_Token"
            ) as string,
          },

        }
      )
      setAccountGroup(getAccountGroup.data.data)
      clean(getAccountGroup.data.data)
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }
  const userCheckBoxDetails = (index: any, userId: React.Key | null | undefined, checked: any) => {
    setUserIsChecked((prev: any) => ({ ...prev, [index]: checked }))
    let data: any[] = [];
    data.push([...data, userId])
    setAutoPostingUser(data)
    if (checked == true) {
      setTotalSelectedCheckboxes(totalSelectedCheckboxes + 1)
    }
    if (checked == false) {
      setTotalSelectedCheckboxes(totalSelectedCheckboxes - 1)

    }
  }
  const fightUserCheckBoxDetails = (index: any, userId: React.Key | null | undefined, checked: any) => {
    setFightUserIsChecked((prev: any) => ({ ...prev, [index]: checked }))
    setFireFighterUser(userId)
    if (checked == true) {
      setTotalSelectedFightUsersCheckboxes(totalSelectedFightUsersCheckboxes + 1)
    }
    if (checked == false) {
      setTotalSelectedFightUsersCheckboxes(totalSelectedFightUsersCheckboxes - 1)
    }
  }
  const cancelUser = (index: any) => {
    setUserIsChecked((prev: any) => ({ ...prev, [index]: false }))
    setTotalSelectedCheckboxes(totalSelectedCheckboxes - 1)
  }
  const cancelFightUser = (index: any) => {
    setFightUserIsChecked((prev: any) => ({ ...prev, [index]: false }))
    setTotalSelectedFightUsersCheckboxes(totalSelectedFightUsersCheckboxes - 1)

  }

  const getUserDepartment = async () => {

    let formData = new FormData();

    formData.append("filtertype", "userdepartment");

    try {
      const userDepartment = await Axios.post(
        Get_USER_DEPARTMENT,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem(
              "TR_Token"
            ) as string,
          },
        }
      );
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }
  const demo = [
    {
      title: 'test1'
    },
    {
      title: 'test2'
    },
    {
      title: 'test3'
    },
  ]
  function handleSliderValChange(event: any) {
    setHighVal(event.target.value)
  }
  function handleSliderMediumValChange(event: any) {
    setMediumVal(event.target.value)
  }
  function handleSliderLowValChange(event: any) {
    setLowVal(event.target.value)
  }
  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }

  const handleSuspiciousKey = (event: any) => {
    let getSuspiciousKeyCopy = [...getSuspiciousKey]
    getSuspiciousKeyCopy.push(event.target.value)
    setGetSuspiciousKey(getSuspiciousKeyCopy)
  }
  const handleRound = (event: any) => {
    let getRoundOffDataCopy = [...getRoundOffData]
    getRoundOffDataCopy.push(parseFloat(event.target.value))
    setGetRoundOffData(getRoundOffDataCopy)
  }
  const handleDatesName = (e: any, index: number) => {
    let data: any = [...holiday]
    data[index].name = e.target.value
    setHoliday(data)
  }
  const handleUpdatedDatesVal = (e: any, index: any) => {
    let data: any = [...holiday]
    data[index].value = e.target.value
    setHoliday(data)
  }
  const saveData = async () => {
    let updateModuleConfig = [...getModuleConfig]
    for (let i = 0; i < updateModuleConfig.length; i++) {
      if (updateModuleConfig[i].KEYNAME == 'risk_weight_ai') {
        updateModuleConfig[i].KEYVALUE = aiValue
      }
      if (updateModuleConfig[i].KEYNAME == 'risk_weight_rule') {
        updateModuleConfig[i].KEYVALUE = ruleValue
      }
      if (updateModuleConfig[i].KEYNAME == 'risk_weight_stat') {
        updateModuleConfig[i].KEYVALUE = statValue
      }
      if (updateModuleConfig[i].KEYNAME == 'GL_Dashboard_Charts') {
        updateModuleConfig[i].KEYVALUE = glDashboardChart
      }
      if (updateModuleConfig[i].KEYNAME == 'metiriality_amount') {
        updateModuleConfig[i].KEYVALUE = materialValue
      }
      if (updateModuleConfig[i].KEYNAME == 'Cash_negative_start') {
        updateModuleConfig[i].KEYVALUE = periodStartValue
      }
      if (updateModuleConfig[i].KEYNAME == 'Cash_negative_end') {
        updateModuleConfig[i].KEYVALUE = periodEndValue
      }
      if (updateModuleConfig[i].KEYNAME === "suspicious_words") {
        updateModuleConfig[i].KEYVALUE = getSuspiciousKey
      }
      if (updateModuleConfig[i].KEYNAME === "roundOff_list") {
        updateModuleConfig[i].KEYVALUE = getRoundOffData
      }
      if (updateModuleConfig[i].KEYNAME === "period_posting") {
        updateModuleConfig[i].value.quarter_posting = quaterPostingValue
      }
      if (updateModuleConfig[i].KEYNAME === "holidays") {
        // let data: any = [...holiday]
        // data.push({ name: updatedDatesName, range: false, value: handleUpdatedVal })
        updateModuleConfig[i].KEYVALUE = holiday
      }
      if (updateModuleConfig[i].KEYNAME === "business_hours") {
        updateModuleConfig[i].value.week_start = weekStart
        updateModuleConfig[i].value.week_end = weekEnd
      }
      if (updateModuleConfig[i].KEYNAME == 'threshold_amount') {
        updateModuleConfig[i].KEYVALUE = thresholdValue
      }
      if (updateModuleConfig[i].KEYNAME === "autoposting_users") {
        updateModuleConfig[i].KEYVALUE = autoPostingUser
      }
      if (updateModuleConfig[i].KEYNAME === "WEIGHT_FIREFIGHTER") {
        updateModuleConfig[i].KEYVALUE = fireFighterUser
      }
      if (updateModuleConfig[i].KEYNAME === "range_high") {
        updateModuleConfig[i].KEYVALUE = rangeHigh / 100
      }
      if (updateModuleConfig[i].KEYNAME === "range_low") {
        updateModuleConfig[i].KEYVALUE = rangeLow / 100
      }
      if (updateModuleConfig[i].KEYNAME === "range_medium") {
        updateModuleConfig[i].KEYVALUE = rangeMedium / 100
      }
      if (updateModuleConfig[i].KEYNAME === "bufferDays") {
        updateModuleConfig[i].KEYVALUE = bufferDays
      }
      if (updateModuleConfig[i].KEYNAME === "Manual_Journal_Entries") {
        updateModuleConfig[i].STATUS = manualJournalUpdateStatus ? manualJournalUpdateStatus : manualJournalStatus.STATUS
      }
      if (updateModuleConfig[i].KEYNAME === "CASH_CONCEN_A") {
        updateModuleConfig[i].KEYVALUE = cashConcentration
      }
      if (updateModuleConfig[i].KEYNAME === "CASH_CONCEN_C") {
        updateModuleConfig[i].KEYVALUE = cashCredit
      }
      if (updateModuleConfig[i].KEYNAME === "CASH_CONCEN_B") {
        updateModuleConfig[i].KEYVALUE = cashDebit
      }
      if (updateModuleConfig[i].KEYNAME === "CASH_DB_A") {
        updateModuleConfig[i].KEYVALUE = cashDisbursment
      }
      if (updateModuleConfig[i].KEYNAME === "CASH_DB_C") {
        updateModuleConfig[i].KEYVALUE = dbCredit
      }
      if (updateModuleConfig[i].KEYNAME === "CASH_DB_B") {
        updateModuleConfig[i].KEYVALUE = dbDebit
      }
      if (updateModuleConfig[i].KEYNAME === "CASH_PR_A") {
        updateModuleConfig[i].KEYVALUE = cashPayrole
      }
      if (updateModuleConfig[i].KEYNAME === "CASH_PR_B") {
        updateModuleConfig[i].KEYVALUE = prCredit
      }
      if (updateModuleConfig[i].KEYNAME === "CASH_PR_C") {
        updateModuleConfig[i].KEYVALUE = prDebit
      }
      if (updateModuleConfig[i].KEYNAME === "LATE_NIGHT_POSTING") {
        updateModuleConfig[i].KEYVALUE = lateNightPosting
      }

    }

    setGetModuleConfig(updateModuleConfig)
    let formData = new FormData();
    formData.append("module", "framework");
    formData.append('configdata', JSON.stringify(updateModuleConfig));
    try {
      const updateData = await Axios.post(
        SAVE_ALL_DATA,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem(
              "TR_Token"
            ) as string,
          },
        }
      );
      setVisible(true)
      setUpdateApiResMesg(updateData.data.message ? updateData.data.message : 'Updated Failed')
      setTimeout(() => {
        setVisible(false)
      }, 4000)
    } catch (error: any) {
      setVisible(true)
      setUpdateApiResMesg('Updated Failed')
      setTimeout(() => {
        setVisible(false)
      }, 4000)
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }

  }

  const handleDasChange = (event: any, itm: any, index: number) => {
    let isChecked = event.target.checked;
    if (isChecked == false) {
      let itmCopy = [...itm]
      setIsDasChecked(false)
      setUpdatedDasChart(itmCopy)
    }
    if (isChecked == true) {
      let itmCopy = [...itm]
      setIsDasChecked(true)
      setUpdatedDasChart(itmCopy)

    }
  }

  const glDasCheckbox = (event: any, index: number) => {
    let glDasChartDataCopy = [...glDashboardChart];
    glDasChartDataCopy[index].status = event.target.checked;
    setGlDashboardChart(glDasChartDataCopy)
  }
  const handleFinanceDept = (e: any) => {
    financeData.push(e.target.innerText)

  }
  const handleManualJournalCheckbox = (event: any) => {
    if (event.target.checked === true) {
      let changeStatus = manualJournalStatus.STATUS = 1
      setManualJournalUpdateStatus(changeStatus)
    }
    else {
      let changeStatus = manualJournalStatus.STATUS = 0
      setManualJournalUpdateStatus(changeStatus)
    }
  }

  useEffect(() => {
    getUsersDetails()
    getUserDepartment()
    getAccount()
    // window.location.reload();
    // clean(accountGroup)
  }, [])

  useEffect(() => {
    getConfigModule();
  }, []);

  const clearAllFightUser = () => {
    setFightUserIsChecked(false)
    setTotalSelectedFightUsersCheckboxes(0)
  }
  const clearAllAutoPostingUser = () => {
    setUserIsChecked(false)
    setTotalSelectedCheckboxes(0)
  }

  const handleDateRangePicker = (e: any) => {
    setStartDate(e.target.value);
    setEndDate(e.target.value)
  }
  // const divRef = useRef() as MutableRefObject<HTMLDivElement>;
  const divRef = createRef() as MutableRefObject<HTMLDivElement>;

  const handleAddRow = (name: any) => {
    setIsEnableAddIcon(false)
    if (name) {
      let newRow: any = [...holiday]
      newRow.push({ name: '', range: false, value: '' })
      setHoliday(newRow)
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }

  }
  const bottomRef = React.useRef();

  const handleRange = (name: any, index: any) => {
    if (index) {
      let range = [...holiday]
      range[index].range = !isRangeCheckbox
      setHoliday(range)
      setRangeIndex(index)
      setIsRangeCheckbox(!isRangeCheckbox)
    }
  }
  var today = new Date();
  const minDate = new Date(15, today.getMonth(), today.getFullYear())
  const maxDate = new Date(15, today.getMonth(), today.getFullYear())
  const fields: any = { dataSource: accounts, text: 'title', child: 'subitems', id: 'id', parentID: 'pid' };

  let id = 1;
  const addId = (item: any, pid?: any) => {
    item.id = id++;
    item.pid = pid;
    if (item.subitems) {
      item.subitems.forEach((subitem: any) => addId(subitem, item.id));
    }
  };
  const removeAccountCode = (item: any) => {
    if (!item.title) {
      item.title = item.id!.toString();
    }
    if (item.subitems) {
      item.subitems = item.subitems.filter((subitem: { ACCOUNT_CODE: string; title: string }) => {
        if (subitem.ACCOUNT_CODE) {
          subitem.title = subitem.title + '-' + subitem.ACCOUNT_CODE;
          // return false;
        }
        removeAccountCode(subitem);
        return true;
      });
    }
  };

  const clean = (data: any[]) => {
    const free: any[] = [];
    const newItm: any[] = [];
    const preProcessData = [...data]
    preProcessData.map((item) => {
      const modifiedObject = { ...item }
      addId(modifiedObject)
      newItm.push(modifiedObject);
      removeAccountCode(modifiedObject);
      free.push(modifiedObject);
    });
    // dispatch(updateAccounts(free));
    setAccounts(free);
    setGetAccCode(newItm)
  };

  const fetchAccountCode = (item: any, name: any) => {
    let arr: any = [];
    item.subitems = item.subitems.filter((subitem: any) => {
      if (subitem.ACCOUNT_CODE) {
        arr.push(subitem.ACCOUNT_CODE);
        let result = arr.map((i: any) => Number(i));
        if (name == 'cashCredit') {
          setCashCredit(result)
        }
        if (name == 'cashConcern') {
          setCashConcentration(JSON.stringify(result.toString()))
        }
        if (name == 'cashDebit') {
          setCashCredit(JSON.stringify(result.toString()))
        }
        if (name == 'cashDisbursment') {
          setCashDisbursment(JSON.stringify(result.toString()))
        }
        if (name == 'dbDebit') {
          setDbDebit(JSON.stringify(result.toString()))
        }
        if (name == 'dbCredit') {
          setDbCredit(JSON.stringify(result.toString()))
        }
        if (name == 'cashPayrole') {
          setCashPayrole(JSON.stringify(result.toString()))
        }
        if (name == 'prCredit') {
          setPrCredit(JSON.stringify(result.toString()))
        }
        if (name == 'prDebit') {
          setPrDebit(JSON.stringify(result.toString()))
        }
        setAccountCode((prev: any) => [...prev, { code: subitem.ACCOUNT_CODE, title: subitem.title }])
        setAccountTitle((prev: any) => [...prev, subitem.title])
      }
      else {
        fetchAccountCode(subitem, name)
      }
    })
  }

  const nodeChecked = (args: any, name: any) => {
    let array: any = []
    setGetNodeCheckedId((pre: any) => [...pre, args.data[0]])
    array.push(args.data[0]?.id)
    setIsShowCode(!isShowCode)
    for (var i = 0; i < getAccCode.length; i++) {
      for (var j = 0; j < getNodeCheckedId.length; j++) {
        if (getNodeCheckedId[i].id == getAccCode[i].id) {
          fetchAccountCode(getAccCode[i], name)
        }
      }
    }
  }

  const handleDelete = (data: any, index: number) => {
    let holidayCopy = [...holiday];
    holidayCopy.splice(index, 1)
    setHoliday(holidayCopy)
    setIsShowDeleteMesg(true)
    setTimeout(() => {
      setIsShowDeleteMesg(false)
    }, 2000)
  }

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setVisible(false);
  };
  const handleMedium = (e: any) => {
    if (e.target.value >= rangeHigh) {
      return;
    }
    setRangeMedium(e.target.value)
  }
  const handleLow = (e: any) => {
    if (e.target.value >= rangeMedium) {
      return;
    }
    setRangeLow(e.target.value)
  }
  let treeObj: any;
  const changeDataSource = (data: any) => {
    treeObj.fields = {
      dataSource: data,
      id: 'id',
      text: 'title',
      child: 'subitems',
    };
  };
  const searchNodes = (args: any) => {
    var matchedDataSource = [];
    var treeData = fields.dataSource;
    if (args.value == '') {
      changeDataSource(treeData);
    } else {
      for (let i = 0; i < treeData.length; i++) {
        //Search the nested child node of TreeView component.
        let filteredChild = nestedChildFilter(args.value, treeData[i]);
        if (filteredChild !== null) {
          matchedDataSource.push(filteredChild);
        }
      }
      // After searching the entire TreeView data and change the datasource of TreeView component.
      changeDataSource(matchedDataSource);
      //let proxy = this;
      setTimeout(function () {
        treeObj.expandAll();
      }, 100);
    }
  };
  const nestedChildFilter = (value: any, node: any) => {
    // If the child node contain children
    let children = node[treeObj.fields.child];
    if (children == null) {
      return isMatchedNode(value, node) ? node : null;
    } else {
      let matchedChildren = [];
      for (let i = 0; i < children.length; i++) {
        // You can again search the child node of TreeView component.
        let filteredChild = nestedChildFilter(value, children[i]);
        if (filteredChild !== null) {
          matchedChildren.push(filteredChild);
        }
      }
      if (matchedChildren.length !== 0) {
        node[treeObj.fields.child] = matchedChildren;
        return node;
      } else {
        node[treeObj.fields.child] = null;
        return isMatchedNode(value, node) ? node : null;
      }
    }
  };
  const isMatchedNode = (value: any, node: any) => {
    //Return matched values
    let checkValue = node[treeObj.fields.text];
    checkValue = checkValue.toLowerCase();
    if (value != null  && value != undefined) {
      value = value.toLowerCase();
    }
    return checkValue.indexOf(value) !== -1;
  };
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  // const handleDateChange = (args: any) => {
  //   const { startDate, endDate } = args;
  //   setDateRange({ startDate, endDate });
  // };

  const handleDateChange = (value: [Date, Date] | null, filterName: any) => {
    let startDate: any = createDateString(value?.length ? value[0] : null);
    let endDate: any = createDateString(value?.length ? value[1] : null);
    setDateRange({ startDate, endDate });

  };
  const createDateString = (date: any) => {
    if (date) {
      let month = date.getMonth() + 1; //months from 1-12
      let day = date.getDate();
      let year = date.getFullYear();

      let dateString = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
        }`;
      return dateString;
    }
    return null;
  };

  const formatDate = (date: Date | null): string =>
    date ? date.toLocaleDateString('en-GB') : '';

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 100,
      label: '100',
    },
  ];
  console.log(assignWeights,"assignWeights")
  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 450 }}
    >

      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="General Ledger Configuration"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <div>
            1. Risk Framework Weights
            <Tooltip title="Assign the weights for risk scoring frameworks." placement="top">
              <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
            </Tooltip>
          </div>
        }
          {...a11yProps(0)} />
        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              2. Dashboard Charts
              <Tooltip title="Description." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(1)} />

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              3. High - Medium - Low Definition
              <Tooltip title="Define the range for High,Medium and Low risk GL transactions." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(2)} />
        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              4. Threshold
              <Tooltip title="Configure the thresholds for GL transactions." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(3)} />
        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              5. Auto Posting Users
              <Tooltip title="Configure the users for system posted entries." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(4)} />

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              6. Assign Weights to General Ledger Rules
              <Tooltip title="Configure the weights for each control point under GL." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(5)} />

        <Tab style={{ display: assignWeights?.[5].STATUS === 1 ? 'block' : 'none' }} sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              7. Fire Fighter Users
              <Tooltip title="Configure the users for fire fighter rule." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(6)} />

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              8. Weekday Configuration
              <Tooltip title="Journal Entries posted during the weekends." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(7)} />

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              9. Business Hours Configuration
              <Tooltip title="Journal Entries posted after regular business hours." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(8)} />

        {/* <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              10. Derived rules
              <Tooltip title="Info about the action." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(9)} /> */}

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              10. Holidays
              <Tooltip title="Journal Entries posted during a calendar holiday." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(9)} />

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              11. Next Quarter Posting
              <Tooltip title="Day difference between the posted and posting date is greater than 12 and the posting is not done in the same quarter." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(10)} />

        <Tab style={{ display: assignWeights?.[36].STATUS === 1 ? 'block' : 'none' }} sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              12. Rounding OFF
              <Tooltip title="Identify transactions with unusual identified number patterns." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(11)} />

        <Tab style={{ display: assignWeights?.[1].STATUS === 1 ? 'block' : 'none' }} sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              13. Non Finance Department
              <Tooltip title="Journal entries posted by a person in non-finance department. E.g.: IT." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(12)} />

        <Tab style={{ display: assignWeights?.[29].STATUS === 1 ? 'block' : 'none' }} sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              14. Suspicious key words
              <Tooltip title="Input any suspicious key words that require your attention appearing in the Transaction Text or Account description." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(13)} />

        <Tab style={{ display: assignWeights?.[8].STATUS === 1 ? 'block' : 'none' }} sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              15. Cash Negative Balance Period
              <Tooltip title="Cash Negative Balance Period." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(14)} />

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              16. List of Accounts Used for Cash Concentration
              <Tooltip title="In consideration of Journal Entries with Cash Concentration account credited, the corresponding debit account does not fall under Cash Disbursement, Cash Payroll and Cash Negative Balances." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(15)} />

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              17. List of Accounts Used for Cash Disbursement Rule
              <Tooltip title="Journal Entries with Cash Disbursement account in credit side are considered. If their corresponding debit account does not have an GL expense accounts." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(16)} />

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
          <>
            <div>
              18. List of Accounts Used for Cash Payroll Rule
              <Tooltip title="Journal Entries with Cash Payroll account in debit side are considered. If their corresponding credit account does not fall under Cash Concentration." placement="top">
                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
              </Tooltip>
            </div>
          </>
        }
          {...a11yProps(17)} />

        <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label="19. Save Data" {...a11yProps(18)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <FormControl error variant="standard">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
            <TextField sx={{ width: "200px", m: 3 }} id="ai-gl-score" value={aiValue || ''} label="AI Risk Score" variant="standard" type="number"
              onChange={(e) => {
                var newVal = parseInt(e.target.value);

                if (newVal > 10) newVal = 10;
                if (newVal < 1) newVal = 1;

                setAiValue(newVal);
              }}
            />
            <TextField sx={{ width: "200px", m: 3 }} id="stat-gl-score" value={statValue || ''} label="Stat Risk Score" variant="standard" type="number"
              onChange={(e) => {
                var newVal = parseInt(e.target.value);

                if (newVal > 10) newVal = 10;
                if (newVal < 1) newVal = 1;

                setStatValue(newVal);
              }}
            />
            <TextField sx={{ width: "200px", m: 3 }} id="rule-gl-score" value={ruleValue || ''} label="Rule Risk Score" variant="standard" type="number"
              onChange={(e) => {
                var newVal = parseInt(e.target.value);
                if (newVal > 10) newVal = 10;
                if (newVal < 1) newVal = 1;

                setRuleValue(newVal);
              }}
            />
          </div>
        </FormControl>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <FormGroup >
          {glDashboardChart?.map((data: any, index: any) => {
            return (
              <FormControlLabel key={index} control={<Checkbox checked={data.status === true} />} label={data.name} onChange={(event) => glDasCheckbox(event, index)} />
            )
          })}
        </FormGroup>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box sx={{ width: 300 }}>
          <Typography id="input-slider" gutterBottom>
            High
          </Typography>
          <Slider
            size="small"
            aria-label="Small"
            valueLabelDisplay="auto"
            value={rangeHigh}
            marks={marks}
            sx={{ color: '#d60000' }}
            onChange={(e: any) => setRangeHigh(e.target.value)}
          />
        </Box>
        <Box sx={{ width: 300 }}>
          <Typography id="input-slider" gutterBottom>
            Medium
          </Typography>
          <Slider
            size="small"
            aria-label="Small"
            valueLabelDisplay="auto"
            value={rangeMedium}
            max={100}
            disabled={value >= rangeHigh}
            marks={marks}
            sx={{ color: '#f2641a' }}
            onChange={(e: any) => handleMedium(e)}
          />
        </Box>
        <Box sx={{ width: 300 }}>
          <Typography id="input-slider" gutterBottom>
            Low
          </Typography>
          <Slider
            size="small"
            aria-label="Small"
            valueLabelDisplay="auto"
            value={rangeLow}
            max={100}
            disabled={value >= rangeMedium}
            marks={marks}
            sx={{ color: '#f5af2d' }}
            onChange={(e: any) => handleLow(e)}
          />
        </Box>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          {/* <Button variant="contained" disabled>Cancel</Button>
                <Button variant="contained" disabled>
                    Save
                </Button> */}
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <FormControl error variant="standard">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
            <TextField sx={{ width: "200px", m: 3 }} id="ai-score" value={materialValue || ''} label="Materiality" variant="standard" type="number"
              onChange={(e) => {
                var newVal = parseInt(e.target.value);
                if (newVal < 1) newVal = 1;
                setMaterialValue(newVal);
              }}
            />
            <TextField sx={{ width: "200px", m: 3 }} id="stat-score" value={thresholdValue || ''} label="Threshold" variant="standard" type="number"
              onChange={(e) => {
                var newVal = parseInt(e.target.value);
                if (newVal < 1) newVal = 1;
                setThresholdValue(newVal);
              }}
            />
          </div>
        </FormControl>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          {/* <Button variant="contained" disabled>Cancel</Button>
                <Button variant="contained" disabled>
                    Save
                </Button> */}
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      {/* Auto posting user  */}
      <TabPanel value={value} index={4}>
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={isChecked == true} onChange={() => setIsChecked(!isChecked)} />} label="Enable Auto Posting" />
        </FormGroup>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
        </Stack>
        {isChecked == true
          ?
          <TableContainer component={Paper} style={{ maxHeight: 250, overflow: 'auto' }}>
            <Table aria-label="simple table" stickyHeader sx={{
              minWidth: 350,
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none"
              }
            }}>
              <TableHead >
                <TableRow
                >
                  <TableCell sx={{ fontWeight: 'bold' }}>Posting Users</TableCell>
                  <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''} &nbsp; &nbsp;Users Selected </TableCell>
                  <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}><Button sx={{ textTransform: 'capitalize' }} onClick={() => clearAllAutoPostingUser()}>Clear All</Button></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {getAllUsersDetails?.map((user: any, index: any) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Checkbox checked={userIsChecked?.[index] == true} onChange={(e) => userCheckBoxDetails(index, user.FMSUSERID, e.target.checked)} /> {user.FMSUSER_CODE}
                      </TableCell>

                      <TableCell align="right">{userIsChecked?.[index] ? <>{user.FMSUSER_CODE}</> : ""}</TableCell>
                      <TableCell align="right" >{userIsChecked?.[index] ? <><HighlightOffRoundedIcon onClick={() => cancelUser(index)} /></> : ""}</TableCell>

                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          :
          ''
        }
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <BasicTable assignWeights={assignWeights} setAssignWeights={setAssignWeights} />
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={6}>
        <TableContainer component={Paper} style={{ maxHeight: 250 }}>
          <Table aria-label="simple table" stickyHeader sx={{
            minWidth: 350,
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none"
            }
          }}>
            <TableHead >
              <TableRow
              >
                <TableCell sx={{ fontWeight: 'bold' }}>Users</TableCell>
                <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedFightUsersCheckboxes ? totalSelectedFightUsersCheckboxes : ''} &nbsp; &nbsp;Users Selected </TableCell>
                <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}><Button sx={{ textTransform: 'capitalize' }} onClick={() => clearAllFightUser()}>Clear All</Button></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {getFireFighterUser?.map((user: { FMSUSERID: React.Key | null | undefined; FMSUSER_CODE: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: any) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Checkbox checked={FightUerIsChecked?.[index] == true} onChange={(e) => fightUserCheckBoxDetails(index, user.FMSUSERID, e.target.checked)} /> {user.FMSUSER_CODE}
                  </TableCell>

                  <TableCell align="right">{FightUerIsChecked?.[index] ? <>{user.FMSUSER_CODE}</> : ""}</TableCell>
                  <TableCell align="right" >{FightUerIsChecked?.[index] ? <><HighlightOffRoundedIcon onClick={() => cancelFightUser(index)} /></> : ""}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={7}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="week-start">Business Week Start</InputLabel>
          <Select
            labelId="week-start"
            id="week-start"
            value={weekStart}
            onChange={handleChangeWeekStart}
            label="Age"
            style={{ width: '15vw' }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={'Monday'}>Monday</MenuItem>
            <MenuItem value={'Tuesday'}>Tuesday</MenuItem>
            <MenuItem value={'Wednesday'}>Wednesday</MenuItem>
            <MenuItem value={'Thursday'}>Thursday</MenuItem>
            <MenuItem value={'Friday'}>Friday</MenuItem>
            <MenuItem value={'Saturday'}>Saturday</MenuItem>
            <MenuItem value={'Sunday'}>Sunday</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="week-end">Business Week End</InputLabel>
          <Select
            labelId="week-end"
            id="week-end"
            value={weekEnd}
            onChange={handleChangeWeekEnd}
            label="Age"
            style={{ width: '15vw' }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={'Monday'}>Monday</MenuItem>
            <MenuItem value={'Tuesday'}>Tuesday</MenuItem>
            <MenuItem value={'Wednesday'}>Wednesday</MenuItem>
            <MenuItem value={'Thursday'}>Thursday</MenuItem>
            <MenuItem value={'Friday'}>Friday</MenuItem>
            <MenuItem value={'Saturday'}>Saturday</MenuItem>
            <MenuItem value={'Sunday'}>Sunday</MenuItem>
          </Select>
        </FormControl>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          {/* <Button variant="contained" disabled>Cancel</Button>
                <Button variant="contained" disabled>
                    Save
                </Button> */}
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={8}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            {/* <TimePicker
              label="Business Hours Start"
              value={startTime}
              onChange={handleChangeStartTime}
              minutesStep={60}
              renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField {...params} />}
            /> */}

          </FormControl>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            {/* <TimePicker
              label="Business Hours End"
              value={endTime}
              onChange={handleChangeEndTime}
              minutesStep={60}
              renderInput={(params) => <TextField {...params} />}
            /> */}

          </FormControl>
        </LocalizationProvider>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          {/* <Button variant="contained" disabled>Cancel</Button>
                <Button variant="contained" disabled>
                    Save
                </Button> */}
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      {/* <TabPanel value={value} index={9}>
        <FormGroup>
          <FormControlLabel control={<Checkbox onChange={(e) => handleManualJournalCheckbox(e)} checked={manualJournalUpdateStatus ? manualJournalUpdateStatus === 1 : manualJournalStatus?.STATUS === 1} />} label="Manual Journal Entries" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Journal Entry Mismatch Debits" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Journal Entry Mismatch Credits" />
        </FormGroup>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" disabled>Cancel</Button>
                <Button variant="contained" disabled>
                    Save
                </Button>
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel> */}
      <TabPanel value={value} index={9}>
        <Accordion sx={{ overflow: 'auto' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"

          >
            <Typography>Dates</Typography>
          </AccordionSummary>
          <div style={{ maxHeight: '40vh' }}>
            {/* <p>starting</p> */}
            {(holiday)?.map((itm: any, index: any) => (
              <AccordionDetails >
                <Typography key={index} >
                  <div className="flex flex-wrap justify-center gap-x-2 gap-y-2" >
                    <TextField sx={{ width: "150px", m: 3 }} id="ai-gl-score" label="Name" variant="standard" type="text" value={itm.name}
                      onChange={(e) => handleDatesName(e, index)}
                    />
                    {itm.range == true
                      ?
                      <div style={{ width: '20vw', marginTop: '6vh', backgroundColor: 'white' }}>
                        {/* <DateRangePickerComponent id="daterangepicker" format="dd/MM/yyyy" change={handleDateChange} startDate={minDate} endDate={maxDate} /> */}
                        <DateRangePicker
                          placeholder=" "
                          size="md"
                          onChange={handleDateChange}
                          style={{ width: "100%", height: "100%" }}
                          gap-10
                          format="dd/MM/yyyy"
                          placement="bottomEnd"
                          value={
                            minDate && maxDate
                              ? [new Date(minDate), new Date(maxDate)]
                              : null
                          }
                        />
                      </div>
                      :
                      <TextField sx={{ width: "150px", m: 4.8, }} id="stat-gl-score" defaultValue={itm.value} variant="standard" type="date" value={itm.value}
                        onChange={(e) => handleUpdatedDatesVal(e, index)}
                      />
                    }
                    <p style={{ marginTop: '6vh' }}><Checkbox onClick={() => handleRange(itm, index)} /> Range </p>
                    <p style={{ marginTop: '6vh' }}><Button><DeleteIcon style={{ color: 'gray' }} fontSize='medium' onClick={() => handleDelete(itm, index)} /></Button>  </p>
                  </div >
                </Typography>
              </AccordionDetails>
            ))}
            <p style={{ height: '2.5vh' }}></p>
            <p style={{ marginTop: '-5vh' }} >
              <IconButton sx={{ display: 'flex', left: '40vw' }} >
                <AddCircleRoundedIcon fontSize="large" onClick={() => handleAddRow(holiday)} />
              </IconButton>
            </p>
            <div ref={divRef} style={{ height: '2.5vh' }}></div>
          </div>
        </Accordion>
        <AlertComponent
          openAlert={isShowDeleteMesg}
          handleClose={handleAlertClose}
          message='Deleted Successfully'
          vertical={"bottom"}
          horizontal={"center"}
          severity={"success"}
        />
        {/* {isShowDeleteMesg ? <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}>Deleted Successfully</p> : ''} */}
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>

        </Stack>
      </TabPanel>
      <TabPanel value={value} index={10}>
        <FormControl error variant="standard">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
            <TextField sx={{ width: "200px", m: 3 }} id="rule-gl-score" value={bufferDays || ''} label="Buffer Days" variant="standard" type="number"
              onChange={(e) => {
                var newVal = parseInt(e.target.value);

                if (newVal > 90) newVal = 90;
                if (newVal < 1) newVal = 1;

                setBufferDays(newVal);
              }}
            />
          </div>
        </FormControl>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={11}>
        <Tags getRoundOffData={getRoundOffData} handleRound={handleRound} setGetRoundOffData={setGetRoundOffData} name='round' />
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={12}>
        <Autocomplete
          multiple
          // onChange={(e, value) => setReceivers((state) => value)}
          id="tags-filled"
          sx={{ minWidth: '25vw' }}
          options={demo.map((option: { title: any; }) => option.title)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          onChange={(e: any) => handleFinanceDept(e)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label="Select Non Finance Department"
            // placeholder="Favorites"
            />
          )}
        />
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={13}>
        <Tags getSuspiciousKey={getSuspiciousKey} handleSuspiciousKey={handleSuspiciousKey} setGetSuspiciousKey={setGetSuspiciousKey} name='suspicious' />
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={14}>
        <FormControl error variant="standard">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
            <TextField sx={{ width: "200px", m: 3 }} id="period-start" value={periodStartValue} label="Period Start" variant="standard" type="number"
              onChange={(e) => {
                var newVal = parseInt(e.target.value);
                if (newVal > 30) newVal = 30;
                if (newVal < 1) newVal = 1;
                setPeriodStartValue(newVal);
              }}
            />
            <TextField sx={{ width: "200px", m: 3 }} id="period-end" value={periodEndValue} label="Period End" variant="standard" type="number"
              onChange={(e) => {
                var newVal = parseInt(e.target.value);

                if (newVal > 30) newVal = 30;
                if (newVal < 1) newVal = 1;

                setPeriodEndValue(newVal);
              }}
            />

          </div>
        </FormControl>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          {/* <Button variant="contained" disabled>Cancel</Button>
                <Button variant="contained" disabled>
                    Save
                </Button> */}
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={15}>
        <FormGroup>
        </FormGroup>
        <Accordion style={{ maxWidth: '65vw' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Account referring to Cash Concentration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableContainer component={Paper} style={{ maxHeight: 200 }}>
                <Table aria-label="simple table" stickyHeader sx={{
                  width: 130,
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none"
                  }
                }}>
                  <TableHead >
                    <TableRow
                    >
                      <TableCell sx={{ fontWeight: 'bold' }} >Search Accounts Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} style={{ width: 105 }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''}Selected </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} style={{ width: 105 }}>Clear All</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ display: 'flex', maxHeight: '24vh' }}>
                    <TableRow >
                      <TableCell style={{ maxHeight: '2vh', maxWidth: '25vw' }}>
                        {/* <MaskedTextBoxComponent change={searchNodes.bind(this)} /> */}
                        {/* <TreeViewComponent fields={fields} ref={(treeview) => { treeObj = treeview as TreeViewComponent; }} showCheckBox={true} nodeChecked={(e) => nodeChecked(e, name = 'cashConcern')} /> */}
                      </TableCell>
                      <TableCell >
                        {cashConcentration}
                        {accountCode.map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))}
                      </TableCell>
                      <TableCell>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion style={{ maxWidth: '65vw' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>List of Accounts Expected on the credit side</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableContainer component={Paper} style={{ maxHeight: 200 }}>
                <Table aria-label="simple table" stickyHeader sx={{
                  maxWidth: 350,
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none"
                  }
                }}>
                  <TableHead >
                    <TableRow
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>Search Accounts Description</TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''} &nbsp; &nbsp;Selected </TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}>Clear All</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {/* <TreeViewComponent fields={fields} showCheckBox={true} nodeChecked={(e) => nodeChecked(e, name = "cashCredit")} /> */}
                      </TableCell>
                      {/* <TableCell align="left" style={{ maxHeight: '10vh', overflow: 'auto' }}> */}
                      <TableCell >
                        {cashCredit?.split(',').map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {itm}
                          </TableRow>
                        ))}
                        {accountCode.map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))}
                      </TableCell>
                      {/* <TableRow>
                          {cashCredit}
                        </TableRow> */}
                      {/* {accountCode.map((itm: any) => (
                          <TableRow>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))} */}
                      {/* </TableCell> */}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion style={{ maxWidth: '65vw' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>List of Accounts Expected on the debit side</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableContainer component={Paper} style={{ maxHeight: 200 }}>
                <Table aria-label="simple table" stickyHeader sx={{
                  maxWidth: 350,
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none"
                  }
                }}>
                  <TableHead >
                    <TableRow
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>Search Accounts Description</TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''} &nbsp; &nbsp;Users Selected </TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}>Clear All</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {/* <TreeViewComponent fields={fields} showCheckBox={true} nodeChecked={(e) => nodeChecked(e, name = 'cashDebit')} /> */}
                      </TableCell>
                      <TableCell align="left" style={{ maxHeight: '10vh', overflow: 'auto' }}>
                        {cashDebit?.split(',').map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {itm}
                          </TableRow>
                        ))}
                        {accountCode.map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={16}>
        <FormGroup>
        </FormGroup>
        <Accordion style={{ maxWidth: '65vw' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Account referring to Cash Disbursement</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableContainer component={Paper} style={{ maxHeight: 300 }}>
                <Table aria-label="simple table" stickyHeader sx={{
                  maxWidth: 350,
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none"
                  }
                }}>
                  <TableHead >
                    <TableRow
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>Search Accounts Description</TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''} &nbsp; &nbsp;Users Selected </TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}>Clear All</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {/* <TreeViewComponent fields={fields} showCheckBox={true} nodeChecked={(e) => nodeChecked(e, name = 'cashDisbursment')} /> */}
                      </TableCell>
                      <TableCell align="left" style={{ maxHeight: '10vh', overflow: 'auto' }}>
                        <TableRow>
                          {cashDisbursment}
                        </TableRow>
                        {accountCode.map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion style={{ maxWidth: '65vw' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>List of Accounts Expected on the credit side</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableContainer component={Paper} style={{ maxHeight: 300 }}>
                <Table aria-label="simple table" stickyHeader sx={{
                  maxWidth: 350,
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none"
                  }
                }}>
                  <TableHead >
                    <TableRow
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>Search Accounts Description</TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''} &nbsp; &nbsp;Users Selected </TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}>Clear All</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {/* <TreeViewComponent fields={fields} showCheckBox={true} nodeChecked={(e) => nodeChecked(e, name = 'dbCredit')} /> */}
                      </TableCell>
                      <TableCell align="left" style={{ maxHeight: '10vh', overflow: 'auto' }}>
                        <TableRow>
                          {dbCredit}
                        </TableRow>
                        {accountCode.map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion style={{ maxWidth: '65vw' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>List of Accounts Expected on the debit side</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableContainer component={Paper} style={{ maxHeight: 300 }}>
                <Table aria-label="simple table" stickyHeader sx={{
                  maxWidth: 350,
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none"
                  }
                }}>
                  <TableHead >
                    <TableRow
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>Search Accounts Description</TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''} &nbsp; &nbsp;Users Selected </TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}>Clear All</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {/* <TreeViewComponent fields={fields} showCheckBox={true} nodeChecked={(e) => nodeChecked(e, name = 'dbDebit')} /> */}
                      </TableCell>
                      <TableCell align="left" style={{ maxHeight: '10vh', overflow: 'auto' }}>
                        <TableRow>
                          {dbDebit}
                        </TableRow>
                        {accountCode.map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={17}>
        <FormGroup>
        </FormGroup>
        <Accordion style={{ maxWidth: '65vw' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Account referring to Cash Payroll</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableContainer component={Paper} style={{ maxHeight: 300 }}>
                <Table aria-label="simple table" stickyHeader sx={{
                  maxWidth: 250,
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none"
                  }
                }}>
                  <TableHead >
                    <TableRow
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>Search Accounts Description</TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''} &nbsp; &nbsp;Users Selected </TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}>Clear All</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {/* <TreeViewComponent fields={fields} showCheckBox={true} nodeChecked={(e) => nodeChecked(e, name = 'cashPayrole')} /> */}
                      </TableCell>
                      <TableCell align="left" style={{ maxHeight: '10vh', overflow: 'auto' }}>
                        <TableRow>
                          {cashPayrole}
                        </TableRow>
                        {accountCode.map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion style={{ maxWidth: '65vw' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>List of Accounts Expected on the credit side</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableContainer component={Paper} style={{ maxHeight: 300 }}>
                <Table aria-label="simple table" stickyHeader sx={{
                  maxWidth: 350,
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none"
                  }
                }}>
                  <TableHead >
                    <TableRow
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>Search Accounts Description</TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''} &nbsp; &nbsp;Users Selected </TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}>Clear All</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {/* <TreeViewComponent fields={fields} showCheckBox={true} nodeChecked={(e) => nodeChecked(e, name = 'prCredit')} /> */}
                      </TableCell>
                      <TableCell align="left" style={{ maxHeight: '10vh', overflow: 'auto' }}>
                        <TableRow>
                          {prCredit}
                        </TableRow>
                        {accountCode.map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion style={{ maxWidth: '65vw' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>List of Accounts Expected on the debit side</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableContainer component={Paper} style={{ maxHeight: 300 }}>
                <Table aria-label="simple table" stickyHeader sx={{
                  maxWidth: 350,
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none"
                  }
                }}>
                  <TableHead >
                    <TableRow
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>Search Accounts Description</TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold' }}>{totalSelectedCheckboxes ? totalSelectedCheckboxes : ''} &nbsp; &nbsp;Users Selected </TableCell>
                      <TableCell align="right" style={{ width: 105 }} sx={{ fontWeight: 'bold', }}>Clear All</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {/* <TreeViewComponent fields={fields} showCheckBox={true} nodeChecked={(e) => nodeChecked(e, name = 'prDebit')} /> */}
                      </TableCell>
                      <TableCell align="left" style={{ maxHeight: '10vh', overflow: 'auto' }}>
                        <TableRow>
                          {prDebit}
                        </TableRow>
                        {accountCode.map((itm: any, index: any) => (
                          <TableRow key={index}>
                            {isShowCode
                              ?
                              <p style={{ fontWeight: 'bold' }}>{itm.code} &nbsp; <span >- &nbsp; &nbsp;{itm.title}</span></p>
                              :
                              ""
                            }
                          </TableRow>
                        ))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
            Next
          </Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={18}>
        <FormGroup>
          <p>Update Edited Data</p>
        </FormGroup>
        <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
          <Button variant="contained" onClick={() => setValue(value - 1)}>
            Back
          </Button>
          <Button variant="contained" onClick={saveData}> Save </Button>
        </Stack>
        <AlertComponent
          openAlert={visible}
          handleClose={handleAlertClose}
          message={updateApiResMesg ? updateApiResMesg : 'upload failed kindly fill all the fields'}
          vertical={"bottom"}
          horizontal={"center"}
          severity={"success"}
        />
      </TabPanel>
    </Box>
  );

}
export default GLConfiguration;
