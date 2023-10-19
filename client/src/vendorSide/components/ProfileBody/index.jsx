
import React, { useEffect, useState,useRef} from 'react'

import {useSelector,useDispatch } from "react-redux";
import { useNavigate} from "react-router-dom"
import {LuSmilePlus, LuArrowRightCircle} from 'react-icons/lu'
import Picker from 'emoji-picker-react'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import Lottie from "lottie-react"
import { toast } from 'react-toastify';

import BookingLottie from '../../../assets/bookingLottie.json'
import { socket } from "../../../Socket";
import { ReadMsgsApi,getAllmsgsApi , ShowMatchesApi,getLastMsgsApi, vendorBookingsApi, addSubscriptionApi, verifySubscriptionApi } from "../../../features/api/api";

import EcommerceCard from '../Card/Card';
import VendorBookingCard from '../VendorBookingCard/VendorBookingCard';

import {logout, setVendor, vendorProfile} from '../../../features/Slice/vendorSlice';
import { getPhotographers,addPhotographer,reset} from '../../../features/Slice/photographySlice';
import { getServices } from '../../../features/Slice/servicesSlice';
import image from '../../../assets/logos/Hinged-1 (1).png'

// Extend Day.js with the necessary plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);

const ProfileBody = () => {

  

  const dispatch = useDispatch();

  const [select,setSelect ]= useState(1)
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {vendor} = useSelector( (state)=> state.vendor )
  const {services} = useSelector( (state)=> state.services )
  const {photographer,message,isSuccess} = useSelector( (state)=> state.vendorPhotographers )

  //bookings
  const [bookings,setBookings] = useState([])

  useEffect(()=>{
    const data ={
      id: vendor._id
    }
    if(select===2){
      vendorBookingsApi(data).then(res=>{
        setBookings(res.data)
      }).catch(err=>console.log(err))
    }

  },[select])

  const togglePopUp = () => {
    setIsPopUpVisible(!isPopUpVisible);
  };

  // Function to show the message
  const showMessage = (message) => {

    setErrorMessage(message)
    // Set a timeout to hide the message after 5 seconds
    setTimeout(() => {
      setErrorMessage('');
      dispatch(reset());
    }, 5000); // 5000 milliseconds = 5 seconds
  };


  const [formData, setFormData] = useState({
    email: vendor.email,
    brand_name:vendor.brand_name,
    contact_name: vendor.contact_name,
    mobile:vendor.mobile,
    website:vendor.website,
    fb:vendor.facebook,
    insta:vendor.insta,
    youtube:vendor.youtube,
    city:vendor.base_city,
    address:vendor.address,
  })

  const {email,brand_name,city,contact_name,mobile,website,fb,insta,youtube,address} = formData

  const onChange = (e)=>{
      setFormData((prevState)=>({
        ...prevState,
        [e.target.name] : e.target.value
      }))
    }

  let servicesArray = services?services.services:[];
  let photographerArray = photographer?photographer.photographers:[];

    const [category,setCategory] = useState(servicesArray[0]?.category)

    useEffect(()=>{
      servicesArray = services?services.services:[];
    },[services])
    
    useEffect(()=>{
      setCategory(servicesArray[0]?.category)
      // console.log(category)
    },[servicesArray])

  const [serviceForm, setServiceForm] =useState({
    brand: '',
    contact: '',
    number: '',
    price: '',
    baseCity: '',
  })

  const {brand,contact,number,price,baseCity} = serviceForm

  useEffect(()=>{
    if(vendor){
      dispatch(getPhotographers({id:vendor._id})).then((res)=>{
        if(!res.payload){
          window.location.reload();
          console.log(res.payload);
        }
      })
      dispatch(getServices({id:vendor._id})).then((res)=>{
        // console.log(res)
      })

    }
  },[])
  
  useEffect(()=>{
    if(vendor){
    }
    if(message){
      showMessage(message);
    }
    if(isSuccess){
      dispatch(reset())
    }
  },[vendor,message,dispatch])


  const Change = (e)=>{
    setServiceForm((prevState)=>({
      ...prevState,
      [e.target.name] : e.target.value
    }))
}

const [validateMessage,setValidateMessage] = useState('')

  const AddServices = (e)=>{
    e.preventDefault();
    let regex = new RegExp(/(0|91)?[6-9][0-9]{9}/);
    if(price<= 0 || price > 99999999){
      setValidateMessage('price invalid ')
      return
    }
    if(number.length!==10 || regex.test(number) == false){
      setValidateMessage('invalid mobile number')
      return
    }
    setValidateMessage('')
    setIsPopUpVisible(!isPopUpVisible);
    
    const formData = new FormData()
    formData.append('id', vendor._id);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('contact', contact);
    formData.append('number', number);
    formData.append('price', price);
    formData.append('baseCity', baseCity);
    // Display the values
    // for (const value of formData.values()) {
    //   console.log(value);
    // }

    if(category=='Photographer'){

      dispatch(addPhotographer(formData))
    }else if(category==='Venues'){
      setCategory(servicesArray[0]?.category)
      // console.log('venues');
    }
  }

  const Submit = (e)=>{
    e.preventDefault();
    const data = {
      email,
      brand_name,
      city,
      contact_name,
      mobile,
      website,
      fb,
      insta,
      youtube,
      address
    }
    dispatch(vendorProfile(data)).then((res)=>toast.success('info saved'))
    
  }

  const backgroundImageUrl = 'url(banner/background-Profile.jpg)';

  const divStyle = {
    backgroundImage: backgroundImageUrl,
    width: '100%',
    height: '60vh',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };  

  const gradientOverlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '40%',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7))',
  };

  
  //chat
  
  const [emojiVisible,setEmojiVisible] = useState(false)

  const [msg, setMsg] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleTextChange = (e) => {
    const message = e.target.value;
    setMsg(message);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTypingTimeout = setTimeout(() => {
      socket.emit("stop-typing", { to: currentChat?._id, from: vendor?._id });
    }, 1000);

    setTypingTimeout(newTypingTimeout);

    socket.emit("typing", { to: currentChat?._id, from: vendor?._id });
    
  };
  
  const handleEmojiClick = (event) => {
    let message = msg;
    message += event.emoji;
    setMsg(message);
  };

  const sendChat = () => {
    if(emojiVisible){
      setEmojiVisible(!emojiVisible)
    }
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  const handleSendMsg = async (msg) => {
    try {
      const data = {
        from: vendor?._id,
        to: currentChat?._id,
        message: msg,
        messageType: "text",
        conversationId: currentChat.conversationId,
      };
      socket.emit("send-msg", data);

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    } catch (error) {
      console.log(error)
      if(!currentChat){
        toast.warning('select an user to chat')
      }
    }
    
  };

  //container
  const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isEmpty,setIsEmpty]=useState(false)
    const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);

    useEffect(() => {
      if (vendor) {
          ShowMatchesApi(vendor).then((res) => {
            if(res.data.length>0){
              // console.log(res.data);
                setContacts(res.data);
                
              }else{
                console.log('emptying');
                setIsEmpty(true)
              }
            }).catch((err)=>{
              console.log(err);
            })
      }
    }, [vendor]);


    const markChatAsRead = (id) => {
      const data={ 
        id: vendor._id,
        msgId: id 
      }
      ReadMsgsApi(data)
      };


  //select user chat
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [lastChatteduser, setLastChattedUser] = useState([]);
  const [lastMessages, setLastMessages] = useState([]);
  const [typing, setTyping] = useState({
    to: null,
    show: false,
  });
  const [chattedUser, setChattedUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  
  // useEffect(() => {
  //   console.log(chattedUser, "<=userStateChanged");
  // }, [chattedUser]);

  useEffect(() => {
    let conversationIds = [];
    contacts.forEach((contact) => {
      conversationIds.push(contact.conversationId);
    });
    const data = {
      conversationIds,
    };
    getLastMsgsApi(data).then((res) => setLastChattedUser(res.data));
  }, [contacts]);
  //FUTURE UPDATION FOR SHOWING TIME

  useEffect(() => {
    const userData = lastChatteduser.map((user) => {

      const messageTime = dayjs.utc(user?.createdAt);
      const daysDiff = dayjs().diff(messageTime, "day");
      const timeAgo = messageTime.fromNow();

      let displayTime;
      if (daysDiff >= 2) {
        displayTime = messageTime.format("MMM DD, YYYY");
      } else if (daysDiff === 1) {
        displayTime = "Yesterday";
      } else {
        displayTime = timeAgo;
      }

      return { ...user, lastmessaged: displayTime };
    });
    setLastMessages(userData);
  }, [lastChatteduser]);

  useEffect(() => {
    if (socket) {
      socket.on("show-typing", (to) => {
        setTyping((prev) => ({ ...prev, to: to, show: true }));
      });
      socket.on("hide-typing", (to) => {
        setTyping((prev) => ({ ...prev, to: null, show: false }));
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("new-msg", (data) => {

        setLastChattedUser((prev) => {
          let found = false;
          const updatedUsers = prev.map((user) => {
            if (user.conversationId === data[0].conversationId) {
              found = true;
              return { ...user, ...data[0] };
            }
            return user;
          });

          if (!found) {
            updatedUsers.push(data[0]);
          }
          // Sort the updatedUsers array based on updatedAt property
          updatedUsers.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          return updatedUsers;
        });
      });
    }
  }, []);

  useEffect(() => {
    const sortUsers = contacts.map((user) => {
      lastChatteduser.forEach((chat) => {
        if (user.conversationId === chat.conversationId) {
          user.createdAt = chat.createdAt;
        }
      });
      return user;
    });
    let sort = sortUsers.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setChattedUsers(sort);
  }, [lastChatteduser]);

  useEffect(() => {
    if (onlineUsers.length > 0) {
      if (chattedUser.length > 0) {
        const newChattedUser = chattedUser.map((user) => {
          return onlineUsers.includes(user?._id)
            ? { ...user, isOnline: true }
            : { ...user, isOnline: false };
        });
        // console.log(newChattedUser, "<=OnlineUsers");
        setChattedUsers(newChattedUser);
      }
    } else {
      if (chattedUser.length > 0) {
        const newChattedUser = chattedUser.map((user) => {
          return { ...user, isOnline: false };
        });
        // console.log(newChattedUser, "<=offlineUsers");
        setChattedUsers(newChattedUser);
      }
    }
  }, [onlineUsers, lastChatteduser]);

  const filteredContacts = Array.from(contacts).filter((contact) =>
    contact?.contact_name?.toLowerCase().includes(searchText?.toLowerCase())
  );

  
  const changeCurrentChat = (index, contact, id) => {
    if (vendor?.blockedUsers?.includes(contact?._id)) {
      setModalOpen(true);
    } else {
      handleChatChange(contact, id);
    }
  };

  const handleChatChange = (chat,id) => {
    setCurrentChat(chat);
    if(id)markChatAsRead(id)
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setAnchorEl(e.currentTarget);
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  const open = Boolean(anchorEl);

//chat card

  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [typing, setTyping] = useState(null);
  // const [modal,setModal]=useState(false)

  useEffect(() => {
    // console.log(onlineUsers,'<==online users');
    if (onlineUsers.length > 0) {
      if (onlineUsers.includes(currentChat?._id)) {
        setCurrentChat((prev)=>({...prev,isOnline:true}))
      }else{
        setCurrentChat((prev)=>({...prev,isOnline:false}))  
      }
    }
  }, [onlineUsers]);

  const data = {
    from: vendor?._id,
    to: currentChat?._id,
  };
  const navigate = useNavigate();

  useEffect(() => {
    getAllmsgsApi(data)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        navigate("/userProfile");
      });
  }, [currentChat]);


  useEffect(() => {
    if (socket) {
      socket.on("show-typing", (to) => {
        setTyping(true);
      });

      socket.on("hide-typing", (to) => {
        setTyping(false);
      });

      socket.on("msg-recieve", (data) => {
        const id = {
          id: vendor._id,
          msgId: data?._id,
        };
        ReadMsgsApi(id);
        setArrivalMessage({
          fromSelf: false,
          message: data.message,
          messageType: data.messageType,
        });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 //message open style...
 const [styleOpen,setStyleOpen] = useState(null)
 const messagesContainerRef = useRef(null);

 const scrollToBottom = () => {
   if (messagesContainerRef.current) {
     const messagesContainer = messagesContainerRef.current;
     const lastMessage = messagesContainer.lastElementChild;
 
     if (lastMessage) {
       lastMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
     }
   }
 };
 
 
 // Call scrollToBottom whenever messages change
 useEffect(() => {
   scrollToBottom();
 }, [messages]);

 //handle membership plans

 const initPayment = (id,name, email, mobile) => {
  const keyId = process.env.REACT_APP_KEY_ID;
  const options = {
    key: "rzp_test_kvlsJZRKScJ3eO" || keyId,
    // amount: '200000',
    currency: 'INR',
    name: name,
    description: "Adding Subscription plans",
    image: image,
    subscription_id: id,
    "prefill": {

      "email" : email,
      "contact": mobile, 
    },
    handler: async (response) => {
      try {

        const { data } = await verifySubscriptionApi({response,id:vendor._id});
        dispatch(setVendor(data))
        toast.success('Subscription added successfully')

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
      const { data } = await addSubscriptionApi({id})
    console.log(data);
    initPayment(data.id,data.name,data.email,data.mobile);

  } catch (error) {
    console.log(error);
    if(error.response.status===403 && error.response.data.message.message==='jwt expired'){
      dispatch(logout())
  }
  }
};



  return (
    <div>
        <div style={divStyle} >
          <div style={gradientOverlayStyle} className='flex flex-col items-center justify-end py-32'>
          <h1 className='text-white font-bold text-5xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>PAVE THE WAY</h1>
          </div>
        </div>
        <div className='flex relative container md:max-w-screen-md mx-auto h-96 '>
          
          {
          vendor && <div className='flex flex-col my-5 text-xs font-sans text-gray-600 h-full w-1/6 font-medium'>
            <h1 onClick={()=>setSelect(1)} style={select===1?{color:'red'}:{color:'black'}} className='m-2 cursor-pointer'>Information</h1>
            <h1 onClick={()=>setSelect(2)} style={select===2?{color:'red'}:{color:'black'}} className='m-2 cursor-pointer'>Projects</h1>
            <h1 onClick={()=>setSelect(3)} style={select===3?{color:'red'}:{color:'black'}} className='m-2 cursor-pointer'>Memberships Plans</h1>
            <h1 onClick={()=>setSelect(4)} style={select===4?{color:'red'}:{color:'black'}} className='m-2 cursor-pointer'>Services</h1> 
            <h1 onClick={()=>setSelect(5)} style={select===5?{color:'red'}:{color:'black'}} className='m-2 cursor-pointer'>Messages</h1> 
          </div>
          }
          <div className='flex flex-col my-5 overflow-y-auto bg-slate-50 h-full w-4/5'>
            {select===1 &&
              <>
              <form action="" className='text-sm' onSubmit={(e)=>Submit(e)}>
                <div className=' bg-slate-100 p-2 flex justify-between items-center'>
                  <h1 className='text-header-bot'>Personal Information</h1>
                  <button type='submit' className='bg-header-bot text-white py-1 px-2 rounded'>Save Changes</button>
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="email" className='w-1/3'>Login email*</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="email" 
                              name="email"
                              id='email'
                              value={email}
                              disabled
                              required
                              />
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="brand_name" className='w-1/3'>Brand Name*</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="text" 
                              name="brand_name"
                              id='brand_name'
                              value={brand_name}
                              onChange={onChange}
                              required
                              />
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="contact_name" className='w-1/3'>Contact Person Name*</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="text" 
                              name="contact_name"
                              id='contact_name'
                              value={contact_name}
                              onChange={onChange}
                              required
                              />
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="mobile" className='w-1/3'>Contact Number*</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="number" 
                              name="mobile"
                              id='mobile'
                              value={mobile}
                              disabled
                      
                              />
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="website" className='w-1/3'>Website Link</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="text" 
                              name="website"
                              id='website'
                              value={website}
                              onChange={onChange}
                              
                              />
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="fb" className='w-1/3'>Facebook url</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="text" 
                              name="fb"
                              id='fb'
                              value={fb}
                              onChange={onChange}
                              
                              />
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="insta" className='w-1/3'>Instagram url</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="text" 
                              name="insta"
                              id='insta'
                              value={insta}
                              onChange={onChange}
                              
                              />
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="youtube" className='w-1/3'>Youtube url</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="text" 
                              name="youtube"
                              id='youtube'
                              value={youtube}
                              onChange={onChange}
                              
                              />
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="city" className='w-1/3'>City*(your base city)</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="text" 
                              name="city"
                              id='city'
                              value={city}
                              onChange={onChange}
                              required
                              />
                </div>
                
                <div className='flex items-center justify-between'>
                  <label htmlFor="address" className='w-1/3'>Address*</label>
                  <input 
                              className='w-2/3 p-1 m-1 text-sm font-mono border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1' 
                              placeholder='' 
                              type="text" 
                              name="address"
                              id='address'
                              value={address}
                              onChange={onChange}
                              required
                              />
                </div>
                
              </form>
              
              </>
            }
            {select===2 &&
            <>
            <div className='text-sm overflow-hidden w-full h-full'>
              <div className=' w-full h-1/6 '>
                <h1 className='text-header-bot p-2 bg-slate-100'>On Going Projects</h1>
              </div>
              {
                bookings.length===0 ?
                <>
                <h1 className='bg-header-top text-white text-center text-lg text-opacity-80'>No Booking Done</h1>
                  <Lottie className='h-80 bg-header-top' animationData={BookingLottie} loop={true} />
                </> :
                <div className='w-full h-5/6 flex overflow-x-auto flex-wrap '>
                  {
                    bookings.map((booking,index)=>
                      <div key={index} className='min-w-1/3 h-full m-2'>
                        < VendorBookingCard booking={booking} setBookings={setBookings}/>
                      </div>
                    )
                  }
                </div>
                
                
              }
              
            </div>
            </>
            }
            {select===3 &&
            <>
              <h1 className='text-header-bot bg-slate-100 p-2 text-sm'>Membership Plans</h1>

              {/* <h1>Membership plans</h1> */}
              <div className='flex justify-center items-center h-full p-3'>
                <div className='flex flex-col justify-center items-center  bg-moneyBackground bg-no-repeat bg-cover bg-center bg-fixed rounded-lg h-full w-60 border-2 border-black'>
                    <div className='flex flex-col justify-center items-center border-b-2 border-black bg-no-repeat bg-cover bg-fixed bg-center w-full h-1/4 p-1 rounded-b text-white '>
                    <h1 className='text-xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>Rs.2500/-</h1>
                    <h2 className='text-md font-medium drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>only</h2>
                  </div>
                  <div className='flex flex-col justify-center items-center h-3/4 bg-opacity-30 bg-black'>
                    <div className='flex flex-col justify-center items-start p-1 font-semibold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
                      <h1 className='text-lg text-center'>Subscribe for Better Visibility and reach amoung users</h1>
                      {/* <h1>-Personalized mails regarding projects or profile updates</h1> */}
                      {/* <h1>-Can reply to reviews</h1> */}
                      {/* <h1>-Profile views</h1> */}
                    </div>
                    
                    <button 
                    onClick={()=>handlePayment(vendor._id)}
                    disabled={vendor?.subscription}
                    style={{
                      backgroundColor: vendor?.subscription && 'white',
                      color: vendor?.subscription && 'black',
                    }}
                    className='m-2 bg-gray-500 bg-opacity-70 p-1 text-white hover:scale-105 duration-300 hover:bg-white hover:text-slate-950 hover:font-semibold rounded'>
                      {vendor?.subscription===true?'SUBSCRIBED':'SUBSCRIBE'}
                    </button>
                </div>
                
                </div>
              </div>
            </>
            }
            {select===4 &&
              <>
              <div className='relative bg-slate-100 p-2 flex justify-between items-center text-sm'>
                  <h1 className='text-header-bot'>Services</h1>
                  {errorMessage &&
                    <p className='text-red-400 font-medium'>{errorMessage}</p>
                  }
                  <button onClick={()=>togglePopUp()} className='bg-header-bot text-white py-1 px-2 rounded'>Add Services+</button>
                 
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
                            <form onSubmit={(e) => AddServices(e)} encType="multipart/form-data" >
                              <div className="relative p-6 flex-auto w-full">
                                <div className='flex items-center justify-between'>
                                  <label htmlFor="category" className='w-1/3'>Category*</label>
                                  <select id='category'
                                          name='category'
                                        onChange={(e)=>setCategory(e.target.value)}
                                        required
                                        className='w-2/3 p-1 m-1 text-sm font-mono rounded border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1'>
                                     {
                                    servicesArray?.map((service,index)=>
                                             <option key={index}  
                                             value={service.category}>{service.category}</option> 
                                        )
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
                                <div className='flex items-center justify-center'>
                                  <p className='text-red-500 text-sm'>{validateMessage}</p>
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
                                type="submit"
                                
                                >
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
                  
              </div>
              <div className='w-full h-full flex overflow-x-auto flex-wrap '>
                {
                  photographerArray?.map((photographer,index)=>
                    <div key={index} className='min-w-1/3 h-full m-2'><EcommerceCard photographer={photographer}/></div>
                  )
                }
                
              </div>
            </>
            }
            {select===5 &&
            <>
              <div className='overflow-hidden w-full h-full'>
                <div className='w-full bg-[#F9DDDD] h-1/6'>
                  <h1 className='text-header-bot bg-slate-100 p-2 text-sm '>Messages Section</h1>
                </div>
                <div className='w-full h-5/6 flex bg-[#F9DDDD] rounded'>
                    <div className='w-1/4 h-full bg-white border p-4 rounded-e-2xl'>
                      { 
                      chattedUser.length > 0 ? (
                      chattedUser.map((contact,index)=>{
                        const filteredUser = lastMessages.filter(
                          (result) => result.conversationId === contact.conversationId
                        );
                        if (filteredUser.length > 0) {
                          const result = filteredUser[0];

                          return(
                          <li onClick={() =>
                            {
                              changeCurrentChat(index, contact, result._id)
                              setStyleOpen(index)
                            }
                          } 
                          style={styleOpen===index?{color:'red',fontWeight:'600'}:{color:'black'}}
                          key={contact._id} 
                          className='text-sm cursor-pointer m-1'>{contact.name}</li>
                          ) 
                      }
                        return (
                          <li onClick={() =>
                            {
                              changeCurrentChat(index, contact)
                              setStyleOpen(index)
                            }                          
                          } 
                          style={styleOpen===index?{color:'red',fontWeight:'600'}:{color:'black'}}
                          key={contact._id} 
                          // {...(!result.read && result.sender === contact._id
                          //   ? {style={fontFamily:"sans-serif", fontWeight:"600",color:"grey"} }
                          //   : {})}
                          className='text-sm cursor-pointer m-1'>{contact.name}</li>
                        );
                      })
                      ) : (
                        <p className='text-sm font-bold text-center'>No Messages Yet</p>
                      )
                      }
                    </div>
                  
                    <div className='w-3/4 h-full p-4 rounded-lg flex flex-col-reverse overflow-hidden'>
                      <div className='w-full flex items-center overflow-hidden'>
                        <input
                          className='w-5/6 rounded-full bg-slate-300 placeholder:text-slate-500 px-3 py-2 text-sm border border-black m-1' 
                          placeholder='Type your message'
                          type="text" 
                          name="message" 
                          id="message"
                          value={msg}
                          onChange={(e)=>handleTextChange(e)}
                          onKeyDown={(e)=>{
                            if (e.key === 'Enter') {
                              sendChat();
                            }
                          }}
                          />
                          
                            <LuSmilePlus className=' text-3xl m-1' onClick={()=>setEmojiVisible(!emojiVisible)}/>
                            { emojiVisible &&
                              <div className='absolute -bottom-[22rem] -right-20'>
                            {/* <Picker  onEmojiClick={(e)=>{setChatMessage(e.emoji)}} height={300} width={500} /> */}
                            <Picker emojiStyle="apple"
                                lazyLoadEmojis="true"
                                height={350}
                                width={350}
                                onEmojiClick={handleEmojiClick}
                              />
                            </div>
                            }
                              
                        
                        <LuArrowRightCircle 
                        className='text-3xl m-1 bg-header-bot rounded-full'
                        onClick={sendChat}
                        />
                      </div>
                      
                      <div className='w-full h-full overflow-y-auto overflow-x-hidden'>
                          <div ref={messagesContainerRef}
                        className='w-full h-full flex flex-col p-2 '>
                          { messages &&
                          messages.map((msg,index)=>{
                            if (msg.fromSelf) {
                              return(
                                <div  
                                    key={index}
                                    className='w-full flex justify-end items-center m-1'><div className='w-1/6'></div>
                                  <div>
                                    <p className='bg-slate-700 text-white px-3 py-1 rounded-t rounded-s font-medium'>{msg.message}</p>
                                  </div>
                                  
                                </div>
                              )
                            }else{
                              return(
                                <div  
                                  key={index}
                                  className='w-full flex justify-start items-center m-1'>
                              
                                  <div>
                                    <p className='bg-black text-white px-3 py-1 rounded-e rounded-t font-medium'>{msg.message}</p>
                                  </div><div className='w-1/6'></div>
                                </div>
                              )
                            }
                          })
                          }
                        </div>
                      </div>
                      
                      
                    </div>
                </div>
              </div>
                
            </>
            }
          </div>
        </div>
      
    </div>
  )
}

export {ProfileBody}