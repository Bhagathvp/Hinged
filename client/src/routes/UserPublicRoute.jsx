import React from "react";
import {useSelector} from 'react-redux'
import {Outlet,Navigate} from 'react-router-dom'


const UserPublicRoute=()=> {
    const authState=useSelector(state=>state.auth)
  return (
    authState.user?<Navigate to='/'/>:<Outlet/>
  )
}

export default UserPublicRoute