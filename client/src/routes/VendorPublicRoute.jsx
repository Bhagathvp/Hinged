import React from "react";
import {useSelector} from 'react-redux'
import {Outlet,Navigate} from 'react-router-dom'


const VendorPublicRoute=()=> {
    const vendorState=useSelector(state=>state.vendor)
  return (
    vendorState.vendor?<Navigate to='/vendorProfile'/>:<Outlet/>
  )
}

export default VendorPublicRoute