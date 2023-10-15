import React, { useState,useEffect } from 'react'

import img from '../../../assets/vendor-auth.png'

import {useSelector, useDispatch } from "react-redux";
import { useNavigate,Link} from "react-router-dom"
import { register} from "../../../features/Slice/vendorSlice";



const Register = () => {

    const [formData,setFormData] =useState({
        email: '',
        name: '',
        password: '',
        city: '',

    })
    const {email,name,password,city} = formData;
    const [mobile,setMobile] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {vendor,loginEmail,isError,isSuccess,message} = 
    useSelector( (state)=> state.vendor )

    useEffect(() => {
      if(isError){
        console.error(message);
      }
      if(vendor){
        navigate('/vendorProfile')
      }
      if(isSuccess ){
        navigate('/vendorProfile')
      }
      

    }, [vendor,loginEmail, isError,isSuccess, message, navigate, dispatch])
    

    const onChange = (e)=>{
        setFormData((prevState)=>({
          ...prevState,
          [e.target.name] : e.target.value
        }))

        

        // const inputValue = e.target.value;
        // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        // const phoneRegex = /^(\d{10}|\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;
        // if (emailRegex.test(inputValue)) {
        //   setIsValidInput(true);
        // }else if(phoneRegex.test(inputValue)){
        //   setIsValidInput(true);
        // }else {
        //   setIsValidInput(false);
        // }
        
    }

    const handleMobileChange = (event) => {
        const mobileValue = event.target.value;
        const mobilePattern = /^\d{10}$/ ; // Change this pattern to match your mobile number format
        const isValidMobile = mobilePattern.test(mobileValue);
    
        setMobile(mobileValue);
    
        if (isValidMobile) {
          setError('');
        } else {
          setError('Please enter a valid mobile number.'); 
        }
      };

    const handleSubmit =(e)=>{
        e.preventDefault();
        const userData ={
            email,
            name,
            password,
            mobile,
            city,
        }
        dispatch(register(userData))
    }


  return (
    <>
        {/* <Header/> */}
        <div className='relative pt-32 mx-auto sm:max-w-screen-smd flex flex-row items-center'>
            <div className=' h-full w-2/5 overflow-hidden '>
                <img className='' src={img} alt="login"/>

            </div>
            <div className='border-2 w-2/3 h-full flex flex-col items-center justify-center p-10'>
                <form className='flex flex-col items-center justify-center w-full' onSubmit={handleSubmit} >
                    <div className='flex flex-col items-center'>
                        <h1 className='text-xl font-semibold p-1 font-mono text-slate-700'>"Grow your business with Hinged"</h1>
                        <p className='text-sm p-3'>Sign In to access your dashboard</p>
                        <div className='w-full m-1 flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                          <input 
                            className='w-full p-2 m-1 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                            placeholder='Brand name' 
                            type="text" 
                            name="name"
                            id='name'
                            value={name}
                            onChange={onChange}
                            required
                            />
                        </div>
                        <div className='w-full m-1 flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                          <input 
                            className='w-full p-2 m-1 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                            placeholder='city' 
                            type="text" 
                            name="city"
                            id='city'
                            value={city}
                            onChange={onChange}
                            required
                            />
                        </div>
                        <div className='w-full m-1 flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                            {/* <BsPersonCircle className='text-header-bot w-6 h-6 pr-2 border-e-2'/> */}
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
                        <div className='w-full m-1 flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                          <input 
                            className='w-full p-2 m-1 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                            placeholder='Mobile' 
                            type="number" 
                            name="mobile"
                            id='mobile'
                            value={mobile}
                            onChange={handleMobileChange}
                            required
                            />
                        </div>
                        {error && <div className="text-red-500">{error}</div>}
                        <div className='w-full m-1 flex items-center border-2 bg-white px-2 focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                          <input 
                            className='w-full p-2 m-1 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                            placeholder='Enter Password' 
                            type="password" 
                            name="password"
                            id='password'
                            value={password}
                            onChange={onChange}
                            required
                            />
                        </div>

                        
                        <button className='bg-header-bot w-full h-10 text-white border-2 m-2' type='submit'>CONTINUE</button>
                        <p className='text-red-500 font-medium text-lg'>{message}</p>
                    </div>
                    <div className='flex'>
                      <p>Already have an account?</p>
                      <Link className='text-blue-400' to={'/business-login'}>SignIn</Link>
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

export default Register
