import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccDocument } from '../../../../../shared/models/records';

export interface GLTransDetails {
    IsDrillThrough: boolean;
    config: any;
    // transId: number;
    // document: AccDocument;
    // riskLevel: any;
}

const initialState: GLTransDetails = {
    IsDrillThrough: false,
    config: {
        transId: 0,
        document: {
            ACCOUNTDOCID: 0,
            ACCOUNTDOC_CODE: 0,
            ACCOUNT_DOC_ID: '',
            ASSIGNED_BY: null,
            ASSIGNED_TO: null,
            BLENDED_RISK_SCORE: 0,
            BLENDED_SCORE_INDEXED: 0,
            COMMENTS: 0,
            COMPANY_CODE_NAME: null,
            CONTROL_DEVIATION: null,
            CREDIT_AMOUNT: 0,
            DEBIT_AMOUNT: null,
            ENTRY_ID: 0,
            INVOICE_NUMBER: '',
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

const GLTransDetailsDrillThroughSlice = createSlice({
    name: 'glTransDetailsDrillThrough',
    initialState,
    reducers: {
        updateGLTransDetailsDrillThrough: (
            state,
            action: PayloadAction<any>
        ) => {
            state.IsDrillThrough = action.payload;
        },
        updateGLTransDetailsDrillThroughConfig: (
            state,
            action: PayloadAction<any>
        ) => {
            state.config = action.payload;
        },
    },
});
export const {
    updateGLTransDetailsDrillThrough,
    updateGLTransDetailsDrillThroughConfig,
} = GLTransDetailsDrillThroughSlice.actions;
export default GLTransDetailsDrillThroughSlice.reducer;
