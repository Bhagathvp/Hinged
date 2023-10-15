import React, { useState,useEffect } from 'react'
import TableDesign  from '../Table/TableDesign'
import {Modal,Button } from 'antd';

import {useSelector,useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { addServices,reset } from '../../../features/Slice/adminSlice';


const Body = (prop) => {

  const [isModalOpen, setIsModalOpen] = useState()
  const [input,setInput] = useState()

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {adminState,isError,isSuccess,message} = useSelector((state)=>state.admin)
  const adminEmail = adminState.email;
  
  const showModal = (e) => {
    setIsModalOpen(true);
  };

  const handleOk = (e) => {
    const Data ={
      category: input ,
      adminEmail,
    } 
    if(input){
      dispatch(addServices(Data))
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if(isError){
      console.error(message);
    }
    if(prop.selected==='CUSTOMERS'){
        if(isSuccess || adminState){
        dispatch(reset())
        navigate('/admin/home')
      }
    }
    if(prop.selected==='VENDORS'){
        if(isSuccess || adminState){
        navigate('/admin/vendors')
      }
    }
    if(prop.selected==='SERVICES'){
      if(isSuccess || adminState){
      navigate('/admin/services')
    }
    }
    if(prop.selected==='BOOKINGS'){
      if(isSuccess || adminState){
      navigate('/admin/bookings')
    }
    }
     

    }, [adminState,prop.selected, isError,isSuccess, navigate, dispatch,message])

  return (
    <div className='relative top-16 container md:max-w-screen-md pt-7'>
      <div className='flex justify-between'>

        <h1 className='mb-10 text-2xl font-semibold underline underline-offset-4'>{prop.selected}</h1>
        { prop.selected==='SERVICES' && <button 
                onClick={showModal}
                className='bg-purple-500 p-2 m-4 rounded-md text-zinc-50 border-2 border-purple-700'>
                ADD SERVICES+</button>}
      </div>
          {prop.selected==='SERVICES' && <p className='text-red-500 font-medium text-lg'>{message}</p>}
      <Modal title="NEW SERVICE" open={isModalOpen} onOk={handleOk} 
        onCancel={handleCancel}
        footer={[<Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="default"  onClick={handleOk}>
                  ADD+
                </Button>,
                ]}>
            <p>Enter new category</p>
            <input className='w-full p-2 m-1 border-2'
            type="text" 
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder='Category Name'
            required
            />
          </Modal>
        
        <TableDesign selected ={prop.selected}/>
        

    </div>
  )
}

export default Body
