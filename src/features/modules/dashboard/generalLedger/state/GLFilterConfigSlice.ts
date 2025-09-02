import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const setInitData = () => {
    let config = [
        {
            label: 'Company',
            data: [],
            filterName: 'companies',
            filterType: 'multi-dropdown',
            selected: undefined,
            active: true,
        },
        {
            label: 'Controls',
            data: [],
            filterName: 'rules',
            filterType: 'multi-dropdown',
            selected: undefined,
            active: true,
        },
        {
            label: 'Posted Date',
            data: [
                {
                    posted_date_start: '',
                    posted_date_end: '',
                },
            ],
            filterName: 'posted-date',
            filterType: 'date-picker',
            selected: {},
            active: true,
        },
        {
            label: 'Analysis Data Set',
            data: [
                { text: 'Above Materiality', value: 1 },
                { text: 'Above Threshold', value: 2 },
                { text: 'Below Threshold', value: 3 },
            ],
            filterName: 'toggle',
            filterType: 'single-dropdown',
            selected: undefined,
            active: true,
        },
        {
            label: 'Accounts',

            data: [
                {
                    dataSource: [],
                    value: 'title',
                    text: 'title',
                    child: 'subitems',
                },
            ],
            filterName: 'accounts',
            filterType: 'dropdown-tree',
            selected: undefined,
            active: true,
        },
        {
            label: 'Risk Level',
            data: [],
            filterName: 'risk',
            filterType: 'multi-dropdown',
            selected: undefined,
            active: true,
        },
        {
            label: 'Transaction Type',
            data: [],
            filterName: 'transaction-type',
            filterType: 'multi-dropdown',
            selected: undefined,
            active: true,
        },
    ];

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    var financialYear = new Date().getFullYear();
    if (currentMonth < 3) {
        financialYear = financialYear - 1;
    }

    let configCopy = [...config];
    configCopy[2].data[0] = {
        posted_date_start: `${financialYear}-04-01`,
        posted_date_end: `${currentYear}-${currentMonth + 1}-${currentDay}`,
    };
    configCopy[2].selected = {
        posted_date_start: `${financialYear}-04-01`,
        posted_date_end: `${currentYear}-${currentMonth + 1}-${currentDay}`,
    };

    return configCopy;
};

export interface GLConfig {
    config: any[];
    IsDrillThrough: boolean;
}

const initialState: GLConfig = {
    config: setInitData(),
    IsDrillThrough: false,
};

const GLFilterConfigSlice = createSlice({
    name: 'glFilterConfig',
    initialState,
    reducers: {
        updateGLFilterConfig: (state, action: PayloadAction<any>) => {
            state.config = action.payload;
        },
        updateIsDrillThrough: (state, action: PayloadAction<boolean>) => {
            state.IsDrillThrough = action.payload;
        },
    },
});

export const { updateGLFilterConfig, updateIsDrillThrough } =
    GLFilterConfigSlice.actions;
export default GLFilterConfigSlice.reducer;
