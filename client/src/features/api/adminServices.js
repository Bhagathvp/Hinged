import instance from './Axios';


const API_URL = '/admin/'

// Login admin
const adminLogin = async (adminData) => {
    const response = await instance.post(API_URL , adminData)
    
    if (response.data) {
      localStorage.setItem('admin', JSON.stringify(response.data))
    }
  
    return response.data
  }

  //admin block
  const adminBlock = async (userData,headers) =>{
    const response = await instance.post(API_URL+'block' ,userData, headers)

    if (response.data) {
      localStorage.setItem('admin', JSON.stringify(response.data))
    }
  
    return response.data
  }

  //admin vendor block
  const adminVendorBlock = async (userData,headers) =>{
    const response = await instance.post(API_URL+'vendorBlock' ,userData, headers)

    if (response.data) {
      localStorage.setItem('admin', JSON.stringify(response.data))
    }
  
    return response.data
  }



  //add services
  const addServices = async (Data,headers) =>{
    const response = await instance.post(API_URL+'addServices' , Data, headers)

    if (response.data) {
      localStorage.setItem('admin', JSON.stringify(response.data))
    }
  
    return response.data
  }


  //logout user
  const adminLogout = ()=>{
    localStorage.removeItem('admin')
  }

  const adminService ={
    adminLogin,
    adminLogout,
    adminBlock,
    addServices,
    adminVendorBlock
  } 
  
  export default adminService;