const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const userRoute = require('./routes/userRoute')
require('dotenv').config()
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

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
// app.set('view engine','ejs')
app.use(express.static('public'))


app.use('/',userRoute)

app.listen(3000,()=>{
    console.log("server started running")
})