const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    addressId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address'
    },
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        },
        quantity:{
            type:Number,
            required:true
        },
        size:{
            type:String,
            required:true
        },
    }],
    totalamount:{
        type:Number,
        required:true
    },
    paymentmethod:{
        type:String,
        required:true
    },
    status:{
        type:String,
       default:"Confirmed"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const order = mongoose.model('Order',orderSchema)

module.exports = order;