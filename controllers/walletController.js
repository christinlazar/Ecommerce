const address = require("../models/addressModel");
const Order = require("../models/orderModel");
const myCart = require("../models/cartModel");
const Product = require("../models/productModel");
const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Razorpay = require("razorpay");

const { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } = process.env;

var razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET_KEY,
});


const createOrderToAdd = async (req,res)=>{
    try {
      
    const amount = parseInt(req.body.amount);
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: req.session.user,
    });
    console.log("order is"+order);
    res.json({ orderId: order });
    } catch (error) {
        console.log(error)
    }
}


const paymentSuccess = async (req, res) => {
    try {
       
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        orderid,
      } = req.body;
      const secret = process.env.RAZORPAY_SECRET_KEY;
      const { createHmac } = require("node:crypto");
      const hash = createHmac("sha256", secret)
        .update(orderid + "|" + razorpay_payment_id)
        .digest("hex");
      console.log(hash);
      console.log(razorpay_signature);
      if (hash == razorpay_signature) {
       
        // Payment successful, process the order
        // Update database, send emails, redirect to success page
        res.json({ message: "Payment successful" });
      } else {
       
  
        res.status(400).json({ errmessage: "Invalid signature" });
      }
    } catch (error) {
      console.log(error);
    }
  };

const walletTopUp = async(req,res)=>{
    try {
        const today = new Date()
        const userId = req.session.user
        const{amount} = req.body
        const walletAfterAddingMoney = await Wallet.findOneAndUpdate({userId:userId},{$inc:{balance:amount}})
        const walletAfterSetHistory = await Wallet.findOneAndUpdate({userId:userId},{$push:{walletdata:{history:+amount,date:today,paymentmethod:"wallet-topup"}}})
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    createOrderToAdd,
    paymentSuccess,
    walletTopUp
}