const User = require('../models/userModel')
const Product = require('../models/productModel')
const myCart = require('../models/cartModel')
const address = require('../models/addressModel')

const loadCart = async(req,res)=>{
    try {
        const id = req.session.user
        const cartOfUser = await myCart.find({userId:id}).populate('products.productId').exec()
        if(cartOfUser){
            // cartOfUser.forEach(element => {
            //   console.log(element.products)  
            // });
            console.log(cartOfUser)
            res.render('cart',{cartOfUser:cartOfUser})
        }
    } catch (error) {
     console.log(error)   
    }
}
const addToCart = async (req, res) => {
    // try {
    //     const productId = req.body.productId;
    //     const quantity = req.body.quantity;
    //     const userId = req.session.user;
    //     const sizee = req.body.selectedSize;

    //     const userHaveCart = await myCart.findOne({ userId: userId }).populate('products.productId');

    //     if (!userHaveCart) {
    //         const cart = new myCart({
    //             userId: userId,
    //             products: [{
    //                 productId: productId,
    //                 size: sizee,
    //                 quantity: quantity
    //             }]
    //         });
    //         await cart.save();
    //     } else {
    //         console.log("entering userHaveCart");
    //         const productIndex = userHaveCart.products.findIndex((product) => product.productId._id == productId && product.size == sizee);

    //         if (productIndex !== -1) {
    //             const currqty = parseInt(userHaveCart.products[productIndex].quantity);
    //             const productqty = parseInt(userHaveCart.products[productIndex].productId.size[sizee].quantity);
    //             const newqty = parseInt(quantity);

    //             if (currqty + newqty <= productqty) {
    //                 userHaveCart.products[productIndex].quantity += newqty;
    //             } else {
    //                 res.status(400).json({ success: false, error: "Can't add more to cart" });
    //                 return;
    //             }
    //         } else {
    //             console.log("entering userhave cart to save");
    //             userHaveCart.products.push({
    //                 productId: productId,
    //                 size: sizee,
    //                 quantity: quantity
    //             });
    //         }

    //         await userHaveCart.save();
    //     }

    //     res.status(200).json({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ success: false, error: "Internal server error" });
    // }

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
            console.log("entering userHaveCart");
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
        console.log("entering")
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
        console.log("increasing product id"+productId)
       const cartData = await myCart.findOne({userId:userId}).populate('products.productId')
     
        if(cartData){
            console.log("cartdata is "+cartData)
         const matchProduct = cartData.products.findIndex((product)=>product.productId._id == productId && product.size == sizey)
         if(matchProduct!==-1){
           
          const  matchprod = cartData.products.find((prod)=>prod.productId._id == productId && prod.size == sizey)
            if(matchprod){
               const maxqty = parseInt(matchprod.productId.size[sizey].quantity)
               const currcartqty = parseInt(matchprod.quantity)
               console.log("maxqty is:"+maxqty+"and"+ "currqty is:"+currcartqty)
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
        console.log("decreasing product id"+productId)
       const cartData = await myCart.findOne({userId:userId}).populate('products.productId')
       
        if(cartData){
         
         const matchProduct = cartData.products.findIndex((product)=>product.productId._id == productId && product.size == sizey)
         if(matchProduct!==-1){
           
          const  matchprod = cartData.products.find((prod)=>prod.productId._id == productId && prod.size == sizey)
            if(matchprod){
                const minqty = 1;
               const maxqty = parseInt(matchprod.productId.size[sizey].quantity)
               const currcartqty = parseInt(matchprod.quantity)
               console.log("maxqty is:"+maxqty+"and"+ "currqty is:"+currcartqty)
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
        console.log(userId)
        addressOfUser = await address.find({userId:userId})
        cartOfUser = await myCart.findOne({userId:userId}).populate('products.productId')
        console.log(cartOfUser);
       res.render('checkout',{cartOfUser:cartOfUser,addressOfUser:addressOfUser}) 
    } catch (error) {
        console.log(error.message)
    }
}
const addAddress = async(req,res)=>{
    try {
       
        res.render('add-address')
    } catch (error) { 
        console.log(error.message)
    }
}
const editAddress = async(req,res)=>{
    try {
        const addressId = req.query.id
        const addressDetails = await address.findOne({_id:addressId})
        console.log("address details is"+addressDetails)
        res.render('editaddress',{addressDetails})
    } catch (error) {
        console.log(error.message)
    }
}
const insertAddress = async(req,res)=>{
    try {
        console.log("getting in")
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
           console.log(savedAddress)
           res.redirect('/checkout')

    } catch (error) {
        console.log(error.message)
    }
}
const confirmEditAddress =  async(req,res)=>{
    try {
        const userId= req.session.user
        const{fname,lname,house,landmark,city,pincode,country,email,phone,addressId} = req.body
        console.log(req.body)
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
        console.log(add)
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