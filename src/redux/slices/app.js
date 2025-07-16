import { createSlice } from "@reduxjs/toolkit"
import { update } from "lodash"

const initialState = {
    modals:{
        gif:false,

    },
    selectedGifUrl: "",

}

const slice = createSlice({
    name : "app",
    initialState,
    reducers:{
        updateGifModal(state,action){
            state.modals.gif = action.payload;
            state.selectedGifUrl = action.payload.url;
        }
    }
})