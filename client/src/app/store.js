import { configureStore} from "@reduxjs/toolkit";
import authReducer from '../features/Slice/authSlice'
import adminReducer from '../features/Slice/adminSlice'
import vendorReducer from '../features/Slice/vendorSlice'
import photographyReducer from '../features/Slice/photographySlice'
import servicesReducer from "../features/Slice/servicesSlice";
import listPhotographers from "../features/Slice/listPhotographers";
import OnlineUserReducer from '../features/Slice/OnlineUsers'

export default configureStore({
    reducer:{
        auth : authReducer,
        admin : adminReducer,
        vendor: vendorReducer,
        vendorPhotographers: photographyReducer,
        AllPhotographers: listPhotographers,
        services: servicesReducer,
        onlineUsers : OnlineUserReducer
    }
})