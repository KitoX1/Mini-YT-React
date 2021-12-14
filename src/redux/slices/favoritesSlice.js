import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import { getDatabase, ref, child, get, set, push, remove } from "firebase/database";


export const getFavorites = createAsyncThunk(
    'favorites/getFavorites',
    async function(_, { dispatch, getState }) {
        try {
            const state = getState();
            const dbRef = ref(getDatabase());
            
            const response = await get(child(dbRef, `users/${state.auth.userId}`));
            const data = response.val();
            console.log(data)
            dispatch(setFavorites(data));
        } catch (error) {
            alert(error.message);
        }
        
    }
)

export const addFavorites = createAsyncThunk(
    'favorites/addFavorites',
    function(values, { getState}) {
        const {userId} = getState().auth;
        const db = getDatabase();

        push(ref(db, `users/${userId}`), values);
    }
)

export const editFavorites = createAsyncThunk(
    'favorites/editFavorites',
    function(values, {dispatch, getState}) {
        const {userId} = getState().auth;
        const db = getDatabase();

        set(ref(db, `users/${userId}/${values.id}`), values.values)
        .then(() => {
            dispatch(editFavoritesInStore(values))
        })
    }
)

export const deleteFavorites = createAsyncThunk(
    'favorites/deleteFavorites',
    function(id, {dispatch, getState}) {
        const {userId} = getState().auth;
        const db = getDatabase();

        remove(ref(db, `users/${userId}/${id}`))
        .then(() => {
            dispatch(deleteFavoritesFromStore(id));
        })
    }
)



export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        favorites: [],
        loadingInProgress: false
    },
    reducers: {
        setFavorites(state, action) {
            const data = [];
            for (let item in action.payload) { data.push({id: item, ...action.payload[item]}) }
            state.favorites = data;
        },
        addFavoritesToStore(state, action) {
            state.favorites.push(action.payload);
        },
        editFavoritesInStore(state, action) {
            state.favorites = state.favorites.map(item => item.id === action.payload.id ? action.payload.values : item);
        },
        deleteFavoritesFromStore(state, action) {
            state.favorites = state.favorites.filter(item => item.id !== action.payload);
        }
    },
    extraReducers: {
        [getFavorites.pending]: (state) => {
            state.loadingInProgress = true;
        },
        [getFavorites.fulfilled]: (state) => {
            state.loadingInProgress = false;
        },
        [getFavorites.rejected]: (state) => {
            state.loadingInProgress = false;
        }
    }
})



export const { setFavorites, editFavoritesInStore, deleteFavoritesFromStore } = favoritesSlice.actions;

export default favoritesSlice.reducer;