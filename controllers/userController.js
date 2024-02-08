const User = require('../models/userModel')
const Product = require('../models/productModel')
const myCart = require('../models/cartModel')
const nodemailer = require('nodemailer')
const Order = require('../models/orderModel')
const Wallet = require('../models/walletModel')
const Address = require('../models/addressModel')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const {v4:uuidv4} = require('uuid')
const express = require('express')
const session = require('express-session')
require('dotenv').config();
const Category = require('../models/categorymodel');
const category = require('../models/categorymodel');
const product = require('../models/productModel')
const Banner = require('../models/bannerModel')
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS,
    }
});

const postRegister = async(req,res)=>{
    try{
        console.log("getting inside post")
      
       const{name,email,phone,password,confirm_password,referal} = req.body
        req.session.referal = referal;
        req.session.email = email
        req.session.phone = phone
       const hashed = await bcrypt.hash(password,10)
       console.log(hashed)
       const referalCode = generateReferalCode();
       const udata = {
        name,
        email,
        phone,
        password:hashed,
        referalcode:referalCode,
        typedreferal:referal,
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

function generateReferalCode(){
    return uuidv4().substr(0,8) //generating a unique referal code a user
}

const createUser = async(udata)=>{

    return await User.create(udata)
    
 }
 const createWallet = async(regUserId)=>{
    const wallet = new Wallet({
         userId:regUserId,
         
    })
    return await wallet.save();
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
            const createdUser = await createUser(userData)
            if(createdUser){
                const createdWallet = await createWallet(createdUser._id)
                // if(createdWallet){
                //     const referal = req.session.referal
                //     const userWithReferal = await User.findOne({referalcode:referal})
                //     if(userWithReferal){
                //         const referalAmount = parseInt(500)
                //         const updatedWallet = await Wallet.findOneAndUpdate({userId:userWithReferal._id},{$inc:{balance:referalAmount}}).populate('userId')
                //         const referalAmount2 = parseInt(200)
                //         const walletOfNewUser = await Wallet.findOneAndUpdate({userId:createdUser._id},{$inc:{balance:referalAmount2}}).populate('userId')
                //         console.log(walletOfNewUser)
                //     }
                // }
            }
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
                    res.redirect('/');   
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
       
        const userId = req.session.user
        var search = ''
        if(req.query.search){
            search = req.query.search
        }
        if(search){
            query.$or = [
                {name:{$regex:'.*'+search+'.*',$options:'i'}},
                {'category.name':{$regex:'.*'+search+'.*',$options:'i'}}
            ]
        }
        
        const cartProducts = await myCart.findOne({userId:userId}).populate('userId')
        console.log(cartProducts);
        let cartCount
        if(cartProducts){
         cartCount = cartProducts.products.length
        }


        const WishlistProduct = await User.findById(userId)
        let WishlistProductCount
        if(WishlistProduct){
              WishlistProductCount = WishlistProduct.wishlist.length
        }
        const products = await Product.find({is_active:true}).populate('category')
        
            res.render('home.ejs',{products,cartCount:cartCount,wishlistCount:WishlistProductCount,userId:userId})



    }catch(error){
        console.log(error)
    }
}
const loadSingleProductView = async(req,res)=>{
    try {
        const userId = req.session.user
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
        const product = await Product.findById(id).populate('category')
        const relatedproducts = await Product.find({category:product.category})
        console.log(relatedproducts);

        const cartProducts = await myCart.findOne({userId:userId}).populate('userId')
        console.log(cartProducts);
        let cartCount
        if(cartProducts){
         cartCount = cartProducts.products.length
        }

        
        const WishlistProduct = await User.findById(userId)
        let WishlistProductCount
        if(WishlistProduct){
              WishlistProductCount = WishlistProduct.wishlist.length
        }
        const products = await Product.find({is_active:true}).populate('category')
        
            // res.render('home.ejs',{products,cartCount:cartCount,wishlistCount:WishlistProductCount,userId:userId})

        res.render('singleproduct',{product,totalQuantity,relatedproducts,userId,cartCount,WishlistProductCount})

    } catch (error) {
   console.log(error.message)     
    }
}
const logOut = async(req,res)=>{
    try {
      req.session.user=null; 
      res.redirect('/') 
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
    const today = new Date()
    console.log(today);
    const userId = req.session.user
    const Category = await category.find({is_active:true})
    const banner = await Banner.findOne({isActive:true})
    const banner2 = await Banner.findOne({title:"oversizebanner",isActive:true})
    const bannermain = await Banner.findOne({title:"mainbanner"})
    const bottombanner = await Banner.findOne({title:"bottombanner2"})
    
    var search = ''
    if(req.query.search){
        search = req.query.search
    }

    var page = 1
    if(req.query.page){
        page = req.query.page
    }
    const limit = 9

    const catId = req.query.id
    console.log(catId)

    let query = {
        is_active:true
    }
   

    if(search){
        query.$or = [
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {'category.name':{$regex:'.*'+search+'.*',$options:'i'}}
        ]
    }
    if(catId){
        query['category'] = catId
    }
    let sortOptions = {}
    if(req.query.high){
        console.log(req.query.high)
        sortOptions = {'price.saleprice':1}
    }
    if(req.query.low){
        sortOptions = {'price.saleprice':-1}
    }

    if(req.query.price){
    switch(req.query.price){
        case'below300':
        query['price.saleprice'] = {$gte:300,$lte:700}
        break;
        case'below1000':
        query['price.saleprice'] = {$gte:700,$lte:1000}
        break;
        case'below1500':
        query['price.saleprice'] = {$gte:1000,$lte:1500}
        break;
        case'below2000':
        query['price.saleprice'] = {$gte:1500,$lte:2000}
        break;
        case'above2000':
        query['price.saleprice'] = {$gt:2000}
        break;
        default:
        break;
    }
   }
    const count = await Product.find(query).countDocuments()

    const products = await Product.find(query)
    .populate('category')
    .sort(sortOptions)
    .skip((page-1)*limit)
    .limit(limit)

    console.log("products arr is"+products);
    products.forEach(async(el)=>{
        if(el.enddate < today){
            await Product.update({_id:el._id},{$set:{discount:0}})
        }
    })

    const cartProducts = await myCart.findOne({userId:userId}).populate('userId')
    console.log(cartProducts);
    let cartCount
    if(cartProducts){
     cartCount = cartProducts.products.length
    }
   


    const WishlistProduct = await User.findById(userId)
    let WishlistProductCount
    if(WishlistProduct){
          WishlistProductCount = WishlistProduct.wishlist.length
    }

   console.log("wishcount is"+WishlistProductCount)
    const high = req.query.high
    const low = req.query.low
   const searchh = search
   const price = req.query.price
    res.render('realhome', {
        products: products,
        Category: Category,
        totalPages: Math.ceil(count / limit),
        page: page,
        high:high,
        low:low,
        search:searchh,
        price:price,
        catId:catId,
        userId:userId,
        banner:banner,
        banner2:banner2,
        bannermain:bannermain,
        bottombanner:bottombanner,
        cartCount:cartCount,
        wishlistCount:WishlistProductCount,
        today:today
    }) 

   } catch (error) {
    console.log(error)
   } 
}
const loadCart = async(req,res)=>{
    try {
        const id = req.session.user
        const cartOfUser = await myCart.find({userId:id}).populate('products.productId').exec()
        if(cartOfUser){
            console.log(cartOfUser);
            
            const cartProducts = await myCart.findOne({userId:userId}).populate('userId')
            console.log(cartProducts);
            let cartCount
            if(cartProducts){
             cartCount = cartProducts.products.length
            }

            const WishlistProduct = await User.findById(userId)
    let WishlistProductCount
    if(WishlistProduct){
          WishlistProductCount = WishlistProduct.wishlist.length
    }

            res.render('cart',{cartOfUser:cartOfUser,userId:id,wishlistCount:WishlistProductCount,cartCount})
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
const loadUserDashboard = async(req,res)=>{
    try {
        var page =1
        if(req.query.page){
            page = req.query.page
        }
        const limit = 3

    const userId = req.session.user
    let query = {
        userId:userId
    }
    const wallet = await Wallet.findOne(query).populate('userId')

    console.log("wallet is"+wallet)
        const address = await Address.find({userId:userId})
        const userDetails = await User.findById(userId)
        const order = await Order.find({userId:userId}).sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(limit)
       
        const count = await Order.find(query).countDocuments()
        const user = await User.findById(userId)

        const cartProducts = await myCart.findOne({userId:user._id}).populate('userId')
        console.log(cartProducts);
        let cartCount
        if(cartProducts){
        cartCount = cartProducts.products.length
        }

        const WishlistProduct = await User.findById(userId)
        let WishlistProductCount
        if(WishlistProduct){
              WishlistProductCount = WishlistProduct.wishlist.length   
        }

        console.log("wish is"+WishlistProductCount)
        console.log("cart is"+cartCount);
        res.render('userdashboard',{user,order,address,user,wallet, totalPages: Math.ceil(count / limit),page:page,WishlistCount:WishlistProductCount,cartCount,userId})
    } catch (error) {
        console.log(error.message)
    }
}
const updateUserDetails = async(req,res)=>{
    try {
        const userId = req.session.user
        const {name,email} = req.body
       const updatedUser = await User.findByIdAndUpdate(userId,{$set:{name:name,email:email}})
       res.redirect('/userdashboard')
    } catch (error) {
        console.log(error.message)
    }
}
const loadChangePassword = async(req,res)=>{
    try {
        const userId = req.session.user
        const cartProducts = await myCart.findOne({userId:userId}).populate('userId')
        console.log(cartProducts);
        let cartCount
        if(cartProducts){
         cartCount = cartProducts.products.length
        }
    
    
    const WishlistProduct = await User.findById(userId)
        let WishlistProductCount
        if(WishlistProduct){
              WishlistProductCount = WishlistProduct.wishlist.length
        }
    
        res.render('changepassword',{userId,cartCount,wishlistCount:WishlistProductCount})
    } catch (error) {
        console.log(error.message)
    }
}

const confirmNewPassword = async(req,res)=>{
    try {
         const userId = req.session.user
        const{oldpassword,newpassword,confirmnewpassword} = req.body
        const userData = await User.findById(userId)
        const hashed = userData.password
        console.log(hashed)
        const isverified = await bcrypt.compare(oldpassword,hashed)
       if(isverified){
        console.log(isverified)
        if(newpassword == confirmnewpassword){
            const hashednewpassword = await bcrypt.hash(newpassword,10)
            await User.findByIdAndUpdate(userId,{$set:{password:hashednewpassword}})
            res.redirect('/userdashboard')
        }else{
            res.render('changepassword',{message:"new password & confirm password is not matching"})
        }
       }else{
        res.render('changepassword',{oldpwd:"Old pasword is not correct"})
       }
    } catch (error) {
        console.log(error.message)
    }
}
const loadForgotPassword = async(req,res)=>{
    try {
        res.render('forgototp')
    } catch (error) {
        console.log(error)
    }
}
const forgotEmail = async(req,res)=>{
    try {
        const{email}=req.body;
        const yesUser = await User.find({email:email})
        if(yesUser){
            const otp = Math.floor(100000 + Math.random() * 90000)
            const mailOptions = {
                from:process.env.EMAIL,
                to:email,
                subject:" Otp to reset password",
                html:`Otp to reset password is ${otp}`
            }
            req.session.forgototp = otp;
            req.session.timer = Date.now()
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log(error.message)
                }else{
                    console.log("mail send")
                    req.session.forgotemail = email
                }
                const expiration = Date.now() + 60*1000
                req.session.expiration = expiration 
                res.redirect('/newforgototp')
            })

        }else{
            console.log("email not found")
        }
    } catch (error) {
        console.log(error.message)
    }
}
const newPasswordSetup = async(req,res)=>{
    try {
        res.render('newpassword')
    } catch (error) {
        console.log(error.message)
    }
}
const verifyForgotOtp = async(req,res)=>{
try {
    const {otp} = req.body
    const globalOtp = req.session.forgototp
    console.log(otp,globalOtp)
    if(otp == globalOtp){
        res.redirect('/newpassword')
    }else{
        const forgotemail = req.session.forgotemail
        const expiration = req.session.expiration
        res.render('newforgototp',{forgotemail,expiration})
    }
} catch (error) {
    console.log(error)
}
}
const verifyNewPassword = async(req,res)=>{
    try {
        const{newpassword,confirmpassword} = req.body
        console.log(newpassword,confirmpassword)
       const forgotemail = req.session.forgotemail
       if(newpassword == confirmpassword){
        const existingUser = await User.findOne({email:forgotemail})
        if(existingUser){
            const hashedpwd = await bcrypt.hash(newpassword,10)
            await User.findOneAndUpdate({email:forgotemail},{$set:{password:hashedpwd}})
            console.log("password changed")
            res.redirect('/login')
        }else{
            console.log("not existing user")
        }
       }else{
       res.render('newpassword',{notmatching:"passwords not matching"})
       }
    } catch (error) {
        console.log(error.message)
    }
}
const loadNewForgotOtp = async(req,res)=>{ 
    try {
        const forgotemail = req.session.forgotemail
        const expiration = req.session.expiration
        res.render('newforgototp',{forgotemail,expiration})
    } catch (error) {
        console.log(error.message)
    }
}
const forgotResendOtp = async(req,res)=>{
    try {
        const otp = Math.floor(100000 + Math.random() * 900000)
        const email = req.session.forgotemail
        const mailOptions = {
            from:process.env.EMAIL,
            to:email,
            subject:"new otp",
            text:`New otp is ${otp}`
        }
            req.session.forgototp = otp;
            req.session.timer = Date.now()
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }else{
                const expiration = Date.now() + 60*1000
                req.session.expiration = expiration 
                res.redirect('/newforgototp')
                res.status(200).json({success:true})
            }
        })
    } catch (error) {
        console.log(error)
    }
}
const loadWallet = async(req,res)=>{
    try {
        res.render('wallet')
    } catch (error) {
        console.log(error)
    }
}
const loadAboutUs = async(req,res)=>{
    try {
        const userId = req.session.user
        const WishlistProduct = await User.findById(userId)
    let WishlistProductCount
    if(WishlistProduct){
          WishlistProductCount = WishlistProduct.wishlist.length
    }
    const cartProducts = await myCart.findOne({userId:userId}).populate('userId')
    console.log(cartProducts);
    let cartCount
    if(cartProducts){
     cartCount = cartProducts.products.length
    }

        res.render('aboutus',{userId,cartCount,wishlistCount:WishlistProductCount})
    } catch (error) {
        console.log(error)
    }
}
const loadOrders = async(req,res)=>{
    try{
        const userId = req.session.user

        var page =1
        if(req.query.page){
            page = req.query.page
        }
        const limit = 3

        const query = {
            userId:userId
        }
        const order = await Order.find(query).sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(limit)

        const count = await Order.find(query).countDocuments()

        const cartProducts = await myCart.findOne({userId:userId}).populate('userId')
        console.log(cartProducts);
        let cartCount
        if(cartProducts){
         cartCount = cartProducts.products.length
        }
        
        const WishlistProduct = await User.findById(userId)
        let WishlistProductCount
        if(WishlistProduct){
            WishlistProductCount = WishlistProduct.wishlist.length
        }
        res.render('orders',{cartCount,wishlistCount:WishlistProductCount,userId,order,totalPages: Math.ceil(count / limit),page:page})
    }catch(error){
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
    loadUserDashboard,
    updateUserDetails,
    loadChangePassword,
    confirmNewPassword,
    loadForgotPassword,
    forgotEmail,
    newPasswordSetup,
    verifyNewPassword,
    loadNewForgotOtp,
    verifyForgotOtp,
    forgotResendOtp,
    loadAboutUs,
    loadOrders
}