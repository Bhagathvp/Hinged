import React from 'react'
import {RiArrowDropDownLine} from 'react-icons/ri'


const Dropdown = () => {
  return (
    <div className=" m-1 text-xs  w-44 lg:max-w-sm flex">
        <select className=" w-full px-2 font-medium text-gray-900 bg-slate-50 border rounded-sm outline-none appearance-none focus:border-header-top">
            <option>All Cities</option>
            <option>Trivandrum</option>
            <option>Calicut</option>
            <option>Kollam</option>
        </select>
        <RiArrowDropDownLine className=' relative text-lg top-1 right-6 text-black'/>
    </div>
  )
}

export default Dropdown
