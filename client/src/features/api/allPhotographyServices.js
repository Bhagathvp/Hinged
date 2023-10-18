import instance from './Axios';


const API_URL = '/photographer/'

//get photographers
const getAllPhotographers = async( )=>{
  const response = await instance.get(API_URL+'getAllPhotographers')

  // if(response.data){
  //     console.log(response.data);
  // }
  return response.data;

}


//logout clearing cache
const logout= ()=>{
  localStorage.removeItem('photographer')
}

const allPhotographyServices ={
    getAllPhotographers,
    logout,
}

export default allPhotographyServices