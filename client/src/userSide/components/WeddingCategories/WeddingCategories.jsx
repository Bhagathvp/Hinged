import React from 'react';
import { useNavigate } from 'react-router-dom';

const WeddingCategories = () => {
  
  const navigate = useNavigate()

  return (
    <div className='relative container md:max-w-screen-md mx-auto '>
      <h1 className='mt-10 mb-5 text-2xl font-semibold'>Wedding Categories</h1>

      <div className='flex flex-col md:flex-row  '>
        <div onClick={()=>navigate('/venues')}
        className='mr-2 mb-2 w-full md:w-1/2 h-32 bg-blue-200 flex items-center justify-between cursor-pointer'>
            <div className='p-5 w-1/2'>
                <h2 className='font-medium '>Venues</h2>
                <p className='text-xs truncate'>Banquet Halls, Lawns / Farmhouses, Rest houses</p>
            </div>
            
            <img className='rounded-s-full h-full w-1/2' src="https://image.wedmegood.com/resized/250X/uploads/m_v_cat_image/1/venues.jpg" alt="venue" />
        </div>
        <div onClick={()=>navigate('/photographers')}
        className='mr-2 mb-2 w-full md:w-1/2 h-32 bg-red-200 flex items-center justify-between cursor-pointer'>
            <div className='p-5 w-1/2'>
                <h2 className='font-medium '>Photographers</h2>
                <p className='text-xs truncate'>Photographers</p>
            </div>
            <img className='rounded-s-full h-full w-1/2' src="https://image.wedmegood.com/resized/250X/uploads/m_v_cat_image/2/photographers.jpg" alt="photographer" />
        </div>
      </div>

      <div className='flex flex-col md:flex-row mb-2 '>
        <div onClick={()=>navigate('/Makeup')}
        className='mr-2 mb-2 w-full md:w-1/2 h-32 bg-lime-200 flex items-center justify-between cursor-pointer'>
            <div className='p-5 w-1/2'>
                <h2 className='font-medium '>Makeup</h2>
                <p className='text-xs truncate'>Bridal Makeup, Family Makeup</p>
            </div>
            <img className='rounded-s-full h-full w-1/2' src="https://image.wedmegood.com/resized/250X/uploads/m_v_cat_image/3/makeup.jpg" alt="makeup" />
        </div>
        <div onClick={()=>navigate('/bridal-wear')}
        className='mr-2 mb-2 w-full md:w-1/2 h-32 bg-emerald-200 flex items-center justify-between cursor-pointer'>
            <div className='p-5 w-1/2'>
                <h2 className='font-medium '>Bridal Wear</h2>
                <p className='text-xs truncate'>Bridal Lehengas, Kanjeevaram / Silk Sarees</p>
            </div>            
            <img className='rounded-s-full h-full w-1/2' src="https://image.wedmegood.com/resized/250X/uploads/m_v_cat_image/4/bridal-wear.jpg" alt="bridalwear" />
        </div>        
      </div>
    </div>
  );
};

export default WeddingCategories;
