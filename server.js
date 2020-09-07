const express=require('express')
const dotenv=require('dotenv')
// load env variable
dotenv.config({path:'./config/config.env'});
//craete instance
const app=express()

const port=process.env.PORT ||  5000

app.get('/hh',(req,res)=>{
    console.log('working')
    res.end('working')
})





app.listen(port,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} at port_no ${port}`)
})





