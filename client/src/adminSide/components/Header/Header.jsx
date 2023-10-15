import React, { useEffect } from 'react'
import logo from '../../../assets/logos/Hinged-1 (3).png'

import {IoMdLogOut} from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'

import { adminLogout, reset } from '../../../features/Slice/adminSlice'


const Header = (props) => {

  const {selected} =props

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { adminState } = useSelector((state) => state.admin)

  const onLogout=()=>{
    dispatch(adminLogout())
    dispatch(reset())
    navigate('/admin/')
  }

  useEffect(()=>{
    if(!adminState){
      navigate('/admin')
    }
  },[adminState,navigate])

  

  return (
  <div className='bg-slate-200 fixed w-[100vw] h-[4rem]'>
    <div className=' w-[95vw] h-full z-10 flex justify-between items-center '>
        <div>
            <img className='h-10 m-10' src={logo} alt="logo" />
        </div>
        <div className='flex font-medium'>
            <p style={selected==='customers'?{color:'#4287f5'}:{color:'black'}} onClick={()=>navigate('/admin/')} className='m-1 px-4 cursor-pointer'>Customers</p>
            <p style={selected==='vendors'?{color:'#4287f5'}:{color:'black'}} onClick={()=>navigate('/admin/vendors')} className='m-1 px-4 cursor-pointer'>Vendors</p>
            <p style={selected==='services'?{color:'#4287f5'}:{color:'black'}} onClick={()=>navigate('/admin/services')} className='m-1 px-4 cursor-pointer'>Services</p>
            <p style={selected==='bookings'?{color:'#4287f5'}:{color:'black'}} onClick={()=>navigate('/admin/bookings')} className='m-1 px-4 cursor-pointer'>Bookings</p>


        </div>
        <div onClick={()=>onLogout()} className='flex items-center cursor-pointer'>
            <p className='m-1'>Logout</p>
            <IoMdLogOut className='w-6 h-6'/>
        </div>
      
    </div>
  </div>
    
  )
}

export default Header
