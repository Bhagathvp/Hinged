const mongoose = require('mongoose')

const serviceSchema = mongoose.Schema({
    category:{
        type: String,
        required: true
    },
    is_verified: {
        type: Number,
        default: 1,
        required: true
    }
})

module.exports=mongoose.model('service',serviceSchema)