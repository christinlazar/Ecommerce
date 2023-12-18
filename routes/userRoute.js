const express = require('express')
const userRoute = express();

userRoute.set('view engine','ejs')

const userController = require('../controllers/userController')

// userRoute.get('/',userController.loadLogin)
userRoute.get('/register',userController.loadRegister)
userRoute.post('/register',userController.postRegister)
userRoute.get('/verifyotp',userController.verifyOtp)
userRoute.post('/verifyotp',userController.verifiedOtp)
userRoute.get('/',userController.loadLogin)

module.exports = userRoute;