const Category = require('../models/categorymodel')
const Product = require('../models/productModel')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path')

const categorySave = async(req,res)=>{
   try{
    const category = await Category.find({})
    const{name,parent,description} = req.body
    console.log(name,parent,description)
    const samedata = await Category.findOne({name:name})
   
    if(samedata){
        res.render('category',{msg:"Sorry!..This category already exists",category})
       
    }else{
            console.log("ok")
        const category = new Category({
            name:name,
            parent:parent,
            description:description
        })
        await category.save();
     res.redirect('/admin/category')
        // res.status(200).json({message:"success"})
    }
  
   }catch(error){
    console.log(error)
   }
}
const blockCategory = async(req,res)=>{
    try {
        const categoryid = req.body.categoryId;
        console.log(categoryid)
        await Category.findOneAndUpdate({_id:categoryid},{$set:{is_active:false}})
        res.status(200).json({message:"sucesscategory"})
    } catch (error) {
        console.log(error)
    } 
}
const unblockCategory = async(req,res)=>{
    try {
        const categoryid = req.body.categoryId
        await Category.findOneAndUpdate({_id:categoryid},{$set:{is_active:true}})
        res.status(200).json({message:"unblock success"})
    } catch (error) {
    console.log(error)        
    }
}
const editCategory = async(req,res)=>{
    try {
        const id = req.query.id
        const category = await Category.findOne({_id:id})
        if(category){
            res.render('editcategory',{category})
        }
    } catch (error) {
        console.log(error)
    }
}
const updateEditCategory = async(req,res)=>{
    try {
  const name = req.body.name
  console.log(name)
    await Category.findByIdAndUpdate({_id:req.query.id},{$set:{name:req.body.name,parent:req.body.parent,description:req.body.description}})
   
    res.redirect('/admin/category')

    } catch (error) {
   console.log(error)        
    }

}
const 
loadAddProduct = async(req,res)=>{
    try {

        const category = await Category.find({is_active:true})
        res.render('addproduct',{category})
    } catch (error) {
     console.log(error)   
    }

}
const addProductDetials = async(req,res)=>{
    try {
        console.log(req.body)
        // console.log("image :",req.file)
        const images = req.files
        const imagefilenames = images.map(image =>image.filename)
       const {name,description,saleprice,regularprice,category,small,medium,large} = req.body
    //    const image = req.file.filename
        console.log(category)
      

       const product = new Product({
        name:name,
        description:description,
        price:{
            saleprice:saleprice,
            regularprice:regularprice,
        },
        image:imagefilenames,
        category:category,
        size:{
            s:{
                quantity:small
            },
            m:{
                quantity:medium
            },
            l:{
                quantity:large
            },
        }
       })
       const savedproduct = await product.save()
       console.log(savedproduct)
       const croppedImages = await Promise.all(

        images.map(async(image)=>{
            const inputFilePath = path.join('uploads', image.filename);
            const outputFilePath = path.join('uploads', `${path.basename(inputFilePath, path.extname(inputFilePath))}_cropped${path.extname(inputFilePath)}`);

            await sharp(inputFilePath)
            .resize(500,500, { fit: 'cover' })
            .toFile(outputFilePath)
            return path.basename(outputFilePath);
        })
       )
       savedproduct.image = croppedImages;
       await savedproduct.save();
       res.redirect('/admin/addproduct')
        
    } catch (error) {
        console.log(error)
    }
}
const productList = async(req,res)=>{
   try {
    const category = await Category.find({is_active:true}).sort({createdAt:-1})
    const product = await Product.find({}).sort({added_at:-1})
    console.log("hi"+product)
    res.render('productlist',{category,product})
   } catch (error) {
console.log(error)    
   }
}

const editProduct = async(req,res)=>{
    try {
        const id = req.query.id
        const productData = await Product.findById({_id:id})
        .populate('category').lean()
        console.log(productData)
        const product = await Product.findOne({_id:id})
       
        const category = await Category.find({is_active:true})
      
       res.render('editproduct',{product,category,productData}) 
    } catch (error) {
        console.log(error)
    }
}
const blockProduct = async(req,res)=>{
    try {
        console.log('hi')
        const productid = req.body.productId
        // console.log(productid)
        const productdata = await Product.findOneAndUpdate({_id:productid},{$set:{is_active:false}})
        console.log(productdata)
        res.status(200).json({message:"successully blocked"})
    } catch (error) {
        console.log(error)
    }
}
const unblockProduct = async(req,res)=>{
    try {
        console.log('unblock')
        const productid = req.body.productId
        const productdata = await Product.findOneAndUpdate({_id:productid},{$set:{is_active:true}})
        console.log(productdata)
        res.status(200).json({message:"unblocked successfully"})
    } catch (error) {
     console.log(error)   
    }
}
const deleteImage = async(req,res)=>{
    try {
       const index = req.body.index
       const productid = req.body.productId
       console.log("hi")
        console.log(productid)
       const product = await Product.findById(productid)
        const imageToDelete = product.image[index]
        fs.unlink(imageToDelete, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
            } else {
                console.log('Image file deleted successfully');
            }
        });
        product.image.splice(index,1)
        await product.save();
       res.status(200).json({message:"successfully deleted"})
    } catch (error) {
      console.log(error)  
    }
}
const verifyEditProduct = async(req,res)=>{   
try {
    console.log("entered inside verify edit product")
    const id = req.query.id
    console.log("id is:"+id)
    const images = req.files
    const newImages = images.map(image=>image.filename)
   const {name,description,saleprice,category,regularprice,small,medium,large} = req.body

   const croppedImages = await Promise.all(
    images.map(async (image) => {
        const inputFilePath = path.join('uploads', image.filename);
        const outputFilePath = path.join('uploads', `${path.basename(inputFilePath, path.extname(inputFilePath))}_cropped${path.extname(inputFilePath)}`);

        await sharp(inputFilePath)
            .resize(500, 500, { fit: 'cover' })
            .toFile(outputFilePath)
        return path.basename(outputFilePath);
    })
)
    
   if(newImages.length>0){
    console.log("gonna update")
    await Product.updateOne({_id:id},{$push:{image:{$each:croppedImages}}})
   }
  
    await Product.findByIdAndUpdate(id,{$set:{
        name:name,
        description:description,
        price:{
            saleprice:saleprice,
            regularprice:regularprice,
        },
        category:category,
        size:{
            s:{quantity:small},
            m:{quantity:medium},
            l:{quantity:large},
        }, 
    }})
   res.redirect('/admin/productlist')
} catch (error) {
 console.log(error)   
}
}

module.exports = {
    // categorySave,
    // blockCategory,
    // unblockCategory,
    // editCategory,
    // updateEditCategory,
    loadAddProduct,
    addProductDetials,
    productList,
    editProduct,
    blockProduct,
    unblockProduct,
    deleteImage,
    verifyEditProduct,
    
}