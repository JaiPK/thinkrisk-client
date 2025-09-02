import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/Store";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
var financialYear = new Date().getFullYear();
if (currentMonth < 3) {
  financialYear = financialYear - 1;
}

export interface GLData {
  posted_date_start_selected: string;
  posted_date_end_selected: string;
  invoice_date_start_selected: string;
  invoice_date_end_selected: string;
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
  vendors: any;
  vendors_selected: any;
  routeBackToInsights: boolean;
}
let month = localStorage.getItem('Month')
let financialMonth = month !== "" ? month?.toString().padStart(2, '0') : "01";

const initialState: GLData = {
  posted_date_start_selected: `${financialYear}-${financialMonth}-01`,
  posted_date_end_selected: `${currentYear}-${currentMonth + 1}-${currentDay}`,
  invoice_date_start_selected: `${financialYear}-${financialMonth}-01`,
  invoice_date_end_selected: `${currentYear}-${currentMonth + 1}-${currentDay}`,
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
  vendors: [],
  vendors_selected: [],
  routeBackToInsights: false
};

const APDataSlice = createSlice({
  name: "APDataSlice",
  initialState,
  reducers: {
    updateAPStartDate: (state, action: PayloadAction<string>) => {
      state.posted_date_start_selected = action.payload;
    },
    updateAPEndDate: (state, action: PayloadAction<string>) => {
      state.posted_date_end_selected = action.payload;
    },
    updateAPInvoiceStartDate: (state, action: PayloadAction<string>) => {
      state.invoice_date_start_selected = action.payload;
    },
    updateAPInvoiceEndDate: (state, action: PayloadAction<string>) => {
      state.invoice_date_end_selected = action.payload;
    },
    updateAPCompanies: (state, action: PayloadAction<any>) => {
      state.companies = action.payload;
    },
    updateAPSelectedCompanies: (state, action: PayloadAction<any>) => {
      state.company_selected = action.payload;
    },
    updateAPAccounts: (state, action: PayloadAction<any>) => {
      state.accounts = action.payload;
    },
    updateAPSelectedAccounts: (state, action: PayloadAction<any>) => {
      state.account_selected = action.payload;
    },
    updateAPTransactionType: (state, action: PayloadAction<any>) => {
      state.transaction_type = action.payload;
    },
    updateAPSelectedSelectedTransactionType: (
      state,
      action: PayloadAction<any>
    ) => {
      state.transaction_type_selected = action.payload;
    },
    updateAPRisk: (state, action: PayloadAction<any>) => {
      state.risk = action.payload;
    },
    updateAPSelectedRisk: (state, action: PayloadAction<any>) => {
      state.risk_selected = action.payload;
    },
    updateAPToggle: (state, action: PayloadAction<any>) => {
      state.toggle = action.payload;
    },
    updateAPSelectedToggle: (state, action: PayloadAction<any>) => {
      state.toggle_selected = action.payload;
    },
    updateAPRules: (state, action: PayloadAction<any>) => {
      state.rules = action.payload;
    },
    updateAPSelectedRules: (state, action: PayloadAction<any>) => {
      state.rule_selected = action.payload;
    },
    updateAPRiskLevel: (state, action: PayloadAction<any>) => {
      state.risk_level = action.payload;
    },
    updateAPVendors: (state, action: PayloadAction<any>) => {
      state.vendors = action.payload;
    },
    updateAPSelectedVendors: (state, action: PayloadAction<any>) => {
      state.vendors_selected = action.payload;
    },
    clearFilters: (state) => {
      state.posted_date_start_selected ='';
      state.posted_date_end_selected = '';
      state.invoice_date_start_selected = '';
      state.invoice_date_end_selected = '';
      state.company_selected = [];
      state.account_selected = [];
      state.transaction_type_selected = [];
      state.risk_selected = [];
      state.toggle_selected = "";
      state.rule_selected = [];
      state.vendors_selected = [];
    },
    updateRouteBackToInsights: (state, action: PayloadAction<any>) => {
            state.routeBackToInsights = action.payload;
    }
  },
});

export const {
  updateAPStartDate,
  updateAPEndDate,
  updateAPCompanies,
  updateAPSelectedCompanies,
  updateAPTransactionType,
  updateAPSelectedSelectedTransactionType,
  updateAPRules,
  updateAPSelectedRules,
  updateAPAccounts,
  updateAPSelectedAccounts,
  updateAPRisk,
  updateAPSelectedRisk,
  updateAPToggle,
  updateAPSelectedToggle,
  updateAPRiskLevel,
  updateAPVendors,
  updateAPSelectedVendors,
  updateAPInvoiceStartDate,
  updateAPInvoiceEndDate,
  clearFilters,
  updateRouteBackToInsights
} = APDataSlice.actions;
export default APDataSlice.reducer;
