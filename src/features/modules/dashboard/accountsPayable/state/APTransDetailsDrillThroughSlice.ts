import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface APTransDetails {
    IsDrillThrough: boolean;
    config: any;
}

const initialState: APTransDetails = {
    IsDrillThrough: false,
    config: {
        transId: 0,
        document: {
            ACCOUNTDOCID: 0,
            ACCOUNTDOC_CODE: '',
            ACCOUNT_DOC_ID: null,
            ASSIGNED_BY: null,
            ASSIGNED_TO: null,
            BLENDED_RISK_SCORE: 0,
            BLENDED_SCORE_INDEXED: 0,
            COMMENTS: 0,
            COMPANY_CODE_NAME: null,
            CONTROL_DEVIATION: null,
            CREDIT_AMOUNT: 0,
            DEBIT_AMOUNT: null,
            ENTRY_ID: null,
            INVOICE_NUMBER: null,
            ISDEVIATION: null,
            POSTED_BY_NAME: null,
            POSTED_DATE: null,
            POSTED_LOCATION_NAME: null,
            REVIEWSTATUSID: 0,
            REVIEW_STATUS_CODE: '',
            SELECTED_TRANSACTIONS: null,
            SUBRSTATUSID: null,
            SUB_R_STATUS_CODE: null,
            riskScore: null,
        },
        riskLevel: {
            range_high: null,
            range_low: null,
            range_medium: null,
        },
    },
};

const APTransDetailsDrillThroughSlice = createSlice({
    name: 'apTransDetailsDrillThrough',
    initialState,
    reducers: {
        updateAPTransDetailsDrillThrough: (
            state,
            action: PayloadAction<any>
        ) => {
            state.IsDrillThrough = action.payload;
        },
        updateAPTransDetailsDrillThroughConfig: (
            state,
            action: PayloadAction<any>
        ) => {
            state.config = action.payload;
        },
    },
});

export const {
    updateAPTransDetailsDrillThrough,
    updateAPTransDetailsDrillThroughConfig,
} = APTransDetailsDrillThroughSlice.actions;
export default APTransDetailsDrillThroughSlice.reducer;
