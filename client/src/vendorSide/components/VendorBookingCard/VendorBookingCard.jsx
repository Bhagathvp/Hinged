import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal,Button } from 'antd';
import { getUserDetailsApi, vendorRefundApi, vendorBookingDetailsApi, vendorBookingsApi } from "../../../features/api/api";


function VendorBookingCard({booking,setBookings}) {

  const {vendor} = useSelector( (state)=> state.vendor )
  const [service,setService] = useState([])
  const [userDetails,setUserDetails] = useState()
  const [isModalOpen,setIsModalOpen] = useState(false);


  const date = booking.createdAt
  const dateObj = new Date(date)
  const dateOnlyString = dateObj.toLocaleDateString();

  const bookedDate = new Date(booking.bookingFor)
  const bookedDateString = bookedDate.toLocaleDateString()

  const handleCancel =()=>{
    setIsModalOpen(false);
  }
  
  const showModal =()=>{
    setIsModalOpen(true);
  }

  const handleRefund= (e,id)=>{
    setIsModalOpen(false);
    vendorRefundApi({id:id}).then(res=>{
      toast.success(res.data);
      
      vendorBookingsApi({id:vendor?._id}).then(res=>{
        setBookings(res.data)
      }).catch(err=>console.log(err))

    }).catch(err=>console.log(err))
  }


  useEffect(()=>{
    const data ={
      id:booking?.serviceId
    }
    vendorBookingDetailsApi(data).then((res)=>{
      setService(res.data)
    }).catch(err=>console.log(err.data));

    
  },[booking])

  useEffect(()=>{
    getUserDetailsApi({id:booking?.userId}).then(res=>{
      setUserDetails(res.data)
    }).catch(err=>console.log(err))
  },[booking])


    return (  
      <Card key={service._id} className="w-96 h-full">
        <CardHeader shadow={false} floated={false} className="h-1/2 flex">
          <div className="h-full w-1/2 m-1">
              <img
              src={userDetails?.imageUrl}
              alt="card-image"
              className="h-24 w-24 object-cover rounded-full"
            />
            <p className="text-center text-opacity-40 text-base">{userDetails?.name}</p>
          </div>
          
          <hr className="border h-full border-gray-200"/>
          <img
            src={service?.images?service.images[0]:"https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80"}
            alt="card-image"
            className="h-28 w-full object-cover rounded-2xl m-1"
          />
        </CardHeader>
        <CardBody>
          <div className="mb-2 flex items-center justify-between">
            <Typography color="blue-gray" className="font-medium" >
              {service.brand}
            </Typography>
            <Typography color="blue-gray" className="font-medium">
                ₹{booking.payment}
            </Typography>
          </div>
          <div className="mb-1 flex">

            <Typography
            variant="small"
            color="gray"
            className="font-normal opacity-75 mr-1 flex"
          >
           Booked By :<span className="font-medium"> {userDetails?.name}</span> 
          </Typography>
          
          </div>
          <div className="mb-1 flex items-center justify-between">
          <Typography  color="blue-gray" className="font-normal text-xs">
                Booked For: <span className="font-semibold text-sm">{bookedDateString}</span>
            </Typography>
            <Typography color="blue-gray" className="font-normal text-xs">
                Payment Done: <span className="font-semibold text-sm">{dateOnlyString}</span>
            </Typography>
          </div>
          
          
        </CardBody>
        <CardFooter className="pt-0 flex justify-between">
          <Button
            disabled
            value={service._id}
            className="bg-gray-200 text-red-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            BOOKED ✓
          </Button>
          {
            booking.status==='paid' &&
            <Button
            onClick={showModal}
            disabled={(new Date(new Date(booking.bookingFor).getTime() - (5 * 24 * 60 * 60 * 1000)) < new Date()) || booking.status!=='paid'}
            value={booking._id}
            className="bg-red-100 text-red-500 font-semibold shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
           REQUEST CANCELLATION
          </Button>
          }
          {
            booking.status==='issue' &&
            <Button
            // onClick={showModal}
            // disabled={(new Date(booking.bookingFor) < new Date()) || booking.status!=='paid'}
            value={booking._id}
            className="bg-yellow-100 text-yellow-600 font-semibold shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            REQUESTED
          </Button>
          }
          {
            booking.status==='refunded' &&
            <Button
            // onClick={showModal}
            // disabled={(new Date(booking.bookingFor) < new Date()) || booking.status!=='paid'}
            value={booking._id}
            className="bg-red-200 text-red-500 font-semibold shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            BOOKING CANCELLED 
          </Button>
          }
        </CardFooter>

        <Modal title="Cancel Booking?" 
        open={isModalOpen} 
        onOk={(e)=>handleRefund(e,booking._id)} 
        onCancel={handleCancel}
        footer={[<Button key="back" 
                onClick={handleCancel}
                >
                  Cancel
                </Button>,
                <Button key="submit" type="default"  
                onClick={(e)=>handleRefund(e,booking._id)}
                >
                  Proceed
                </Button>,
                ]}>
            <p>Are you sure you want to Issue a cancel Request to admin?</p>
          </Modal>

      <ToastContainer />
      </Card>
      
    );
  }

  export default VendorBookingCard;