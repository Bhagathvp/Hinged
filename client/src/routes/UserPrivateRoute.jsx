import React from "react";
import {useSelector} from 'react-redux'
import {Outlet,Navigate} from 'react-router-dom'


const UserPrivateRoute=()=> {
    const authState=useSelector(state=>state.auth)
  return (
    authState.user?<Outlet/>:<Navigate to='login'/>
  )
}

export default UserPrivateRoute