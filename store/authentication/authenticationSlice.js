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
        },
        updateProfile: function (state, action) {
            state.userData.profileSource = action.payload;
        },
        updateFollowees: function (state, action) {
            if (state.userData.followees) {
                const prev = state.userData.followees
                switch (action.payload.type) {
                    case 'add':
                        if (prev.includes(action.payload.authorId)) return;
                        state.userData.followees = [...prev, action.payload.authorId];
                        break;
                    case 'remove':
                        state.userData.followees = prev.filter((id) => id != action.payload.authorId);
                    default: ''
                        break;
                }
            }
            else {
                state.userData.followees = action.payload
            }

        }

    }
});

export const { logIn, logOut, setLoading, updateBio, updateProfile, updateFollowees } = authenticationSlice.actions;

export default authenticationSlice.reducer;