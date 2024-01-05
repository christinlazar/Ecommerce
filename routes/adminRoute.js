
const express = require('express')
const session = require('express-session')
const path = require('path')
const adminRoute = express();
const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')
const adminAuth = require('../middleware/adminauth')
// const fs =require('fs')
adminRoute.set('view engine','ejs')
adminRoute.set('views','./views/admin')
const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{

        cb(null,Date.now() + '-' + path.extname(file.originalname))
    }
})
const upload = multer({storage:storage})


adminRoute.get('/',adminAuth.isLogin,adminController.loadLogin)
adminRoute.post('/',adminController.postLoadLogin)
adminRoute.get('/admindash',adminAuth.isLogout,adminController.loadDashBoard)
adminRoute.get('/userlist',adminAuth.isLogout,adminController.loaduserlist)
adminRoute.patch('/blockuser',adminController.blockUser)
adminRoute.patch('/unblockuser',adminController.unblockUser)
adminRoute.get('/category',adminAuth.isLogout,adminController.loadCategory)
adminRoute.post('/category',categoryController.categorySave)
adminRoute.patch('/blockcategory',categoryController.blockCategory)
adminRoute.patch('/unblockcategory',categoryController.unblockCategory)
adminRoute.get('/editcategory',adminAuth.isLogout,categoryController.editCategory)
adminRoute.post('/editcategory',categoryController.updateEditCategory)
adminRoute.get('/addproduct',adminAuth.isLogout,productController.loadAddProduct)
adminRoute.post('/addproduct',upload.array('image'),productController.addProductDetials)
adminRoute.get('/productlist',adminAuth.isLogout,productController.productList)
adminRoute.get('/editproduct',adminAuth.isLogout,productController.editProduct)
adminRoute.post('/editproduct',upload.array('image'),productController.verifyEditProduct)
adminRoute.patch('/blockproduct',productController.blockProduct)
adminRoute.patch('/unblockproduct',productController.unblockProduct)
adminRoute.patch('/deleteimage',productController.deleteImage)
adminRoute.get('/logout',adminController.logOut)



module.exports = adminRoute