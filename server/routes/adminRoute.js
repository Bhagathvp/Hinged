const express = require('express')
const admin_route = express()
const adminController = require('../controllers/adminController')
const { jwtAuth } = require('../middleware/jwtAuth')

admin_route.post("/", adminController.login)

admin_route.use(jwtAuth)

admin_route.post("/block", adminController.block)

admin_route.post("/vendorBlock", adminController.vendorBlock)

admin_route.post('/addServices',adminController.addService)

admin_route.get('/adminBookings',adminController.adminBookings)

admin_route.put('/issueRefund',adminController.issueRefund)


module.exports = admin_route;