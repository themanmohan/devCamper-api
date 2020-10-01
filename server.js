const express=require('express')
const color=require('colors')
const path=require('path')
const dotenv=require('dotenv')
const morgan=require('morgan')
const helmet=require('helmet')
var xss = require('xss-clean')
var ratelimit = require('express-rate-limit')
var hpp = require('hpp')
var xss = require('xss-clean')
var cors = require('cors')

const fileupload=require('express-fileupload')
const mongoSanitize = require('express-mongo-sanitize');
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
const authRouter=require('./routes/auth')
const userRouter=require('./routes/users')
const reviewRouter=require('./routes/review')


const port=process.env.PORT ||  5000

if (process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

//file upload
app.use(fileupload())

//mongo senitize
app.use(mongoSanitize());


//security header 
app.use(helmet())

//prevent uwanted script
app.use(xss());

//rate limit
const limiter=ratelimit({
    windowMs:10 *60*1000, //10 minute
    max:100
})
app.use(limiter);


//enable cors
app.use(cors())


//prevent http param polllution
app.use(hpp())

//mounting rutes
app.use('/api/v1/bootcamps', bootcampRouter)
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/review', reviewRouter)


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




