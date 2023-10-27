import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import adminService from '../api/adminServices'

//get user from localstorage
let admin=  JSON.parse(localStorage.getItem('admin'))

const headers = {
  headers:{
    'auth' : JSON.parse(localStorage.getItem('admin'))?.token,
  }
}

const initialState = {
    adminState: admin ? admin : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message:''
}

//admin login
export const adminLogin = createAsyncThunk('admin/login', async (adminData, thunkAPI) => {
    try {
      return await adminService.adminLogin(adminData)
    } catch (error) {
      const message =
        (error.response && 
            error.response.data && 
            error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  })

  //block user
  export const adminBlock = createAsyncThunk('admin/block', async (userData,thunkAPI) => {
    try {
      return await adminService.adminBlock(userData,headers)
    } catch (error) {
      const message =
        (error.response && 
            error.response.data && 
            error.response.data.message) ||
        error.message ||
        error.toString()
        if(error.response.status===403){
          if(error.response.data.message.message !== 'jwt must be provided'){
            console.log('removing local');
            await adminService.adminLogout()
        }
        }
      return thunkAPI.rejectWithValue(message)
    }
  })

//block vendor
export const adminVendorBlock = createAsyncThunk('admin/vendorBlock', async (userData,thunkAPI) => {
  try {
    return await adminService.adminVendorBlock(userData,headers)
  } catch (error) {
    const message =
      (error.response && 
          error.response.data && 
          error.response.data.message) ||
      error.message ||
      error.toString()
      if(error.response.status===403){
        if(error.response.data.message.message !== 'jwt must be provided'){
          console.log('removing local');
          await adminService.adminLogout()
      }
      }
    return thunkAPI.rejectWithValue(message)
  }
})
  
//add services
  export const addServices = createAsyncThunk('admin/addServices', async (Data, thunkAPI) => {
    try {
      return await adminService.addServices(Data,headers)
    } catch (error) {
      const message =
        (error.response && 
            error.response.data && 
            error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  })

  //logout admin
  export const adminLogout = createAsyncThunk('admin/logout', async () => {
    await adminService.adminLogout()
  })

export const adminSlice = createSlice({
    name: "admin",
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
        .addCase(adminLogin.pending, (state) => {
            state.isLoading = true
        })
        .addCase(adminLogin.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.adminState = action.payload
        })
        .addCase(adminLogin.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.adminState = null
        })
        .addCase(adminBlock.pending, (state) => {
          state.isLoading = true
        })
        .addCase(adminBlock.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.adminState = action.payload
        })
        .addCase(adminBlock.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
          state.adminState = null
        })
        .addCase(adminVendorBlock.pending, (state) => {
          state.isLoading = true
        })
        .addCase(adminVendorBlock.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.adminState = action.payload
        })
        .addCase(adminVendorBlock.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
          state.adminState = null
        })
        .addCase(adminLogout.fulfilled, (state) => {
            state.adminState = null
        })
        .addCase(addServices.pending, (state) => {
          state.isLoading = true
        })
        .addCase(addServices.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.adminState = action.payload
          state.message = action.payload.message
        })
        .addCase(addServices.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
          state.adminState = null
        })
    }
})


export const {reset} = adminSlice.actions;

export default adminSlice.reducer;
