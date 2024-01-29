
const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    name:{
        type:String,
        requiured:true
    },
    code:{
        type:String,
        requiured:true
    },
    discount:{
        type:Number,
        required:true
    },
    expirationDate:{
        type:Date,
        required:true
    },
    minimumPurchase:{
        type:Number,
        required:true
    },
    users:{
        type:Array,
        default:[]
    },
    is_active:{
        type:Boolean,
        default:true
    }
})
const Coupon = mongoose.model('Coupon',couponSchema)
module.exports = Coupon;