const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Vendor = require('../models/vendorModel')
const Services = require('../models/services')
const Bookings = require('../models/bookings')

require('dotenv').config();

const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    })
  }
  
  
//login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
   
    const userList= await User.find({is_user: 1});
    let users=[];

    for(let i=0 ; i<userList.length ; i++ ){
        users.push(userList[i]);
    }

    const vendorList = await Vendor.find({is_vendor: 1});
    let vendors=[];

    for(let i=0 ; i<vendorList.length ; i++ ){
      vendors.push(vendorList[i]);
    }

    const serviceList = await Services.find()
    let services =[];

    for(let i=0 ; i<serviceList.length ; i++ ){
      services.push(serviceList[i]);
    }

    // Check for admin email
    const admin = await Admin.findOne({ email })

  if(admin && admin.is_admin===1){
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin.id,
        email: admin.email,
        users,
        vendors, 
        services,
        token: generateToken(admin._id),
      } 
      )
    } else {
      res.status(400).json({message:'Invalid Password'})
      throw new Error('Invalid credentials')
    }
  }else{
      res.status(400).json({message:'Invalid Email Id'})
      throw new Error('Invalid admin login')
  }
    
  })


  //block user
  const block = asyncHandler(async (req,res)=>{

    const {email,adminEmail} = req.body;
    const user = await User.findOne({email})
    const vendor = await Vendor.findOne({email});
    const service = await Services.findOne({category:email})
    if(user){
      if(user.is_verified==1){  
      await User.findOneAndUpdate({ email }, {$set:{is_verified : 0}});
    }else{
      await User.findOneAndUpdate({ email }, {$set:{is_verified : 1}});
    }
  }else if(vendor){
    if (vendor.is_verified==1) {
      await Vendor.findOneAndUpdate({email},{$set:{is_verified : 0}})
    }else{
      await Vendor.findOneAndUpdate({email},{$set:{is_verified : 1}});
    }
  }else if(service){
    if (service.is_verified==1) {
      await Services.findOneAndUpdate({category:email},{$set:{is_verified : 0}})
    }else{
      await Services.findOneAndUpdate({category:email},{$set:{is_verified : 1}});
    }
  }

    const userList= await User.find({is_user: 1});
    let users=[];

    for(let i=0 ; i<userList.length ; i++ ){
        users.push(userList[i]);
    }

    const vendorList = await Vendor.find({is_vendor: 1});
    let vendors=[];

    for(let i=0 ; i<vendorList.length ; i++ ){
      vendors.push(vendorList[i]);
    }

    const serviceList = await Services.find()
    let services =[];

    for(let i=0 ; i<serviceList.length ; i++ ){
      services.push(serviceList[i]);
    }

    const admin = await Admin.findOne({email:adminEmail})
   
    if(admin.is_admin===1){
        res.json( {
            _id: admin.id,
            email: admin.email,
            users,
            vendors, 
            services,
            token: generateToken(admin._id),
          } )
    }else{
      res.status(400).json({message:'invalid admin login'})
      throw new Error('Invalid admin login')
  }
    
  })

  //block vendor
  const vendorBlock = asyncHandler(async (req,res)=>{

    const {email,adminEmail} = req.body;
    console.log(email)
    const vendor = await Vendor.findOne({email});
    if(vendor){
    if (vendor.is_verified==1) {
      await Vendor.findOneAndUpdate({email},{$set:{is_verified : 0}})
    }else{
      await Vendor.findOneAndUpdate({email},{$set:{is_verified : 1}});
    }
  }

    const userList= await User.find({is_user: 1});
    let users=[];

    for(let i=0 ; i<userList.length ; i++ ){
        users.push(userList[i]);
    }

    const vendorList = await Vendor.find({is_vendor: 1});
    let vendors=[];

    for(let i=0 ; i<vendorList.length ; i++ ){
      vendors.push(vendorList[i]);
    }

    const serviceList = await Services.find()
    let services =[];

    for(let i=0 ; i<serviceList.length ; i++ ){
      services.push(serviceList[i]);
    }

    const admin = await Admin.findOne({email:adminEmail})
   
    if(admin.is_admin===1){
        res.json( {
            _id: admin.id,
            email: admin.email,
            users,
            vendors, 
            services,
            token: generateToken(admin._id),
          } )
    }else{
      res.status(400).json({message:'invalid admin login'})
      throw new Error('Invalid admin login')
  }
    
  })

  //add services
  const addService = asyncHandler(async(req,res)=>{

    const {category, adminEmail}= req.body;
    console.log(category);

    const service = await Services.findOne({category: category}).collation({ locale: 'en', strength: 1 });
    console.log(service);

    const userList= await User.find({is_user: 1});
    let users=[];

    for(let i=0 ; i<userList.length ; i++ ){
        users.push(userList[i]);
    }

    const vendorList = await Vendor.find({is_vendor: 1});
    let vendors=[];

    for(let i=0 ; i<vendorList.length ; i++ ){
      vendors.push(vendorList[i]);
    }

    const serviceList = await Services.find()
    let services =[];

    for(let i=0 ; i<serviceList.length ; i++ ){
      services.push(serviceList[i]);
    }

    const admin = await Admin.findOne({email:adminEmail})

    if(service){
      if(admin.is_admin===1){
          res.json( {
              _id: admin.id,
              email: admin.email,
              message:'Category already entered',
              users,
              vendors,
              services,
              token: generateToken(admin._id),
            } )
      }
    }else{
      const service = await Services.create({
        category
      })
      if(service){
        const serviceList = await Services.find()
        let services =[];

        for(let i=0 ; i<serviceList.length ; i++ ){
          services.push(serviceList[i]);
        }
        res.status(201).json({
          _id: admin.id,
              email: admin.email,
              users,
              vendors, 
              services,
              token: generateToken(admin._id),
        })
      }

    }
  })


  //to get all bookings

  const adminBookings = async(req,res)=>{
    try {
      const bookings = await Bookings.find();
      let detailsArray = [];
  
      // Create an array to store promises
      const promiseArray = bookings.map(async (booking) => {
        const user = await User.findOne({ _id: booking.userId });
        const vendor = await Vendor.findOne({ _id: booking.vendorId });
  
        const details = {
          id: booking._id,
          user: user.name,
          vendor: vendor.contact_name,
          orderId: booking.paymentDetails.orderId,
          status: booking.status,
        };
  
        // Push the details object into the 'detail' array
        detailsArray.push(details);
      });
  
      // Wait for all promises to complete
      await Promise.all(promiseArray);
  
      if (detailsArray.length > 0) {
        res.status(200).json(detailsArray);
      } else {
        res.status(400).json('no data found');
      }
    } catch (error) {
      res.status(400).json('Cannot access data')
    }
  }

  const issueRefund = asyncHandler(async(req,res)=>{
    const {id} = req.body;
    const updatedBooking = await Bookings.findOneAndUpdate({_id:id},{$set:{status:"refunded"}},{new:true});
    if(updatedBooking){
      res.status(200).json('updated successfully')
    }else{
      res.status(400).json('updation failed')
    }
  })

  module.exports={
    login,
    block,
    vendorBlock,
    addService,
    adminBookings,
    issueRefund
  }
