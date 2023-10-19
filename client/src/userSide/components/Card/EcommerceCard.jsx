import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal,Button } from 'antd';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { makeOrderApi, removeShortlistApi, userShortlistsApi, verifyOrderApi } from "../../../features/api/api";
import offerImage from '../../../assets/offer.png'
import { logout } from "../../../features/Slice/authSlice";
   
function EcommerceCard({photographer,setShortlists}) {

  const [startDate, setStartDate] = useState(new Date());

  const {user} = useSelector( (state)=> state.auth )
  const dispatch =useDispatch();

      const showToast = (mes) => {
          toast.success(mes, {
            position: 'top-right', // Set the position of the toast
            autoClose: 3000,       // Auto-close the toast after 3 seconds
            hideProgressBar: false, // Show the progress bar
            closeOnClick: true,    // Close the toast when clicked
            pauseOnHover: true,    // Pause auto-close on hover
        });
      };
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [ModalOpen, setModalOpen] = useState(false);

      const handleCancel = () => {
        setIsModalOpen(false);
      };
      const handleNo = () => {
        setModalOpen(false);
      };

      const showModal = (e) => {
        setIsModalOpen(true);
      };
      const openModal = (id) => {
        setModalOpen(true);
      };
    const handleRemove =(e,id)=>{
      e.preventDefault();
      const data ={
        userId: user._id,
        id
      }
      setIsModalOpen(false);
      removeShortlistApi(data).then(res=>{
        console.log(res.data)
        showToast(res.data)
        
        const data ={
          id: user._id
        }
        userShortlistsApi(data).then(res=>{
          console.log(res.data,"<===final shortlists added");
          setShortlists(res.data)
        }).catch(err=>console.log(err))

      }).catch(err=>{
        console.log(err)
        toast.error(err)
        })
    }

    //BOOKINGS....
    const initPayment = (datas,name,image) => {
      console.log(process.env.REACT_APP_KEY_ID,"this is my key id")
      const keyId = process.env.REACT_APP_KEY_ID;
      console.log(keyId)
      const options = {
        key: "rzp_test_kvlsJZRKScJ3eO" || keyId,
        amount: datas.amount,
        currency: datas.currency,
        name: name,
        description: "Thank you for choosing HINGED as your service partner.",
        image: image,
        order_id: datas.id,
        "prefill": {
          "contact": "6282214013" 
      },
        handler: async (response) => {
          try {
            console.log('verifing booking')
            const receipt =datas.receipt
            const { data } = await verifyOrderApi({response,receipt});
            console.log(data);
            
            const val ={
              userId: user._id,
              id: data.id
            }
            removeShortlistApi(val).then(res=>{
              console.log(res)
              
            const data ={
              id: user._id
            }
            userShortlistsApi(data).then(res=>{
              console.log(res.data,"<===final shortlists added");
              setShortlists(res.data)
            }).catch(err=>console.log(err))

            }).catch(err => console.log(err))
            toast.success(data.message)
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#E72E66",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    };

    const handlePayment = async (id) => {
      try {
        if(startDate>Date.now()){
          setModalOpen(false);
          const { data } = await makeOrderApi({id,userId:user._id,startDate})
        console.log(data);
        initPayment(data.data,data.name,data.image);
        }else{
          toast.warning("Select a proper date")
        }
      } catch (error) {
        console.log(error);
        if(error.response.status===403 && error.response.data.message.message==='jwt expired'){
          dispatch(logout())
        }
        if(error.response.status===400){
          toast.error(error.response.data.message)
        }
      }
    };
    

    return (  
      <Card key={photographer._id} className="w-96 h-full">
        <CardHeader shadow={false} floated={false} className="h-1/2 relative">
        {
          photographer?.offer ?
          <img 
          className="absolute right-0 top-0 w-20"
          src={offerImage} alt="offer-image" 
          /> : null
          }
          <img
            src={photographer.images?photographer.images[0]:"https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80"}
            alt="card-image"
            className="h-full w-full object-cover"
          />
        </CardHeader>
        <CardBody>
          <div className="mb-2 flex items-center justify-between">
            <Typography color="blue-gray" className="font-medium" >
              {photographer.brand}
            </Typography>
            {
            photographer.offer ?
            <Typography color="blue-gray" className="font-medium">
                ₹{photographer.amount-(photographer.amount*photographer.offer/100)}/-
                <span className="text-sm text-slate-500"> on offer</span>
            </Typography>
            :
            <Typography color="blue-gray" className="font-medium">
                ₹{photographer.amount}
            </Typography>
            }
          </div>
          <Typography
            variant="small"
            color="gray"
            className="font-normal opacity-75"
          >
           {photographer.base_city}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0 flex justify-between items-center ">
          <Button
            onClick={()=>openModal()}
            value={photographer._id}
            className="bg-gray-200 text-blue-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            BOOK
          </Button>
          <DatePicker 
          selected={startDate} 
          onChange={(date) => setStartDate(date)} 
          className="border rounded p-1 text-center"
          filterDate={(date) => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 5);
            return date.getTime() >= tomorrow.getTime();
          }}
          />
          <Button
            onClick={showModal}
            value={photographer._id}
            className="bg-gray-200 text-blue-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            REMOVE
          </Button>
        </CardFooter>
        <Modal title="Confirmation" open={isModalOpen} onOk={(e)=>handleRemove(e,photographer._id)} 
        onCancel={handleCancel}
        footer={[<Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="default"  onClick={(e)=>handleRemove(e,photographer._id)}>
                  Confirm
                </Button>,
                ]}>
            <p>Are you sure you want to remove?</p>
          </Modal>
          <Modal title="Acknowledgement" open={ModalOpen} onOk={(e)=>handlePayment(photographer._id)} 
        onCancel={handleNo}
        footer={[<Button key="back" onClick={handleNo}>
                  No
                </Button>,
                <Button key="submit" type="default"  onClick={(e)=>handlePayment(photographer._id)}>
                  Yes, Proceed
                </Button>,
                ]}>
            <p>Please have a proper communication with the vendor before moving to <span className="font-medium text-base text-red-800">payment </span>option. 
              Ask vendor for their <span className="font-medium text-base text-orange-800">availabilty and dates</span> before proceeding.</p>
              <p className="text-base font-medium text-red-900">Proceed to payment?</p>
          </Modal>
      <ToastContainer />
      </Card>
    );
  }

  export default EcommerceCard;