const User = require('../models/userModel')
const Product = require('../models/productModel')
const myCart = require('../models/cartModel')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
require('dotenv').config();
const Category = require('../models/categorymodel');
const category = require('../models/categorymodel');
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
        console.log("getting inside post")
       const{name,email,phone,password,confirm_password} = req.body
       req.session.email = email
       req.session.phone = phone
       const hashed = await bcrypt.hash(password,10)
       console.log(hashed)
       const udata = {
        name,
        email,
        phone,
        password:hashed,
        confirm_password
       }
       req.session.udata = udata
         const user = await User.findOne({$or:[{email:email},{phone:phone}]})
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
            const email = req.session.email
            res.render('verifyotp',{email:email,otpExpiration:otpExpiration})

        } catch (error) {
      console.log(error)            
        }
    }


//   const verifiedOtp = async(req,res)=>{
//     try {
//         const timer = req.session.timer;
//         const tim   = Date.now()

//         if(tim-timer >60000){
//             console.log("set")
           
//             res.render('registration',{error:"Otp expired, Please try again!"})
//         }else{
//             const userotp = req.body.otp
//             const globalOtp = req.session.globalOtp
//             console.log(userotp,globalOtp)

//         if(userotp==globalOtp){
//            const udata =  req.session.udata
//             console.log("gonna check pwd")
//             createUser(udata);

//             res.redirect('/')
//         } else{
//             res.render('registration',{error:"Wrong Otp, Please try again!"})    
//         }
           
//     } 
        
//     // try again

//     } catch (error) {
// console.log(error)
        
//     }
//   }  
//   const verifiedOtp = async (req, res) => {
//     try {
//         const timer = req.session.timer;
//         const currentTime = Date.now();

//         if (currentTime - timer > 60000) {
//             console.log("set");
//             res.render('verifyotp', { error: "Otp expired, Please try again!" });
//         } else {
//             const userOtp = req.body.otp;
//             const globalOtp = req.session.globalOtp;
//             console.log(userOtp, globalOtp);

//             if (userOtp === globalOtp) {
//                 const udata = req.session.udata;
//                 console.log("Correct OTP, registering user");
//                 createUser(udata);
//                 req.session.otpAttempts = 0;  // Reset attempts
//                 res.redirect('/');
//             } else {
//                 const attempts = (req.session.otpAttempts || 0) + 1;
//                 req.session.otpAttempts = attempts;

//                 res.render('verifyotp', {
//                     error: `Wrong OTP. ${3 - attempts} attempts remaining.`,
//                     remainingAttempts: 3 - attempts,
//                     email: req.session.email, // You may want to include other necessary data
//                     otpExpiration: req.session.otpExpiration
//                 });
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// };

const verifiedOtp = async(req,res)=>{
    try {
        
        const currentTime = Date.now()
        const timer = req.session.timer
        if(currentTime-timer>60000){
            res.render('registration',{message:"OTP has been timed out"})
        }else{
           const  otp = req.body.otp
           const globalOtp = req.session.globalOtp
           if(otp==globalOtp){
            const userData = req.session.udata
            createUser(userData)
            req.session.uData = userData
    
            res.redirect('/login')
           }else{
            const email = req.session.email
            const otpExpiration = req.session.otpExpiration
            res.render('verifyotp',{email:email,otpExpiration:otpExpiration})
           }
        }

    }catch(error){
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
const userLogin = async (req, res) => {
    try {
        console.log("enterning userlogin")
        const useremail = req.body.email;
        const password = req.body.password;
    console.log(useremail,password)
        const userData = await User.findOne({ email: useremail });

        if (userData) {
            const hashed = userData.password
            const isverified = await bcrypt.compare(password,hashed)
            if(isverified){
                if (userData.is_active === false) {
                    res.render('login', { blockmessage: "You are blocked" });
                }
                else{
                    req.session.user = userData._id;
                    res.redirect('/home');   
                }
                
            }else{
                res.render('login', { passError: "Email and password don't match" });
            }
        } else {
             res.render('login', { passError: "Email and password don't match" });
        }
    } catch (error) {
        console.log(error);
         res.status(500).send("Internal Server Error");
    }
};

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
        const relatedproducts = await Product.find({category:product.category})
        // console.log(relatedproducts)
        res.render('singleproduct',{product,totalQuantity,relatedproducts})

    } catch (error) {
   console.log(error)     
    }
}
const logOut = async(req,res)=>{
    try {
      req.session.destroy() 
      res.redirect('/login') 
    } catch (error) {
     console.log(error)   
    }
}

let lastOtpGeneration=0
const resendOtp = async(req,res)=>{
    try {
       const  currentTime = Date.now();
       const timeDiff = (currentTime-lastOtpGeneration/1000)
       if(timeDiff<60){
        res.send(400).json({message:"please wait before resending"})
       }
       const otp = Math.floor(100000 + Math.random()* 900000)

       const email = req.body.email
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
           res.status(200).json({message:"resend success"})
       })
       
    } catch (error) {
        console.log(error)        
    }
}
const loadRealHome = async(req,res) =>{
   try {

    res.render('realhome')
   } catch (error) {
    console.log(error)
   } 
}
const loadCart = async(req,res)=>{
    try {
        const id = req.session.user
        const cartOfUser = await myCart.find({userId:id}).populate('products.productId').exec()
        if(cartOfUser){
            // cartOfUser.forEach(element => {
            //   console.log(element.products)  
            // });
            res.render('cart',{cartOfUser:cartOfUser})
        }
    } catch (error) {
     console.log(error)   
    }
}
const addToCart = async(req,res)=>{
    try {
        const productId = req.body.productId
        const quantity = req.body.quantity
        const userId = req.session.user
        const size = req.body.selectedSize
        console.log(size)
        console.log(productId)
        console.log(quantity)
        console.log(userId)

       const cart = new myCart({
            userId:userId,
            products:[{
                productId:productId,
                size:size,
                quantity:quantity}]
        })

       const savedcart = await cart.save()
       console.log(savedcart)
        

        res.status(200).json({data:"success"})
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
    resendOtp,
    loadRealHome,
    // loadCart,
    // addToCart,
  
}