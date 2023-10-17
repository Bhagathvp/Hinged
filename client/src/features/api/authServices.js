import axios from './Axios';

const API_URL = '/users/'


// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)
  
    return response.data
  }

//google login
const googleLogin = async(userData) =>{
  const response = await axios.post(API_URL + 'glogin', userData)

  if(response.data){
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data

}


//verify Otp
const verifyOtp = async (userData) => {
  const response = await axios.post(API_URL + 'verifyOtp', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data

}

// editProfile user
const editProfile = async (userData) => {
    const response = await axios.post(API_URL + 'editProfile', userData)
  
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
  
    return response.data
  }

//logout user
const logout = ()=>{
    localStorage.removeItem('user')
}

const authService={
    login,
    googleLogin,
    verifyOtp,
    logout,
    editProfile
}

export default authService;
