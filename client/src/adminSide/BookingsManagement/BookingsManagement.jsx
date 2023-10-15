import React from 'react'

import Header from '../components/Header/Header'
import Body  from '../components/Body/Body'
import Footer from '../components/Footer/Footer'

const BookingsManagement = () => {
  return (
    <div>
        <Header selected={'bookings'}/>
        <Body selected={'BOOKINGS'}/>
        <Footer/>
    </div>
  )
}

export default BookingsManagement
