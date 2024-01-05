const express = require('express')
const session = require('express-session')
const userRoute = express();
const userAuth = require('../middleware/userauth') 
const userBlockingMiddleware = require('../middleware/blockauth')
// userRoute.use(express.static('public'))
userRoute.set('view engine','ejs')
userRoute.set('views','./views/user')
userRoute.use(session({
    secret:"mySecretkey"
}))  
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController')
// const isBlock = require('../middleware/isblock');

// userRoute.get('/',userController.loadLogin)
userRoute.get('/',userController.loadRealHome)
userRoute.get('/register',userAuth.isLogin,userController.loadRegister)
userRoute.post('/register',userController.postRegister)
userRoute.get('/verifyotp',userAuth.isLogin,userController.verifyOtp)
userRoute.post('/verifyotp',userController.verifiedOtp)
userRoute.get('/login',userAuth.isLogin,userController.loadLogin)
userRoute.post('/login',userController.userLogin)
userRoute.get('/home',userAuth.isLogout,userController.loadHome)
userRoute.get('/userproductdetail',userAuth.isLogout,userBlockingMiddleware.userBlockingMiddleware,userController.loadSingleProductView)
userRoute.get('/logout',userController.logOut)
userRoute.post('/resendotp',userController.resendOtp)
userRoute.get('/cart',cartController.loadCart)
userRoute.post('/userproductdetail',cartController.addToCart)
// userRoute.post('/bringsize',userController.fetchTheSize)



module.exports = userRoute;