const express = require('express')
const servicesRoute = express()
const serviceController = require('../controllers/servicesController')
const { jwtAuth } = require('../middleware/jwtAuth')

servicesRoute.use(jwtAuth)

servicesRoute.post("/getServices", serviceController.getServices)


module.exports = servicesRoute;