const mongoose = require('mongoose')


const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    is_admin:{
        type:Boolean,
        default:true
    }
   
})

const admin = mongoose.model('Admin',adminSchema)
module.exports = admin;