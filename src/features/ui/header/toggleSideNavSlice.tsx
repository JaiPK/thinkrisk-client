import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open: false,
};

export const toggleSideNavSlice = createSlice({
    name: "toggleSideNav",
    initialState,
    reducers: {
        toggle: (state) => {
            state.open = !state.open;
        },
    },
});

export const { toggle } = toggleSideNavSlice.actions;
export default toggleSideNavSlice.reducer;
