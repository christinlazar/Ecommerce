const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Category = require('../models/categorymodel')
const Product = require('../models/productModel')
const path = require('path')


const loadLogin = async(req,res)=>{
    try {
       
        // await Category.update({},{})
        res.render('adminlogin')
    } catch (error) {
        console.log(error)
    }
}
const postLoadLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
         
        const adminData = await Admin.findOne({email:email})
        
        if(adminData){
            if(adminData.password==password){
                req.session.admin=adminData._id
                res.redirect('/admin/admindash')
            }else{
                res.render('adminlogin',{message:'password is incorrect'})
            }
        }else{
            res.render('adminlogin',{message:'you dont seems to be an Admin '})
        }

    } catch (error) {
     console.log(error)   
    }
} 
const loadDashBoard = async(req,res)=>{
    try {
     res.render('admindash')     
    } catch (error) {
    console.log(error)        
    }
}
const loaduserlist = async(req,res)=>{
        try {
          const users =  await  User.find({})
            res.render('userslist',{users})
        } catch (error) {
            console.log(error)
        }
   
}
const blockUser = async(req,res)=>{
    try {
       const userId = req.body.userId
    await User.findOneAndUpdate({_id:userId},{$set:{is_active:false}})
        res.status(200).json({message:"success"})
    } catch (error) {
        console.log(error)
    }
}
const unblockUser = async(req,res)=>{
    try {
        const userId = req.body.userId
        await User.findOneAndUpdate({_id:userId},{$set:{is_active:true}})
        res.status(200).json({message:"success2"})
    } catch (error) {
    console.log(error)        
    }
}
const loadCategory = async(req,res)=>{
    try {
        const category = await Category.find({}).sort({createdAt:-1})
        res.render('category',{category,message:''})
    } catch (error) {
    console.log(error)        
    }
}
const logOut = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/admin')
    } catch (error) {
    console.log(error)    
    }
}

module.exports = {
    loadLogin,
    postLoadLogin,
    loadDashBoard,
    loaduserlist,
    blockUser,
    unblockUser,
    loadCategory,
    logOut,
    
}