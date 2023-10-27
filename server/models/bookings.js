const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(

{
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    vendorId: {
        type: mongoose.Types.ObjectId,
        ref: 'vendor',
        required: true
    },
    serviceId :{
        type: mongoose.Types.ObjectId,
        ref: 'photographer',
        required: true
    },
    payment : {
        type: Number,
        requierd: true
    },
    bookingFor :{
        type: Date,
        default: ()=> Date.now()
    },
    paymentDetails: {
        receipt: {
          type: String,
        },
        orderId:{
            type: String,
        },
        status: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: ()=> Date.now()
        }
    },
    status:{
        type: String,
        default:"payment initiated"
    },
    completed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model("Bookings", bookingSchema)