

const Coupon = require('../models/couponModel')
const cart = require('../models/cartModel')
const address = require('../models/addressModel')
const moment = require('moment')

const addCoupon = async(req,res)=>{
    try {
        const couponDetails = await Coupon.find({})
        const {name,purchase,code,discount,mindiscount,expirationDate} = req.body
        const existingCoupon = await Coupon.findOne({code:code})
            if(existingCoupon){
                res.render('coupon',{couponExists:"A coupon with this code already exists",couponDetails })
            }
            else{
                const coupon = new Coupon({
                    name:name,
                    code:code,
                    discount:discount,
                    minDiscount:mindiscount,
                    expirationDate:expirationDate,
                    minimumPurchase:purchase,
                })
                const savedCoupon = await coupon.save()
                console.log(savedCoupon)
                res.redirect('/admin/coupon')
            }
    } catch (error) {
        console.log(error)
    }
}
const holdCoupon = async(req,res)=>{
    try {
      
        const couponId = req.body.couponId
        const findedCoupon = await Coupon.findOneAndUpdate({_id:couponId},{$set:{is_active:false}})
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error)
    }
}
const unHoldCoupon = async(req,res)=>{
    try {
      
        const couponId = req.body.couponId
        const findedCoupon = await Coupon.findOneAndUpdate({_id:couponId},{$set:{is_active:true}})
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error)
    }
}
const applyCoupon = async(req,res)=>{
    try {

        const userId = req.session.user
        const couponCode = req.body.coupon
        const total = parseInt(req.body.total)
      
        const couponWithThisCode = await Coupon.findOne({code:couponCode}) 
        cartOfUser = await cart.findOne({userId:userId}).populate('products.productId')
        addressOfUser = await address.find({userId:userId})
        const coupon = await Coupon.find({is_active:true})

        

        const minpurchase = parseInt(couponWithThisCode.minimumPurchase)
        const maxdiscountPercentage = parseInt(couponWithThisCode.discount) 
        const mindiscountPercentage =  parseInt(couponWithThisCode.minDiscount) 
        const discountPercentage = Math.floor(Math.random() * (maxdiscountPercentage - mindiscountPercentage + 1)) + mindiscountPercentage;
        const discountAmount = minpurchase * (discountPercentage/100)
        console.log(discountAmount);

        if(couponWithThisCode){
        const timeStamp = Date.now()
        const dateToFormat = moment(timeStamp)
        const expiryDate = couponWithThisCode.expirationDate
        const expiryDateToFormat = moment(expiryDate)
        const expirationDate = expiryDateToFormat.format('YYYY-MM-DD HH:mm:ss')
        const currentDate = dateToFormat.format('YYYY-MM-DD HH:mm:ss');

          
            if(couponWithThisCode.users.includes(userId)){
                res.render('checkout',{used:"This coupon has already been used",cartOfUser,addressOfUser,coupon})
                }else if(currentDate >= expirationDate ){
                    res.render('checkout',{expired:"coupon has been expired",cartOfUser,addressOfUser,coupon})
                }else if(total>=minpurchase){
                       const newTotal =  total-discountAmount
                       couponWithThisCode.users.push(userId)
                       await couponWithThisCode.save()
                       res.render('checkout',{applied:"Coupon has been applied",newTotal,cartOfUser,addressOfUser,coupon})
                }else{
                        res.render('checkout',{minpurchase:`Minimum purchase Amount is ${minpurchase}`,cartOfUser,addressOfUser,coupon})
                }
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    addCoupon,
    holdCoupon,
    unHoldCoupon,
    applyCoupon
}