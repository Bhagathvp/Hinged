import React, {useRef} from 'react'
import WeddingCategories from '../WeddingCategories/WeddingCategories';
import { useNavigate } from 'react-router-dom';

const Body = () => {
  const backgroundImageUrl = 'url(banner/background.png)';

  const divStyle = {
    backgroundImage: backgroundImageUrl,
    width: '100%',
    height: '70vh',
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


  const scrollContainerRef = useRef(null);

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 202, // Adjust the scroll distance as needed
      behavior: 'smooth',
    });
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -202, // Adjust the scroll distance as needed
      behavior: 'smooth',
    });
  };

  const navigate = useNavigate();
  
  return (

    <div className='' >
        <div style={divStyle} >
          <div style={gradientOverlayStyle} className='flex flex-col items-center justify-end py-32'>
          <h1 className='text-white font-extrabold text-5xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>Your Wedding, Your Way</h1>
          <h2 className='text-white font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'> Find the best wedding vendors with thousands of trusted reviews</h2>
          </div>
        </div>
        {/* Popular Searches */}
        <div className='relative container md:max-w-screen-md  mx-auto '>
          <h1 className='mt-10 mb-5 text-2xl font-semibold'>Popular Searches</h1>

          <div className='flex overflow-x-scroll no-scrollbar mb-5'  ref={scrollContainerRef}>
            {/* Clone the content for loop effect */}
          {[...Array(2)].map((_, index) => (
            <React.Fragment key={index}>
              <div className='flex flex-col mr-3 cursor-pointer' onClick={()=>navigate('/photographers')}>
                <div className='w-48 h-60 overflow-hidden rounded-lg'>
                  <img className='rounded-lg w-full h-full object-cover transition-transform duration-500 hover:scale-125' src="https://image.wedmegood.com/resized/450X/uploads/member/138533/1611909257__JAN2609.jpg?crop=9,138,2031,1142" alt="popular searches" />
                </div>
                <p className='mt-2 text-gray-700'>Venues</p>
              </div>
              <div className='flex flex-col mr-3 cursor-pointer' onClick={()=>navigate('/photographers')}>
                <div className='w-48 h-60 overflow-hidden rounded-lg'>
                  <img className='rounded-lg w-full h-full object-cover transition-transform duration-500 hover:scale-125' src="https://image.wedmegood.com/resized/300X/uploads/banner_image/2/mua.jpg" alt="popular searches" />
                </div>
                <p className='mt-2 text-gray-700'>Bridal MakeUp</p>
              </div>
              <div className='flex flex-col mr-3 cursor-pointer' onClick={()=>navigate('/photographers')}>
                <div className='w-48 h-60 overflow-hidden rounded-lg'>
                  <img className='rounded-lg w-full h-full object-cover transition-transform duration-500 hover:scale-125' src="https://image.wedmegood.com/resized/300X/uploads/banner_image/3/photography.jpg" alt="popular searches" />
                </div>
                <p className='mt-2 text-gray-700'>Photographers</p>
              </div>
              <div className='flex flex-col mr-3 cursor-pointer' onClick={()=>navigate('/photographers')}>
                <div className='w-48 h-60 overflow-hidden rounded-lg'>
                  <img className='rounded-lg w-full h-full object-cover transition-transform duration-500 hover:scale-125' src="https://image.wedmegood.com/resized/300X/uploads/banner_image/1/bridal-wear.jpg" alt="popular searches" />
                </div>
                <p className='mt-2 text-gray-700'>Bridal Wear</p>
              </div>
              
              
            <div className='bg-slate-50 absolute rounded-full hover:bg-slate-200 w-10 h-10 top-36 -right-5 flex items-center justify-center'>
              <button className='text-gray-950 w-5 hover:text-header-bot text-3xl font-medium' onClick={scrollRight}>&#8250;</button>
            </div>
            <div className='bg-slate-50 absolute rounded-full hover:bg-slate-200 w-10 h-10 top-36 -left-5 flex items-center justify-center'>
              <button className='text-gray-950 w-5 hover:text-header-bot text-3xl font-medium' onClick={scrollLeft}>&#8249;</button>
            </div>
              
            </React.Fragment>
        ))}
            

          </div>
      
        </div>

        {/* Wedding categories */}
        <WeddingCategories/>
      
    </div>
    
  )
}

export {Body}
