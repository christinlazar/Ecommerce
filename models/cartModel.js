const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        },
        size:{
            type:String
        },
        quantity:{
            type:Number
        }
}]
})

const cart = mongoose.model('Cart',cartSchema)
module.exports = cart