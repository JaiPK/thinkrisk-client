export interface AccDocument {
    ACCOUNTDOCID: number;
    ACCOUNTDOC_CODE: string;
    ACCOUNT_DOC_ID: string;
    ASSIGNED_BY: null | string;
    ASSIGNED_TO: null | string;
    BLENDED_RISK_SCORE: number;
    BLENDED_SCORE_INDEXED: number;
    COMMENTS: number;
    COMPANY_CODE_NAME: null | string;
    CONTROL_DEVIATION: null | string;
    CREDIT_AMOUNT: number;
    DEBIT_AMOUNT: number;
    DUE_DATE: string;
    ENTRY_ID: number;
    INVOICE_DATE: string;
    INVOICE_NUMBER: string;
    ISDEVIATION: null | boolean;
    PAYMENT_DATE: string;
    POSTED_BY_NAME: null | string;
    POSTED_DATE: string;
    POSTED_LOCATION_NAME: string;
    REVIEWSTATUSID: number;
    REVIEW_STATUS_CODE: string;
    SELECTED_TRANSACTIONS: null | string;
    SUBRSTATUSID: null | number;
    SUB_R_STATUS_CODE: null | number;
    riskScore: number;
}

export interface RiskLevel {
    range_high: number;
    range_low: number;
    range_medium: number;
}

export interface RiskLevelItem {
    KEYNAME: string;
    KEYVALUE: string;
}

export interface ControlException {
    doccount: number;
    rule: string;
    rule_desc: string;
    title: string;
    selected: boolean;
}

export interface TransControlException {
    doccount: number;
    title: string;
}

export interface DuplicateInvoices {
    COMPANY_NAME: string;
    DUPLICATES_ID: string;
    INVOICE_AMOUNT: string;
    INVOICE_DATE: string;
    INVOICE_NUMBER: string;
    NO_OF_DUPLICATES: string;
    PAYMENT_DATE: string;
    POSTED_BY: string;
    POSTED_DATE: string;
    PrimaryKeySimple: string;
    REVIEWSTATUSID: string;
    REVIEW_STATUS_CODE: string;
    REVIEW_STATUS_DESCRIPTION: string;
    RISK_SCORE: string;
    VENDORID: string;
    VENDOR_NAME: string;
    Payment_date:string;

}
