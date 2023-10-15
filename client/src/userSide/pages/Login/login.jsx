import React, { useState,useEffect } from 'react'

import { Header } from '../../components'
import img from '../../../assets/loginPage.png'
import {BsPersonCircle} from 'react-icons/bs'

import {GoogleLogin } from '@react-oauth/google';


import {useSelector, useDispatch } from "react-redux";
import { useNavigate} from "react-router-dom"
import { googleLogin, login,reset} from "../../../features/Slice/authSlice";



const Login = () => {

    const [disable,setDisable] = useState(false)
    const [formData,setFormData] =useState({
        email: '',
        name: ''
    })

    const {email,name} = formData;

    const [isEmailEntered, setIsEmailEntered] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user,loginEmail,isError,isSuccess,message} = 
    useSelector( (state)=> state.auth )

    const {vendor} = useSelector((state)=>state.vendor);

    useEffect(() => {
      if(isError){
        console.error(message);
      }
      if(user || vendor){
        navigate('/')
      }
      if(isSuccess || loginEmail){
        navigate('/verifyOtp')
      }

      if(email){
        setIsEmailEntered(true);
      }else{
        setIsEmailEntered(false);
      }
      
      dispatch(reset())

    }, [user,vendor,loginEmail, isError,isSuccess, message, navigate, dispatch,email])
    

    const onChange = (e)=>{
        setFormData((prevState)=>({
          ...prevState,
          [e.target.name] : e.target.value
        }))
        
    }

    

    const handleSubmit =(e)=>{
        e.preventDefault();
        setDisable(true)
        const userData ={
            email,
            name,
        }
        dispatch(login(userData))
    }


  return (
    <>
        <Header/>
        <div className='relative pt-32 mx-auto sm:max-w-screen-smd flex flex-row items-center'>
            <div className='relative h-full w-2/5 overflow-hidden '>
                <img className='' src={img} alt="login"/>
                <div className='absolute top-10 left-10'>
                  <p className=' text-2xl font-serif text-slate-100 font-semibold'>
                    <span className='text-4xl text-pink-100'>Join </span>  
                    Our 
                    <span className='text-4xl text-pink-100'> Family</span></p>
                </div>
            </div>
            <div className='border-2 w-2/3 h-full flex flex-col items-center justify-center p-10'>
                <form className='flex flex-col items-center justify-center w-full' onSubmit={handleSubmit} >
                    <div className='flex flex-col items-center'>
                        <h1 className='text-4xl p-3 font-mono text-slate-700'>Sign In/Sign Up</h1>
                        <div className='w-full flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                            <BsPersonCircle className='text-header-bot w-6 h-6 pr-2 border-e-2'/>
                            <input 
                            className='w-full p-2 m-1 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                            placeholder='Enter email' 
                            type="email" 
                            name="email"
                            id='email'
                            value={email}
                            onChange={onChange}
                            required
                            />
                            
                        </div>
                        {isEmailEntered && <div className='w-full flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                          <input 
                            className='w-full p-2 m-1 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                            placeholder='Enter Full Name' 
                            type="name" 
                            name="name"
                            id='name'
                            value={name}
                            onChange={onChange}
                            required
                            />
                        </div>}
                        
                        <button
                        disabled={disable}
                        className='bg-header-bot w-full h-10 text-white border-2 m-2' 
                        type='submit'>
                          CONTINUE</button>
                    </div>
                    <div className='w-full flex items-center'>
                        <hr className='w-full flex-grow border-t border-gray-400' />
                        <p className='mx-4 text-gray-500'>OR</p>
                        <hr className='w-full flex-grow border-t border-gray-400'/>
                    </div>
                    
                    <p className='font-medium text-slate-700'>Continue With</p>
                    <div className='cursor-pointer rounded-md border-2  border-slate-200 m-2 p-2 bg-white flex items-center '>
                          <GoogleLogin
                              onSuccess={credentialResponse => {

                                const userData = {
                                  id: credentialResponse.clientId,
                                  token : credentialResponse.credential
                                }
                                dispatch(googleLogin(userData))
                                
                              }}
                              onError={() => {
                                console.log('Login Failed');
                              }}
                          />
                        
                    </div>
                    <div className='flex flex-row items-center'>
                      <p>Are you a vendor?</p>
                      <button 
                        onClick={()=>navigate('/business-login')}
                        className='bg-blue-400 p-2 text-white m-2 rounded-sm'>
                        Business signIn
                      </button>
                    </div>  
                </form>
                
    
                


            </div>
        </div>
      
    </>
  )
}

export default Login
