
const Services = require('../models/services')
require('dotenv').config();


const asyncHandler = require('express-async-handler')

const getServices = asyncHandler(async(req,res)=>{
    let services = await Services.find({is_verified: 1});

    if(services){
        res.status(200).json({
            services: services
        })
    }else{
        res.status(400).json({message: 'no services available'})
        throw new Error('services unavailable')
    }
})

module.exports ={
    getServices,
}