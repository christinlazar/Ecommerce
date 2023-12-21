const express = require('express')
const session = require('express-session')
const userRoute = express();
const userAuth = require('../middleware/userauth') 
// userRoute.use(express.static('public'))
userRoute.set('view engine','ejs')
userRoute.set('views','./views/user')
userRoute.use(session({
    secret:"mySecretkey"
}))  
const userController = require('../controllers/userController')

// userRoute.get('/',userController.loadLogin)
userRoute.get('/register',userAuth.isLogin,userController.loadRegister)
userRoute.post('/register',userController.postRegister)
userRoute.get('/verifyotp',userAuth.isLogin,userController.verifyOtp)
userRoute.post('/verifyotp',userController.verifiedOtp)
userRoute.get('/',userAuth.isLogin,userController.loadLogin)
userRoute.post('/',userController.userLogin)
userRoute.get('/home',userController.loadHome)
userRoute.get('/userproductdetail',userController.loadSingleProductView)
userRoute.get('/logout',userController.logOut)



module.exports = userRoute;