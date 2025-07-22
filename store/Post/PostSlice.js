import { createSlice } from "@reduxjs/toolkit"
const initialState = []
const postSlice = createSlice({
    name: 'Posts',
    initialState,
    reducers: {
        addBatch: function ( state,action) {
            return action.payload;
        }
    }
});

export default postSlice.reducer;

export const { addBatch, removeBatch } = postSlice.actions;

