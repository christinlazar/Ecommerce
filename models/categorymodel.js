const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    }, 
    parent:{
        type:String,
        required:true
    },
    categoryDiscount:{
        type:Number,
        default:0
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    createdAt:{
        type:Date,
        default:()=>Date.now()
    },
    description:{
        type:String,
        required:true
    }
})
const category = mongoose.model('category',categorySchema)
module.exports = category;