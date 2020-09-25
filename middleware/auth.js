const jwt =require('jsonwebtoken')
const asyncHandler=require('./async')
const errorResponse=require('../utils/errorResponse')
const  User =require('../model/user')

//protected route

exports.protect=asyncHandler(async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
        
        
    }

    // else if(req.cookies.token){
    //    token=req.cookies.token
    // }
    

    if(!token){
        return next(new errorResponse('Not Authorize to access  this route ',401))

    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)
         req.user=await User.findById(decode.id)
         next()
    }catch(err){
         return next(new errorResponse('Not Authorize to access  this route ', 401))
    }
})

exports.authorize=(...roles)=>{
    
    return (req,res,next)=>{
       
        if(!roles.includes(req.user.role)){
            return next(new errorResponse(`${req.user.role} not allow to perform this task`, 401))
        }
        next()
    }
     
}