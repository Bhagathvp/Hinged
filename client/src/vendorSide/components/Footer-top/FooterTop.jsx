import React from 'react'
import {BiLogoFacebook,BiLogoInstagram} from 'react-icons/bi'
import {TfiYoutube} from 'react-icons/tfi'

const FooterTop = () => {
  return (
    <div className='mt-20 pb-5 border-b-2 border-slate-300'>

      <div className='pt-5'>
        <h6 className='text-sm font-medium text-slate-700 pb-3'>HINGED - Your Personal Wedding Planner</h6>
        <p className=' text-slate-600 pb-3' >Plan your wedding with Us</p>
        <p className=' text-slate-600 pb-3'>
          Hinged is an Indian Wedding Planning Website and app where you can find the best wedding vendors, 
          with prices and reviews at the click of a button. Whether you are looking to hire wedding planners in India, 
          or looking for the top photographers, or just some ideas and inspiration for your wedding. 
          Hinged can help you solve your wedding planning woes through its unique features. 
          With a checklist, detailed vendor list, inspiration gallery and blog - you won't need to spend hours 
           planning a wedding anymore.
        </p>

      </div>
      <div className='pt-5 w-full flex '>
        <div className='w-1/2'>
          <p className='text-sm font-medium text-slate-700 pb-3'>Contact us to get best deals</p>
          <div className='flex'>
            <div className='pr-4 '>
              <p className='text-sm font-medium'>For Vendors</p>
              <a className='text-slate-600' href="mailto:bhagathvp.ramu@gmail.com">bhagathvp.ramu@gmail.com</a><br />
              <a className='text-slate-600' href="tel:+916282214013">+91 6282214013</a>
            </div>

            <div className='border-l border-gray-400 pl-4 '>
              <p className='text-sm font-medium'>For Users</p>
              <a className='text-slate-600' href="mailto:bhagathvp.ramu@gmail.com">bhagathvp.ramu@gmail.com</a><br />
              <a className='text-slate-600' href="tel:+916282214013">+91 6282214013</a>
            </div>
          </div>
        </div>
          

        <div className='w-1/2 pr-10 flex flex-col justify-end items-end'>
          <p className='text-sm font-medium pb-2'>Follow us on:</p>

          <div className='pb-1'>
            <a className='flex items-center' href="http://www.facebook.com"><BiLogoFacebook className='text-blue-600 mr-1'/>
            <p>facebook</p>
            </a>
          </div>
          <div className='pb-1'>
            <a className='flex items-center' href="http://www.instagram.com"><BiLogoInstagram className='text-pink-600 mr-1'/>  
            <p>Instagram</p>
            </a>
          </div>
          <div className='pb-1'>
            <a  className='flex items-center'href="http://youtube.com"><TfiYoutube className='text-red-500 mr-1'/>
            <p>YouTube</p>
            </a>
            
          </div>
        </div>
      </div>

    </div>
  )
}

export default FooterTop;
