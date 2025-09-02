import { createSlice , PayloadAction} from "@reduxjs/toolkit";

const iniiState = {
    tr_model:[]
}
export const Rbac = createSlice({
    name: "rbac",
    initialState: iniiState,
    reducers: {
        setTrModel: (state, action:PayloadAction<any>) => {
            state.tr_model = action.payload;
        },
    },
});

export const { setTrModel } = Rbac.actions;
export default Rbac.reducer;
