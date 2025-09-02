import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import type { RootState } from '../../../../store/Store'


const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
var financialYear = new Date().getFullYear();
if (currentMonth < 3) {
    financialYear = financialYear - 1;
}

export interface DateRange {
    posted_date_start: string
    posted_date_end: string
  }

const initialState: DateRange = {
    posted_date_start: `${financialYear}-04-01`,
    posted_date_end: `${currentYear}-${currentMonth + 1}-${currentDay}`
}


const dateSlice = createSlice({
  name: 'postedDate',
  initialState,
  reducers: {
    updateStartDate: (state, action: PayloadAction<string>) => {
      state.posted_date_start = action.payload;
    },
    updateEndDate: (state, action: PayloadAction<string>) => {
        state.posted_date_end = action.payload; 
      }
  }
});

export const { updateStartDate, updateEndDate } = dateSlice.actions;
export default dateSlice.reducer;