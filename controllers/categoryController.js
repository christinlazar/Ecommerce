const Category = require('../models/categorymodel')
const Product = require('../models/productModel')


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


module.exports = {
    categorySave,
    blockCategory,
    unblockCategory,
    editCategory,
    updateEditCategory 
}