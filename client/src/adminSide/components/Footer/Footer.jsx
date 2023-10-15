import React from 'react'
import logo from '../../../assets/logos/Hinged-1 (3).png'

const Footer = () => {
  return (
    <div className='absolute bottom-0 w-[100vw] bg-slate-200 h-9 flex items-center'>
      <div className='container h-full md:max-w-screen-md mx-auto flex items-center justify-between'>
        <p className='text-xs'>&#xA9;2023</p>
        <img className='h-6' src={logo} alt="logo" />
        <p className='text-xs'>Terms & Conditions/Privacy Policy</p>
      </div>
    </div>
  )
}

export default Footer
