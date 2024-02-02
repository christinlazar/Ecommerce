const User = require('../models/userModel')



const addToWishList = async(req,res)=>{
    try {
        const productId = req.body.productId
        const userId = req.session.user
        console.log(productId+" "+userId)
        await User.findOneAndUpdate({_id:userId},{$push:{wishlist:{product_id:productId}}})
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error)
    }
}
const viewWishList = async(req,res)=>{
    try {
        const userId = req.session.user
        const wishlistProductsPopulated = await User.findById(userId).populate('wishlist.product_id')
        
        const wishlistProducts = wishlistProductsPopulated.wishlist.map(item=>item.product_id)
        res.render('wishlist',{wishlistProducts})
    } catch (error) {
        console.log(error)
    }
}
const removeFromWishlist = async(req,res)=>{
    try {
        console.log("getting here inside removefrom wishlist")
       const productId =  req.query.id
       const userId = req.session.user
       console.log(productId+""+userId)
        await User.findOneAndUpdate({_id:userId},{$pull:{wishlist:{product_id:productId}}})
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    addToWishList,
    viewWishList,
    removeFromWishlist
}