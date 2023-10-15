import React, { useEffect, useState } from 'react'
import {LuMessagesSquare} from 'react-icons/lu'
import {GrLocation} from 'react-icons/gr'
import {BiImages,BiHeart,BiShareAlt} from 'react-icons/bi'
import {useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment';
import { toast} from 'react-toastify'
import ImageZoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'

import discountImage from '../../../assets/specialDiscount.png'
import PopUpMessage from '../PopUpMessage/PopUpMessage'

import { useDispatch, useSelector } from 'react-redux'
import { createMatch,addShortlistApi, addReviewApi, PhotoProfile } from '../../../features/api/api'
import { logout } from '../../../features/Slice/authSlice'
import { LiaCrownSolid } from 'react-icons/lia'



const Photographer_Profile = () => {

    const [showPhotos,setShowPhotos] = useState(false)
    const [value,setValue] = useState({})
    const [showFullText, setShowFullText] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const location = useLocation();
    useEffect(()=>{
        if(location.state){
            let data = location.state?location.state:'';

            PhotoProfile(data).then(res=>{
                setValue(res.data.photographer)
            }).catch(err=>console.log(err))
        }else{
            navigate('/photographers')
        }
    },[])
    
    
    useEffect(()=>{
        if(!value){
            console.log('no photo');
            navigate('/photographers')
        }
    },[])

    const Show =() =>{
        setShowPhotos(!showPhotos)
    }

    const handleShareClick = async () => {
        try {
          if (navigator.share) {
            // Check if the Web Share API is available
            await navigator.share({
              title: 'Hinged',
              text: 'Check out this Photographer!',
              url: window.location.href, // You can replace this with the desired URL
            });
          } else {
            // Fallback for browsers that do not support the Web Share API
            alert('Web Share API is not supported in this browser');
          }
        } catch (error) {
          console.error('Error sharing:', error);
        }
      };

    

    const {user} = useSelector(state=>state.auth)
    const {vendor} = useSelector(state=>state.vendor)

    const handleButtonClick=(e)=>{
        e.preventDefault();
        if(!user){
            navigate('/login')
        }else{
            const vendorId=value.vendor_id;
            const userId= user?._id

            const data ={
                vendorId,
                userId
            }
            createMatch(data).then((res)=>{
                navigate('/userProfile')
            }).catch(err=>console.log(err))
        }
        
    }

    //shortlist
  const handleShortlist = (e,photographer)=>{
    e.preventDefault()
    if(!user){
        navigate('/login')
    }else{
        const data ={
            userId: user._id,
            serviceId: photographer._id
        }
        addShortlistApi(data).then((res)=>{
            setMessage(res.data)
            setTimeout(()=>{
                setMessage('')
            },1500)
        }).catch(err=>
            console.log(err)
        )
    }
  }

  const [message,setMessage] = useState('')

  const [review, setReview] = useState('')

  const Submit= (e) =>{
    e.preventDefault();
    if(user){
        const data ={
            userId:user._id,
            id:value._id,
            comment: review
        }

        addReviewApi(data).then(res=>{
            setReview('')
            setValue(res.data.reviewAdded)
            toast.success(res.data.message);
        }).catch(err=>{
            console.log(err)
            toast.error(err.message)
            if(err.response.status===403 && err.response.data.message.message==="jwt expired"){
                dispatch(logout())
                navigate('/login')
            }
        });
    }else{
        navigate('/login')
    }
  }
  
  //for displaying full comment
  const toggleText = () => {
    setShowFullText(!showFullText);
  };


  return (
    <div>

        { value &&
        <div className='container md:max-w-screen-md  mx-auto mt-28'>
          <h1 className=' mb-5 text-2xl font-semibold text-slate-600'>PROFILE</h1>

          <div className='flex justify-between mb-5 w-full'>
            
            <div className='w-2/3'>
                <div className=' w-full relative'>
                    {
                        value?.offer ?
                        <div className='absolute left-0 top-0 w-32'>
                            <img src={discountImage} alt="discount image" />
                        </div>
                        : null
                    }
                    { value.subscription &&
                                    <div className='w-full flex justify-end items-center absolute top-0 right-0 '>
                                        <div className='bg-header-bot max-w-fit px-3 p-1 text-white rounded-tr flex justify-center items-center '>
                                            <LiaCrownSolid/>
                                            <p className='font-medium text-sm p-1'>handpicked</p>
                                        </div>
                                    </div>
                                    
                    }
                    <img className='w-full h-96 object-cover rounded shadow-xl ' src={value.images ? value.images[0]:'https://www.shutterstock.com/image-vector/loading-sign-doodle-260nw-742556110.jpg'} alt="image_poster" />  
                </div>
                <div className='relative w-full flex justify-center mb-40'>
                    <div className='absolute -top-10 bg-white border rounded-sm w-11/12'>
                        <div className='flex justify-between'>
                            <div className='w-2/3 h-32 flex flex-col justify-center items-start ml-2'>
                                <h1 className='text-lg font-semibold text-slate-700 m-1'>{value.brand}</h1>
                            <div className=' flex items-center text-sm font-medium text-slate-500 m-1'>
                                <GrLocation />
                                <p className='mx-1'>{value.base_city}</p>
                            </div>
                           
                            </div>
                            <div className='w-1/3 flex flex-col items-end justify-center'>
                                <h1 className='text-white bg-lime-600 m-1 px-2 py-1 rounded-sm w-16 text-center'>★4.8</h1>
                                <h1 className='text-sm m-1'>{value.reviews?.length} reviews</h1>
                            </div> 
                        </div>
                        <div className='flex justify-between h-10'>
                            <div onClick={Show}  className='w-full flex justify-center items-center bg-slate-100 border-e-2 cursor-pointer'>
                                <BiImages/>
                                <p>Photos</p>
                            </div>
                            {vendor?
                            <div disabled
                            className='w-full flex justify-center items-center bg-slate-100 border-e-2 cursor-not-allowed'>
                                <BiHeart/>
                                <p>Shortlist</p>
                            </div> :
                            <button 
                            onClick={(e)=>handleShortlist(e,value)}
                            className='w-full flex justify-center items-center bg-slate-100 border-e-2 cursor-pointer'>
                                <BiHeart/>
                                <p>Shortlist</p>
                            </button>
                            }
                            <div onClick={handleShareClick} className='w-full flex justify-center items-center bg-slate-100 cursor-pointer'>
                                <BiShareAlt/>
                                <p>Share</p>
                            </div>
                            {
                                        message && 
                                        <div id='PopUpMessageId'>
                                            <PopUpMessage message={message} />
                                        </div>
                                    }
                        </div>
                    </div>
                </div>
                
                
            </div>
            <div className='w-1/3'>
                <div className='bg-white p-1 m-1 border'>
                    <h1 className='text-sm font-semibold'>Per Day Price Estimate</h1>
                </div>
                {value.offer 
                    ?
                <div className='flex justify-between items-center bg-white p-1 m-1 border'>
                    <h1 className='text-base font-semibold text-header-bot line-through'>₹ {value.amount}</h1>
                    <h1 className='text-lg font-semibold text-header-bot '>₹{value.amount-(value.amount*value.offer/100)} <span className='text-sm'>per day</span></h1>
                    <h1 className='text-xs'>Photo Package</h1>
                </div>
                : 
                <div className='flex justify-between items-center bg-white p-1 m-1 border'>
                    <h1 className='text-lg font-semibold text-header-bot'>₹ {value.amount} <span className='text-sm'>per day</span></h1>
                    <h1 className='text-xs'>Photo Package</h1>
                </div>
                }
                {value?.offer 
                    ?
                <div className='flex justify-between items-center bg-white p-1 m-1 border'>
                    <h1 className='text-lg font-semibold text-header-bot'>₹ {value.amount-(value.amount*value.offer/100) +20000} <span className='text-sm'>per day</span></h1>
                    <h1 className='text-xs'>Photo + Video</h1>
                </div>
                    :
                <div className='flex justify-between items-center bg-white p-1 m-1 border'>
                    <h1 className='text-lg font-semibold text-header-bot'>₹ {value.amount +20000} <span className='text-sm'>per day</span></h1>
                    <h1 className='text-xs'>Photo + Video</h1>
                </div>
                }
                <div className='flex justify-center items-center text-sm text-white bg-white p-3 m-1 border font-medium'>
                    {vendor?
                        <div className='mx-1 px-5 py-3 bg-header-bot rounded-full flex justify-center items-center cursor-not-allowed'>
                            <LuMessagesSquare />
                            <button className='p-1 cursor-not-allowed'
                            disabled
                            onClick={handleButtonClick}
                            >Send Message</button>
                        </div>
                        :
                        <div className='mx-1 px-5 py-3 bg-header-bot rounded-full flex justify-center items-center'>
                            <LuMessagesSquare />
                            <button className='p-1'
                            onClick={handleButtonClick}
                            >Send Message</button>
                        </div> 
                    }
                    
                </div>
            </div>
            
          </div>
          { showPhotos &&
          <div className='w-full  bg-white m-1 p-2 rounded flex flex-wrap'>
            {
                value.images.map((image,index)=>
                <>
                <br/>
                <div key={index} className='w-full sm:w-1/2 md:w-1/3 p-1'>
                    <ImageZoom 
                        zoomMargin={40}
                        overlayBgColorEnd={'rgba(1, 1, 1, 0.5)'}
                        >
                        <img className='w-full h-60 object-cover ' src={image} alt={index} />
                        
                    </ImageZoom>
                </div>
                   
                </>
                    
                )
            }
          </div>
            }
            <div className='w-full mb-2'>
                <div className='w-full bg-white p-2 rounded'>
                    <h1 className='text-lg text-slate-600 font-medium p-1'>About {value.brand}</h1>
                    <hr className='border-gray-300'/>
                    <br />
                    <p className='text-sm  text-slate-600'>{value.brand} is a professional wedding photography brand based in {value.base_city}. With many years of industry experience, they have attained proficiency in capturing the perfect moments. They believe that bonds are beautiful and it is more beautiful to capture them in real-life settings. Bonds are more celebrated at weddings. To capture this celebration in the autocracy of beauty is the aim of The Candid House. Well-equipped with tools of photography, they provide services in an excellent manner. They are a good option to hire for wedding photography at reasonable prices.</p>
                    <br />
                    <p className='text-sm text-slate-600'>Enriched with immense experiences of capturing weddings, The Candid House leaves no stone unturned in order to ensure that you take home a treasure trove of memories. Having traveled extensively across India and to countries like Thailand, Dubai, and Sri Lanka, their skilled team consists of dynamic professionals who strive continuously to perfect their craft to match your vision. With a razor-sharp focus on details, quality, and innovation, The Candid House, with every click manages to seize a plethora of emotions that leaves one mesmerized. Recognized widely for their skill, this premiere wedding photography company has also received several prestigious accolades at the Global Business Awards, LifeStyle Awards EMF Rajasthan Awards for being the best wedding photographer in India.</p>
                    <br />
                </div>
                <hr />
            </div>
            <div className='w-full bg-white p-2 rounded'>
                <div className=' p-1'>
                    <h1 className='text-lg font-medium text-slate-700'>Reviews for {value.brand}</h1>
                </div>
                <hr className='my-2'/>
                <form className='border flex flex-col' onSubmit={(e)=>Submit(e)}>

                    <p className='p-1'>Write your reviews for {value.brand}</p>
                    <textarea 
                    className='h-28 border m-2 p-4 focus:outline-pink-200 text-sm'
                    placeholder='Write a review or tell us your experience'
                    type="text" 
                    value={review}
                    onChange={(e)=>setReview(e.target.value)}
                    required
                    />

                    <button className='p-2 bg-header-bot text-white border-slate-600' type='submit'>Submit Review</button>
                </form>
            </div><hr />
            <div className='w-full bg-white p-2 rounded '>
                <div className='bg-gray-50 p-1'>
                    <h1 className='text-lg font-medium text-slate-700'>Reviews</h1>
                </div>
                <hr className='my-2'/>
                <div className='max-h-96 overflow-y-auto'>
                    { (value.reviews && value.reviews?.length!=0) ?
                    value.reviews
                    .slice() // Create a copy of the reviews array to avoid mutating the original array
                    .sort((a, b) => {
                      // Sort by 'createdAt' property in descending order (newest to oldest)
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    .map((review,index)=>{
                        const now = moment();
                        const createdAt = moment(review.createdAt);
                        const diffInSeconds = now.diff(createdAt, 'seconds')
                        const diffInMinutes = now.diff(createdAt, 'minutes')
                        const diffInHours = now.diff(createdAt, 'hours')
                        const diffInDays = now.diff(createdAt, 'days');
                        const diffInMonths = now.diff(createdAt, 'months');
                        const diffInYears = now.diff(createdAt, 'years')

                        let reviewedText;
                        if(diffInYears === 1){
                            reviewedText = 'reviewed 1 year ago';
                        }else if(diffInYears > 1){
                            reviewedText = `reviewed ${diffInYears} years ago`;
                        }else if (diffInMonths === 1) {
                            reviewedText = 'reviewed 1 month ago';
                        } else if (diffInMonths > 1) {
                            reviewedText = `reviewed ${diffInMonths} months ago`;
                        } else if (diffInDays === 1) {
                            reviewedText = 'reviewed 1 day ago';
                        } else if(diffInDays > 1){
                            reviewedText = `reviewed ${diffInDays} days ago`
                        } else if(diffInHours === 1){
                            reviewedText = 'reviewed 1 hour ago';
                        } else if(diffInHours > 1){
                            reviewedText = `reviewed ${diffInHours} hours ago`
                        } else if(diffInMinutes === 1){
                            reviewedText = 'reviewed 1 minute ago';
                        } else if(diffInMinutes > 1){
                            reviewedText = `reviewed ${diffInMinutes} minutes ago`
                        } else{
                            reviewedText = `reviewed ${diffInSeconds} seconds ago`
                        }

                    return (
                    <div key={index} className='p-2 border mb-1 '>
                        <div className='flex items-center justify-between'>
                            <div className='flex'>
                                <div className='w-12 h-12 rounded-full border border-slate-500'>
                                    <img className='w-full h-full rounded-full object-cover' src={review.imageUrl} alt={review.name} />
                                </div>
                                <p className='p-2 font-medium text-slate-600'>{review.name}</p>
                            </div>
                            <div >
                                <p className='text-xs text-slate-400 font-medium '>{reviewedText}</p>
                            </div>
                        </div>
                        <hr className='my-2'/>
                        <p className='text-sm p-2 text-slate-700 font-sans'>
                            {showFullText || review.comment.length < 250 ? review.comment : `${review.comment.slice(0, 250)}...`}
                                {review.comment.length > 250 && (
                                <button
                                    onClick={toggleText}
                                    className='text-slate-500 font-medium cursor-pointer'
                                >
                                    {showFullText ? 'Read Less' : 'Read More'}
                                </button>
                            )}               
                        </p>
                    </div>
                    )
                    })
                     :
                    <div className='p-2 border mb-1'>
                        <p className='text-center text-sm p-2 text-slate-600 font-sans'>No reviews available</p>
                    </div>
                }
                </div>
                
            </div><hr />
          
      
        </div>
        }

    </div>
    
  )
}

export {Photographer_Profile}
