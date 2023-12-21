const mongoose = require('mongoose')
const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
require('dotenv').config()
const path = require('path')

const app = express()

mongoose.set('strictQuery',true)
const connectDB = async () =>{
    try{
        await mongoose.connect( 'mongodb://127.0.0.1:27017/ecommerce')
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
app.use('/',userRoute)
app.use('/admin',adminRoute)

app.listen(3000,()=>{
    console.log("server started running")
})