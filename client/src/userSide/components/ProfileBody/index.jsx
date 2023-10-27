
import React,{useEffect, useState,useRef} from 'react'
import Lottie from "lottie-react";
import lottie from '../../../assets/shortlists.json'
import BookingLottie from '../../../assets/bookingLottie.json'
import EcommerceCard from '../Card/EcommerceCard';
import BookingCard from '../BookingCard/BookingCard';

import {useDispatch, useSelector } from "react-redux";
import { useNavigate} from "react-router-dom"
import {LuSmilePlus, LuArrowRightCircle} from 'react-icons/lu'
import Picker from 'emoji-picker-react'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

import {logout} from '../../../features/Slice/authSlice'
import { socket } from "../../../Socket";
import { ReadMsgsApi,getAllmsgsApi , ShowMatchesApi,getLastMsgsApi, userShortlistsApi, userBookingsApi } from "../../../features/api/api";
import { toast } from 'react-toastify';

// Extend Day.js with the necessary plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);

const ProfileBody = () => {

  const [select,setSelect ]= useState(1)
  
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

  const {user} = useSelector( (state)=> state.auth )

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
      socket.emit("stop-typing", { to: currentChat?._id, from: user?._id });
    }, 1000);

    setTypingTimeout(newTypingTimeout);

    socket.emit("typing", { to: currentChat?._id, from: user?._id });
    
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
    try{
      const data = {
        from: user?._id,
        to: currentChat?._id,
        message: msg,
        messageType: "text",
        conversationId: currentChat.conversationId,
      };
      socket.emit("send-msg", data);

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    }catch (error) {
      console.log(error)
      if(!currentChat){
        toast.warning('select a vendor to chat')
      }
    }
    
  };

  //container
  const dispatch = useDispatch();
  const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isEmpty,setIsEmpty]=useState(false)
    const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);

    useEffect(() => {
      if (user) {
          ShowMatchesApi(user).then((res) => {
            if(res.data.length>0){
                setContacts(res.data);
                
              }else{
                setIsEmpty(true)
              }
            }).catch((err)=>{
              console.log(err);
            })
      }
    }, [user]);    


    const markChatAsRead = (id) => {
      const data={ 
        id: user._id,
        msgId: id 
      }
      ReadMsgsApi(data).catch(err=>console.log(err))
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

  
  useEffect(() => {
    // console.log(chattedUser, "<=userStateChanged");
  }, [chattedUser]);

  useEffect(() => {
    let conversationIds = [];
    contacts.forEach((contact) => {
      conversationIds.push(contact.conversationId);
    });
    const data = {
      conversationIds,
    };
    getLastMsgsApi(data).then((res) => setLastChattedUser(res.data)).catch(err=>console.log(err));
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
        setChattedUsers(newChattedUser);
      }
    } else {
      if (chattedUser.length > 0) {
        const newChattedUser = chattedUser.map((user) => {
          return { ...user, isOnline: false };
        });
        setChattedUsers(newChattedUser);
      }
    }
  }, [onlineUsers, lastChatteduser]);

  const filteredContacts = Array.from(contacts).filter((contact) =>
    contact?.contact_name?.toLowerCase().includes(searchText?.toLowerCase())
  );

  
  const changeCurrentChat = (index, contact, id) => {
    if (user?.blockedUsers?.includes(contact?._id)) {
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

  useEffect(() => {
    if (onlineUsers.length > 0) {
      if (onlineUsers.includes(currentChat?._id)) {
        setCurrentChat((prev)=>({...prev,isOnline:true}))
      }else{
        setCurrentChat((prev)=>({...prev,isOnline:false}))  
      }
    }
  }, [onlineUsers]);

  const data = {
    from: user?._id,
    to: currentChat?._id,
  };
  const navigate = useNavigate();

  useEffect(() => {
    getAllmsgsApi(data)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        window.location.reload()
        console.log(err)
        if(err.response.status===403 && err.response.data.message.message==='jwt expired'){
          	dispatch(logout())
        }
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
          id: user._id,
          msgId: data?._id,
        };
        ReadMsgsApi(id).catch(err=>console.log(err))
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

  //message open style
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

  //.......shortlisting and booking section...........
  const [Shortlists,setShortlists] = useState([])
  const [bookings,setBookings] = useState([])

  useEffect(()=>{
    const data ={
      id: user._id
    }
    if(select===1){
                userShortlistsApi(data).then(res=>{
                  setShortlists(res.data)
                }).catch(err=>console.log(err))
              }
    if(select===3){
      userBookingsApi(data).then(res=>{
        setBookings(res.data)
      }).catch(err=>console.log(err))
    }

  },[select])

  


  return (
    <div>
        <div style={divStyle} >
          <div style={gradientOverlayStyle} className='flex flex-col items-center justify-end py-32'>
          <h1 className='text-white font-bold text-5xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>YOUR WEDDING,YOUR WAY</h1>
          {/* <h2 className='text-white font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'> Find the best wedding vendors with thousands of trusted reviews</h2> */}
          </div>
        </div>
        <div className='flex relative container md:max-w-screen-md mx-auto h-96 '>
          {user && <div className='flex flex-col my-5 text-xs font-sans text-gray-600 bg-slate-50 h-full w-1/6 font-medium'>
            <h1 onClick={()=>setSelect(1)} style={select===1?{color:'red'}:{color:'black'}} className='m-2 cursor-pointer'>Shortlists</h1>
            <h1 onClick={()=>setSelect(2)} style={select===2?{color:'red'}:{color:'black'}} className='m-2 cursor-pointer'>Finalizing Vendors</h1>
            <h1 onClick={()=>setSelect(3)} style={select===3?{color:'red'}:{color:'black'}} className='m-2 cursor-pointer'>Bookings</h1>
          </div>}
          <div className='flex flex-col my-5 overflow-y-auto h-full w-4/5'>

            {/* shortlist section.............. */}
          {select===1 &&
              <>
              <div className='text-sm overflow-hidden w-full h-full'>
                <div className=' w-full h-1/6   '>
                  <h1 className='text-header-bot p-2 bg-slate-100'>Shortlists</h1>
                </div>
                {
                  Shortlists.length===0 ?
                  <>
                  <h1 className='bg-header-top text-white text-center text-lg text-opacity-70'>Shortlist Services</h1>
                    <Lottie className='h-80 bg-header-top' animationData={lottie} loop={true} />
                  </> :
                  <div className='w-full h-5/6 flex overflow-x-auto flex-wrap '>
                    {
                      Shortlists.map((Shortlist,index)=>
                        <div key={index} className='min-w-1/3 h-full m-2'>
                          < EcommerceCard photographer={Shortlist} setShortlists={setShortlists}/>
                        </div>
                      )
                    }
                  </div>
                  
                  
                }
                
              </div>
              </>
            }


            {/* ...........chat features.................................. */}
            {
              select===2 &&
              <>
              <div className='overflow-hidden w-full h-full'>
                <div className='w-full bg-[#F9DDDD] h-1/6'>
                  <h1 className='text-header-bot bg-slate-100 p-2 text-sm '>Finalized Vendors</h1>
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
                          className='text-sm font-medium  cursor-pointer m-1'>{contact.brand_name}</li>
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
                          className='text-sm font-medium text-black cursor-pointer m-1'>{contact.brand_name}</li>
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
                          className='w-5/6 rounded-full bg-slate-100 placeholder:text-slate-500 px-3 py-2 text-sm border border-black m-1' 
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
                          
                            <LuSmilePlus className=' text-3xl m-1' 
                            onClick={()=>setEmojiVisible(!emojiVisible)} 
                            />
                            { emojiVisible &&
                              <div className='absolute -bottom-[22rem] -right-20'>
                            <Picker emojiStyle="apple"
                                lazyLoadEmojis="true"
                                height={350}
                                width={350}
                                onEmojiClick={handleEmojiClick}
                              />
                            </div>
                            }
                              
                        
                        <LuArrowRightCircle 
                        className='text-3xl m-1 text-white bg-header-bot rounded-full'
                        onClick={sendChat} 
                        />
                      </div>
                      <div className='w-full h-full overflow-y-auto overflow-x-hidden'>
                          <div ref={messagesContainerRef}
                        className='w-full h-full flex flex-col p-2 '>
                          { messages.length>0 ?
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
                          }) :
                          
                            <div className='w-full flex justify-center items-center m-1'>
                                  <div>
                                    <p className='bg-header-bot bg-opacity-70 text-white px-3 py-1 rounded font-medium'>Start Your Conversation</p>
                                  </div>
                                  
                                </div>
                          
                          }
                        </div>
                      </div>
                      
                      
                      
                    </div>
                </div>
              </div>
                
                
              </>
            }
            {
              select===3 &&
              <>
              <div className='text-sm overflow-hidden w-full h-full'>
                <div className=' w-full h-1/6 '>
                  <h1 className='text-header-bot p-2 bg-slate-100'>Bookings</h1>
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

                          < BookingCard booking={booking} setBookings={setBookings}/>
                          
                        </div>
                      )
                    }
                  </div>
                  
                  
                }
                
              </div>
              </>
            }

          </div>
        </div>
      
    </div>
  )
}

export {ProfileBody}