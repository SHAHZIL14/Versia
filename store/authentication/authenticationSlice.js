import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userStatus: false,
    userData: {},
    loading: true
};

const authenticationSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
        logIn: function (state, action) {
            state.userStatus = true;
            state.userData = action.payload;
        },
        logOut: function (state) {
            state.userStatus = false;
            state.userData = {};
        },
        setLoading: function (state, action) {
            state.loading = action.payload;
        }
    }
});

export const { logIn, logOut, setLoading } = authenticationSlice.actions;

export default authenticationSlice.reducer;