import { configureStore } from "@reduxjs/toolkit";
import postSliceReducer from './PostSlice';

const postStore = configureStore({
    reducer: postSliceReducer
})

export default postStore;