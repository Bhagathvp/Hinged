
import React, { useState,useEffect } from 'react'

import { Header } from '../../components'
import img from '../../../assets/loginPage.png'

import {useSelector, useDispatch } from "react-redux";
import { useNavigate} from "react-router-dom"
import { verifyOtp} from "../../../features/Slice/authSlice";



const Register = () => {

    const [formData,setFormData] =useState({
        Otp: '',
    })
    const[errorMessage,setErrorMessage] = useState('') ;

    const {Otp} = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onChange = (e)=>{
        setFormData((prevState)=>({
          ...prevState,
          [e.target.name] : e.target.value
        }))
        
    }
        

    const {user,loginEmail,loginName,isError,isSuccess,message} = 
    useSelector( (state)=> state.auth )

    useEffect(() => {
        
        if(isError){
          console.error(message);
        }
        if(isSuccess || user){
            navigate('/')
        }
        if(!loginEmail){
            navigate('/login')
        }
    
  
      }, [user,loginEmail, isError,isSuccess, message, navigate, dispatch])
      

          const handleSubmit =(e)=>{
            e.preventDefault();
            if(Otp.length!==6){
                setErrorMessage('Otp should be a 6 digit number')
                return
            }else{
                setErrorMessage('')
            }    
            const userData ={
                userOtp: Otp,
                email : loginEmail,
                name : loginName,
            }
            dispatch(verifyOtp(userData))
          }


  return (
    <>
        <Header/>
        <div className='relative pt-32 mx-auto sm:max-w-screen-smd flex flex-row items-center'>
            <div className=' h-full w-2/5 overflow-hidden '>
                <img className='' src={img} alt="login"/>

            </div>
            <div className='border-2 w-2/3 h-full flex flex-col items-center justify-center p-10'>
                <form className='flex flex-col items-center justify-center w-full' action="/login" method="post" onSubmit={handleSubmit}>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-4xl p-3 font-mono text-slate-700'>Otp Verification</h1>
                        <div className='w-full flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                            {/* <BsPersonCircle className='text-header-bot w-6 h-6 pr-2 border-e-2'/> */}
                            <input 
                            className='w-full p-2 m-1 text-xl font-mono focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                            placeholder='Enter Your Otp' 
                            type="number" 
                            name="Otp"
                            id='Otp'
                            value={Otp}
                            onChange={onChange}
                            required
                            />
                        </div>
                        <p className='text-red-600'>{message}</p>
                        <p className='text-red-600'>{errorMessage}</p>
                        <button className='bg-header-bot w-full h-10 text-white border-2 m-2' type='submit'>VERIFY</button>
                    </div>

                </form>
                
    
                


            </div>
        </div>
      
    </>
  )
}

export default Register
