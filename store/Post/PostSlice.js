import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    isFetched: false,
    data: [],
    likesMap: []
}
const postSlice = createSlice({
    name: 'Posts',
    initialState,
    reducers: {
        addBatch: function (state, action) {
            state.isFetched = true;
            state.data = action.payload;
        },
        addPostLikes: function (state, action) {
            state.likesMap = action.payload;
        },
        changeIsFetched(state, action) {
            state.isFetched = action.payload;
        }
    }
});

export default postSlice.reducer;

export const { addBatch, removeBatch, addPostLikes,changeIsFetched } = postSlice.actions;

