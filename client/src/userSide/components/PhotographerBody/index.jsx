import React, { useEffect, useState } from 'react'

import PopUpMessage from '../PopUpMessage/PopUpMessage'

import {GrLocation} from 'react-icons/gr'
import {LiaCrownSolid} from 'react-icons/lia'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllPhotographers } from '../../../features/Slice/listPhotographers'
import { createMatch, searchPhotographer, addShortlistApi} from '../../../features/api/api'
import offerImage from '../../../assets/specialOffer.png'

const PhotographerBody = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getAllPhotographers())
      },[])

    const AllPhotographers = useSelector((state)=> state?.AllPhotographers)

    const Photographers = AllPhotographers?AllPhotographers?.allPhotographers?.AllPhotographers : [];

    const Goto=(id) =>{
        const data ={
            id: id
        }
        navigate('/photographers/profile', {state: data })
        
    }

    const {user} = useSelector((state)=> state.auth)
    const {vendor} = useSelector((state)=> state.vendor)

    const handleButtonClick=(e,value)=>{
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

    //search and filter funtionality
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPhotographers,setFilteredPhotographers] = useState(Photographers)
    const [selectedBudgets, setSelectedBudgets] = useState([]);

    
    useEffect(()=>{
        const data={
            searchQuery,
            selectedBudgets
        }

        searchPhotographer(data).then((res)=>{
            setFilteredPhotographers(res.data.filteredPhotographers)
                
                
        }).catch((err)=>{
            console.log(err);
        })
    },[searchQuery,selectedBudgets])

    // Function to handle checkbox selection
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    if (checked) {
      setSelectedBudgets([...selectedBudgets, id]);
    } else {
      setSelectedBudgets(selectedBudgets.filter((budget) => budget !== id));
    }
  };

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

  

  return (
    <div  >
        <div className='container md:max-w-screen-md mt-28 mx-auto '>
            <div className='flex justify-between'>
                <h1 className=' mb-5 text-2xl font-semibold text-slate-600 ml-3'>PHOTOGRAPHERS</h1>
                <input 
                placeholder='search here'
                className='w-72 h-9 border border-slate-300 p-2 rounded focus:outline-none focus:border-sky-500 placeholder:text-sm'
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          
          <div className='flex justify-between mb-5 w-full'>
            
            <div className='w-3/4 relative'>
                
                {
                    filteredPhotographers?.length>0 ? 
                    (   
                        filteredPhotographers.map((photographer,index)=>
                     
                        <div key={photographer._id} className='flex h-48 m-1 p-1 bg-white rounded-xl border cursor-pointer relative'>
                            { photographer.offer 
                            ?
                            <div className='absolute w-16 right-0 top-0 bg-transparent'>
                                <img className='w-full ' src={offerImage} alt="offer-image" />
                            </div> 
                            : null
                            }
                            <div className=' w-1/3 h-full'>
                                <img className='rounded-md w-full h-full object-cover' src={photographer?photographer.images[0]:''} alt={photographer.brand} />
                            </div>
                            <div className='w-2/3 p-2 relative'>
                                
                                { photographer.subscription &&
                                    <div className='w-full flex justify-end items-center absolute top-0 right-full '>
                                        <div className='bg-header-bot max-w-fit px-2 text-white rounded-tr-md flex justify-center items-center '>
                                            <LiaCrownSolid/>
                                            <p className='font-medium text-sm p-1'>handpicked</p>
                                        </div>
                                    </div>
                                    
                                }
                                <div onClick={(e)=>Goto(photographer._id)} className='text-ellipsis'>
                                    
                                    <h1 className='text-lg font-semibold text-slate-700 m-1'>{photographer.brand}</h1>
                                    <div className='flex items-center text-sm font-medium text-slate-500 m-1'>
                                        <GrLocation />
                                        <p className='mx-1'>{photographer.base_city}</p>
                                    </div>
                                    <p className='text-xs font-medium text-slate-500 m-1'>Photo + Video</p>
                                    {
                                        photographer.offer  
                                        ?
                                        <div className='flex'>
                                            <h1 className='text-base font-bold text-slate-800 m-1 line-through'>₹ {photographer.amount}</h1>
                                            <h1 className='text-xl font-bold text-slate-800 m-1 '>₹{photographer.amount-(photographer.amount*photographer.offer/100)} <span className='text-xs text-slate-500'>per day</span></h1>
                                        </div>
                                        :
                                        <h1 className='text-xl font-bold text-slate-800 m-1'>₹ {photographer.amount} <span className='text-xs text-slate-500'>per day</span></h1>
                                    }
                                    <p className='text-xs font-semibold text-slate-500 m-1 w-full' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photographer.brand} is a professional wedding photography brand based in {photographer.base_city}...</p>
                                </div>
                                
                                
                                    
                                
                                {vendor ?
                                    <div className='flex justify-end items-center text-xs text-white font-medium'>
                                        <button disabled
                                        onClick={(e)=>handleButtonClick(e,photographer)}
                                        className='mx-1 p-2 bg-header-bot rounded cursor-not-allowed'>Send Message</button>
                                        <button 
                                        disabled
                                        className='mx-1 p-2 bg-header-bot rounded cursor-not-allowed'>ShortList</button>
                                    </div> :
                                    <div className='flex justify-end items-center text-xs text-white font-medium'>
                                    <button 
                                    onClick={(e)=>handleButtonClick(e,photographer)}
                                    className='mx-1 p-2 bg-header-bot rounded'>Send Message</button>
                                    <button 
                                    onClick={(e)=>handleShortlist(e,photographer)} 
                                    className='mx-1 p-2 bg-header-bot rounded'>ShortList</button>
                                    {
                                        message && 
                                        <div id='PopUpMessageId'>
                                            <PopUpMessage message={message} />
                                        </div>
                                    }
                                </div>
                                }
                            </div>
                        </div>
                        )
                    ) :
                    <div className='flex justify-center items-center font-medium '>
                        <p className='text-header-bot'>Search for a different Brand Name or Apply a different filter</p>
                    </div>
                }
                
            </div>
            <div className=' flex flex-col mx-1 p-2 w-1/4 h-48 border items-stretch justify-center bg-white rounded-xl'>

                <h1 className='font-semibold text-slate-600 m-2'>Photographers by Budget</h1>
                <div className="flex items-center">
                    <input 
                    id="Budget_Friendly" 
                    type="checkbox" 
                    value="" 
                    checked={selectedBudgets.includes("Budget_Friendly")}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="Budget_Friendly" className="m-2 text-sm font-medium text-gray-900">Budget Friendly</label>
                </div>
                <div className="flex items-center">
                    <input 
                    id="Value_For_Money" 
                    type="checkbox" 
                    value="" 
                    checked={selectedBudgets.includes("Value_For_Money")}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="Value_For_Money" className="m-2 text-sm font-medium text-gray-900">Value For Money</label>
                </div>
                <div className="flex items-center">
                    <input 
                    id="Premium" 
                    type="checkbox" 
                    value="" 
                    checked={selectedBudgets.includes("Premium")}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="Premium" className="m-2 text-sm font-medium text-gray-900">Premium </label>
                </div>
                <div className="flex items-center">
                    <input 
                    id="Luxury" 
                    type="checkbox" 
                    value="" 
                    checked={selectedBudgets.includes("Luxury")}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="Luxury" className="m-2 text-sm font-medium text-gray-900">Luxury</label>
                </div>
            </div>
            
          </div>
      
        </div>
      
    </div>
    
  )
}

export {PhotographerBody}
