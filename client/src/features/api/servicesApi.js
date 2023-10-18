import instance from './Axios';

const API_URL = '/services/'

//get services
const getServices = async( users, headers)=>{
    const response = await instance.post(API_URL+'getServices',users, headers)

    return response.data;

}

//logout clearing cache
const logout= ()=>{
    localStorage.removeItem('services')
}


const servicesApi={
    getServices,
    logout
}

export default servicesApi;
