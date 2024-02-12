const User = require('../models/userModel')
const Product = require('../models/productModel')
const myCart = require('../models/cartModel')
const address = require('../models/addressModel')
const Coupon = require('../models/couponModel')

const loadCart = async(req,res)=>{
    try {
        const id = req.session.user
        const cartOfUser = await myCart.find({userId:id}).populate({path:'products.productId',populate:{ path:'category', model:'category'}}).populate('userId').exec()
        if(cartOfUser&&cartOfUser.length>0){
           
           cartOfUser.forEach(element=>{
            element.products.forEach(async(el)=>{
                if(el.productId.discount < el.productId.category.categoryDiscount){
                    const discount = el.productId.category.categoryDiscount
                    const discountAmount = el.productId.price.regularprice * (el.productId.category.categoryDiscount/100)
                    const sellPrice = el.productId.price.regularprice-discountAmount
                    const sellingPrice = Math.floor(sellPrice)
                   const dev = await Product.findByIdAndUpdate({_id:el.productId._id},{$set:{'price.saleprice':sellingPrice}},{new:true})
                }
               })
           })

           const cartProducts = await myCart.findOne({userId:id}).populate('userId')
           let cartCount
           if(cartProducts){
            cartCount = cartProducts.products.length
           }
           
           const WishlistProduct = await User.findById(id)
            let WishlistProductCount
            if(WishlistProduct){
          WishlistProductCount = WishlistProduct.wishlist.length
    }

            res.render('cart',{cartOfUser:cartOfUser,userId:id,wishlistCount:WishlistProductCount,cartCount:cartCount ? cartCount :0})
        }else{ 
           const cartProducts = await myCart.findOne({userId:id}).populate('userId')
           let cartCount
           if(cartProducts){
            cartCount = cartProducts.products.length
           }
           
           const WishlistProduct = await User.findById(id)
            let WishlistProductCount
            if(WishlistProduct){
          WishlistProductCount = WishlistProduct.wishlist.length
    }
            res.render('cart',{cartEmpty:"Your cart is empty",userId:id,cartCount,wishlistCount:WishlistProductCount})
        }
    } catch (error) {
     console.log(error)   
    }
}
const addToCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const userId = req.session.user;
        const sizee = req.body.selectedSize;

    

        const userHaveCart = await myCart.findOne({ userId: userId }).populate('products.productId');

        if (!userHaveCart) {
            const cart = new myCart({
                userId: userId,
                products: [{
                    productId: productId,
                    size: sizee,
                    quantity: quantity
                }]
            });
            await cart.save();
        } else {
            const productIndex = userHaveCart.products.findIndex((product) => product.productId._id == productId && product.size == sizee);

            if (productIndex !== -1) {
                const currqty = parseInt(userHaveCart.products[productIndex].quantity);
                const productqty = parseInt(userHaveCart.products[productIndex].productId.size[sizee].quantity);
                const newqty = parseInt(quantity);

                if (currqty + newqty <= productqty) {
                    userHaveCart.products[productIndex].quantity += newqty;
                } else {
                    res.status(400).json({ success: false, error: "Can't add more to cart" });
                    return;
                }
            } else {
                    const product = await Product.findOne({_id:productId})
                    const maxqty = product.size[sizee].quantity
                    if(parseInt(quantity)<=maxqty){
                        userHaveCart.products.push({
                            productId: productId,
                            size: sizee,
                            quantity: quantity
                        });
                    }else{
                        res.status(400).json({ success: false, error: "quantity exceeds the limit of stock" });
                    return;
                    }
                       
                    }

                    await userHaveCart.save();
                }

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }


};
const removefromcart = async(req,res)=>{
    try {
        const userId = req.session.user
        const productId = req.body.productId
        const size = req.body.size
        await myCart.updateOne({userId:userId},{$pull:{products:{productId:productId,size:size}}})
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error.message)
    }
}
const incQuantityUpdation = async(req,res)=>{
    try {
        
        const userId = req.session.user
        const productId = req.body.productId
        const sizey = req.body.size
       const cartData = await myCart.findOne({userId:userId}).populate('products.productId')
     
        if(cartData){
         const matchProduct = cartData.products.findIndex((product)=>product.productId._id == productId && product.size == sizey)
         if(matchProduct!==-1){
           
          const  matchprod = cartData.products.find((prod)=>prod.productId._id == productId && prod.size == sizey)
            if(matchprod){
               const maxqty = parseInt(matchprod.productId.size[sizey].quantity)
               const currcartqty = parseInt(matchprod.quantity)
               if(currcartqty<maxqty){
                matchprod.quantity += 1;
               }else{
                res.status(400).json({success:false,updateError1:"reached the limit"})
                return;
               }
            }else{
                console.log("cant find match prod") 
            }
            await cartData.save()
            res.status(200).json({success:true})
         }else{
            console.log("no match product index")
         }
        
        
        }

    } catch (error) {
        console.log(error)
    }
}
const decQuantityUpdation = async(req,res)=>{
    try {
        
        const userId = req.session.user
        const productId = req.body.productId
        const sizey = req.body.size
       const cartData = await myCart.findOne({userId:userId}).populate('products.productId')
       
        if(cartData){
         
         const matchProduct = cartData.products.findIndex((product)=>product.productId._id == productId && product.size == sizey)
         if(matchProduct!==-1){
           
          const  matchprod = cartData.products.find((prod)=>prod.productId._id == productId && prod.size == sizey)
            if(matchprod){
                const minqty = 1;
               const maxqty = parseInt(matchprod.productId.size[sizey].quantity)
               const currcartqty = parseInt(matchprod.quantity)
               if(currcartqty>minqty){
                const decQuantity = Math.min(1,currcartqty-minqty)
                matchprod.quantity  -= decQuantity
               }else{
                res.status(400).json({success:false,updateError2:"reached the limit"})
                return;
               }
            }else{
                console.log("cant find match prod") 
            }
            await cartData.save()
            res.status(200).json({success:true})
         }else{
            console.log("no match product index")
         }
        
         
        }

    } catch (error) {
        console.log(error)
    }
}
const checkOut = async(req,res)=>{
    try {
        const userId = req.session.user
        addressOfUser = await address.find({userId:userId})
        cartOfUser = await myCart.findOne({userId:userId}).populate('products.productId')
        const coupon = await Coupon.find({is_active:true})

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

        if(cartOfUser){
        res.render('checkout',{cartOfUser:cartOfUser,addressOfUser:addressOfUser,coupon:coupon,userId,cartCount,wishlistCount:WishlistProductCount}) 
        }else{
        res.render('cart',{cantMoveToCheckout:"Your cart has No proudcts,So cant proceed to checkout",cartEmpty:"Your cart is empty"})  
        }
    } catch (error) {
        console.log(error.message)
    }
}
const addAddress = async(req,res)=>{
    try {
       const userId = req.session.user
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
        res.render('add-address',{userId,cartCount,wishlistCount:WishlistProductCount})
    } catch (error) { 
        console.log(error.message)
    }
}
const editAddress = async(req,res)=>{
    try {
        const addressId = req.query.id
        const addressDetails = await address.findOne({_id:addressId})
        const userId = req.session.user
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
    
        res.render('editaddress',{addressDetails,userId,cartCount,wishlistCount:WishlistProductCount})
    } catch (error) {
        console.log(error.message)
    }
}
const insertAddress = async(req,res)=>{
    try {
        const userId= req.session.user
        const{fname,lname,house,landmark,city,pincode,country,email,phone} = req.body
           const userAddress = new address({
            fname:fname,
            lname:lname,
            house:house,
            landmark:landmark,
            city:city,
            country:country,
            pincode:pincode,
            email:email,
            phone:phone,
            userId:userId,
           }) 
           const savedAddress =  await userAddress.save()
           res.redirect('/checkout')

    } catch (error) {
        console.log(error.message)
    }
}
const confirmEditAddress =  async(req,res)=>{
    try {
        const userId= req.session.user
        const{fname,lname,house,landmark,city,pincode,country,email,phone,addressId} = req.body
        const add = await address.findOneAndUpdate({_id:addressId},{$set:{
            fname:fname,
            lname:lname,
            house:house,
            landmark:landmark,
            city:city,
            pincode:pincode,
            country:country,
            email:email,
            phone:phone,
        }},{new:true}) 
        res.redirect('/userdashboard')
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    loadCart,
    addToCart,
    removefromcart,
    incQuantityUpdation,
    decQuantityUpdation,
    checkOut,
    addAddress,
    insertAddress,
    editAddress,
    confirmEditAddress
}