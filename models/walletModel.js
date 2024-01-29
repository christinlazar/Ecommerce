const mongoose = require('mongoose')

const walletSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    balance:{
        type:Number,
        default:0
    }
})

const Wallet = mongoose.model('wallet',walletSchema)

module.exports = Wallet;