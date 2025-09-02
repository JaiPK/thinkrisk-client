import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/Store";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
let month = localStorage.getItem('Month')
let financialMonth = month?.toString().padStart(2, '0');
var financialYear = new Date().getFullYear();
if (currentMonth < Number(financialMonth)) {
  financialYear = financialYear - 1;
}

export interface GLData {
  posted_date_start_selected: string;
  posted_date_end_selected: string;
  companies: any;
  company_selected: any;
  accounts: any;
  account_selected: any;
  rules: any;
  rule_selected: any;
  toggle: any;
  toggle_selected: any;
  risk: any;
  risk_selected: any;
  transaction_type: any;
  transaction_type_selected: any;
  risk_level: any;
  workflow: any;
  routeBackToInsights: boolean;
}


//console.log(`${financialYear}-${financialMonth}-01`,"intialDate")
const initialState: GLData = {
  posted_date_start_selected: `${financialYear}-${financialMonth}-01`,
  posted_date_end_selected: `${currentYear}-${currentMonth + 1}-${currentDay}`,
  companies: [],
  company_selected: [],
  accounts: [],
  account_selected: [],
  rules: [],
  rule_selected: [],
  toggle: [
    { text: "Above Materiality", value: 1 },
    { text: "Above Threshold", value: 2 },
    { text: "Below Threshold", value: 3 },
  ],
  toggle_selected: "",
  risk: [
    { text: "High", value: "1" },
    { text: "Medium", value: "2" },
    { text: "Low", value: "3" },
  ],
  risk_selected: [],
  transaction_type: [
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
  transaction_type_selected: [],
  risk_level: [],
  workflow: [],
  routeBackToInsights: false,
};

const GLDataSlice = createSlice({
  name: "GLDataSlice",
  initialState,
  reducers: {
    updateStartDate: (state, action: PayloadAction<string>) => {
      state.posted_date_start_selected = action.payload;
    },
    updateEndDate: (state, action: PayloadAction<string>) => {
      state.posted_date_end_selected = action.payload;
    },
    updateCompanies: (state, action: PayloadAction<any>) => {
      state.companies = action.payload;
    },
    updateSelectedCompanies: (state, action: PayloadAction<any>) => {
      state.company_selected = action.payload;
    },
    updateAccounts: (state, action: PayloadAction<any>) => {
      state.accounts = action.payload;
    },
    updateSelectedAccounts: (state, action: PayloadAction<any>) => {
      state.account_selected = action.payload;
    },
    updateTransactionType: (state, action: PayloadAction<any>) => {
      state.transaction_type = action.payload;
    },
    updateSelectedSelectedTransactionType: (
      state,
      action: PayloadAction<any>
    ) => {
      state.transaction_type_selected = action.payload;
    },
    updateRisk: (state, action: PayloadAction<any>) => {
      state.risk = action.payload;
    },
    updateSelectedRisk: (state, action: PayloadAction<any>) => {
      state.risk_selected = action.payload;
    },
    updateToggle: (state, action: PayloadAction<any>) => {
      state.toggle = action.payload;
    },
    updateSelectedToggle: (state, action: PayloadAction<any>) => {
      state.toggle_selected = action.payload;
    },
    updateRules: (state, action: PayloadAction<any>) => {
      state.rules = action.payload;
    },
    updateSelectedRules: (state, action: PayloadAction<any>) => {
      state.rule_selected = action.payload;
    },
    updateRiskLevel: (state, action: PayloadAction<any>) => {
      state.risk_level = action.payload;
    },
    updateWorkflow: (state, action: PayloadAction<any>) => {
      // console.log(action.payload);
      state.workflow = action.payload;

    },
    clearFilters: (state) => {
      state.posted_date_start_selected = `${financialYear}-${financialMonth}-01`;
      state.posted_date_end_selected = `${currentYear}-${currentMonth + 1
        }-${currentDay}`;
      state.company_selected = [];
      state.account_selected = [];
      state.transaction_type_selected = [];
      state.risk_selected = [];
      state.toggle_selected = "";
      state.rule_selected = [];
      state.risk_level = [];
    },
    updateRouteBackToInsights: (state, action: PayloadAction<any>) => {
      state.routeBackToInsights = action.payload;
    }
  },
});

export const {
  updateStartDate,
  updateEndDate,
  updateCompanies,
  updateSelectedCompanies,
  updateTransactionType,
  updateSelectedSelectedTransactionType,
  updateRules,
  updateSelectedRules,
  updateAccounts,
  updateSelectedAccounts,
  updateRisk,
  updateSelectedRisk,
  updateToggle,
  updateSelectedToggle,
  updateRiskLevel,
  updateWorkflow,
  clearFilters,
  updateRouteBackToInsights
} = GLDataSlice.actions;
export default GLDataSlice.reducer;
