const express = require('express')
const photographerRoute = express()
const photographerController = require('../controllers/photographerController')
const { jwtAuth } = require('../middleware/jwtAuth')
const multer = require('../middleware/multer')


photographerRoute.get('/getAllPhotographers', photographerController.getAllPhotographers)

photographerRoute.get('/getPhotoProfile', photographerController.getPhotoProfile)

photographerRoute.get('/searchPhoto', photographerController.searchPhotographers)

photographerRoute.use(jwtAuth)

photographerRoute.post('/getPhotographers',photographerController.getPhotographers)

photographerRoute.post("/addPhotographer",photographerController.addPhotographer)

photographerRoute.post("/editPhotographer",multer.upload.single('image'), photographerController.editPhotographer)

photographerRoute.get('/bookedPhotographers',photographerController.bookedPhotographers)

photographerRoute.put('/addReview', photographerController.addReview)

photographerRoute.put('/addOffer', photographerController.addOffer)

photographerRoute.put('/clearOffer', photographerController.clearOffer)


module.exports = photographerRoute;