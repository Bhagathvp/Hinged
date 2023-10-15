const express = require('express')
const userRoute = express()
const userController = require("../controllers/userController")
const { jwtAuth } = require('../middleware/jwtAuth')
const { jwtUser } = require('../middleware/jwtUser')
const multer = require('../middleware/multer')


userRoute.post('/login',userController.loginUser)

userRoute.post('/glogin',userController.googleLogin)

userRoute.post('/verifyOtp', userController.verifyOtp)

userRoute.use(jwtUser)

userRoute.post('/editUserProfile', userController.editProfile)

userRoute.post('/editProPic',multer.upload.single('image'), userController.editProPic)

userRoute.put('/addShortlist', userController.addShortlist)

userRoute.get('/userShortlists', userController.userShortlists)

userRoute.put('/removeShortlist', userController.removeShortlist)

userRoute.get('/userBookings', userController.userBookings)

userRoute.put('/userRefund', userController.userRefund);

userRoute.post('/orders', userController.makeOrder)

userRoute.post('/verify', userController.verifyOrder)


module.exports = userRoute;