import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import {toast,ToastContainer} from 'react-toastify'

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPhotographer, setPhotographer } from "../../../features/Slice/photographySlice";
import { addOfferApi, clearOfferApi } from "../../../features/api/api";
import offerImage from '../../../assets/offer.png'

function EcommerceCard({photographer}) {

  const dispatch = useDispatch();

  const {vendor} = useSelector( (state)=> state.vendor )
  const {services} = useSelector( (state)=> state.services )

  const servicesArray = services?services.services:[];
    
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [Open, setOpen] = useState(false);

    const togglePopUp = () => {
            setIsPopUpVisible(!isPopUpVisible);
        };
    
    const openModal = () => {
      setIsOpen(!isOpen);
    }

    const Modal = () => {
      setOpen(!Open);
    }

    const [serviceForm, setServiceForm] =useState({
            category: servicesArray[0]?.category,
            brand: photographer.brand,
            contact: photographer.contact_name,
            number: photographer.mobile,
            price: photographer.amount,
            baseCity: photographer.base_city,
            images: photographer.images
         })

         const {category,brand,contact,number,price,baseCity,images} = serviceForm

         const Change = (e)=>{
           setServiceForm((prevState)=>({
             ...prevState,
             [e.target.name] : e.target.value
           }))
       }

       const [image,setImage] = useState([])
       const [imageUrl,setImageUrl] = useState()

       const handleImage=(e)=>{
        setImage(e.target.files[0]);
          
          let link=URL.createObjectURL(e.target.files[0])
          setImageUrl(link)
          
       }
       
       
         const EditServices = (e)=>{
           e.preventDefault();
           setIsPopUpVisible(!isPopUpVisible);
       
           const data = new FormData();
           
            data.append('id',vendor._id)  
            data.append('category',category);
            data.append('brand',brand);
            data.append('contact',contact);
            data.append('number',number);
            data.append('price',price);
            data.append('baseCity',baseCity);
            data.append("image",image);

           if(category==='Photographer'){
             dispatch(editPhotographer(data))
           }else if(category==='Venues'){
             console.log('venues');
           }
         }

         const [offer,setOffer] = useState(photographer?.offer)
         const [offerMessage, setOfferMessage] = useState('')

         const onChange = (e)=>{
          setOffer(e.target.value)
         }

         const addOffer = (e) =>{
            e.preventDefault();
            if(offer<=0 || offer >=100){
                setOfferMessage('invalid offer value')
                return
            }else{
                setOfferMessage('')
            }
            setIsOpen(false)

            addOfferApi({offer,id:photographer._id}).then(res=>{
              dispatch(setPhotographer({photographers: res.data.photographers}))
              toast.success(res.data.message)
            }).catch(err=>{
              console.log(err);
            })
         }

         const clearOffer = (e)=>{
          e.preventDefault();
          setOpen(false);
          clearOfferApi({id:photographer?._id}).then(res=>{
            dispatch(setPhotographer({photographers: res.data.photographers}));
            toast.success(res.data.message);
          }).catch(err=>{
            console.log(err);
          })
         }

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
            <Typography color="blue-gray" className="font-medium">
                ₹{photographer.amount}
            </Typography>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <Typography
            variant="small"
            color="gray"
            className="font-normal opacity-75"
          >
           {photographer.base_city}
          </Typography>
          <Typography className=" text-black z-10">PHOTOGRAPHY</Typography>
          </div>
          <div>
            <Typography 
              variant="small"
              color="gray"
              className="font-normal opacity-75">OFFER: {photographer.offer}%</Typography>
          </div>
        </CardBody>
        <CardFooter className="pt-0 flex justify-between">
          <Button
            ripple={false}
            fullWidth={false}
            onClick={()=>togglePopUp()}
            value={photographer._id}
            className="bg-gray-200 text-blue-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            edit
          </Button>
          
          <Button
            ripple={false}
            fullWidth={false}
            onClick={()=>openModal()}
            value={photographer._id}
            className="bg-gray-200 text-blue-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            ADD OFFER
          </Button>

          <Button
            ripple={false}
            fullWidth={false}
            onClick={()=>Modal()}
            value={photographer._id}
            className="bg-gray-200 text-blue-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            clear offers
          </Button>
        </CardFooter>
        {isPopUpVisible ? (
                    <>
                      <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                      >
                        <div className="relative w-5/12 my-6 mx-auto max-w-3xl">
                          {/*content*/}
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t">
                              <h3 className="text-xl font-semibold text-header-bot">
                                Add New Services
                              </h3>
                              
                            </div>
                            {/*body*/}
                            <form onSubmit={(e) => EditServices(e)} encType="multipart/form-data">
                              <div className="relative p-6 flex-auto w-full">
                                <div className='flex items-center justify-between'>
                                  <label htmlFor="category" className='w-1/3'>Category*</label>
                                  <select id='category'
                                          name='category'
                                        onChange={Change}
                                        disabled
                                        required
                                        className='w-2/3 p-1 m-1 text-sm font-mono rounded border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                                     {
                                             <option key={photographer.id}  
                                             value={photographer.category}>{photographer.category}</option> 
                                        
                                    }
                                    </select>
                                  
                                  
                                </div>
                                  
                                  <div className='flex items-center justify-between'>
                                    
                                  <label htmlFor="brand" className='w-1/3'>Brand Name*</label>
                                  <input 
                                              className='w-2/3 p-1 m-1 text-sm font-mono rounded border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                                              placeholder='' 
                                              type="text" 
                                              name="brand"
                                              id='brand'
                                              value={brand}
                                              onChange={Change}
                                              disabled
                                              required
                                              />
                                </div>
                                <div className='flex items-center justify-between'>
                                  <label htmlFor="contact" className='w-1/3'>Contact Person Name*</label>
                                  <input 
                                              className='w-2/3 p-1 m-1 text-sm font-mono rounded border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                                              placeholder='' 
                                              type="text" 
                                              name="contact"
                                              id='contact'
                                              value={contact}
                                              onChange={Change}
                                              required
                                              />
                                </div>
                                <div className='flex items-center justify-between'>
                                  <label htmlFor="number" className='w-1/3'>Contact Number*</label>
                                  <input 
                                              className='w-2/3 p-1 m-1 text-sm font-mono rounded border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                                              placeholder='' 
                                              type="number" 
                                              name="number"
                                              id='number'
                                              value={number}
                                              onChange={Change}
                                              required
                                              />
                                </div>
                                <div className='flex items-center justify-between'>
                                  <label htmlFor="price" className='w-1/3'>Price range*</label>
                                  <input 
                                              className='w-2/3 p-1 m-1 text-sm font-mono rounded border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                                              placeholder='in Rupees' 
                                              type="number" 
                                              name="price"
                                              id='price'
                                              value={price}
                                              onChange={Change}
                                              required
                                              />
                                </div>
                                <div className='flex items-center justify-between'>
                                  <label htmlFor="baseCity" className='w-1/3'>City*(your base city)</label>
                                  <input 
                                              className='w-2/3 p-1 m-1 text-sm font-mono rounded border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                                              placeholder='' 
                                              type="text" 
                                              name="baseCity"
                                              id='baseCity'
                                              value={baseCity}
                                              onChange={Change}
                                              required
                                              />
                                </div>
                                <div className='flex items-center justify-between'>
                                  <label htmlFor="images" className='w-1/3'>Images</label>
                                  <input 
                                              className='w-2/3 p-1 m-1 text-sm font-mono rounded border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                                              placeholder='' 
                                              type="file" 
                                              name="images"
                                              id='images'
                                              onChange={handleImage}
                                              // accept="image/*"
                                              // multiple
                                              
                                              />
                                </div>
                                
                              </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                              <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setIsPopUpVisible(false)}
                                >
                                Close
                              </button>
                              <button
                                className="bg-header-bot text-white active:bg-header-top font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="submit" >
                                ADD+
                              </button>
                            </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
      ) : null}

      {isOpen ? (
                    <>
                      <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                      >
                        <div className="relative w-5/12 my-6 mx-auto max-w-3xl">
                          {/*content*/}
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t">
                              <h3 className="text-xl font-semibold text-header-bot">
                                Add an offer
                              </h3>
                              
                            </div>
                            {/*body*/}
                            <form onSubmit={(e) => addOffer(e)} encType="multipart/form-data">
                              <div className="relative p-6 flex-auto w-full">
                                  
                                <div className='flex items-center justify-between'>
                                    
                                  <label htmlFor="offer" className='w-1/3'>Offer/Discount percentage*</label>
                                  <div className="w-2/3 flex items-center justify-center">
                                    <input 
                                              className=' p-1 m-1 text-sm font-mono rounded border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                                              placeholder='eg: 10%' 
                                              type="number" 
                                              name="offer"
                                              id='offer'
                                              value={offer}
                                              onChange={onChange}
                                              required
                                              />
                                    <p>%</p>
                                  </div>
                                  
                                </div>
                                <div className='flex items-center justify-center'>
                                  <p className='text-red-500 text-sm'>{offerMessage}</p>
                                </div>
                                
                              </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                              <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setIsOpen(false)}
                                >
                                Close
                              </button>
                              <button
                                className="bg-header-bot text-white active:bg-header-top font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="submit" >
                                ADD+
                              </button>
                            </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
      ) : null}

      {Open ? (
                    <>
                      <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                      >
                        <div className="relative w-5/12 my-6 mx-auto max-w-3xl">
                          {/*content*/}
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t">
                              <h3 className="text-xl font-semibold text-header-bot">
                                Confirmation
                              </h3>
                              
                            </div>
                            {/*body*/}
                            <form onSubmit={(e) => clearOffer(e)} encType="multipart/form-data">
                              <div className="relative p-6 flex-auto w-full">
                                  
                                <div className='flex items-center justify-center'>
                                  <p className="text-base font-medium">Clear all existing offers?</p>  
                                </div>
                                
                              </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                              <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setOpen(false)}
                                >
                                Close
                              </button>
                              <button
                                className="bg-header-bot text-white active:bg-header-top font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="submit" >
                                CLEAR
                              </button>
                            </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
      ) : null} 
      <ToastContainer/>
      </Card>
    );
  }

  export default EcommerceCard;