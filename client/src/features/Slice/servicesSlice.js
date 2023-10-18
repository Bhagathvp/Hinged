import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Services from "../api/servicesApi";
import vendorService from "../api/vendorServices";

//get user from localstorage
// let vendor= JSON.parse(localStorage.getItem('vendor'))
let services= JSON.parse(localStorage.getItem('services'))

const headers = {
    headers:{
      'auth' : JSON.parse(localStorage.getItem('vendor'))?.token,
    }
  }

const initialState = {
    services: services ? services : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message:''
}

//login services
export const getServices = createAsyncThunk('services/getServices', async(user, thunkAPI)=>{
    try{
        return await Services.getServices(user,headers)
    }catch(error){
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)
            || error.message ||error.toString()
            if(error.response.status===403){
                console.log(error.response)
                if(error.response.data.message.message !== 'jwt must be provided'){
                    console.log('removing local');
                    await vendorService.logout()
                }
              }
    }
})

//logout user
export const logout = createAsyncThunk('services/logout', async () => {
    await Services.logout()
  })

export const serviceSlice = createSlice({
    name: "services",
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
        .addCase(getServices.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(getServices.fulfilled, (state,action)=>{
            state.isLoading=false;
            state.isSuccess = true;
            state.services = action.payload
        })
        .addCase(getServices.rejected, (state,action)=>{
            state.isLoading=false;
            state.isError =true;
            state.message = action.payload;
            state.services =null;
        })
        
        .addCase(logout.fulfilled, (state) => {
            state.services = null
        })
    }
})

export const {reset} = serviceSlice.actions;

export default serviceSlice.reducer; 