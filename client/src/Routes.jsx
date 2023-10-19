import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lottie from "lottie-react";
import loading from './assets/loading2.json'
import { useSelector } from 'react-redux';
import UserPrivateRoute from './routes/UserPrivateRoute';
import UserPublicRoute from './routes/UserPublicRoute';
import VendorPrivateRoute from './routes/VendorPrivateRoute';
import VendorPublicRoute from './routes/VendorPublicRoute';

const PageNotFound = lazy(()=> import('./userSide/pages/404 error/PageNotFound'))

//user
const Home = lazy(() => import('./userSide/pages/Home/home'));
const Login =lazy(()=> import('./userSide/pages/Login/login'))
const OtpPage =lazy(()=> import('./userSide/pages/OtpPage/OtpPage'))
const Profile = lazy(()=> import('./userSide/pages/Profile/Profile'))
const Photographers= lazy(()=>import('./userSide/pages/Photographers/Photographers'))
const PhotographerProfile= lazy(()=>import('./userSide/pages/PhotographerProfile/PhotographerProfile'))
const Venues= lazy(()=>import('./userSide/pages/Venues/Venues'))
const Settings = lazy(()=> import('./userSide/pages/Settings/Settings'))

//vendor
const VendorProfile = lazy(()=> import('./vendorSide/pages/Profile/VendorProfile'))
const BusinessLogin=lazy(()=> import('./vendorSide/pages/Login/BusinessLogin'))
const BusinessRegister=lazy(()=> import('./vendorSide/pages/Register/BusinessRegister'))

//admin
const AdminLogin =lazy(()=>import('./adminSide/Login/adminLogin'))
const AdminHome = lazy(()=>import('./adminSide/Home/adminHome'))
const AdminVendors = lazy(()=> import('./adminSide/VendorManagement/AdminVendor'))
const ServiceManagement = lazy(()=>import('./adminSide/ServicesManagement/ServiceManagement'))
const BookingsManagement = lazy(()=>import('./adminSide/BookingsManagement/BookingsManagement'))

const ProjectRoutes = () => {
  
  const [showRoutes, setShowRoutes] = useState(false);

  useEffect(() => {
    // Show the routes after 3 seconds
    const timer = setTimeout(() => {
      setShowRoutes(true);
    }, 1000);

    // Clear the timeout when the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const { adminState } = useSelector((state) => state.admin)

  return (
    <div>
      {showRoutes ? (
        
          <Suspense fallback={
          <>
            <div className='w-full h-screen flex justify-center items-center'>
              <Lottie className=' h-64' animationData={loading} loop={true} />
            </div>
          </>}>
            <Routes>
              {/* ....................USER ROUTES.................. */}
                  <Route path="/" element={<Home/> } />  
                  <Route path='/photographers' element={<Photographers/>}/>
                  <Route path='/photographers/profile' element={<PhotographerProfile/>}/>
                  {/* <Route path='/venues' element={<Venues/>}/> */}


                <Route element={<UserPublicRoute/>}>
                  <Route path="/login" element={<Login/> } />
                  <Route path="/verifyOtp" element={<OtpPage/> } />
                </Route>
                
                <Route element={<UserPrivateRoute/>}>
                  <Route path="/userProfile" element={<Profile/>} />
                  <Route path='/settings' element={ <Settings/> } />
                </Route>
              
              {/* .......................VENDOR ROUTES.................. */}
              <Route path="/" >
                <Route element={<VendorPrivateRoute/>}>
                  <Route path="vendorProfile" element={<VendorProfile/>} />
                </Route>
                <Route element={<VendorPublicRoute/>}>
                  <Route path="business-login" element={<BusinessLogin/> } />
                  <Route path="business-register" element={<BusinessRegister/> } />
                </Route>
                
              </Route>
              
              {/* .............................ADMIN ROUTES........................... */}
              <Route path='/admin'>
                <Route index element={adminState?<AdminHome/>:<AdminLogin/>}  />
                <Route path='home' element={adminState?<AdminHome/>:<AdminLogin/>} />
                <Route path='vendors' element={adminState?<AdminVendors/> : <AdminLogin/>}/>
                <Route path='services' element={adminState?<ServiceManagement/> : <AdminLogin/>}/>
                <Route path='bookings' element={adminState?<BookingsManagement/> : <AdminLogin/>}/>

              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
       
      ) : (
        <>
        <div className='w-full h-screen flex justify-center items-center'>
          <Lottie className=' h-64' animationData={loading} loop={true} />
        </div>
        </>
      )}
    </div>
  );
};

export default ProjectRoutes;
