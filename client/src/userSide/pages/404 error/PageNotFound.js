import React from 'react'

import {Header} from '../../components'
import img from '../../../assets/error.png'

const PageNotFound = () => {

  return (
    <div>
      <Header/>
      <div className='w-screen h-screen flex flex-col items-center justify-center'>
        
        <img className='w-1/2 h-1/2' src={img} alt="error" />
        <br/>
        <p className='text-slate-400 text-sm'>The page you are looking for does not exist.</p>
        
      </div>
    </div>
  )
}

export default PageNotFound
