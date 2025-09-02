import * as React from "react";
import { useEffect, useState, forwardRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import Tags from "../../../features/modules/configuration/components/Chips";
import DragableList from "../../../features/modules/configuration/components/ListView";
import BasicTable from "../../../features/modules/configuration/components/RuleTable";
import axios from "../../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

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
        <Box sx={{ p: 3, fontWeight: "bold" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `gl-vertical-tab-${index}`,
    "aria-controls": `gl-vertical-tabpanel-${index}`,
  };
}

interface ClickProps {
  auditId: any;
  clientId: any;
  ref: any;
}

interface ConfigurationProps extends ClickProps {}

const Configuration: React.FC<ConfigurationProps> = forwardRef(
  ({ auditId, clientId }, ref) => {
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);
    const [ruleValue, setRuleValue] = React.useState(5);
    const [aiValue, setAiValue] = React.useState<any>();
    const [materialValue, setMaterialValue] = React.useState<any>();
    const [thresholdValue, setThresholdValue] = React.useState<any>();
    const [shortCreditValue, setShortCreditValue] = React.useState<any>();
    const [unpaidInvoiceValue, setUnpaidInvoiceValue] = React.useState<any>();
    const [immediatePaymentValue, setImmediatePaymentValue] =
      React.useState<any>();
    const [getModuleConfig, setGetModuleConfig] = useState<any>();
    const [dashboardCharts, setDashboardCharts] = useState<any>();
    const [rangeHigh, setRangeHigh] = useState<any>();
    const [rangeMedium, setRangeMedium] = useState<any>();
    const [rangeLow, setRangeLow] = useState<any>();
    const [assignWeights, setAssignWeights] = useState<any>();
    const [getSuspiciousKey, setGetSuspiciousKey] = React.useState<any>();
    const [reOrderSequence, setReOrderSequence] = useState<any>();
    const [accountStyle, setAccountStyle] = useState<string>("");

    const min = 1;
    const max = 9;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    const getConfigData = async () => {
      let updateModuleConfig = [...getModuleConfig];
      for (let i = 0; i < updateModuleConfig.length; i++) {
        switch (updateModuleConfig[i].KEYNAME) {
          case "RISK_WEIGHT_AI":
            updateModuleConfig[i].KEYVALUE = aiValue;
            break;
          case "RISK_WEIGHT_RULE":
            updateModuleConfig[i].KEYVALUE = ruleValue;
            break;
          case "account_style":
            updateModuleConfig[i].KEYVALUE = accountStyle;
            break;
          case "AP_Dashboard_Charts":
            updateModuleConfig[i].KEYVALUE = dashboardCharts;
            break;
          case "range_high":
            updateModuleConfig[i].KEYVALUE = rangeHigh
              ? rangeHigh / 100
              : null;
            break;
          case "range_medium":
            updateModuleConfig[i].KEYVALUE = rangeMedium
              ? rangeMedium / 100
              : null;
            break;
          case "range_low":
            updateModuleConfig[i].KEYVALUE = rangeLow ? rangeLow / 100 : null;
            break;
          case "metiriality_amount":
            updateModuleConfig[i].KEYVALUE = materialValue;
            break;
          case "threshold_amount":
            updateModuleConfig[i].KEYVALUE = thresholdValue;
            break;
          case "shorter_credit":
            updateModuleConfig[i].KEYVALUE = shortCreditValue;
            break;
          case "suspicious_words":
            updateModuleConfig[i].KEYVALUE = getSuspiciousKey;
            break;
          case "immediate_payments":
            updateModuleConfig[i].KEYVALUE = immediatePaymentValue;
            break;
          case "old_unpaid_invoice":
            updateModuleConfig[i].KEYVALUE = unpaidInvoiceValue;
            break;
          case "date_Sequence":
            updateModuleConfig[i].KEYVALUE = reOrderSequence;
            break;
          default:
            break;
        }
      }
      setGetModuleConfig(updateModuleConfig);
      return updateModuleConfig;
    };

    React.useImperativeHandle(ref, () => ({
      getConfigData,
    }));
    const getConfigModule = async () => {
      try {
        if (auditId) {
          const getModuleConfigResponse = await axios.get(
            `v1/client/${clientId}/audit/${auditId}`,
            {
              headers: {
                Authorization: localStorage.getItem("TR_Token") as string,
              },
            }
          );
          let dataRecord = getModuleConfigResponse.data.data.configuration;
          let result = dataRecord.filter((dataRecord: { KEYNAME: string }) =>
            dataRecord.KEYNAME.startsWith("WEIGHT_")
          );
          setAssignWeights(result);
          setGetModuleConfig(dataRecord);
          for (let i = 0; i < dataRecord.length; i++) {
            switch (dataRecord[i].KEYNAME) {
              case "RISK_WEIGHT_AI":
                setAiValue(dataRecord[i].KEYVALUE);
                break;
              case "RISK_WEIGHT_RULE":
                setRuleValue(dataRecord[i].KEYVALUE);
                break;
              case "account_style":
                setAccountStyle(dataRecord[i].KEYVALUE);
                break;
              case "AP_Dashboard_Charts":
                setDashboardCharts(JSON.parse(dataRecord[i].KEYVALUE));
                break;
              case "range_high":
                setRangeHigh(dataRecord[i].KEYVALUE * 100);
                break;
              case "range_medium":
                setRangeMedium(dataRecord[i].KEYVALUE * 100);
                break;
              case "range_low":
                setRangeLow(dataRecord[i].KEYVALUE * 100);
                break;
              case "metiriality_amount":
                setMaterialValue(dataRecord[i].KEYVALUE);
                break;
              case "threshold_amount":
                setThresholdValue(dataRecord[i].KEYVALUE);
                break;
              case "shorter_credit":
                setShortCreditValue(dataRecord[i].KEYVALUE);
                break;
              case "suspicious_words":
                setGetSuspiciousKey(JSON.parse(dataRecord[i].KEYVALUE));
                break;
              case "immediate_payments":
                setImmediatePaymentValue(dataRecord[i].KEYVALUE);
                break;
              case "old_unpaid_invoice":
                setUnpaidInvoiceValue(dataRecord[i].KEYVALUE);
                break;
              case "date_Sequence":
                setReOrderSequence(JSON.parse(dataRecord[i].KEYVALUE));
                break;
              default:
                break;
            }
          }
        } else {
          const getModuleConfigResponse = await axios.post(
            `v1/client/${clientId}/audit/config/getmoduleconfig`,
            {
              module: "apframework",
            },
            {
              headers: {
                Authorization: localStorage.getItem("TR_Token") as string,
              },
            }
          );
          let dataRecord = getModuleConfigResponse.data.data;
          let result = dataRecord.filter((dataRecord: { KEYNAME: string }) =>
            dataRecord.KEYNAME.startsWith("WEIGHT_")
          );
          setAssignWeights(result);
          setGetModuleConfig(dataRecord);
          for (let i = 0; i < dataRecord.length; i++) {
            switch (dataRecord[i].KEYNAME) {
              case "RISK_WEIGHT_AI":
                setAiValue(dataRecord[i].KEYVALUE);
                break;
              case "RISK_WEIGHT_RULE":
                setRuleValue(dataRecord[i].KEYVALUE);
                break;
              case "account_style":
                setAccountStyle(dataRecord[i].KEYVALUE);
                break;
              case "AP_Dashboard_Charts":
                setDashboardCharts(JSON.parse(dataRecord[i].KEYVALUE));
                break;
              case "range_high":
                setRangeHigh(dataRecord[i].KEYVALUE * 100);
                break;
              case "range_medium":
                setRangeMedium(dataRecord[i].KEYVALUE * 100);
                break;
              case "range_low":
                setRangeLow(dataRecord[i].KEYVALUE * 100);
                break;
              case "metiriality_amount":
                setMaterialValue(dataRecord[i].KEYVALUE);
                break;
              case "threshold_amount":
                setThresholdValue(dataRecord[i].KEYVALUE);
                break;
              case "shorter_credit":
                setShortCreditValue(dataRecord[i].KEYVALUE);
                break;
              case "suspicious_words":
                setGetSuspiciousKey(JSON.parse(dataRecord[i].KEYVALUE));
                break;
              case "immediate_payments":
                setImmediatePaymentValue(dataRecord[i].KEYVALUE);
                break;
              case "old_unpaid_invoice":
                setUnpaidInvoiceValue(dataRecord[i].KEYVALUE);
                break;
              case "date_Sequence":
                setReOrderSequence(JSON.parse(dataRecord[i].KEYVALUE));
                break;
              default:
                break;
            }
          }
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    const marks = [
      {
        value: 0,
        label: "0",
      },
      {
        value: 100,
        label: "100",
      },
    ];

    const handleMedium = (e: any) => {
      if (e.target.value >= rangeHigh) {
        return;
      }
      setRangeMedium(e.target.value);
    };

    const handleLow = (e: any) => {
      if (e.target.value >= rangeMedium) {
        return;
      }
      setRangeLow(e.target.value);
    };

    const handleSuspiciousKey = (event: any) => {
      let getSuspiciousKeyCopy = [...getSuspiciousKey];
      getSuspiciousKeyCopy.push(event.target.value);
      setGetSuspiciousKey(getSuspiciousKeyCopy);
    };

    const handleDasCheckbox = (event: any, index: any) => {
      let dashboardChartsCopy: any = [...dashboardCharts];
      dashboardChartsCopy[index].status = event.target.checked;
      setDashboardCharts(dashboardChartsCopy);
    };

    useEffect(() => {
      getConfigModule();
    }, []);

    return (
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: 450,
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Accounts Payable Configuration"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  1. Risk Framework Weights
                  <Tooltip
                    title="Assign the weights for risk scoring frameworks."
                    placement="top"
                  >
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(0)}
          />
          <Tab
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  2. Dashboard Charts
                  <Tooltip title="Description." placement="top">
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(1)}
          />
          <Tab
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  3. High - Medium - Low Definition
                  <Tooltip
                    title="Define the range for High,Medium and Low risk GL transactions."
                    placement="top"
                  >
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(2)}
          />
          <Tab
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  4. Threshold
                  <Tooltip
                    title="Configure the thresholds for GL transactions."
                    placement="top"
                  >
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(3)}
          />
          <Tab
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  5. Assign Weights to AP Rules
                  <Tooltip
                    title="Configure the weights for each control point under AP."
                    placement="top"
                  >
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(4)}
          />
          <Tab
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  6. Date sequence of workflow
                  <Tooltip
                    title="Define the sequential workflow of P2P process followed in the organization."
                    placement="top"
                  >
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(5)}
          />
          <Tab
            style={{
              display: assignWeights?.[2].STATUS === 1 ? "block" : "none",
            }}
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  7. Unfavourable payment term
                  <Tooltip
                    title="How many days  would you consider  as a shorter credit period in your company?"
                    placement="top"
                  >
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(6)}
          />
          <Tab
            style={{
              display: assignWeights?.[2].STATUS === 1 ? "block" : "none",
            }}
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  8. Suspicious key words
                  <Tooltip
                    title="How many days  would you consider  as a shorter credit period in your company?"
                    placement="top"
                  >
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(7)}
          />
          <Tab
            style={{
              display: assignWeights?.[3].STATUS === 1 ? "block" : "none",
            }}
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  9. Immediate Payments
                  <Tooltip
                    title="Payments made to the vendor within a specific time period before the due date."
                    placement="top"
                  >
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(8)}
          />
          <Tab
            style={{
              display: assignWeights?.[2].STATUS === 1 ? "block" : "none",
            }}
            sx={{ alignItems: "start", textAlign: "start" }}
            label={
              <>
                <div>
                  10. Old Unpaid Invoice
                  <Tooltip
                    title="Identify invoices that have not been settled for more than 'n' number of days after due date."
                    placement="top"
                  >
                    <InfoIcon style={{ fontSize: "16px", color: "#1976d2" }} />
                  </Tooltip>
                </div>
              </>
            }
            {...a11yProps(9)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <h4>Risk Framework Weights</h4>
          <FormControl error variant="standard">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
              <TextField
                sx={{ width: "200px", m: 3 }}
                id="ai-ap-score"
                value={aiValue || ""}
                label="AI Risk Score"
                variant="standard"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 10 } }}
                onChange={(e) => {
                  var newVal = parseInt(e.target.value, 10);
                  if (newVal > max) newVal = max;
                  if (newVal < min) newVal = min;

                  setAiValue(newVal);
                }}
              />
              <TextField
                sx={{ width: "200px", m: 3 }}
                id="rule-ap-score"
                value={ruleValue || ""}
                label="Rule Risk Score"
                variant="standard"
                type="number"
                onChange={(e) => {
                  var newVal = parseInt(e.target.value, 10);

                  if (newVal > max) newVal = max;
                  if (newVal < min) newVal = min;

                  setRuleValue(newVal);
                }}
              />
            </div>
          </FormControl>
          <Stack
            mt={4}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              variant="contained"
              onClick={() => setValue(value + 1)}
            >
              Next
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h4> Dashboard Charts</h4>
          {dashboardCharts?.map((chart: any, index: any) => (
            <FormGroup>
              <FormControlLabel
                key={index}
                onChange={(e) => handleDasCheckbox(e, index)}
                control={<Checkbox checked={chart.status === true} />}
                label={chart.name}
              />
            </FormGroup>
          ))}
          <Stack
            mt={4}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              variant="contained"
              href="#contained-buttons"
              onClick={() => setValue(value + 1)}
            >
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
              sx={{ color: "#d60000" }}
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
              sx={{ color: "#f2641a" }}
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
              sx={{ color: "#f5af2d" }}
              onChange={(e: any) => handleLow(e)}
            />
          </Box>
          <Stack
            mt={4}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              variant="contained"
              href="#contained-buttons"
              onClick={() => setValue(value + 1)}
            >
              Next
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <h4>Threshold</h4>
          <FormControl error variant="standard">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
              <TextField
                sx={{ width: "200px", m: 3 }}
                id="ai-score"
                value={materialValue || ""}
                label="Materiality"
                variant="standard"
                type="number"
                onChange={(e) => {
                  var newVal = parseInt(e.target.value, 10);
                  if (newVal < min) newVal = min;
                  setMaterialValue(newVal);
                }}
              />
              <TextField
                sx={{ width: "200px", m: 3 }}
                id="stat-score"
                value={thresholdValue || ""}
                label="Threshold"
                variant="standard"
                type="number"
                onChange={(e) => {
                  var newVal = parseInt(e.target.value, 10);
                  if (newVal < min) newVal = min;
                  setThresholdValue(newVal);
                }}
              />
            </div>
          </FormControl>
          <Stack
            mt={4}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              variant="contained"
              href="#contained-buttons"
              onClick={() => setValue(value + 1)}
            >
              Next
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <h4> Assign Weights to AP Rules</h4>
          <BasicTable
            assignWeights={assignWeights}
            setAssignWeights={setAssignWeights}
          />
          <Stack
            mt={4}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              variant="contained"
              href="#contained-buttons"
              onClick={() => setValue(value + 1)}
            >
              Next
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <h4>Date sequence of workflow</h4>
          <DragableList
            setReOrderSequence={setReOrderSequence}
            reOrderSequence={reOrderSequence}
          />
          <Stack
            mt={4}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              variant="contained"
              href="#contained-buttons"
              onClick={() => setValue(value + 1)}
            >
              Next
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={6}>
          <h4>Unfavourable payment term</h4>
          <FormControl error variant="standard">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
              <TextField
                sx={{ width: "200px", m: 3 }}
                id="short-credit"
                value={shortCreditValue}
                label="Define shorter Credit Term"
                variant="standard"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 30 } }}
                onChange={(e) => {
                  var newVal = parseInt(e.target.value, 10);
                  if (newVal < min) newVal = min;
                  setShortCreditValue(newVal);
                }}
              />
            </div>
          </FormControl>
          <Stack
            mt={4}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              variant="contained"
              href="#contained-buttons"
              onClick={() => setValue(value + 1)}
            >
              Next
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={7}>
          <h4> Suspicious key words</h4>
          <Tags
            getSuspiciousKey={getSuspiciousKey}
            handleSuspiciousKey={handleSuspiciousKey}
            setGetSuspiciousKey={setGetSuspiciousKey}
            name="suspicious"
          />
          <Stack
            mt={4}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              variant="contained"
              href="#contained-buttons"
              onClick={() => setValue(value + 1)}
            >
              Next
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={8}>
          <h4>Immediate Payments</h4>
          <FormControl error variant="standard">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
              <div className=" pt-8">Payments made with in</div>
              <TextField
                sx={{ width: "50px", m: 3, marginLeft: 0, marginRight: 0 }}
                id="immediate-payment"
                value={immediatePaymentValue}
                variant="standard"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 30 } }}
                onChange={(e) => {
                  var newVal = parseInt(e.target.value, 10);
                  if (newVal < min) newVal = min;
                  setImmediatePaymentValue(newVal);
                }}
              />
              <div className=" pt-8">% of the credit period</div>
            </div>
          </FormControl>
          <Stack
            mt={4}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              variant="contained"
              href="#contained-buttons"
              onClick={() => setValue(value + 1)}
            >
              Next
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={9}>
          <h4> Old Unpaid Invoice</h4>
          <FormControl error variant="standard">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
              <div className=" pt-8">
                Invoices that have not been settled for more than
              </div>
              <TextField
                sx={{ width: "50px", m: 3, marginLeft: 0, marginRight: 0 }}
                id="unpaid-invoices"
                value={unpaidInvoiceValue}
                variant="standard"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 30 } }}
                onChange={(e) => {
                  var newVal = parseInt(e.target.value, 10);
                  if (newVal < min) newVal = min;
                  setUnpaidInvoiceValue(newVal);
                }}
              />
              <div className=" pt-8">days after due date</div>
            </div>
          </FormControl>
        </TabPanel>
      </Box>
    );
  }
);
export default Configuration;
