import React from 'react'

import Header from '../components/Header/Header'
import Body  from '../components/Body/Body'
import Footer from '../components/Footer/Footer'

const ServiceManagement = () => {
  return (
    <div>
        <Header selected={'services'}/>
        <Body selected={'SERVICES'}/>
        <Footer/>
    </div>
  )
}

export default ServiceManagement
