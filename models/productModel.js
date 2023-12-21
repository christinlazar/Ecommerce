const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    is_active:{
        type:Boolean,
        default:true
    },
    price:{
       saleprice:{type:Number,required:true},
       regularprice:{type:Number,required:true}
    },
    image:{
        type:Array,
        required:true
    },
    added_at:{
        type:Date,
        default:()=>Date.now()
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    size:{
        s:{
            quantity:{
                type:Number,
                required:true,
            }  
        },
        m:{
            quantity:{
                type:Number,
                required:true,
            }  
        },
        l:{
            quantity:{
                type:Number,
                required:true,
            }  
        }

}})

const product = mongoose.model('product',productSchema)
module.exports = product