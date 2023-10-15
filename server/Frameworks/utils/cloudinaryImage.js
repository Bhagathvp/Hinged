const cloudinary = require('cloudinary').v2;
require('dotenv').config()

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
  });

  const saveImage = async (imageBuffer) => {
    try{
        const response = await cloudinary.uploader.upload('data:image/jpeg;base64,' + imageBuffer.toString('base64'),{ resource_type: 'auto' });
        return response;
    }catch(error){
        console.log(error);
    }
  }

  module.exports = {
    saveImage
  }