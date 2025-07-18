import { createSlice } from "@reduxjs/toolkit"
import { update } from "lodash"

const initialState = {
    modals:{
        gif:false,

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
        }
    }
})

export default slice.reducer;   
export const ToggleGifModal = (value) => async (dispatch, getState) =>{
    dispatch(slice.actions.updateGifModal(value));
}