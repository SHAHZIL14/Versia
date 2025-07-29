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
        },
        updateBio: function (state, action) {
            state.userData.userBio = action.payload;
        }
    }
});

export const { logIn, logOut, setLoading,updateBio } = authenticationSlice.actions;

export default authenticationSlice.reducer;