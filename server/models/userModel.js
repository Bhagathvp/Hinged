const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        default: 'user',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    is_user: {
        type: Number,
        default: 1,
        required: true
    },
    is_verified: {
        type: Number,
        default: 1,
        required: true
    },
    imageUrl: {
        type: String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbBEzSEpERLmcHGnkp_Gdimsc_a_e_VD2tZWmYsvUvSQ&s',
        required: true
    },
    shortlist:[
        {
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: "serviceType",
                required: true
            },
            serviceType: {
                type: String,
                enum: ["photographer","venues"], // Define the possible service types
              },

        }
    ]

})

module.exports = mongoose.model('user', userSchema)