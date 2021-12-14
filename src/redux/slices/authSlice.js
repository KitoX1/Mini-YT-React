import { createSlice  } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        auth: null,
        userId: ''
    },
    reducers: {
        setAuth(state, action) {
            state.auth = action.payload;
        },
        setFavorites(state, action) {
            const data = [];
            for (let item in action.payload) { data.push({id: item, ...action.payload[item]}) }
            state.favorites = data;
        },
        setUserId(state, action) {
            state.userId = action.payload;
        }
    }
});



export const { setAuth, setUserId, setFavorites } = authSlice.actions;

export default authSlice.reducer;