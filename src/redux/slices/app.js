import { createSlice } from "@reduxjs/toolkit"
import { update } from "lodash"

const initialState = {
    modals:{
        gif:false,
        audio : false,
        media : false,
        documents : false,
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
        updateMediaModal(state, action){
            state.modals.media = action.payload
        },
        updateDocumentModal(state, action){
            state.modals.documents = action.payload
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

export const ToggleMediaModal = (value)=> async (dispatch, getState) =>{
    dispatch(slice.actions.updateMediaModal(value));
}

export const ToggleDocumentModal = (value)=> async (dispatch, getState) =>{
    dispatch(slice.actions.updateDocumentModal(value));
}