
import { useEffect } from 'react';
import './App.css';
import Routes from './Routes';

import { socket } from './Socket';
import { SetOnlineUserData } from './features/Slice/OnlineUsers';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {ToastContainer} from 'react-toastify'

function App() {

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const vendor = useSelector((state) => state.vendor.vendor);
  const auth = user?user.token:''
  const { pathname } = useLocation();

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit("add-user", user._id);
    }
  }, [user,pathname]);

  useEffect(() => {
    if (vendor) {
      socket.connect();
      socket.emit("add-user", vendor._id);
    }
  }, [vendor,pathname]);


  useEffect(() => {
    const interval = setInterval(() => {
      if(user){
        socket.emit("getOnlineUsers", user?user._id:'');
      }else if(vendor){
        socket.emit("getOnlineUsers", vendor?vendor._id:'');
      }
      console.log('Emitting socket event every 5 second');
    }, 5000); // 1000 milliseconds = 1 second
    return () => {
      // Clear the interval when the component unmounts to avoid memory leaks
      clearInterval(interval);
    };
  }, [user,vendor]);

  useEffect(() => {
    if (socket) {
      socket.on("connect_error", (error) => {
        console.log("Socket connect_error:", error);
      });

      socket.on("error", (error) => {
        console.log("Socket error:", error);
      });
      
      socket.on("onlineUsersList", (data) => {
        // console.log(data,'<=from app');
        dispatch(SetOnlineUserData(data));
      });

      
    }
    return () => {
      socket.off("connect_error");
      socket.off("error");
    };
  }, []);

  return (
    <div >
      <Routes/>
      <ToastContainer/>
    </div>
  );
}

export default App;
