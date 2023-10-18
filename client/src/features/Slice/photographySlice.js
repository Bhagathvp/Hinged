import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photographyServices from "../api/photographyServices";
import vendorService from "../api/vendorServices";
import servicesApi from "../api/servicesApi";

//get user from localstorage
let photographer= JSON.parse(localStorage.getItem('photographer'))
let token = JSON.parse(localStorage.getItem('vendor'))?.token

const headers = {
    headers:{
      'auth' : token,
    }
  }

  const formDataHeaders = {
    headers: {
        'auth' : token,
        "Content-Type": "multipart/form-data",
    },
  };

const initialState = {
    photographer: photographer ? photographer : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message:''
}


//get photographers
export const getPhotographers = createAsyncThunk('vendor/getPhotographer', async(data, thunkAPI)=>{
    
    try{
        const res= await photographyServices.getPhotographers(data)
        return res;
    }catch(error){
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)
            || error.message ||error.toString()
            if(error.response.status===403){
                if(error.response.data.message.message !== 'jwt must be provided'){
                    await vendorService.logout()
                    await photographyServices.logout()
                    await servicesApi.logout()
                }
              }
    }
})

//add photographer
export const  addPhotographer = createAsyncThunk('vendor/photographer-add', async(data, thunkAPI)=>{ 
    try {
        return await photographyServices.addPhotographer(data,headers)
    } catch (error) {
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)
            || error.message ||error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

//edit photographer
export const editPhotographer = createAsyncThunk('vendor/photographer-edit', async(data, thunkAPI)=>{
    try {
        return await photographyServices.editPhotographer(data,formDataHeaders)
    } catch (error) {
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)
            || error.message ||error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

//clear data
export const logout = createAsyncThunk('photographer/logout', async () => {
    await photographyServices.logout()
  })

export const photographySlice = createSlice({
    name: "photographer",
    initialState,
    reducers: {
        reset: (state)=>{
          state.isError =null;
          state.isLoading =null;
          state.isSuccess =null;
          state.message = '' 
        },
        setPhotographer: (state,action)=>{
            state.isLoading = null
            state.isSuccess = null
            state.loginEmail = null
            state.photographer = action.payload;
          }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getPhotographers.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(getPhotographers.fulfilled, (state,action)=>{
            state.isLoading=false;
            state.isSuccess = true;
            state.photographer = action.payload
        })
        .addCase(getPhotographers.rejected, (state,action)=>{
            state.isLoading=false;
            state.isError =true;
            state.message = action.payload;
        })
        .addCase(addPhotographer.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(addPhotographer.fulfilled, (state,action)=>{
            state.isLoading=false;
            state.isSuccess = true;
            state.photographer = action.payload
        })
        .addCase(addPhotographer.rejected, (state,action)=>{
            state.isLoading=false;
            state.isError =true;
            state.message = action.payload;
        })
        .addCase(editPhotographer.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(editPhotographer.fulfilled, (state,action)=>{
            state.isLoading=false;
            state.isSuccess = true;
            state.photographer = action.payload
        })
        .addCase(editPhotographer.rejected, (state,action)=>{
            state.isLoading=false;
            state.isError =true;
            state.message = action.payload;
        })
        
        .addCase(logout.fulfilled, (state) => {
            state.photographer = null
        })
    }
})

export const {reset,setPhotographer} = photographySlice.actions;

export default photographySlice.reducer; 