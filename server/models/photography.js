const mongoose = require('mongoose')

const photographySchema = mongoose.Schema({

    vendor_id:{
        type: mongoose.Types.ObjectId,
        ref: 'vendor',
        required: true,
    },
    category:{
        type: String,
        default: 'Photographer',
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    contact_name:{
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required : true
    },
    amount: {
        type: Number,
        required: true
    },
    offer: {
        type: Number,
    },
    base_city: {
        type: String,
        required : true
    },
    images:{
        type: Array
    },
    subscription: {
        type: Boolean,
        default: false,
    },
    reviews:[
        {
            name:{
                type: String
            },
            imageUrl: {
                type: String
            },
            comment: {
                type: String
            },
            createdAt: {
                type: Date,
                default: ()=>Date.now()
            }
            
        },
    ]
})

module.exports=mongoose.model('photographer',photographySchema)