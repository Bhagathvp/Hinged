import React from "react";
import {useSelector} from 'react-redux'
import {Outlet,Navigate} from 'react-router-dom'


const VendorPrivateRoute=()=> {
    const vendorState=useSelector(state=>state.vendor)
  return (
    vendorState.vendor?<Outlet/>:<Navigate to='business-login'/>
  )
}

export default VendorPrivateRoute