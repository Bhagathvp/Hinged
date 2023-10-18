import instance from './Axios';

const API_URL = '/vendor/'

//register vendor
const register = async (userData)=>{
    const response = await instance.post(API_URL+'business-register', userData)
     
    if(response.data){
        localStorage.setItem('vendor', JSON.stringify(response.data))
    }
    return response.data
}

//login vendor
const vendorLogin = async(userData)=>{
    const response = await instance.post(API_URL+'business-login', userData)
     
    if(response.data){
        localStorage.setItem('vendor', JSON.stringify(response.data))
    }
    return response.data
}

//vendor Profile
const vendorProfile = async(data,headers)=>{
    const response = await instance.post(API_URL+'vendorProfile', data,headers)

    if(response.data){
        localStorage.setItem('vendor', JSON.stringify(response.data))
    }
    return response.data
}


//logout user
const logout = async()=>{
   await localStorage.removeItem('vendor')
}


const vendorService={
    register,
    vendorLogin,
    vendorProfile,
    logout
}

export default vendorService;
