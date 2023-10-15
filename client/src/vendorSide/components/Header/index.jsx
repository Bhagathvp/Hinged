import React, { useEffect, useState } from 'react'
import {BsPencilSquare,BsSearch} from 'react-icons/bs'
import img from '../../../assets/logos/Hinged-1.png'
import Dropdown from '../Dropdown/Dropdown'
import { logout, reset } from '../../../features/Slice/authSlice'
import {logout as Logout} from '../../../features/Slice/vendorSlice'
import {logout as serviceLogout} from '../../../features/Slice/servicesSlice'
import {logout as photographerLogout} from '../../../features/Slice/photographySlice'

import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'

import {RiArrowDropDownLine} from 'react-icons/ri'

const Header = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector((state)=> state.auth)
  const {vendor} = useSelector((state)=> state.vendor)

  const onLogout = ()=>{
    dispatch(logout())
    dispatch(Logout())
    dispatch(serviceLogout())
    dispatch(photographerLogout())
    dispatch(reset())
    navigate('/')
  }

  const Navigate=()=>{
    if(user){
      navigate('/userProfile')
    }else if(vendor){
      navigate('/vendorProfile')
    }
  }

  return (
    <div className='fixed top-0 left-0 z-10 w-full'>
      
      <div className='bg-header-top	text-white py-1 '>
        <div className='container flex justify-between items-center'>
          <div className='flex flex-row '>
            
            <p className='text-xs font-medium m-2 '>India's Favourite Wedding Planning Platform</p>
            
            <Dropdown/>
          </div>

          <div  className='flex flex-row'>
            <BsPencilSquare />
            <p className='text-xs font-medium '>Write A Review</p>
          </div>
        </div>

      </div>

      <div className='bg-header-bot	text-white py-2 '>
        <div className='container flex justify-between items-center'>
          <div className='flex flex-row items-center'>
            <img onClick={()=>navigate('/')} className='h-8 px-2 cursor-pointer' 
            src={img?img:'https://w7.pngwing.com/pngs/761/343/png-transparent-computer-icons-issues-trademark-logo-area.png'} 
            alt="logo" />
            {/* <p onClick={()=>navigate('/venues')} className='font-medium m-1 px-4 cursor-pointer'>Venues</p> */}
            <p onClick={()=>navigate('/photographers')} className='font-medium m-1 px-4 cursor-pointer'>Photographers</p>
            <p className='font-medium m-1 px-4 cursor-pointer'>MakeUp</p>
          </div>
          <div className='flex flex-row'>
            <BsSearch className='hidden md:block bg-header-top px-2 m-1 rounded-full h-8 w-8 cursor-pointer'/>
            {
              user||vendor?
              <div className="relative flex items-center p-1" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}> 
              <img onClick={()=>Navigate()} className='cursor-pointer rounded-full w-8 h-8' src={user?user.url:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="profileImg" />
              <RiArrowDropDownLine className='text-lg top-0 right-3 text-header-top'/>
              <div
              className="absolute top-10 right-0 w-40 bg-slate-400 border border-gray-300 shadow-lg rounded-md"
              style={{ visibility: isDropdownVisible ? 'visible' : 'hidden' }}
              >
                {vendor && <button onClick={()=>navigate('/vendorProfile')} className="block w-full text-left px-4 py-2 text-white">Vendor Profile</button>}
                {/* <button className="block w-full text-left px-4 py-2 text-white">Settings</button> */}
                <button onClick={()=>onLogout()} className="block w-full text-left px-4 py-2 text-white rounded-b-lg bg-header-top text-sm ">Logout</button>
              </div>
              {/* 
                <button onClick={()=>onLogout()} className=' bg-header-top px-8 m-1 text-sm rounded-full h-8 '>Log Out</button> */}
              </div>
              :
              <button onClick={()=>navigate('/login')} className=' bg-header-top px-8 m-1 text-sm rounded-full h-8 '>Log In</button>
            }
            
          </div>
        </div>

      </div>
        
    </div>
    
  )
}

export {Header}