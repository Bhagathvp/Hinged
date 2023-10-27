import React, { useEffect,useState } from 'react'
import { Table,Modal,Button } from 'antd';

import {useSelector,useDispatch} from 'react-redux'
import { adminBlock, adminVendorBlock } from '../../../features/Slice/adminSlice'
import { useNavigate } from 'react-router-dom';
import { adminBookingsApi, issueRefundApi } from '../../../features/api/api';


const TableDesign = (prop) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');


  const {adminState,isError,isSuccess,message} = useSelector((state)=>state.admin)
  const users =adminState.users;
  const vendors = adminState.vendors;
  const services = adminState.services;
  const adminEmail = adminState.email;

  //booking details
  const [bookingDetails, setBookingsDetails] = useState([])
  const [bookingId,setBookingId] = useState();

  useEffect(()=>{
    if(prop.selected==='BOOKINGS'){

      adminBookingsApi().then(res=>{

        setBookingsDetails(res.data);
      }).catch(err=>console.log(err))
    }
  },[prop])

  const showModal = (e) => {
    setConfirmationEmail(e.target.value);
    setIsModalOpen(true);
  };

  const openModal = (e) =>{
    setBookingId(e.target.value)
    setModalOpen(true)
  }

  const handleOk = (e) => {
    if(prop.selected==='CUSTOMERS'){
      const userData ={
        email:confirmationEmail ,
        adminEmail,
      } 
      dispatch(adminBlock(userData)).then(res=>{
        console.log(res)
        if(res.payload.message === "jwt must be provided"){
          window.location.reload();
        }
      })
    }
    if(prop.selected==='VENDORS'){
      const userData ={
        email:confirmationEmail ,
        adminEmail,
      } 
      dispatch(adminVendorBlock(userData))
    }
    if(prop.selected==='SERVICES'){
      const userData ={
        email:confirmationEmail ,
        adminEmail,
      } 
      dispatch(adminBlock(userData))
    }
    
    setIsModalOpen(false);
  };

  const handleRefund =(e)=>{
    setModalOpen(false);
    issueRefundApi({id:bookingId}).then(res=>{

      adminBookingsApi().then(res=>{
      setBookingsDetails(res.data);
    }).catch(err=>console.log(err))

    }).catch(err=>console.log(err))

    

  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalOpen(false);
  };

 
    useEffect(() => {
      if(isError){
        console.error(message);
      }
      if(prop.selected==='CUSTOMERS'){
          if(isSuccess || adminState){
          navigate('/admin/home')
        }
      }
      if(prop.selected==='VENDORS'){
          if(isSuccess || adminState){
          navigate('/admin/vendors')
        }
      }
  
      }, [adminState,prop.selected, isError,isSuccess, navigate, dispatch,message])

  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  const serviceColumns = [
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  const bookingsColumns = [
    {
      title: 'Users',
      dataIndex: 'user',
    },
    {
      title: 'Vendors',
      dataIndex: 'vendor',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  return (

    <div>
        <>
            {
            prop.selected==='CUSTOMERS' && <Table columns={columns} dataSource={users.map((user,index)=>{
      return( 
        { 
          key: index,
          name:user.name,
          email: user.email,
          action: <button onClick={(e)=>showModal(e)} 
                    value={user.email} 
                    className='bg-red-500 px-4 rounded text-white font-semibold border border-slate-950'>{user.is_verified?"BLOCK":"UNBLOCK"}</button>
                    ,
        }
      )
    })} size="small" />
    }
    {prop.selected==='VENDORS' && <Table columns={columns} dataSource={vendors.map((vendor,index)=>{
      return( 
        { 
          key: index,
          name:vendor.brand_name,
          email: vendor.email,
          action: <button onClick={(e)=>showModal(e)} 
          value={vendor.email} 
          className='bg-red-500 px-4 rounded text-white font-semibold border border-slate-950'>{vendor.is_verified?"BLOCK":"UNBLOCK"}</button>,
        }
      )
    })} size="small" />}

        <Modal title="Confirmation" open={isModalOpen} onOk={handleOk} 
        onCancel={handleCancel}
        footer={[<Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="default"  onClick={handleOk}>
                  Confirm
                </Button>,
                ]}>
            <p>Are you sure you want to continue?</p>
          </Modal>

    {
    prop.selected==='SERVICES' && <Table columns={serviceColumns} dataSource={services.map((service,index)=>{
      return( 
        { 
          key: index,
          category:service.category,
          action: <button onClick={(e)=>showModal(e)} 
          value={service.category} 
          className='bg-red-500 px-4 rounded text-white font-semibold border border-slate-950'>{service.is_verified?"LIST":"UNLIST"}</button>,
        }
      )
    })} size="small" />
    }
    {
    prop.selected==='BOOKINGS' && 
    <Table columns={bookingsColumns} dataSource={bookingDetails.map((bookingDetail,index)=>{
      let action = null; 
      if (bookingDetail.status === 'paid') {
        action = (
          <button
            value={bookingDetail.id}
            className='bg-green-500 px-4 rounded text-white font-semibold border border-slate-950'
          >
            {bookingDetail?.status === 'paid' && "PAID"}
          </button>
        );
      } else if (bookingDetail.status === 'issue') {
        action = (
          <button
            onClick={(e)=>openModal(e)}
            value={bookingDetail.id}
            className='bg-yellow-500 px-4 rounded text-white font-semibold border border-slate-950'
          >
            {bookingDetail?.status === 'issue' && "REFUND USER"}
          </button>
        );
      } else if (bookingDetail.status === 'refunded') {
        action = (
          <button
            value={bookingDetail.id}
            className='bg-red-500 px-4 rounded text-white font-semibold border border-slate-950'
          >
            {bookingDetail?.status === 'refunded' && "REFUNDED"}
          </button>
        );
      } else if (bookingDetail.status === 'payment initiated') {
        action = (
          <button
            value={bookingDetail.id}
            className='bg-sky-400 px-4 rounded text-white font-semibold border border-slate-950'
          >
            {bookingDetail?.status === 'payment initiated' && "PAYMENT INITIATED"}
          </button>
        );
      }
      return( 
        { 
          key: index,
          user:bookingDetail.user,
          vendor:bookingDetail.vendor,
          orderId:bookingDetail.orderId,
          action: action
          
        }
      )
    })} size="small" />
    }
    <Modal title="Refund User?" open={ModalOpen} onOk={handleRefund} 
        onCancel={handleCancel}
        footer={[<Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="default"  onClick={handleRefund}>
                  Yes,Refund User
                </Button>,
                ]}>
            <p>Are you sure you have refunded the money?</p>
          </Modal>
        </>
    </div>
  )
}

export default TableDesign
