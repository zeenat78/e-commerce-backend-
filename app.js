require('dotenv').config()
const express=require("express")
const mongoose=require("mongoose")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var cors = require('cors')
//importing routes
const authRoutes =require("./routes/auth")
const userRoute=require("./routes/user")
const categoryRoute=require("./routes/category")
const productRoute=require("./routes/product")
const orderRoute=require("./routes/order")

const app=express()
//connecting to database
mongoose.connect(process.env.DB_HOST)
.then(()=>console.log("CONNECTED DB..."))
//using middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
//routes
app.use("/api",authRoutes)
app.use("/api",userRoute)
app.use("/api",categoryRoute)
app.use("/api",productRoute)
app.use("/api",orderRoute)

app.use(express.static(path.join(__dirname,"../projfrontend/build")))
app.get("*",function(_,res){
    res.sendFile(
        path.join(__dirname,"../projfrontend/build/index.html"),
        function(err){
            if(err){
                res.status(500).send(err)
            }
        }
    )
})
const port = process.env.PORT || 8000;
//listening to the server
app.listen(port,()=>{
    console.log("server connected....")
})