import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../api/authServices";

//get user from localstorage
const user= JSON.parse(localStorage.getItem('user'));

const headers = {
  headers:{
    'auth' : JSON.parse(localStorage.getItem('user'))?.token,
  }
}

const initialState = {
    user: user ? user : null,
    loginEmail: null,
    loginName: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message:''
}


// Login user
export const login = createAsyncThunk('/login', async (user, thunkAPI) => {
    try {
      return await authService.login(user)
    } catch (error) {
      const message =
        (error.response && 
            error.response.data && 
            error.response.data.error) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  })

  //Google login
export const googleLogin = createAsyncThunk('/glogin', async(user, thunkAPI)=>{
  try{
    return await authService.googleLogin(user);
  }catch(error){
    const message =
        (error.response && 
            error.response.data && 
            error.response.data.error) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

//verifyOtp
export const verifyOtp = createAsyncThunk('/verifyOtp',async(user,thunkAPI)=>{
  try {
    return await authService.verifyOtp(user)
  } catch (error) {
    const message =
      (error.response && 
          error.response.data && 
          error.response.data.err) ||
      error.message ||
      error.toString()
      console.log('Error',error);
    return thunkAPI.rejectWithValue(message)
  }

})

  //logout user
  export const logout = createAsyncThunk('/logout', async () => {
    await authService.logout()
  })


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state)=>{
          state.isError =null;
          state.isLoading =null;
          state.isSuccess =null;
          state.message = '' 
        },
        setUser: (state,action)=>{
          localStorage.setItem('user', JSON.stringify(action.payload))
          state.isLoading = null
          state.isSuccess = null
          state.loginEmail = null
          state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.loginEmail = action.payload.email
            state.loginName = action.payload.name
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(googleLogin.pending, (state) => {
          state.isLoading = true
        })
        .addCase(googleLogin.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.loginEmail = null
          state.user = action.payload
        })
        .addCase(googleLogin.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(verifyOtp.pending, (state) => {
          state.isLoading = true
        })
        .addCase(verifyOtp.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.loginEmail = null
            state.loginName = null
            state.user = action.payload
        })
        .addCase(verifyOtp.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null
        })
    }
})

export const {reset,setUser} = authSlice.actions;

export default authSlice.reducer;
