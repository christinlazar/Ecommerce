const address = require("../models/addressModel");
const Order = require("../models/orderModel");
const myCart = require("../models/cartModel");
const Product = require("../models/productModel");
const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Razorpay = require("razorpay");
const easyinvoice = require("easyinvoice");

const { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } = process.env;

var razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET_KEY,
});

const createOrder = async (req, res) => {
  try {
    const amount = parseInt(req.body.totalprice);
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: req.session.user,
    });
    // console.log(order);
    res.json({ orderId: order });
  } catch (error) {
    console.log(error);
  }
};
const paymentSuccess = async (req, res) => {
  try {
  
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderid,
    } = req.body;
    const secret = process.env.RAZORPAY_SECRET_KEY;
    const { createHmac } = require("node:crypto");
    const hash = createHmac("sha256", secret)
      .update(orderid + "|" + razorpay_payment_id)
      .digest("hex");
    console.log(hash);
    console.log(razorpay_signature);
    if (hash == razorpay_signature) {
     
      // Payment successful, process the order
      // Update database, send emails, redirect to success page
      res.json({ message: "Payment successful" });
    } else {
     

      res.status(400).json({ errmessage: "Invalid signature" });
    }
  } catch (error) {
    console.log(error);
  }
};
const placeOrder = async (req, res) => {
  try {
    const userId = req.session.user;
    const cartId = req.body.cartId;
    const addressId = req.body.radiovalue;
    const paymentMethod = req.body.paymentMethod;
    req.session.payment = paymentMethod;
    const totalprice = parseInt(req.body.totalprice, 10);

    if (paymentMethod == "wallet") {
     
      let query = {
        userId: userId,
      };
      const wallet = await Wallet.findOne(query).populate("userId");
     
      if (totalprice <= wallet.balance) {
        const cart = await myCart.findOne({ _id: cartId });
        const productId = cart.products.map((element) => {
          let prodata = {
            product: element.productId,
            quantity: element.quantity,
            size: element.size,
          };
          return prodata;
        });
        
        const myOrder = new Order({
          userId: userId,
          addressId: addressId,
          products: productId,
          totalamount: totalprice,
          paymentmethod: paymentMethod,
        });

        const mineOrder = await myOrder.save();

      
        const userWithTypedreferal = await User.findOne({_id:userId})
        const referalCode = userWithTypedreferal.typedreferal
        if(referalCode){
          const myFirstOrder = await Order.findOne({userId:userId}).populate('userId').count()
          console.log(myFirstOrder);
          if(myFirstOrder==1){
                     const referalAmount = parseInt(500)
                      const updatedWallet = await Wallet.findOneAndUpdate({userId:userWithReferal._id},{$inc:{balance:referalAmount}}).populate('userId')
                      const referalAmount2 = parseInt(200)
                      const walletOfNewUser = await Wallet.findOneAndUpdate({userId:createdUser._id},{$inc:{balance:referalAmount2}}).populate('userId')
                      console.log(walletOfNewUser)
          }
        }
        let productDetArray = [];

        mineOrder.products.forEach((element) => {
          let pdata = {
            product_id: element.product,
            qty: element.quantity,
            size: element.size,
          };
          productDetArray.push(pdata);
        });
        productDetArray.forEach(async (el) => {
          await Product.findByIdAndUpdate(
            { _id: el.product_id },
            { $inc: { [`size.${el.size}.quantity`]: -el.qty } }
          );
        });

        const walletPayment = await Wallet.findOneAndUpdate(
          { userId: userId },
          { $inc: { balance: -totalprice } }
        ).populate("userId");
        if (walletPayment) {
          const today = new Date();
          const walletHistory = await Wallet.findOneAndUpdate(
            { userId: userId },
            { $push:{walletdata:{ history: -totalprice, date: today ,paymentmethod:paymentMethod }}}
          );
        }
        res.status(200).json({ success: true });
      } else {
        res
          .status(400)
          .json({
            success: false,
            error: "Total amount exceeds wallet balance",
          });
      }
    } else if (paymentMethod == "COD" || paymentMethod == "razorpay") {
      const cart = await myCart.findOne({ _id: cartId });
      const productId = cart.products.map((element) => {
        let prodata = {
          product: element.productId,
          quantity: element.quantity,
          size: element.size,
        };
        return prodata;
      });
    
    
      const myOrder = new Order({
        userId: userId,
        addressId: addressId,
        products: productId,
        totalamount: totalprice,
        paymentmethod: paymentMethod,
      });

      const mineOrder = await myOrder.save();

      const userWithTypedreferal = await User.findOne({_id:userId})
      const referalCode = userWithTypedreferal.typedreferal
      const userWithOrginalReferal = await User.findOne({referalcode:referalCode})
      if(referalCode&&userWithOrginalReferal){
        const myFirstOrder = await Order.find({userId:userId}).populate('userId')
        console.log(myFirstOrder);
        if(myFirstOrder.length==1){
                   const referalAmount = parseInt(500)
                    const updatedWallet = await Wallet.findOneAndUpdate({userId:userWithOrginalReferal._id},{$inc:{balance:referalAmount}}).populate('userId')
                    const referalAmount2 = parseInt(200)
                    const walletOfNewUser = await Wallet.findOneAndUpdate({userId:userWithTypedreferal._id},{$inc:{balance:referalAmount2}}).populate('userId')
        }
      }

      let productDetArray = [];
     
      mineOrder.products.forEach((element) => {
        let pdata = {
          product_id: element.product,
          qty: element.quantity,
          size: element.size,
        };
        productDetArray.push(pdata);
      });
      productDetArray.forEach(async (el) => {
        await Product.findByIdAndUpdate(
          { _id: el.product_id },
          { $inc: { [`size.${el.size}.quantity`]: -el.qty } }
        );
      });
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const placeSuccess = async (req, res) => {
  try {
    const paymentMethod = req.session.payment;
    const userId = req.session.user;
    await myCart.findOneAndDelete({ userId: userId });
   
    if (
      paymentMethod == "COD" ||
      paymentMethod == "razorpay" ||
      paymentMethod == "wallet"
    ) {
      res.render("orderplaced");
    }
  } catch (error) {
    console.log(error.messsage);
  }
};
const loadOrderSummary = async (req, res) => {
  try {
    const userId = req.session.user
    const orderId = req.query.id;
    const orderDetails = await Order.findById(orderId).populate("products.product");
    
    const cartProducts = await myCart.findOne({userId:userId}).populate('userId')
   
    let cartCount
    if(cartProducts){
     cartCount = cartProducts.products.length
    }

    const WishlistProduct = await User.findById(userId)
    let WishlistProductCount
    if(WishlistProduct){
          WishlistProductCount = WishlistProduct.wishlist.length
    }

    res.render("ordersummary", { userId,orderDetails ,wishlistCount:WishlistProductCount,cartCount:cartCount});
  } catch (error) {
    console.log(error.messsage);
  }
};
const removeSinglePr = async (req, res) => {
  try {
    const userId = req.session.user;
    const producttoremove = req.body.productId;
    const orderId = req.body.orderId;
    const size = req.body.size;
    const singleOrderDetails = await Order.findOneAndUpdate(
      { _id: orderId },
      { $pull: { products: { product: producttoremove, size: size } } },
      { new: true, populate: "products.product" }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
  }
};
const removeOrder = async (req, res) => {
  try {
    const order = req.body.orderId;
    const myOrder = await Order.findById(order);
    const totalAmount = myOrder.totalamount;
    const product = req.body.productId;
    const paymentMethod = myOrder.paymentmethod;
    if (paymentMethod == "COD") {
      await Order.findByIdAndUpdate(
        { _id: order },
        { $set: { status: "cancelled", totalamount: 0 } }
      );

      let remOrderArray = [];
      myOrder.products.forEach((element) => {
        let remdata = {
          product_id: element.product,
          qty: element.quantity,
          size: element.size,
        };
        remOrderArray.push(remdata);
      });
      console.log("remorderis" + remOrderArray);
      remOrderArray.forEach(async (el) => {
       
        await Product.findByIdAndUpdate(
          { _id: el.product_id },
          { $inc: { [`size.${el.size}.quantity`]: el.qty } }
        );
      });
      res.status(200).json({ success: true });
    }

    if (paymentMethod == "razorpay" || paymentMethod == "wallet") {
      await Order.findByIdAndUpdate(
        { _id: order },
        { $set: { status: "cancelled", totalamount: 0 } }
      );

      let remOrderArray = [];
      myOrder.products.forEach((element) => {
        let remdata = {
          product_id: element.product,
          qty: element.quantity,
          size: element.size,
        };
        remOrderArray.push(remdata);
      });
      
      remOrderArray.forEach(async (el) => {
        
        await Product.findByIdAndUpdate(
          { _id: el.product_id },
          { $inc: { [`size.${el.size}.quantity`]: el.qty } }
        );
        const filter = { userId: req.session.user };
        const update = { $inc: { balance: totalAmount } };
        const options = { upsert: true };
        const updatedWallet = await Wallet.findOneAndUpdate(
          filter,
          update,
          options
        ).populate("userId");
        if (updatedWallet) {
          const today = new Date();
          const walletHistory = await Wallet.findOneAndUpdate(filter, {
            $push:{walletdata:{ history: totalAmount, date: today ,paymentmethod:paymentMethod }},
          });
        }
      });
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const returnOrder = async (req, res) => {
  try {
   
    const order = req.body.orderId;
    const myOrder = await Order.findById(order);
    const totalAmount = myOrder.totalamount;
    await Order.findByIdAndUpdate(order, {
      $set: { totalAmount: 0, status: "returned" },
    });
    let returnOrder = [];
    await myOrder.products.forEach((el) => {
      returnData = {
        productId: el.product,
        qty: el.quantity,
        size: el.size,
      };
      returnOrder.push(returnData);
    });
    returnOrder.forEach(async (element) => {
      await Product.findByIdAndUpdate(
        { _id: element.productId },
        { $inc: { [`size.${element.size}.quantity`]: element.qty } }
      );
      const filter = { userId: req.session.user };
      const update = { $inc: { balance: totalAmount } };
      const options = { upsert: true };
      const updatedWallet = await Wallet.findOneAndUpdate(
        filter,
        update,
        options
      ).populate("userId");

     
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
const downloadInvoice = async (req, res) => {
  try {
    const orderId = req.body.orderId;
  

    const order = await Order.findById(orderId)
      .populate("addressId")
      .populate("userId")
      .populate("products.product");
    const pro = order.products.map((el) => {
      return (pr = el.product.name);
    });
    const currentDate = new Date(Date.now());
    const formatedDate = currentDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    console.log(formatedDate);
    console.log(pro);

    console.log(order);
    const client = {
      company: order.addressId.house,
      address: order.addressId.landmark,
      zip: order.addressId.pincode,
      city: order.addressId.city,
      country: order.addressId.country,
    };
    console.log(client);
    totalAmount = order.totalamount;
    let prod = [];
    await order.products.forEach((el) => {
      let proData = {
        quantity: el.quantity,
        description: el.product.name,
        "tax-rate": 0,
        price: el.product.price.saleprice,
      };
      prod.push(proData);
    });
    console.log(prod);

    const data = {
      images: {
        background:
          "https://public.easyinvoice.cloud/pdf/sample-background.pdf",
      },
      sender: {
        company: "Wild Monkey",
        address: "Kormangala Banglore",
        zip: "683572",
        city: "Banglore",
        country: "India",
      },
      client: client,
      information: {
        number: "2022.0001",
        date: formatedDate,
      },
      products: prod,
      "bottom-notice": "Thanku for your purchase ",
      settings: {
        currency: "INR",
        "tax-notation": "vat",
        "margin-top": 50,
        "margin-right": 50,
        "margin-left": 50,
        "margin-bottom": 25,
      },
    };

    const result = await easyinvoice.createInvoice(data);
    res.json({ resPdf: result.pdf });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  placeOrder,
  placeSuccess,
  loadOrderSummary,
  removeSinglePr,
  removeOrder,
  createOrder,
  paymentSuccess,
  returnOrder,
  downloadInvoice,
};
