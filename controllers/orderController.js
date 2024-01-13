
const address = require('../models/addressModel')
const Order = require('../models/orderModel')
const myCart = require('../models/cartModel')
const Product = require('../models/productModel')

const placeOrder = async(req,res)=>{
    try {
        const userId = req.session.user
        const cartId = req.body.cartId
        const addressId = req.body.radiovalue
        const paymentMethod = req.body.paymentMethod
        req.session.payment = paymentMethod
        const totalprice = parseInt(req.body.totalprice,10)

        
       
        const cart = await myCart.findOne({_id:cartId})
       const productId = cart.products.map(element=>{
       let prodata = {
        product: element.productId,
        quantity:element.quantity,
        size:element.size
       } 
       return prodata;
    })
    console.log("getting here")
       console.log(productId)
        const myOrder = new Order({
            userId:userId,
            addressId:addressId,
            products:productId,
            totalamount:totalprice,
            paymentmethod:paymentMethod
        })
       
         const mineOrder = await myOrder.save();
      let productDetArray = []
      
       console.log(mineOrder)
       mineOrder.products.forEach(element => {
            let pdata = {
            product_id:element.product,
            qty:element.quantity,
            size:element.size
            }
            productDetArray.push(pdata)
       });
       productDetArray.forEach(async (el)=>{
        await Product.findByIdAndUpdate({_id:el.product_id},{$inc:{[`size.${el.size}.quantity`]:-el.qty}})
       })
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error.message)
    }
}
const placeSuccess = async(req,res)=>{
    try {
         const paymentMethod = req.session.payment
        const userId = req.session.user
        await myCart.findOneAndDelete({userId:userId})
        if(paymentMethod == "COD"){
            res.render('orderplaced',{placed:"Cash On Delivery"})
        }
  
    } catch (error) {
        console.log(error.messsage)
    }
}
const loadOrderSummary = async(req,res)=>{
    try {
        const orderId = req.query.id
        const orderDetails = await Order.findById(orderId).populate('products.product') 
        console.log(orderDetails)
        res.render('ordersummary',{orderDetails})
    } catch (error) {
        console.log(error.messsage)
    }
}
const removeSinglePr = async(req,res)=>{
    try {
        const userId = req.session.user
        const producttoremove = req.body.productId
        const orderId = req.body.orderId
        const size = req.body.size
        const singleOrderDetails = await Order.findOneAndUpdate({_id:orderId},{$pull:{products:{product:producttoremove,size:size}}},{new:true,populate:'products.product'})
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error.message)
    }
}
const removeOrder = async(req,res)=>{
    try {
        const product = req.body.productId
        const order = req.body.orderId
        await Order.findByIdAndUpdate({_id:order},{$set:{status:"cancelled",totalamount:0}})
       const myOrder = await Order.findById(order)
       console.log("myorder is :"+myOrder)
      let remOrderArray = []
      myOrder.products.forEach(element =>{
        let remdata = {
            product_id:element.product,
            qty:element.quantity,
            size:element.size
        }
        remOrderArray.push(remdata)
      })
      console.log("remorderis"+remOrderArray)
      remOrderArray.forEach(async(el)=>{
        console.log(el)
        await Product.findByIdAndUpdate({_id:el.product_id},{$inc:{[`size.${el.size}.quantity`]:el.qty}})
      })
      res.status(200).json({success:true})
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    placeOrder,
    placeSuccess,
    loadOrderSummary,
    removeSinglePr,
    removeOrder
}