const User = require('../models/userModel')
const Product = require('../models/productModel')
const myCart = require('../models/cartModel')

const loadCart = async(req,res)=>{
    try {
        const id = req.session.user
        const cartOfUser = await myCart.find({userId:id}).populate('products.productId').exec()
        if(cartOfUser){
            // cartOfUser.forEach(element => {
            //   console.log(element.products)  
            // });
            res.render('cart',{cartOfUser:cartOfUser})
        }
    } catch (error) {
     console.log(error)   
    }
}
const addToCart = async(req,res)=>{
    try {
        const productId = req.body.productId
        const quantity = req.body.quantity
        const userId = req.session.user
        const sizee = req.body.selectedSize
        console.log(sizee)

        const userHaveCart = await myCart.findOne({userId:userId}).populate('products.productId')
        console.log("usercartis:"+userHaveCart)
        if(!userHaveCart){
            const cart = new myCart({ 
                userId:userId,
                products:[{
                    productId:productId,
                    size:sizee,
                    quantity:quantity}]
            })
            const savedcart = await cart.save()
        
        }
        else {
            console.log("entering userHaveCart")
            const have = userHaveCart.products.find((product)=>   product.productId._id == productId && product.size == sizee )
            console.log(have)
            if(have)
            {
                const newqty =  parseInt(quantity)
                const qtyadd = await myCart.findOneAndUpdate({'products.productId':have.productId._id},{$inc:{'products.$.quantity':newqty}},{new:true})
                console.log("qty="+qtyadd+"new"+newqty)
            } 
            else{
                console.log("entering userhave cart to save")
                    userHaveCart.products.push({
                        productId:productId,
                        size:sizee,
                        quantity:quantity
                    })
                    await userHaveCart.save()
                }
                // console.log(existingProduct) 
        }
        res.status(200).json({data:"success"})
    } catch (error) {
    console.log(error)    
    }
}
module.exports = {
    loadCart,
    addToCart,
}