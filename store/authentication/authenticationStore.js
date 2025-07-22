import { configureStore } from "@reduxjs/toolkit"
import authenticationSliceReducer from "./authenticationSlice";
import postSliceReducers from "../Post/PostSlice";
import refreshSliceReducer from "../refresh/refreshSlice";
const authStore = configureStore({
    reducer: {
    "auth": authenticationSliceReducer,
    "Post" : postSliceReducers,
    "refresh":refreshSliceReducer
    }
});

export default authStore;