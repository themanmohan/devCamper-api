const express=require('express')
const color=require('colors')
const path=require('path')
const dotenv=require('dotenv')
const morgan=require('morgan')
const fileupload=require('express-fileupload')
const cookieparser=require('cookie-parser')
const errorHandler=require('./middleware/error')
const logger=require('./middleware/logger')
const connectDB=require('./config/db')
// load env variable
dotenv.config({path:'./config/config.env'});

connectDB()
//craete instance
const app=express()
//body parser
app.use(express.json())

app.use(cookieparser())

const bootcampRouter = require("./routes/bootcamps");
const courseRouter = require("./routes/Courses");
const userRouter=require('./routes/auth')

const port=process.env.PORT ||  5000

if (process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

//file upload
app.use(fileupload())




//mounting rutes
app.use('/api/v1/bootcamps', bootcampRouter)
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/auth',userRouter)


//custom errorhandler
app.use(errorHandler)

//static file

app.use(express.static(path.join(__dirname,'public')))


const server=app.listen(port,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} at port_no ${port}`.rainbow)
})

//handling unhandlepromise
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error :- ${err.message}`)
    server.close(()=>process.exit(1))
})




