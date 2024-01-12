
const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    house:{
        type:String,
        required:true,
    },
    landmark:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    phone:{
       type:String,
       required:true 
    },
    email:{
        type:String,
        required:true
    },
    
})

const address = mongoose.model('Address',addressSchema)
module.exports = address;