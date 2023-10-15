const Vendor = require('../models/vendorModel')
const User = require('../models/userModel')
const Services = require('../models/services')
const Bookings = require('../models/bookings')
const Subscriptions = require('../models/subscriptions')
const Photographer = require('../models/photography')

const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const Razorpay = require('razorpay')
const {randomBytes} = require('node:crypto')
const crypto =require('node:crypto')


require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    })
  }

//register
const register= asyncHandler(async(req,res)=>{
    const {name,email,password,mobile, city} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please add all the fields')
    }

    //check if user exists
    let userExists = await User.findOne({email});
    if(userExists){
        res.status(401).json({message:'Email already in use'})
        throw new Error('Insufficient credentials')
    }
    userExists = await Vendor.findOne({email})
    const userExist = await Vendor.findOne({mobile})
    if(userExists || userExist){
        res.status(400).json({message:'Email or Mobile  already registered'})
        throw new Error('vendor already exists')
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password,10);

    const vendor = await Vendor.create({
        brand_name: name,
        email,
        password: hashedPassword,
        mobile,
        base_city: city
    })

    if(vendor){
        res.status(201).json({
            _id: vendor.id,
            brand_name: vendor.brand_name,
            email: vendor.email,
            mobile: vendor.mobile,
            base_city: vendor.base_city,
            is_verified: vendor.is_verified,
            token: generateToken(vendor._id),
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }

})

//login
const login = asyncHandler(async (req, res) => {
    const { input,password } = req.body;

    let user = await Vendor.findOne({email:input})
    if(!user){
        user = await Vendor.findOne({mobile:input})
    }
    
    if(user){
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(passwordMatch){
            const subs = await Subscriptions.findOne({vendorId: user._id})
            if(subs){
                if(subs.paymentDetails.expiry_by < Date.now()){
                    user = await Vendor.findOneAndUpdate({_id:user._id},{$set:{subscription: false}},{new:true}); 
                    await Photographer.findOneAndUpdate({vendor_id:user._id},{$set:{subscription: false}},{new:true});
                }
            }
            res.status(200).json({
                _id: user.id,
                brand_name: user.brand_name,
                contact_name: user.contact_name,
                facebook: user.facebook,
                insta: user.insta,
                youtube: user.youtube,
                website: user.website,
                address: user.address,
                email: user.email,
                mobile: user.mobile,
                base_city: user.base_city,
                subscription: user.subscription,
                is_verified: user.is_verified,
                token: generateToken(user._id),
              })
        }else{
            res.status(400).json({message: 'Password incorrect'});
            throw new Error('Password incorrect');
        }
    }else{
        res.status(400).json({message: 'user not found'})
        throw new Error('User not found')
    }
    
  })

//vendor profile
const vendorProfile = asyncHandler(async(req,res)=>{
    const { email,brand_name,city,contact_name,mobile,website,fb,insta,youtube,address } = req.body;

    let vendor = await Vendor.findOne({email});
    console.log(vendor);
    if(!vendor){
        vendor = await Vendor.findOne({mobile});
    }
    if(vendor){
        const vendorUpdated = await Vendor.findOneAndUpdate({email},{$set:{brand_name,base_city:city,contact_name,website,facebook:fb,insta,youtube,address}},{new:true});
        if(vendorUpdated){
            res.status(200).json({
                _id: vendorUpdated._id,
                brand_name: vendorUpdated.brand_name,
                contact_name: vendorUpdated.contact_name,
                facebook: vendorUpdated.facebook,
                insta: vendorUpdated.insta,
                youtube: vendorUpdated.youtube,
                website: vendorUpdated.website,
                address: vendorUpdated.address,
                email: vendorUpdated.email,
                mobile: vendorUpdated.mobile,
                base_city: vendorUpdated.base_city,
                is_verified: vendorUpdated.is_verified,
                token: generateToken(vendorUpdated._id),
              })
        }else{
            res.status(400).json({message: 'updation unsuccessful'})
            throw new Error('updation unsuccessful')
        }
    }else{
        res.status(400).json({message: 'vendor not found'})
        throw new Error('vendor not found')
    }
})

//get bookings
const vendorBookings = asyncHandler(async(req,res)=>{
    const {id} = req.query;
    const bookings =await Bookings.find({vendorId:id});
    if(bookings.length!=0){
      res.status(200).json(bookings);
    }else{
      res.status(400).json('Invalid vendor Credential');
      throw new Error('Invalid User Credential');
    }
  })

//get user details
const getUserDetails = asyncHandler(async(req,res)=>{
    const {id} = req.query;
    const user = await User.findOne({_id:id})
    if(user){
        res.status(200).json(user)
    }else{
        res.status(400).json('user not found')
    }
})


//vendor refund
const vendorRefund = asyncHandler(async(req,res)=>{
    const {id} = req.body;
    const updatedBooking = await Bookings.findOneAndUpdate({_id:id},{$set:{status:"issue"}})
    if(updatedBooking){
      res.status(200).json("refund initiated")
    }else{
      res.status(400).json("refund not initiated")
    }
  })
  
  //subscription adding
  const addSubscription = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.body;

        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });

        const vendor = await Vendor.findOne({_id:id})

        const plan_id = process.env.PLAN_ID;

        const subscription = await instance.subscriptions.create({
            plan_id: plan_id,
            total_count: 100,
            customer_notify: 1,
            expire_by: Math.floor((new Date().setMonth(new Date().getMonth() + 6)) / 1000),
        }) 

        if(subscription){
            let subscribed = await Subscriptions.findOne({vendorId: id})
            if(!subscribed){
                subscribed = await Subscriptions.create({
                    vendorId: id,
                    paymentDetails:{
                        subscriptionId: subscription.id,
                        status: subscription.status,
                    }
                })
            }else{
                subscribed.paymentDetails.subscriptionId = subscription.id;
                subscribed.paymentDetails.status = subscription.status;
                await subscribed.save();
            }
             
            if(subscribed) res.status(201).json({ 
                id: subscription.id ,
                name:vendor.brand_name ,
                email:vendor.email, 
                mobile:vendor.mobile 
            });
        }else{
             res.status(500).json({ message: "Something Went Wrong!" });
        }
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
    }
  })


  const verifySubscription = async(req,res)=>{
    try {
      const {response,id} = req.body;
          const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = response;
            const subs = await Subscriptions.findOne({'paymentDetails.subscriptionId': razorpay_subscription_id})
            const subscription_id = subs.paymentDetails.subscriptionId;

          const sign = razorpay_payment_id + "|" + subscription_id;

          const expectedSign = await crypto
              .createHmac("sha256", process.env.KEY_SECRET)
              .update(sign,"utf-8")
              .digest("hex");

          if (razorpay_signature === expectedSign) {

            subs.completed = true;
            await subs.save();
            const subComplete = await Vendor.findOneAndUpdate({_id:id},{$set:{subscription: true}},{new:true});
            const Complete = await Photographer.findOneAndUpdate({vendor_id:id},{$set:{subscription: true}},{new:true});

            if(subComplete){
                return res.status(200).json({
                    _id: subComplete.id,
                    brand_name: subComplete.brand_name,
                    contact_name: subComplete.contact_name,
                    facebook: subComplete.facebook,
                    insta: subComplete.insta,
                    youtube: subComplete.youtube,
                    website: subComplete.website,
                    address: subComplete.address,
                    email: subComplete.email,
                    mobile: subComplete.mobile,
                    base_city: subComplete.base_city,
                    subscription: subComplete.subscription,
                    is_verified: subComplete.is_verified,
                    token: generateToken(subComplete._id),              
                } );
            }
          } else {
              return res.status(400).json({ message: "Invalid signature sent!" });
          }
      } catch (error) {
          res.status(500).json({ message: "Internal Server Error!" });
          console.log(error);
      }
  }



module.exports = {
    register,
    login,
    vendorProfile,
    vendorBookings,
    getUserDetails,
    vendorRefund,
    addSubscription,
    verifySubscription,
}