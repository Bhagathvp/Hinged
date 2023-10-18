import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorService from "../api/vendorServices";

//get user from localstorage
let vendor= JSON.parse(localStorage.getItem('vendor'))

const headers = {
    headers:{
      'auth' : JSON.parse(localStorage.getItem('vendor'))?.token,
    }
  }

const initialState = {
    vendor: vendor ? vendor : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message:''
}

//register vendor
export const  register = createAsyncThunk('vendor/register', async(user, thunkAPI)=>{
    try {
        return await vendorService.register(user)
    } catch (error) {
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)
            || error.message ||error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

//login vendor
export const vendorLogin = createAsyncThunk('vendor/login', async(user, thunkAPI)=>{
    try{
        return await vendorService.vendorLogin(user)
    }catch(error){
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)
            || error.message ||error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

//vendor profile
export const vendorProfile = createAsyncThunk('vendor/profile', async(data, thunkAPI)=>{
    try{
        return await vendorService.vendorProfile(data,headers)
    }catch(error){
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)
            || error.message ||error.toString()
            if(error.response.status===403){
                console.log('removing local');
                await vendorService.logout()
              }
        return thunkAPI.rejectWithValue(message);
    }
})

//logout user
export const logout = createAsyncThunk('/logout', async () => {
    await vendorService.logout()
  })

export const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {
        reset: (state)=>{
          state.isError =null;
          state.isLoading =null;
          state.isSuccess =null;
          state.message = '' 
        },
        setVendor: (state,action)=>{
            localStorage.setItem('vendor', JSON.stringify(action.payload))
            state.isLoading = null
            state.isSuccess = null
            state.loginEmail = null
            state.vendor = action.payload;
          }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state,action)=>{
            state.isLoading=false;
            state.isSuccess = true;
            state.vendor = action.payload
        })
        .addCase(register.rejected, (state,action)=>{
            state.isLoading=false;
            state.isError =true;
            state.message = action.payload;
            state.vendor =null;
        })
        .addCase(vendorLogin.pending, (state) => {
            state.isLoading = true
        })
        .addCase(vendorLogin.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.vendor = action.payload;
        })
        .addCase(vendorLogin.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.vendor = null
        })
        .addCase(vendorProfile.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(vendorProfile.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.vendor = action.payload;
        })
        .addCase(vendorProfile.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.vendor = null
        })

        .addCase(logout.fulfilled, (state) => {
            state.vendor = null
        })
    }
})

export const {reset,setVendor} = vendorSlice.actions;

export default vendorSlice.reducer; 