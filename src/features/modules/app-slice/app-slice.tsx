import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/Store";


export interface APPData {
  gl_page: boolean;
  ap_page: boolean;
  other:boolean;
}

const initialState: APPData = {
    gl_page: true,
    ap_page: false,
    other:true
};

const APPDataSlice = createSlice({
  name: "APPDataSlice",
  initialState,
  reducers: {
    updateGLPage: (state, action: PayloadAction<boolean>) => {
      state.gl_page = action.payload;
      state.ap_page = false;
      state.other = false;
    },
    updateAPPage: (state, action: PayloadAction<boolean>) => {
      state.gl_page = false;
      state.ap_page = action.payload;
      state.other = false;
    },
    updateOtherPage: (state, action: PayloadAction<boolean>) => {
        state.gl_page = false;
        state.ap_page = false;
        state.other = action.payload;
    }
  },
});

export const {
  updateAPPage,
  updateGLPage,
  updateOtherPage,

} = APPDataSlice.actions;
export default APPDataSlice.reducer;
