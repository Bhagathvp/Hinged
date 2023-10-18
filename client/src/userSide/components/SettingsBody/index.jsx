import React, { useState } from 'react'


import {MdVerified,MdLogout,MdCameraAlt} from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { logout,setUser } from '../../../features/Slice/authSlice'
import { editProPicApi, editUserProfile } from '../../../features/api/api'

const SettingsBody = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const {user} = useSelector(state=>state.auth)

    const [save,setSave] = useState(false);
    const [form,setForm] = useState({
        name: user.name,
        email: user.email,
    })

    const {name,email} = form;

    const onChange =(e) => {
        setForm((prevState)=>({
            ...prevState,
            [e.target.name] : e.target.value
          }))
          setSave(true)
    }

    const handleFileUpload = async(e) => {
        const formData = new FormData()
        formData.append("id",user._id);
        formData.append("image",e.target.files[0]);

        await editProPicApi(formData).then(res=>{
            toast.success("Profile Pic updated")
            dispatch(setUser(res.data))
        }).catch(err=>{
            console.log(err);
            toast.error(err.data)
        })
    };


    const Submit = (e) =>{
        e.preventDefault();
        setSave(false);
        const data ={
            id: user._id,
            name: name
        }
        editUserProfile(data).then(res=>{
            toast.success("updated successfully")
            dispatch(setUser(res.data))
        }).catch(err=>{
            console.log(err)
            toast.error(err.response.status)
        })
    }

    const handleClick = () =>{
        dispatch(logout())
        navigate('/')
    }

  return (
    <div  >
        <div className='container md:max-w-screen-md mt-28 mx-auto '>
            <div className='w-full flex flex-col justify-center items-center'>
                <h1 className=' font-medium underline text-gray-600'>Profile Settings</h1>
                <div className='w-36 h-36 rounded-full m-5 border border-slate-700 flex flex-col justify-center items-center relative'>
                    <img className='w-full h-full rounded-full object-cover' src={user?.url} alt={user?.name} />
                    <div className='absolute bottom-0'>
                        <label htmlFor="file-input" className='text-white'>
                            <MdCameraAlt className='text-2xl cursor-pointer'/>
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
                <div className='flex '>
                    <input 
                    className='text-center p-2 text-sm border focus:outline-none focus:border border-slate-300'
                    name='name'
                    value={name}
                    onChange={onChange}
                    type="text" 
                    />
                    {
                        save && 
                        <button 
                        onClick={Submit}
                        className=' border border-slate-300 p-2 bg-slate-50'>☑</button>
                    }
                </div>
                
                
            </div>
            <div className='flex flex-col justify-center items-center'>
                <div className='w-1/2 relative flex flex-col justify-center items-start'>
                    <label htmlFor='email' className='text-sm font-medium text-slate-600'>Email Address</label>
                    <div className='w-full relative'>
                        <input 
                        disabled
                        id='email'
                        className='w-full p-2 text-sm focus:outline-none  border '
                        name='email'
                        value={email}
                        onChange={onChange}
                        type="email" 
                        />
                        <MdVerified className='text-green-600 text-lg absolute right-1 top-2'/>
                    </div>
                    
                </div>
                <div 
                onClick={handleClick}
                className='m-3 flex justify-center items-center text-lg text-header-bot font-medium cursor-pointer hover:scale-105 duration-300 '>
                    <MdLogout className='text-xl '/>
                    <p>Logout</p>
                </div>
            </div>
          
      
        </div>
      
    </div>
    
  )
}

export {SettingsBody}
