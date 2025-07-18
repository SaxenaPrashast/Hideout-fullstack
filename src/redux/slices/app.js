import { createSlice } from "@reduxjs/toolkit"
import { update } from "lodash"

const initialState = {
    modals:{
        gif:false,
        audio : false,
    },
    selectedGifUrl: null,

}

const slice = createSlice({
    name : "app",
    initialState,
    reducers:{
        updateGifModal(state,action){
            state.modals.gif = action.payload.value;
            state.selectedGifUrl = action.payload.url;
        },
        updateAudioModal(state, action){
            state.modals.audio = action.payload
        },
    },
});

export default slice.reducer;   
export const ToggleGifModal = (value) => async (dispatch, getState) =>{
    dispatch(slice.actions.updateGifModal(value));
}

export const ToggleAudioModal = (value)=> async (dispatch, getState) =>{
    dispatch(slice.actions.updateAudioModal(value));
}