import React from 'react'

import Header from '../components/Header/Header'
import Body  from '../components/Body/Body'
import Footer from '../components/Footer/Footer'


const AdminVendor = () => {
  return (
    <div>
        <Header selected={'vendors'}/>
        <Body selected={'VENDORS'}/>
        <Footer/>
      
    </div>
  )
}

export default AdminVendor
