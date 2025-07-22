import { createSlice } from "@reduxjs/toolkit";

const refreshSlice = createSlice({
    name: 'Refresh',
    initialState: {
        refresh: 0,
    },
    reducers: {
        refresh: function (state, action) {
            state.refresh++;
        }
    }
});
export default refreshSlice.reducer;

export const { refresh } = refreshSlice.actions;