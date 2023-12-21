
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
    },
    is_active:{
        type:Boolean,
        default:true,
    }
})
const user = mongoose.model('User',userSchema)
module.exports = user;

