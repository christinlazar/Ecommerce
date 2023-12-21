
const express = require('express')
const session = require('express-session')
const path = require('path')
const adminRoute = express();
const adminController = require('../controllers/adminController')
const productController = require('../controllers/productController')
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


adminRoute.get('/',adminController.loadLogin)
adminRoute.post('/',adminController.postLoadLogin)
adminRoute.get('/admindash',adminController.loadDashBoard)
adminRoute.get('/userlist',adminController.loaduserlist)
adminRoute.patch('/blockuser',adminController.blockUser)
adminRoute.patch('/unblockuser',adminController.unblockUser)
adminRoute.get('/category',adminController.loadCategory)
adminRoute.post('/category',productController.categorySave)
adminRoute.patch('/blockcategory',productController.blockCategory)
adminRoute.patch('/unblockcategory',productController.unblockCategory)
adminRoute.get('/editcategory',productController.editCategory)
adminRoute.post('/editcategory',productController.updateEditCategory)
adminRoute.get('/addproduct',productController.loadAddProduct)
adminRoute.post('/addproduct',upload.array('image'),productController.addProductDetials)
adminRoute.get('/productlist',productController.productList)
adminRoute.get('/editproduct',productController.editProduct)
adminRoute.post('/editproduct',upload.array('image'),productController.verifyEditProduct)
adminRoute.patch('/blockproduct',productController.blockProduct)
adminRoute.patch('/unblockproduct',productController.unblockProduct)
adminRoute.patch('/deleteimage',productController.deleteImage)



module.exports = adminRoute