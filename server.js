const mongoose = require('mongoose')
const express = require('express')
const fs = require('fs')
const nocache = require('nocache')
const bodyParser = require('body-parser')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
require('dotenv').config()
const path = require('path')
// const blockAuth = require('./middleware/isblock')
const app = express()

mongoose.set('strictQuery',true)
const connectDB = async () =>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
        console.log("Database connected successfully :)");
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}
connectDB();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json()) 
// app.set('view engine','ejs')
app.use(express.static('public'))

app.use('/uploads',express.static('uploads'))


app.use((req, res, next) => {
   
    const timestamp = new Date().getTime();
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Requested-With', 'XMLHttpRequest'); 
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.setHeader('ETag', `W/"${timestamp}"`);
    next();
});

// app.use('/',blockAuth.isBlock)
app.use(nocache())

app.set('view engine','ejs')
app.set('views','./views/user')

app.use('/',userRoute)
app.use('/admin',adminRoute)

app.use((req, res, next) => {
    res.status(404).render('404error'); 
});
app.listen(3000,()=>{
    console.log("server started running")
})