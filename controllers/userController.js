const User = require('../models/userModel')
const Product = require('../models/productModel')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"christinlazar19@gmail.com",
        pass:"ogbe esyu loap nomr",
    }
});

// let users = {}

const createUser = async(udata)=>{

   return await User.create(udata)
   
}

const postRegister = async(req,res)=>{
    try{
         const udata = req.body
         req.session.udata = udata
       const{name,email,phone,password,confirm_password} = req.body
       req.session.email = email
       
         const user = await User.findOne({email:email})
         if(user){
           res.render('registration',{exists:"This user already exists"})
         }else{
            console.log(password,confirm_password)
            if(password==confirm_password){

                console.log("im inside")
                const otp = Math.floor(100000 + Math.random()* 900000)

                const globalOtp = otp;
                req.session.globalOtp = globalOtp
                req.session.timer = Date.now()
                const mailOptions = {
                    from:"christinlazar19@gmail.com",
                    to:email, 
                    subject:'otp has been send',
                    text:`New otp is ${otp}`
                }
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                    console.log(error)
                    }
                     const otpExpiration = Date.now() + 60*1000
                     req.session.otpExpiration = otpExpiration
                    res.redirect('/verifyotp')
                })
              }else{
                res.render('registration',{message:"passwords must be matching"})
              }
         }
    }catch(error){
        console.log(error)
    }
}


const verifyOtp = async(req,res) =>{
        try {
            const otpExpiration = req.session.otpExpiration
            const emails = req.session.email
            res.render('verifyotp',{email:emails,otpExpiration:otpExpiration})

        } catch (error) {
      console.log(error)            
        }
    }


  const verifiedOtp = async(req,res)=>{
    try {
        const timer = req.session.timer;
        const tim   = Date.now()

        if(tim-timer >60000){
            console.log("set")
           
            res.render('registration',{error:"Otp expired, Please try again!"})
        }else{
            const userotp = req.body.otp
            const globalOtp = req.session.globalOtp
            console.log(userotp,globalOtp)

        if(userotp==globalOtp){
           const udata =  req.session.udata
            console.log("gonna check pwd")
            createUser(udata);

            res.redirect('/')
        } else{
            res.render('registration',{error:"Wrong Otp, Please try again!"})    
        }
           
    } 
        
    // try again

    } catch (error) {
console.log(error)
        
    }
  }  
  
const loadLogin = async(req,res)=>{
    try {
            res.render('login')

    } catch (error) {
  console.log(error)        
    }
}
const loadRegister = async(req,res)=>{
    try {
        res.render('registration' )
    } catch (error) {
        console.log(error)
    }
}
const userLogin = async(req,res)=>{
    try {
    const useremail = req.body.email
    const password = req.body.password
    const id = req.body._id
  
    const userData = await User.findOne({email:useremail,password:password})

    if(userData){
        if(password==userData.password){
            req.session.user = userData._id
            res.redirect('/home')
        }else{
            res.render('login',{passError:"Email and password doesnt matches"})
        }
    }else{
        res.render('login',{passError:"Email and password doesnt matches"})
    }
    }catch (error) {
        console.log(error)
    }
}
const loadHome = async(req,res)=>{
    try{
        const products = await Product.find({is_active:true})
            res.render('home.ejs',{products})

    }catch(error){
        console.log(error)
    }
}
const loadSingleProductView = async(req,res)=>{
    try {
        const id = req.query.id
        const totalQuantity = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalS: { $sum: "$size.s.quantity" },
                    totalM: { $sum: "$size.m.quantity" },
                    totalL: { $sum: "$size.l.quantity" }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: { $sum: ["$totalS", "$totalM", "$totalL"] }
                }
            }
        ]);
        const product = await Product.findById(id)
        res.render('singleproduct',{product,totalQuantity})
    } catch (error) {
   console.log(error)     
    }
}
const logOut = async(req,res)=>{
    try {
      req.session.destroy() 
      res.redirect('/') 
    } catch (error) {
     console.log(error)   
    }
}

module.exports = {
    loadRegister,
    postRegister,
    verifyOtp,
    verifiedOtp,
    loadLogin,
    userLogin,
    loadHome,
    loadSingleProductView,
    logOut,
}