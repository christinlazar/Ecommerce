const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

const banner = mongoose.model('Banner',bannerSchema)
module.exports=banner;