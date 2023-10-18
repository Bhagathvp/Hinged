import axios from './Axios';

const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    }
  });

let headers;
  const user= JSON.parse(localStorage.getItem('user'));
  const vendor= JSON.parse(localStorage.getItem('vendor'));

  if(user){
    const token = JSON.parse(localStorage.getItem('user'))?.token
    headers = {
      headers:{
        'auth' : token,
      }
    }
  }else if(vendor){
    const token = JSON.parse(localStorage.getItem('vendor'))?.token
    headers = {
      headers:{
        'auth' : token,
      }
    }
  }
 

export const PhotoProfile = (data) => {
    return instance.get( '/photographer/getPhotoProfile', { params:  data  } )
}

//chat
export const ReadMsgsApi = (data) => instance.post("/chat/markRead", data, headers);

export const addNewMSgApi = (data) => instance.post("/chat/addmsg", data, headers);

export const getAllmsgsApi = (data) => instance.post("/chat/getmsg", data, headers);

export const getLastMsgsApi = (data) => instance.post("/chat/lastmsg", data, headers);

//match
export const ShowMatchesApi = (data) => instance.post("chat/matches",data, headers);

export const createMatch = (data) => instance.put('/chat/createMatch', data, headers)

//photosearch
export const searchPhotographer =(data) => instance.get('/photographer/searchPhoto',{params:data})

export const addOfferApi =(data) => instance.put('/photographer/addOffer', data, headers)

export const clearOfferApi =(data) => instance.put('/photographer/clearOffer', data, headers)

//shortlist
export const addShortlistApi = (data) =>{
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'Authorization': `Bearer ${token}` };
  return instance.put('/users/addShortlist',data, {
    headers: headers, // Pass headers inside the configuration object
  })
} 

export const userShortlistsApi = (data) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'Authorization': `Bearer ${token}` };
  return instance.get('/users/userShortlists', {
    params: data,
    headers: headers, // Pass headers inside the configuration object
  });
}

export const removeShortlistApi = (data) =>{
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'Authorization': `Bearer ${token}` };
  return instance.put('/users/removeShortlist',data, {
    headers: headers, // Pass headers inside the configuration object
  })
} 

export const userBookingsApi = (data) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'Authorization': `Bearer ${token}` };
  return instance.get('/users/userBookings', {
    params: data,
    headers: headers, // Pass headers inside the configuration object
  });
}

export const bookingDetailsApi = (data) =>{
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'auth': token };
  return instance.get('/photographer/bookedPhotographers',{
    params: data,
    headers: headers,
  });
}

//orders
export const makeOrderApi = (data)=>{
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'Authorization': `Bearer ${token}` };
  return instance.post('/users/orders',data, {
    headers: headers, 
  })
}

export const verifyOrderApi = (data)=>{
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'Authorization': `Bearer ${token}` };
  return instance.post('/users/verify',data, {
    headers: headers, 
  })
}

export const vendorBookingsApi = (data) => {
  const token = JSON.parse(localStorage.getItem('vendor'))?.token;
  const headers = { 'auth': token };
  return instance.get('/vendor/vendorBookings', {
    params: data,
    headers: headers, // Pass headers inside the configuration object
  });
}

export const vendorBookingDetailsApi = (data) =>{
  const token = JSON.parse(localStorage.getItem('vendor'))?.token;
  const headers = { 'auth': token };
  return instance.get('/photographer/bookedPhotographers',{
    params: data,
    headers: headers,
  });
}

export const getUserDetailsApi = (data) =>{
  const token = JSON.parse(localStorage.getItem('vendor'))?.token;
  const headers = { 'auth': token };
  return instance.get('/vendor/getUserDetails',{
    params: data,
    headers: headers,
  });
}

//admin bookings
export const adminBookingsApi = (data) =>{
  const token = JSON.parse(localStorage.getItem('admin'))?.token;
  const headers = {'auth': token};
  return instance.get('/admin/adminBookings',{
    headers: headers
  })
}

export const issueRefundApi = data =>{
  const token = JSON.parse(localStorage.getItem('admin'))?.token;
  const headers = {'auth': token};
  return instance.put('/admin/issueRefund',data,{
    headers: headers
  })
}

export const userRefundApi = data =>{
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'Authorization': `Bearer ${token}` };
    return instance.put('/users/userRefund',data,{
    headers: headers,
  });
}

export const vendorRefundApi = data =>{
  const token = JSON.parse(localStorage.getItem('vendor'))?.token;
  const headers = { 'auth': token };
    return instance.put('/vendor/vendorRefund',data,{
    headers: headers,
  });
}

export const addReviewApi = data =>{
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'auth': token };
    return instance.put('/photographer/addReview',data,{
    headers: headers,
  });
}

//edit user profile
export const editUserProfile = data =>{
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 'Authorization': `Bearer ${token}` };
  return instance.post('/users/editUserProfile',data,{
    headers: headers,
  });
}

//edit profile picture
export const editProPicApi = data =>{
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const headers = { 
    'Authorization': `Bearer ${token}`,
    "Content-Type": "multipart/form-data", 
  };
  return instance.post('/users/editProPic',data,{
    headers: headers,
  });
}

//subscription
export const addSubscriptionApi = data =>{
  const token = JSON.parse(localStorage.getItem('vendor'))?.token;
  const headers = { 'auth': token };
  return instance.post('/vendor/addSubscription',data,{
  headers: headers,
});
}

//subscription verification
export const verifySubscriptionApi= data =>{
  const token = JSON.parse(localStorage.getItem('vendor'))?.token;
  const headers = { 'auth': token };
  return instance.post('/vendor/verifySubscription',data,{
  headers: headers,
});
}
