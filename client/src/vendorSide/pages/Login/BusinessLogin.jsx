import React, { useState,useEffect } from 'react'

import img from '../../../assets/vendor-auth.png'
import {BsPersonCircle} from 'react-icons/bs'

import {useSelector, useDispatch } from "react-redux";
import { useNavigate,Link} from "react-router-dom"
import { vendorLogin} from "../../../features/Slice/vendorSlice";


const Login = () => {

    const [formData,setFormData] =useState({
        input: '',   
    })
    const [password,setPassword] = useState('');
    const {input} = formData;

    const [isValidInput, setIsValidInput] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {vendor,loginEmail,isError,isSuccess,message} = 
    useSelector( (state)=> state.vendor )

    useEffect(() => {
      if(isError){
        console.error(message);
      }

    }, [vendor,loginEmail, isError,isSuccess, message, navigate, dispatch])
    

    const onChange = (e)=>{
        setFormData((prevState)=>({
          ...prevState,
          [e.target.name] : e.target.value
        }))

        const inputValue = e.target.value;
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const phoneRegex = /^(\d{10}|\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;
        if (emailRegex.test(inputValue)) {
          setIsValidInput(true);
        }else if(phoneRegex.test(inputValue)){
          setIsValidInput(true);
        }else {
          setIsValidInput(false);
        }
        
    }

    const handleSubmit =(e)=>{
        e.preventDefault();
        const userData ={
          input,
          password,
        }
        dispatch(vendorLogin(userData))
        
    }


  return (
    <>
        {/* <Header/> */}
        <div className='relative pt-32 mx-auto sm:max-w-screen-smd flex flex-row items-center'>
            <div className=' h-full w-2/5 overflow-hidden '>
                <img src={img} alt="login"/>

            </div>
            <div className='border-2 w-2/3 h-full flex flex-col items-center justify-center p-10'>
                <form className='flex flex-col items-center justify-center w-full' onSubmit={handleSubmit} >
                    <div className='flex flex-col items-center'>
                        <h1 className='text-xl p-2 font-semibold font-mono text-slate-700'>"Grow your business with Hinged"</h1>
                        <p className='text-sm p-3'>Sign In to access your dashboard</p>
                        <div className='w-full flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                            <BsPersonCircle className='text-header-bot w-6 h-6 pr-2 border-e-2'/>
                            <input 
                            className='w-full p-2 m-1 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                            placeholder='Enter email or mobile' 
                            type="text" 
                            name="input"
                            id='input'
                            value={input}
                            onChange={onChange}
                            required
                            />
                            
                            
                        </div>
                        {!isValidInput && (
                          <p className="text-red-500 text-sm">Invalid email or phone</p>
                        )}
                        {isValidInput && <div className='w-full flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                          <input 
                            className='w-full p-2 m-1 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                            placeholder='Enter Password' 
                            type="password" 
                            name="password"
                            id='password'
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}
                            required
                            />
                        </div>}
                        
                        <button className='bg-header-bot w-full h-10 text-white border-2 m-2' type='submit'>CONTINUE</button>
                        <p className='text-red-500 font-medium text-lg'>{message}</p>
                    </div>
                    <div className='flex'>
                      <p>Register as vendor?</p>
                      <Link className='text-blue-400' to={'/business-register'}>SignUp</Link>
                    </div>
                    
                    <div className='flex flex-row items-center'>
                      <p>Are you a customer?</p>
                      <button 
                        onClick={()=>navigate('/login')}
                        className='bg-blue-400 p-2 text-white m-2 rounded-sm'>
                        Customer signIn
                      </button>
                    </div>  
                </form>
                
    
                


            </div>
        </div>
      
    </>
  )
}

export default Login
