import React,{useEffect,useState} from 'react'
import logo from '../../assets/logos/Hinged-1 (3).png'
import { useNavigate } from 'react-router-dom'
import { adminLogin} from '../../features/Slice/adminSlice'
import {useSelector , useDispatch} from 'react-redux'


const AdminLogin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

    const [formData, setFormData] = useState({
      email:'',
      password: '',
    })

    const {email,password} = formData;

    const {adminState,isError,isSuccess,message} = 
    useSelector( (state)=> state.admin)

    const handleChange=(e)=>{
      setFormData((prevstate)=>({
        ...prevstate,
        [e.target.name]:e.target.value
      }))
    }

    const handleSubmit=(e)=>{
      e.preventDefault();

      const adminData ={
        email,
        password
      } 
      dispatch(adminLogin(adminData))
    }

    useEffect(() => {
      if(isError){
        console.error(message);
      }

      if(isSuccess || adminState){
        navigate('/admin/home')
      }
      

    }, [adminState, isError,isSuccess, message, navigate, dispatch])


  return (
    <div className='container h-[100vh] sm:max-w-screen-smd mx-auto flex flex-col justify-center items-center'>
      <img className='w-[30rem] absolute top-14' src={logo} alt="logo" />
      <h1 className='text-2xl font-mono font-semibold'>Sign In</h1>
      <form className=' rounded flex flex-col w-80 p-2 items-center' action="/admin" method="post" onSubmit={handleSubmit}>
        <input className='m-2 w-full h-10 text-center border-2 border-black rounded' 
        type="mail" 
        name='email' 
        placeholder='Email'
        id='email'
        value={email}
        onChange={handleChange}
        required
        />
        <input className='m-2 w-full h-10 text-center border-2 border-black rounded' 
        type="password" 
        name='password' 
        placeholder='Password'
        id='password'
        value={password}
        onChange={handleChange}
        required
        />
        <button className='m-2 h-10 text-white font-mono font-extrabold bg-header-bot border-2 border-slate-300 rounded-md w-full' type='submit'>SignIn</button>
        <p className='text-red-600 text-xl font-mono'>{message}</p>
      </form>

        <div className='absolute bottom-14 text-sm font-medium'>
          <p>@copyright 2023 HINGED</p>
        </div>
      
    </div>
  )
}

export default AdminLogin 
