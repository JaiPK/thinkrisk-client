import * as React from 'react';
import { useEffect, useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import ControlledRadioButtonsGroup from './RadioSelect';

import Tags from './Chips';

import DragableList from './ListView';

import BasicTable from './RuleTable';

import axios from '../../../../api/axios';
import { useNavigate } from 'react-router-dom';
import AlertComponent from '../../../ui/alert-component/AlertComponent';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
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
const APConfiguration = (props: any) => {
    const navigate = useNavigate();

    const [value, setValue] = React.useState(0);
    const [ruleValue, setRuleValue] = React.useState(5);
    const [aiValue, setAiValue] = React.useState<any>();
    const [materialValue, setMaterialValue] = React.useState<any>();
    const [thresholdValue, setThresholdValue] = React.useState<any>();
    const [shortCreditValue, setShortCreditValue] = React.useState<any>();
    const [unpaidInvoiceValue, setUnpaidInvoiceValue] = React.useState<any>();
    const [immediatePaymentValue, setImmediatePaymentValue] = React.useState<any>();
    const [getModuleConfig, setGetModuleConfig] = useState<any>()
    const [updateApiResMesg, setUpdateApiResMesg] = useState<any>();
    const [accountStyle, setaccountStyle] = useState<any>();
    const [dashboardCharts, setDashboardCharts] = useState<any>();
    const [rangeHigh, setRangeHigh] = useState<any>();
    const [rangeMedium, setRangeMedium] = useState<any>();
    const [rangeLow, setRangeLow] = useState<any>();
    const [assignWeights, setAssignWeights] = useState<any>();
    const [getSuspiciousKey, setGetSuspiciousKey] = React.useState<any>();
    const [visible, setVisible] = useState(false);
    const [updateApiFailedResMesg, setUpdateApiFailedResMesg] = useState<any>();
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const [reOrderSequence, setReOrderSequence] = useState<any>();
    const [dateSequence, setDateSequence] = useState<any>()
    const min = 1;
    const max = 10;
    const Axios = axios;
    const GET_CONFIG_MODULE = 'v1/config/getmoduleconfig';
    const SAVE_ALL_DATA = 'v1/config/setmoduleconfig';

    const getConfigModule = async () => {
        let formData = new FormData();
        formData.append("module", "apframework");
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
            setAssignWeights(result);
            setGetModuleConfig(dataRecord)
            for (let i = 0; i < dataRecord.length; i++) {

                if (dataRecord[i].KEYNAME === "RISK_WEIGHT_AI") {
                    setAiValue(dataRecord[i].KEYVALUE);
                }
                if (dataRecord[i].KEYNAME === "RISK_WEIGHT_RULE") {
                    setRuleValue(dataRecord[i].KEYVALUE);
                }
                if (dataRecord[i].KEYNAME === "account_style") {
                    setaccountStyle(dataRecord[i].KEYVALUE);
                }
                if (dataRecord[i].KEYNAME === "AP_Dashboard_Charts") {
                    setDashboardCharts(JSON.parse(dataRecord[i].KEYVALUE));
                }
                if (dataRecord[i].KEYNAME === "range_high") {
                    setRangeHigh(dataRecord[i].KEYVALUE * 100);
                }
                if (dataRecord[i].KEYNAME === "range_medium") {
                    setRangeMedium(dataRecord[i].KEYVALUE * 100);
                }
                if (dataRecord[i].KEYNAME === "range_low") {
                    setRangeLow(dataRecord[i].KEYVALUE * 100);
                }
                if (dataRecord[i].KEYNAME === "metiriality_amount") {
                    setMaterialValue(dataRecord[i].KEYVALUE);
                }
                if (dataRecord[i].KEYNAME === "threshold_amount") {
                    setThresholdValue(dataRecord[i].KEYVALUE);
                }
                if (dataRecord[i].KEYNAME === "shorter_credit") {
                    setShortCreditValue(dataRecord[i].KEYVALUE);
                }
                if (dataRecord[i].KEYNAME === "suspicious_words") {
                    let data = JSON.parse(dataRecord[i].KEYVALUE)
                    setGetSuspiciousKey(data);
                }
                if (dataRecord[i].KEYNAME === "immediate_payments") {
                    setImmediatePaymentValue(dataRecord[i].KEYVALUE);
                }
                if (dataRecord[i].KEYNAME === "old_unpaid_invoice") {
                    setUnpaidInvoiceValue(dataRecord[i].KEYVALUE);
                }
                if (dataRecord[i].KEYNAME === "date_Sequence") {
                    setReOrderSequence(JSON.parse(dataRecord[i].KEYVALUE));
                }
            }
        }
        catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };
    const handleSuspiciousKey = (event: any) => {
        let getSuspiciousKeyCopy = [...getSuspiciousKey]
        getSuspiciousKeyCopy.push(event.target.value)
        setGetSuspiciousKey(getSuspiciousKeyCopy)
    }
    const saveData = async () => {
        let updateModuleConfig = [...getModuleConfig]
        for (let i = 0; i < updateModuleConfig.length; i++) {

            if (updateModuleConfig[i].KEYNAME == 'RISK_WEIGHT_AI') {
                updateModuleConfig[i].KEYVALUE = aiValue
            }
            if (updateModuleConfig[i].KEYNAME == 'RISK_WEIGHT_RULE') {
                updateModuleConfig[i].KEYVALUE = ruleValue
            }
            if (updateModuleConfig[i].KEYNAME == 'account_style') {
                updateModuleConfig[i].KEYVALUE = accountStyle
            }
            if (updateModuleConfig[i].KEYNAME == 'AP_Dashboard_Charts') {
                updateModuleConfig[i].KEYVALUE = dashboardCharts
            }
            if (updateModuleConfig[i].KEYNAME == 'range_high') {
                updateModuleConfig[i].KEYVALUE = rangeHigh / 100
            }
            if (updateModuleConfig[i].KEYNAME == 'range_medium') {
                updateModuleConfig[i].KEYVALUE = rangeMedium / 100
            }
            if (updateModuleConfig[i].KEYNAME == 'range_low') {
                updateModuleConfig[i].KEYVALUE = rangeLow / 100
            }
            if (updateModuleConfig[i].KEYNAME == 'metiriality_amount') {
                updateModuleConfig[i].KEYVALUE = materialValue
            }
            if (updateModuleConfig[i].KEYNAME == 'threshold_amount') {
                updateModuleConfig[i].KEYVALUE = thresholdValue
            }
            if (updateModuleConfig[i].KEYNAME == 'shorter_credit') {
                updateModuleConfig[i].KEYVALUE = shortCreditValue
            }
            if (updateModuleConfig[i].KEYNAME === "suspicious_words") {
                updateModuleConfig[i].KEYVALUE = getSuspiciousKey
            }
            if (updateModuleConfig[i].KEYNAME === "immediate_payments") {
                updateModuleConfig[i].KEYVALUE = immediatePaymentValue
            }
            if (updateModuleConfig[i].KEYNAME === "old_unpaid_invoice") {
                updateModuleConfig[i].KEYVALUE = unpaidInvoiceValue
            }
            if (updateModuleConfig[i].KEYNAME === "date_Sequence") {
                updateModuleConfig[i].KEYVALUE = reOrderSequence
            }
        }
        setGetModuleConfig(updateModuleConfig)

        let formData = new FormData();
        formData.append("module", "apframework");
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
            // getConfigModule()
            setVisible(true)
            setUpdateApiResMesg(updateData.data.message)
            setTimeout(() => {
                setVisible(false)
            }, 4000)
        } catch (error: any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }

    }
    const handleDasCheckbox = (event: any, index: any) => {
        if (event.target.checked == false) {
            let dashboardChartsCopy: any = [...dashboardCharts]
            dashboardChartsCopy[index].status = false
            setDashboardCharts(dashboardChartsCopy)
        }
        else if (event.target.checked == true) {
            let dashboardChartsCopy: any = [...dashboardCharts]
            dashboardChartsCopy[index].status = true
            setDashboardCharts(dashboardChartsCopy)
        }
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

    const findRuleStatus = (rule: string) => {
        if(assignWeights?.find((element:any) => element.KEYNAME === rule)?.STATUS === 1){
            return true
        }
        else
        {
            return false;
        }
    };

    useEffect(() => {
        getConfigModule()
    }, [])
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
                aria-label="Accounts Payable Configuration"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
                    <>
                        <div>
                            1. Risk Framework Weights
                            <Tooltip title="Assign the weights for risk scoring frameworks." placement="top">
                                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
                            </Tooltip>
                        </div>
                    </>
                }
                    {...a11yProps(0)} />
                {/* 
                <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
                    <>
                        <div>
                            2. Account Style
                            <Tooltip title="Description." placement="top">
                                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
                            </Tooltip>
                        </div>
                    </>
                }
                    {...a11yProps(1)} /> */}

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
                            5. Assign Weights to AP Rules
                            <Tooltip title="Configure the weights for each control point under AP." placement="top">
                                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
                            </Tooltip>
                        </div>
                    </>
                }
                    {...a11yProps(4)} />
                <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label={
                    <>
                        <div>
                            6. Date sequence of workflow
                            <Tooltip title="Define the sequential workflow of P2P process followed in the organization." placement="top">
                                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
                            </Tooltip>
                        </div>
                    </>
                }
                    {...a11yProps(5)} />
                <Tab style={{ display: assignWeights?.[1].STATUS === 1 ? 'block' : 'none' }} sx={{ alignItems: 'start', textAlign: 'start' }} label={
                    <>
                        <div>
                            7. Unfavourable payment term
                            <Tooltip title="How many days  would you consider  as a shorter credit period in your company?" placement="top">
                                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
                            </Tooltip>
                        </div>
                    </>
                }
                    {...a11yProps(6)} />
                <Tab style={{ display: assignWeights?.[2].STATUS === 1 ? 'block' : 'none' }} sx={{ alignItems: 'start', textAlign: 'start' }} label={
                    <>
                        <div>
                            8. Suspicious key words
                            <Tooltip title="How many days  would you consider  as a shorter credit period in your company?" placement="top">
                                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
                            </Tooltip>
                        </div>
                    </>
                }
                    {...a11yProps(7)} />
                <Tab style={{ display: assignWeights?.[3].STATUS === 1 ? 'block' : 'none' }} sx={{ alignItems: 'start', textAlign: 'start' }} label={
                    <>
                        <div>
                            9. Immediate Payments
                            <Tooltip title="Payments made to the vendor within a specific time period before the due date." placement="top">
                                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
                            </Tooltip>
                        </div>
                    </>
                }
                    {...a11yProps(8)} />
                <Tab style={{ display: findRuleStatus('WEIGHT_OLD_UNPAID_INVOICE') ? 'block' : 'none' }} sx={{ alignItems: 'start', textAlign: 'start' }} label={
                    <>
                        <div>
                            10. Old Unpaid Invoice
                            <Tooltip title="Identify invoices that have not been settled for more than 'n' number of days after due date" placement="top">
                                <InfoIcon style={{ fontSize: '16px', color: '#1976d2' }} />
                            </Tooltip>
                        </div>
                    </>
                }
                    {...a11yProps(9)} />
                <Tab sx={{ alignItems: 'start', textAlign: 'start' }} label="11. Save Data" {...a11yProps(10)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <h4>Risk Framework Weights</h4>
                <FormControl error variant="standard">
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
                        <TextField sx={{ width: "200px", m: 3 }} id="ai-ap-score" value={aiValue || ''} label="AI Risk Score" variant="standard" type="number" InputProps={{ inputProps: { min: 0, max: 10 } }}
                            onChange={(e) => {
                                var newVal = parseInt(e.target.value, 10);
                                if (newVal > max) newVal = max;
                                if (newVal < min) newVal = min;

                                setAiValue(newVal);
                            }}
                        />
                        <TextField sx={{ width: "200px", m: 3 }} id="rule-ap-score" value={ruleValue || ''} label="Rule Risk Score" variant="standard" type="number"
                            onChange={(e) => {
                                var newVal = parseInt(e.target.value, 10);

                                if (newVal > max) newVal = max;
                                if (newVal < min) newVal = min;

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
            {/* <TabPanel value={value} index={1}>
                <ControlledRadioButtonsGroup accountStyle={accountStyle} setaccountStyle={setaccountStyle} />
                <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
                    <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
                        Next
                    </Button>
                </Stack>
            </TabPanel> */}
            <TabPanel value={value} index={1}>
                <h4> Dashboard Charts</h4>
                {dashboardCharts?.map((chart: any, index: any) => (
                    <FormGroup>
                        <FormControlLabel key={index} onChange={(e) => handleDasCheckbox(e, index)} control={<Checkbox checked={chart.status == true} />} label={chart.name} />
                    </FormGroup>
                ))}
                <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
                    <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
                        Next
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <h4>High - Medium - Low Definition</h4>
                <Box sx={{ width: 300 }}>
                    <Typography id="input-slider" gutterBottom>
                        High
                    </Typography>
                    <Slider
                        size="small"
                        defaultValue={rangeHigh}
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
                        defaultValue={rangeMedium}
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
                        defaultValue={rangeLow}
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
                    <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
                        Next
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <h4>Threshold</h4>
                <FormControl error variant="standard">
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
                        <TextField sx={{ width: "200px", m: 3 }} id="ai-score" value={materialValue || ''} label="Materiality" variant="standard" type="number"
                            onChange={(e) => {
                                var newVal = parseInt(e.target.value, 10);
                                if (newVal < min) newVal = min;
                                setMaterialValue(newVal);
                            }}
                        />
                        <TextField sx={{ width: "200px", m: 3 }} id="stat-score" value={thresholdValue || ''} label="Threshold" variant="standard" type="number"
                            onChange={(e) => {
                                var newVal = parseInt(e.target.value, 10);
                                if (newVal < min) newVal = min;
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
            <TabPanel value={value} index={4}>
                <h4> Assign Weights to AP Rules</h4>
                < BasicTable assignWeights={assignWeights} setAssignWeights={setAssignWeights} />
                <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
                    <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
                        Next
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={5}>
                <h4>Date sequence of workflow</h4>
                <DragableList setReOrderSequence={setReOrderSequence} reOrderSequence={reOrderSequence} />
                <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
                    <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
                        Next
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={6}>
                <h4>Unfavourable payment term</h4>
                <FormControl error variant="standard">
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
                        <TextField sx={{ width: "200px", m: 3 }} id="short-credit" value={shortCreditValue} label="Define shorter Credit Term" variant="standard" type="number" InputProps={{ inputProps: { min: 0, max: 30 } }}
                            onChange={(e) => {
                                var newVal = parseInt(e.target.value, 10);
                                if (newVal < min) newVal = min;
                                setShortCreditValue(newVal);
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
            <TabPanel value={value} index={7}>
                <h4> Suspicious key words</h4>
                <Tags getSuspiciousKey={getSuspiciousKey} handleSuspiciousKey={handleSuspiciousKey} setGetSuspiciousKey={setGetSuspiciousKey} name='suspicious' />
                <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
                    <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
                        Next
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={8}>
                <h4>Immediate Payments</h4>
                <FormControl error variant="standard">
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
                        <div className=" pt-8">Payments made with in</div>
                        <TextField sx={{ width: "50px", m: 3, marginLeft: 0, marginRight: 0 }} id="immediate-payment" value={immediatePaymentValue} variant="standard" type="number" InputProps={{ inputProps: { min: 0, max: 30 } }}
                            onChange={(e) => {
                                var newVal = parseInt(e.target.value, 10);
                                if (newVal < min) newVal = min;
                                setImmediatePaymentValue(newVal);
                            }}
                        />
                        <div className=" pt-8">% of the credit period</div>
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
            <TabPanel value={value} index={9}>
                <h4> Old Unpaid Invoice</h4>
                <FormControl error variant="standard">
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
                        <div className=" pt-8">Invoices that have not been settled for more than</div>
                        <TextField sx={{ width: "50px", m: 3, marginLeft: 0, marginRight: 0 }} id="unpaid-invoices" value={unpaidInvoiceValue} variant="standard" type="number" InputProps={{ inputProps: { min: 0, max: 30 } }}
                            onChange={(e) => {
                                var newVal = parseInt(e.target.value, 10);
                                if (newVal < min) newVal = min;
                                setUnpaidInvoiceValue(newVal);
                            }}
                        />
                        <div className=" pt-8">days after due date</div>
                    </div>
                </FormControl>
                <Stack mt={4} alignItems="flex-end" justifyContent="flex-end" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
                    <Button variant="contained" href="#contained-buttons" onClick={() => setValue(value + 1)}>
                        Next
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={10}>
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
export default APConfiguration;
