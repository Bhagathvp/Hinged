import instance from './Axios';

let token;
if(JSON.parse(localStorage.getItem('vendor'))){
  token = JSON.parse(localStorage.getItem('vendor')).token
}

const headers = {
    headers:{
      'auth' : token,
    }
  }


const API_URL = '/photographer/'

//get photographers
const getPhotographers = async( data)=>{
  const response = await instance.post(API_URL+'getPhotographers',data,headers)

  return response.data;

}

//add photographer
const addPhotographer = async(data, headers)=>{
  const response = await instance.post(API_URL+'addPhotographer',data, headers)

  return response.data

}

//edit photographer
const editPhotographer = async(data, headers)=>{
  const response = await instance.post(API_URL+'editPhotographer',data, headers)

  return response.data

}

//logout clearing cache
const logout= ()=>{
  localStorage.removeItem('photographer')
}

const photographyServices ={
  getPhotographers,
  addPhotographer,
  editPhotographer,
  logout,
}

export default photographyServices