const express = require('express')
const vendorRoute = express()
const vendorController = require('../controllers/vendorController')
const { jwtAuth } = require('../middleware/jwtAuth')


vendorRoute.post("/business-register", vendorController.register)

vendorRoute.post("/business-login", vendorController.login)

vendorRoute.use(jwtAuth)

vendorRoute.post("/vendorProfile", vendorController.vendorProfile)

vendorRoute.get('/vendorBookings', vendorController.vendorBookings)

vendorRoute.get('/getUserDetails', vendorController.getUserDetails)

vendorRoute.put('/vendorRefund', vendorController.vendorRefund);

vendorRoute.post('/addSubscription', vendorController.addSubscription);

vendorRoute.post('/verifySubscription', vendorController.verifySubscription);


module.exports = vendorRoute;