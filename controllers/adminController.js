const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Category = require('../models/categorymodel')
const Product = require('../models/productModel')
const Order = require('../models/orderModel')
const Coupon = require('../models/couponModel')
const path = require('path')
const { log } = require('util')


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
        const arr=[] 
        const orderDetails = await Order.find({}).populate('userId').sort({createdAt:-1})
        const orderCounts = await Order.find({}).count()
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth()+1 
        const firstDayOfMonth = new Date(currentDate.getFullYear(),currentMonth-1,1)
        const lastDayOfMonth = new Date(currentDate.getFullYear(),currentMonth,0)

        const totalRevenueArray = await Order.aggregate([
            {
            $match:{
                createdAt: {$gte:firstDayOfMonth,$lte:lastDayOfMonth}
            }
        },
        {
            $group:{
                _id:null,
                totalRevenue:{$sum:'$totalamount'}
            }
        }
    ])
    
    let totalrevenue=0
    totalRevenueArray.forEach(el=>{
    totalrevenue = el.totalRevenue
  })
  
  const productCount = await Order.aggregate([
    {
        $unwind:'$products'
    },
    {
        $group:{
            _id:'$_id',
            totalProductsInOrder:{$sum:'$products.quantity'}
        }
    },
    {
        $group:{
            _id:null,
            totalProducts:{$sum:'$totalProductsInOrder'}
        }
    }
  ])
  let pCount = 0
  productCount.forEach(el=>{
 pCount = el.totalProducts
  })

  const revenue = await Order.aggregate([
    {
        $group:{
            _id:null,
            revenue : {$sum:'$totalamount'}
        }
    }
  ])
  let totalRevenue=0
revenue.forEach(el=>{
    totalRevenue = el.revenue
})
currentRoute="/admin/admindash"
     res.render('admindash',{orderDetails,orderCounts,totalrevenue,pCount,totalRevenue,currentRoute})     
    } catch (error) {
    console.log(error)        
    }
}
const loaduserlist = async(req,res)=>{
        try {
          const users =  await  User.find({})
          const currentRoute="/admin/userlist"
            res.render('userslist',{users,currentRoute})
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
        const currentRoute="/admin/category"
        res.render('category',{category,message:'',currentRoute})
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
const loadOrderDetails = async(req,res)=>{
    try {
        
        const orderDetails = await Order.find({}).populate('userId').sort({createdAt:-1})
       const currentRoute = "/admin/orderdetails"
        res.render('orderdetails',{orderDetails,currentRoute})
    } catch (error) {
        console.log(error.message)
    }
}

const loadOrderDetailView = async(req,res)=>{
    try {
        const orderId= req.query.id
        console.log(orderId)
        const singleorder = await Order.findById(orderId).populate('products.product').populate('addressId').populate('userId')
        res.render('orderview',{singleorder})
    } catch (error) {
        console.log(error.message)
    }
}

const adminCancelOrder = async(req,res)=>{
    try {
        
        const {statusvalue,ordervalue,productId} = req.body 
        console.log(statusvalue)
        console.log(ordervalue)
        const currentOrder = await Order.findById(ordervalue)
        console.log("currentOrder issss"+currentOrder)
        if(currentOrder.status=="cancelled"){
            res.status(400).json({success:false})
            return;
        }
        const updatedStatus = await Order.findByIdAndUpdate(ordervalue,{$set:{status:statusvalue}})
        if(statusvalue == "cancelled"){
            const orderDetails = await  Order.findByIdAndUpdate(ordervalue,{$set:{totalamount:0}})
            console.log("orderDetails is "+orderDetails)
            let proArray =[]
            orderDetails.products.forEach(element => {
                let prodata={
                    product_id:element.product,
                    qty:element.quantity,
                    size:element.size
                }
                proArray.push(prodata)
            });
            proArray.forEach(async(el)=>{
                console.log(el.product_id)
                console.log(el.qty)
               console.log(el.size)
                const updated = await Product.findByIdAndUpdate({_id:el.product_id},{$inc:{[`size.${el.size}.quantity`]:el.qty}})
                
            })
        }
      
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error.message)
    }
}
const loadCoupon = async(req,res)=>{
    try {
        const couponDetails = await Coupon.find({})
        const currentRoute = "/admin/coupon"
        res.render('coupon',{couponDetails,currentRoute})
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
    loadOrderDetails,
    loadOrderDetailView,
    adminCancelOrder,
    loadCoupon,
    // loadAddbanner,
    // addBannerDetails
}