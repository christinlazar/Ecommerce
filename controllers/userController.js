const User = require('../models/userModel')
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

let users = {}

const postRegister = async(req,res)=>{
    const  {name,email,phone,password,confirm_password} = req.body
      console.log(email)
      if(password===confirm_password){

        // const otp = otpGenerator.generate(6,{
        //     digits:true,
        //     upperCase:false,
        //     specialChars:false,
        //     alphabets:false
        // })
    
        const otp = Math.floor(100000 + Math.random()* 900000)
        globalOtp = otp;
    
        const mailOptions = {
            from:"christinlazar19@gmail.com",
            to:email, 
            subject:'otp has been send',
            text:`otp is ${otp}`
        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
            console.log(error)
            }
            // console.log('email sent'+info.response)
    
            // users[email]= {otp};
            res.render('verifyotp',{email})
        })
      }else{
        res.render('registration',{message:'password must be me matching'})
      }

}

const verifyOtp = async(req,res) =>{
        try {

            res.render('verifyotp')

        } catch (error) {
      console.log(error)            
        }
    }


  const verifiedOtp = async(req,res)=>{
    try {
       


            const userotp = req.body.otp
        if(userotp===globalOtp){
            res.redirect('/')
        }else{
            res.redirect('/verifyotp')
        }
        
        
        
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

// const loadProductDetail = async(req,res)=>{
//     try {
        
//         res.render('productdetail')
        
//     } catch (error) {
//         console.log(error)        
//     }
// }



module.exports = {
    loadRegister,
    postRegister,
    verifyOtp,
    verifiedOtp,
    loadLogin,
}