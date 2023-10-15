const mongoose = require('mongoose')

const vendorSchema = mongoose.Schema({
    brand_name: {
        type: String,
        default: 'user',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    is_vendor: {
        type: Number,
        default: 1,
        required: true
    },
    is_verified: {
        type: Number,
        default: 1,
        required: true
    },
    subscription: {
        type: Boolean,
        default: false,
        required: true
    },
    base_city:{
        type: String,
        required: true
    },
    contact_name:{
        type: String,
    },
    website:{
        type: String
    },
    facebook:{
        type: String
    },
    insta:{
        type: String
    },
    youtube:{
        type: String
    },
    address:{
        type: String
    }
    
})

module.exports = mongoose.model('vendor', vendorSchema)