const express = require("express");
const session = require("express-session");
const userRoute = express();
const userAuth = require("../middleware/userauth");
const userBlockingMiddleware = require("../middleware/blockauth");
const Razorpay = require("razorpay");
const path = require("path");
// userRoute.use(express.static('public'))
userRoute.set("view engine", "ejs");
userRoute.set("views", path.join(__dirname, "../views/user"));

userRoute.use(
  session({
    secret: "mySecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const couponController = require("../controllers/couponController");
const productController = require("../controllers/productController");
const wishlistController = require("../controllers/wishlistController");
const walletController = require("../controllers/walletController");
// const isBlock = require('../middleware/isblock');

// userRoute.get('/',userController.loadLogin)

userRoute.get(
  "/",
  userBlockingMiddleware.userBlockingMiddleware,
  userController.loadRealHome
);
userRoute.get("/register", userController.loadRegister);
userRoute.post("/register", userController.postRegister);
userRoute.get("/verifyotp",  userController.verifyOtp);
userRoute.post("/verifyotp", userController.verifiedOtp);
userRoute.get("/login", userAuth.isLogin, userController.loadLogin);
userRoute.post("/login", userAuth.isLogin, userController.userLogin);
userRoute.get(
  "/home",
  userBlockingMiddleware.userBlockingMiddleware,
  userController.loadHome
);
userRoute.get(
  "/userproductdetail",
  userBlockingMiddleware.userBlockingMiddleware,
  userController.loadSingleProductView
);
userRoute.get("/logout", userController.logOut);
userRoute.post("/resendotp", userController.resendOtp);
userRoute.get(
  "/cart",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  cartController.loadCart
);
userRoute.post(
  "/userproductdetail",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  cartController.addToCart
);
userRoute.patch(
  "/removefromcart",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  cartController.removefromcart
);
userRoute.patch(
  "/incquantityupdation",
  userAuth.isLogout,
  cartController.incQuantityUpdation
);
userRoute.patch(
  "/decquantityupdation",
  userAuth.isLogout,
  cartController.decQuantityUpdation
);
userRoute.get(
  "/checkout",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  cartController.checkOut
);
userRoute.get(
  "/add-address",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  cartController.addAddress
);
userRoute.post("/add-address", userAuth.isLogout, cartController.insertAddress);
userRoute.get(
  "/editaddress",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  cartController.editAddress
);
userRoute.post("/placeorder", orderController.placeOrder);
userRoute.get("/orderplaced", userAuth.isLogout, orderController.placeSuccess);
userRoute.post("/editaddress", cartController.confirmEditAddress);
userRoute.get(
  "/userdashboard",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  userController.loadUserDashboard
);
userRoute.get(
  "/ordersummary",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  orderController.loadOrderSummary
);
userRoute.post("/removefromorder", orderController.removeSinglePr);
userRoute.post("/removeorder", orderController.removeOrder);
userRoute.post("/userdashboard", userController.updateUserDetails);
userRoute.get(
  "/changepassword",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogin,
  userController.loadChangePassword
);
userRoute.post("/changepassword", userController.confirmNewPassword);
userRoute.get(
  "/forgotpassword",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogin,
  userController.loadForgotPassword
);
userRoute.post("/forgotpassword", userController.forgotEmail);
userRoute.get(
  "/newpassword",
  userAuth.isLogin,
  userController.newPasswordSetup
);
userRoute.post("/newpassword", userController.verifyNewPassword);
userRoute.get(
  "/newforgototp",
  userAuth.isLogin,
  userController.loadNewForgotOtp
);
userRoute.post("/newforgototp", userController.verifyForgotOtp);
userRoute.post("/forgotresendotp", userController.forgotResendOtp);
userRoute.post("/checkout", userAuth.isLogout, couponController.applyCoupon);
userRoute.post("/createorder", orderController.createOrder);
userRoute.post("/payment-success", orderController.paymentSuccess);
userRoute.post("/returnorder", orderController.returnOrder);
userRoute.patch("/downloadinvoice", orderController.downloadInvoice);
userRoute.get(
  "/aboutus",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  userController.loadAboutUs
);

userRoute.post("/addtowishlist", wishlistController.addToWishList);
userRoute.get(
  "/wishlist",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  wishlistController.viewWishList
);
userRoute.get(
  "/removefromwishlist",
  userAuth.isLogout,
  wishlistController.removeFromWishlist
);
userRoute.get(
  "/orders",
  userBlockingMiddleware.userBlockingMiddleware,
  userAuth.isLogout,
  userController.loadOrders
);
userRoute.post("/createordertowallet", walletController.createOrderToAdd);
userRoute.post("/payment-successTowallet", walletController.paymentSuccess);
userRoute.post("/addToWallet", walletController.walletTopUp);

module.exports = userRoute;
