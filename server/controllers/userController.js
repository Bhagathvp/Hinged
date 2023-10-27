const User = require('../models/userModel')
const Photographers = require('../models/photography')
const Bookings = require('../models/bookings')

const crypto =require('node:crypto')
const {randomBytes} = require('node:crypto')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const Razorpay = require('razorpay')
require('dotenv').config();

const sendMail = require('../Frameworks/utils/sendMail')
const googleVerify = require('../Frameworks/utils/googleVerify')
const {saveImage} = require('../Frameworks/utils/cloudinaryImage')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    })
  }
 
let Otp;

//login
const loginUser = asyncHandler(async (req, res) => {
    const { email,name } = req.body
    Otp = Math.floor(100000 + Math.random() * 900000);
    console.log(Otp);
    const sent= await sendMail(email,Otp);

    if(sent){
      console.log("otp sent successfully!!");
      res.status(200).json({
        email,
        name
      })
    }
    
  })



//google login
const googleLogin = asyncHandler(async(req,res)=>{
  const {id,token} = req.body;

  const payload = await googleVerify(id,token)
 
  if(payload){

    const {email,name,picture} = payload
    // Check for user email
    const user = await User.findOne({ email })

    if(user){
      const imagePresent = await User.findOne({email, imageUrl: {$exists: true}})
      if(!imagePresent){
        console.log('image not present')
        await User.findOneAndUpdate({email},{$set:{imageUrl:picture}});
      }
      if(user.is_verified && user.is_user===1){

          res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            url: user.imageUrl,
            is_verified: user.is_verified,
            shortlist: user.shortlist,
            token: generateToken(user._id),
          })
        
      }else{
          res.status(400).json({err:'User Blocked by admin'})
          throw new Error('User Blocked by admin')
      }
    }else{
      const user = await User.create({
                name,
                email,
                imageUrl: picture,
            })

      if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            url: user.imageUrl,
            is_verified: user.is_verified,
            shortlist: user.shortlist,
            token: generateToken(user._id),
        })
      }else{
          res.status(400).json({err:'Account login failed'})
          throw new Error("Invalid user data")
      }
    }
  }else{
    res.status(500).json({err:'email verification failed'});
    throw new Error('email verification failed');
  }
})



//Otp Verification

const verifyOtp =asyncHandler(async(req,res)=>{
  const {email,userOtp,name} = req.body;

  if(Otp == userOtp){
    // Check for user email
    const user = await User.findOne({ email })

    if(user){
      if(user.is_verified && user.is_user===1){

        res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          url: user.imageUrl,
          is_verified: user.is_verified,
          shortlist: user.shortlist,
          token: generateToken(user._id),
        })
        
      }else{
          res.status(400).json({err:'User Blocked by admin'})
          throw new Error('User Blocked by admin')
      }
    }else{
      const user = await User.create({
                email,
                name,
            })

      if(user){
        res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          url: user.imageUrl,
          is_verified: user.is_verified,
          shortlist: user.shortlist,
          token: generateToken(user._id),
        })
      }else{
          res.status(400).json({err:'Account login failed'})
          throw new Error("Invalid user data")
      }

    }

  }else{
    res.status(400).json({err:'Incorrect Otp'})
    throw new Error('Otp Incorrect')
  }

})

//adding shortlist
const addShortlist = asyncHandler(async(req,res)=>{
  const {userId, serviceId} = req.body

  const user = await User.findOne({_id:userId})

  if(user){
    const shortlistExist = user.shortlist.filter((obj)=>{
      console.log(obj);
      if(obj.serviceId.toString() === serviceId.toString()){
        return obj
      }
    })

    if(shortlistExist.length==0){
      let shortlisted;
      if( await Photographers.findOne({_id:serviceId}) ){
        user.shortlist.push({
        serviceId,
        serviceType: 'photographer'
        })
        shortlisted=await user.save()
      }
      
      if(shortlisted){
        res.status(200).json('Successfully Added to Shortlist');
      }else{
        res.status(400).json('Not added to shortlist')
      }
    }else{
      res.status(200).json('Already Shortlisted')
    }
  }else{
    res.status(400).json('Invalid data provided')
    throw new Error('Invalid data provided')
  }
})

const userShortlists = asyncHandler(async(req,res)=>{
  const {id} = req.query;
  const user =await User.findOne({_id:id});
  if(user){
    const Shortlists = user.shortlist.map((obj)=>{
      return obj.serviceId
    });
    const shortlistArray = await Photographers.find({_id:{$in: Shortlists}})
    if(shortlistArray){
      res.status(200).json(shortlistArray);
    }
  }else{
    res.status(400).json('Invalid User Credential');
    throw new Error('Invalid User Credential');
  }
})

//removing shortlist
const removeShortlist = asyncHandler(async(req,res)=>{
  const {userId,id} = req.body;
  const user = await User.findOneAndUpdate({_id:userId},{$pull:{shortlist:{serviceId:id}}},{new:true})
  if(user){
    res.status(200).json('removed successfully')
  }else{
    res.status(400).json('unable to remove')
    throw new Error('Unable to remove')
  }
})

//get bookings
const userBookings = asyncHandler(async(req,res)=>{
  const {id} = req.query
  const bookings =await Bookings.find({userId:id,completed: true});
  if(bookings.length!=0){

    res.status(200).json(bookings);
  }else{
    res.status(400).json('No bookings found');
    throw new Error('No booking found');
  }
})

//capture payment

const makeOrder =async(req,res)=>{
  try {
    const {id,userId,startDate} = req.body;

    
    const userDetails = await User.findOne({_id:userId});
    

    if(userDetails.is_verified===0){
      console.log("user blocked")
      return res.status(400).json({message:"user blocked by admin"})
    } 
    
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		})

    const photographer = await Photographers.findOne({_id:id});

    let amount = photographer?.amount;
    if(photographer?.offer){
      amount = photographer.amount-(photographer.amount*photographer.offer/100)
    }

		const options = {
			amount: amount * 100,
			currency: "INR",
			receipt: randomBytes(12).toString("hex"),
		};  

		instance.orders.create(options, async(error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
      console.log(order);
      const bookings = await Bookings.create({
        userId : userId,
        vendorId: photographer.vendor_id,
        serviceId: id,
        payment:(order.amount)/100,
        bookingFor:startDate,
        paymentDetails:{
          receipt: order.receipt,
          orderId: order.id,
          status: order.status,
          createdAt: order.created_at
        }
      })
      if(bookings){
        res.status(201).json({ data: order ,name:photographer.brand,image: photographer.images[0]});
      }
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
	}
}

//verifying order

const verifyOrder = async(req,res)=>{
  try {
    const {response,receipt} = req.body;
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
      const bookingComplete = 
        await Bookings.findOneAndUpdate({'paymentDetails.receipt':receipt},{$set:{completed: true, status: 'paid'}},{new:true});
      if(bookingComplete){
        return res.status(200).json({ message: "Payment verified and completed successfully", id:bookingComplete.serviceId });
      }
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
	}
}


//user refund
const userRefund = asyncHandler(async(req,res)=>{
  const {id} = req.body;
  const updatedBooking = await Bookings.findOneAndUpdate({_id:id},{$set:{status:"issue"}})
  if(updatedBooking){
    res.status(200).json("refund initiated")
  }else{
    res.status(400).json("refund not initiated")
  }
})


//edit profile
const editProfile = asyncHandler(async( req,res)=>{
    const {id,name} = req.body;
    const user = await User.findOne({_id:id })

    if(user.is_verified && user.is_user===1){
      if (user) {
        const userUpdated = await User.findOneAndUpdate({_id:id },
              {$set:{name}},
              {new:true}
              )
        if(userUpdated){
          res.status(200).json({
            _id: userUpdated.id,
            name: userUpdated.name,
            email: userUpdated.email,
            url: userUpdated.imageUrl,
            is_verified: userUpdated.is_verified,
            shortlist: user.shortlist,
            token: generateToken(userUpdated._id),
          })
        }else{
          res.status(400).json('updation failed')
          throw new Error('update failed');
        }
      } else {
        res.status(400).json('user not found')
        throw new Error('Invalid credentials')
      }
    }else{
        res.status(400).json('user actions blocked by admin')
        throw new Error('User Blocked by admin')
    }

})

//edit profile picture
const editProPic = asyncHandler(async(req,res)=>{
  
  const {id} = req.body;
  const cloudImg= await saveImage(req.file?.buffer)
  console.log(cloudImg)
  const updateUser = await User.findOneAndUpdate({_id:id},
    {$set:{
      imageUrl: cloudImg?.secure_url
    }},
    {new:true}
  )
  if(updateUser){
    res.status(200).json({
      _id: updateUser.id,
      name: updateUser.name,
      email: updateUser.email,
      url: updateUser.imageUrl,
      is_verified: updateUser.is_verified,
      shortlist: updateUser.shortlist,
      token: generateToken(updateUser._id),
    })
  }else{
    res.status(400).json('Profile pic updation failed')
  }

})


module.exports = {
    loginUser,
    googleLogin,
    verifyOtp,
    addShortlist,
    userShortlists,
    removeShortlist,
    userBookings,
    makeOrder,
    verifyOrder,
    userRefund,
    editProfile,
    editProPic
}