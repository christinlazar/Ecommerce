const express = require("express");
const session = require("express-session");
const path = require("path");
const adminRoute = express();
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const couponController = require("../controllers/couponController");
const bannerController = require("../controllers/bannerController");
const chartController = require("../controllers/chartController");
const walletController = require("../controllers/walletController");
const adminAuth = require("../middleware/adminauth");
// const fs =require('fs')
adminRoute.set("view engine", "ejs");
adminRoute.set("views", "./views/admin");
const multer = require("multer");
const banner = require("../models/bannerModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

adminRoute.get("/",  adminController.loadLogin);
adminRoute.post("/", adminController.postLoadLogin);
adminRoute.get("/admindash",  adminController.loadDashBoard);
adminRoute.get("/userlist",  adminController.loaduserlist);
adminRoute.patch("/blockuser", adminController.blockUser);
adminRoute.patch("/unblockuser", adminController.unblockUser);
adminRoute.get("/category",  adminController.loadCategory);
adminRoute.post("/category", categoryController.categorySave);
adminRoute.patch("/blockcategory", categoryController.blockCategory);
adminRoute.patch("/unblockcategory", categoryController.unblockCategory);
adminRoute.get(
  "/editcategory",
 
  categoryController.editCategory
);
adminRoute.post("/editcategory", categoryController.updateEditCategory);
adminRoute.get(
  "/addproduct",
 
  productController.loadAddProduct
);
adminRoute.post(
  "/addproduct",
  upload.array("image"),
  productController.addProductDetials
);
adminRoute.get(
  "/productlist",
 
  productController.productList
);
adminRoute.get(
  "/editproduct",
  
  productController.editProduct
);
adminRoute.post(
  "/editproduct",
  upload.array("image"),
  productController.verifyEditProduct
);
adminRoute.patch("/blockproduct", productController.blockProduct);
adminRoute.patch("/unblockproduct", productController.unblockProduct);
adminRoute.patch("/deleteimage", productController.deleteImage);
adminRoute.get("/logout", adminController.logOut);
adminRoute.get(
  "/orderdetails",
 
  adminController.loadOrderDetails
);
adminRoute.get(
  "/orderdetailview",

  adminController.loadOrderDetailView
);
adminRoute.post("/orderdetailview", adminController.adminCancelOrder);
adminRoute.get("/coupon", adminController.loadCoupon);
adminRoute.post("/coupon", couponController.addCoupon);
adminRoute.patch("/hold", couponController.holdCoupon);
adminRoute.patch("/unhold", couponController.unHoldCoupon);
adminRoute.get("/addbanner", bannerController.loadAddbanner);
adminRoute.post(
  "/addbanner",
  upload.array("image"),
  bannerController.addBannerDetails
);
adminRoute.get("/editbanner", bannerController.loadEditBanner);
adminRoute.patch("/deletebanner", bannerController.deleteBanner);
adminRoute.post(
  "/editbanner",
  upload.array("image"),
  bannerController.verifyEditBanner
);
adminRoute.patch("/blockbanner", bannerController.blockBanner);
adminRoute.patch("/unblockbanner", bannerController.unBlockBanner);
adminRoute.post("/fetchSalesData", chartController.fetchsalesdata);

module.exports = adminRoute;
