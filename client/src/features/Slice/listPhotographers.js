import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import allPhotographyServices from "../api/allPhotographyServices";

//get user from localstorage
let allPhotographers = JSON.parse(localStorage.getItem('allPhotographer'))

const initialState = {
    allPhotographers: allPhotographers ? allPhotographers : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message:''
}


//get photographers
export const getAllPhotographers = createAsyncThunk('/allPhotographers', async( thunkAPI)=>{
    try{
        return await allPhotographyServices.getAllPhotographers()
    }catch(error){
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)
            || error.message ||error.toString()
           
        return thunkAPI.rejectWithValue(message);
    }
})

export const listPhotographySlice = createSlice({
    name: "allPhotographers",
    initialState,
    reducers: {
        reset: (state)=>{
          state.isError =null;
          state.isLoading =null;
          state.isSuccess =null;
          state.message = '' 
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllPhotographers.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(getAllPhotographers.fulfilled, (state,action)=>{
            state.isLoading=false;
            state.isSuccess = true;
            state.allPhotographers = action.payload
        })
        .addCase(getAllPhotographers.rejected, (state,action)=>{
            state.isLoading=false;
            state.isError =true;
            state.message = action.payload;
        })
        
    }
})

export const {reset} = listPhotographySlice.actions;

export default listPhotographySlice.reducer; 