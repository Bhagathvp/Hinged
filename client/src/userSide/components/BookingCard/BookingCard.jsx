import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal,Button } from 'antd';
import { bookingDetailsApi, userBookingsApi, userRefundApi } from "../../../features/api/api";

   
function BookingCard({booking,setBookings}) {

  const {user} = useSelector( (state)=> state.auth )
  const dispatch =useDispatch();
  const [service,setService] = useState([])
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
    userRefundApi({id:id}).then(res=>{
      toast.success(res.data);
      
      userBookingsApi({id:user?._id}).then(res=>{
        setBookings(res.data)
      }).catch(err=>console.log(err))

    }).catch(err=>console.log(err))
  }

  useEffect(()=>{
    const data ={
      id:booking?.serviceId
    }
    bookingDetailsApi(data).then((res)=>{
      setService(res.data)
    }).catch(err=>console.log(err.data))
  },[booking])



    return (  
      <Card key={service._id} className="w-96 h-full">
        <CardHeader shadow={false} floated={false} className="h-1/2">
          <img
            src={service?.images?service.images[0]:"https://www.shutterstock.com/image-vector/loading-sign-doodle-260nw-742556110.jpg"}
            alt="card-image"
            className="h-full w-full object-cover"
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
          <div className="mb-1 flex items-center justify-between">
            <Typography
            variant="small"
            color="gray"
            className="font-normal opacity-75"
          >
           {service.base_city}
          </Typography>
          <Typography variant="small" color="gray" className="font-normal opacity-85 text-sky-300">
                Payment Method: Online
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
            value={service._id}
            className="bg-green-200 text-green-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            BOOKED✓
          </Button>
          {
            booking.status==='paid' &&
            <Button
            onClick={showModal}
            disabled={(new Date(new Date(booking.bookingFor).getTime() - (5 * 24 * 60 * 60 * 1000)) < new Date()) || booking.status!=='paid'}
            value={booking._id}
            className="bg-red-100 text-red-500 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
           CANCEL AND REFUND
          </Button>
          }
          {
            booking.status==='issue' &&
            <Button
            // onClick={showModal}
            // disabled={(new Date(booking.bookingFor) < new Date()) || booking.status!=='paid'}
            value={booking._id}
            className="bg-yellow-100 text-yellow-600 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            REFUND ISSUED
          </Button>
          }
          {
            booking.status==='refunded' &&
            <Button
            value={booking._id}
            className="bg-red-200 text-red-500 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            REFUNDED
          </Button>
          }
          
        </CardFooter>

        <Modal title="Issue Refund?" 
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
                  Issue Refund
                </Button>,
                ]}>
            <p>Are you sure you want to Issue a refund?</p>
          </Modal>
        
      <ToastContainer />
      </Card>
    );
  }

  export default BookingCard;