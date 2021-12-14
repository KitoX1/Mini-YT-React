import { createAsyncThunk, createSlice  } from "@reduxjs/toolkit";

export const getVideos = createAsyncThunk(
    'app/getVideos',
    async function(values, { dispatch }) {
        try {
            dispatch(setWithResult());

            const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${values.slider || 25}&order=${values.sort || 'relevance'}&q=${values.request}&type=video&key=${process.env.REACT_APP_FIREBASE_API_KEY}`);
            console.log(response)
            const data = await response.json();

            dispatch(setVideos({ request: values.request, ...data }));
        } catch (error) {
            alert(error.message)
        }
        
    }
)

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        loadingInProgress: false,
        videos: [],
        withResult: false
    },
    reducers: {
        setVideos(state, action) {
            state.videos = action.payload;
        },
        setWithResult(state) {
            state.withResult = true;
        }
    },
    extraReducers: {
        [getVideos.pending]: (state) => {
            state.loadingInProgress = true;
        },
        [getVideos.fulfilled]: (state) => {
            state.loadingInProgress = false;
        },
        [getVideos.rejected]: (state) => {
            state.loadingInProgress = false;
        }
    }
});

export const { setVideos, setWithResult } = appSlice.actions;

export default appSlice.reducer;