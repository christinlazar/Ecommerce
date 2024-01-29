const express = require('express')
const session = require('express-session')
const userRoute = express();
const userAuth = require('../middleware/userauth') 
const userBlockingMiddleware = require('../middleware/blockauth')
const Razorpay = require('razorpay')
// userRoute.use(express.static('public'))
userRoute.set('view engine','ejs')
userRoute.set('views','./views/user')

userRoute.use(session({
    secret:"mySecretkey",
    resave: false,
    saveUninitialized: true,
}))  

const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const couponController = require('../controllers/couponController')
const productController = require('../controllers/productController')
// const isBlock = require('../middleware/isblock');

// userRoute.get('/',userController.loadLogin)


userRoute.get('/',userController.loadRealHome)
userRoute.get('/register',userAuth.isLogin,userController.loadRegister)
userRoute.post('/register',userController.postRegister)
userRoute.get('/verifyotp',userAuth.isLogin,userController.verifyOtp)
userRoute.post('/verifyotp',userController.verifiedOtp)
userRoute.get('/login',userAuth.isLogin,userController.loadLogin)
userRoute.post('/login',userController.userLogin)
userRoute.get('/home',userController.loadHome)
userRoute.get('/userproductdetail',userBlockingMiddleware.userBlockingMiddleware,userController.loadSingleProductView)
userRoute.get('/logout',userController.logOut)
userRoute.post('/resendotp',userController.resendOtp)
userRoute.get('/cart',userAuth.isLogout,cartController.loadCart)
userRoute.post('/userproductdetail',userAuth.isLogout,cartController.addToCart)
userRoute.patch('/removefromcart',userAuth.isLogout,cartController.removefromcart)
userRoute.patch('/incquantityupdation',userAuth.isLogout,cartController.incQuantityUpdation)
userRoute.patch('/decquantityupdation',userAuth.isLogout,cartController.decQuantityUpdation)
userRoute.get('/checkout',userAuth.isLogout,cartController.checkOut)
userRoute.get('/add-address',userAuth.isLogout,cartController.addAddress)
userRoute.post('/add-address',cartController.insertAddress)
userRoute.get('/editaddress',userAuth.isLogout,cartController.editAddress)
userRoute.post('/placeorder',orderController.placeOrder)
userRoute.get('/orderplaced',userAuth.isLogout,orderController.placeSuccess)
userRoute.post('/editaddress',cartController.confirmEditAddress)
userRoute.get('/userdashboard',userAuth.isLogout,userController.loadUserDashboard)
userRoute.get('/ordersummary',userAuth.isLogout,orderController.loadOrderSummary)
userRoute.post('/removefromorder',orderController.removeSinglePr)
userRoute.post('/removeorder',orderController.removeOrder)
userRoute.post('/userdashboard',userController.updateUserDetails)
userRoute.get('/changepassword',userAuth.isLogout,userController.loadChangePassword)
userRoute.post('/changepassword',userController.confirmNewPassword)
userRoute.get('/forgotpassword',userController.loadForgotPassword)
userRoute.post('/forgotpassword',userController.forgotEmail)
userRoute.get('/newpassword',userController.newPasswordSetup)
userRoute.post('/newpassword',userController.verifyNewPassword)
userRoute.get('/newforgototp',userController.loadNewForgotOtp)
userRoute.post('/newforgototp',userController.verifyForgotOtp)
userRoute.post('/forgotresendotp',userController.forgotResendOtp)
userRoute.post('/checkout',userAuth.isLogout,couponController.applyCoupon)
userRoute.post('/createorder',orderController.createOrder)
userRoute.post('/payment-success',orderController.paymentSuccess)
userRoute.post('/returnorder',orderController.returnOrder)
userRoute.patch('/downloadinvoice',orderController.downloadInvoice)
userRoute.get('/aboutus',userController.loadAboutUs)
userRoute.get('/offers',productController.loadOffers)

module.exports = userRoute;