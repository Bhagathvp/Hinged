const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema(

{
    vendorId: {
        type: mongoose.Types.ObjectId,
        ref: 'vendor',
        required: true
    },
    paymentDetails: {
        
        subscriptionId:{
            type: String,
        },
        status: {
          type: String,
        },
        created_at: {
          type: Date,
          default: ()=> Date.now(),
        },
        expiry_by: {
            type: Date,
            default: ()=> Date.now() + (6 * 30 * 24 * 60 * 60 * 1000),
        }
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

module.exports = mongoose.model("Subscription", subscriptionSchema)