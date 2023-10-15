import React from 'react'

import Header from '../components/Header/Header'
import Body  from '../components/Body/Body'
import Footer from '../components/Footer/Footer'

const AdminHome = () => {
  return (
    <div>
        <Header selected={'customers'}/>
        <Body selected={'CUSTOMERS'}/>
        <Footer/>
    </div>
  )
}

export default AdminHome
