const User = require('../model/user')
const asyncHandler = require('../middleware/async')
const errorResponse = require('../utils/errorResponse')



//@desc      Register user
//@route     post/api/v1/auth/register
//@access    public

exports.register=asyncHandler(async(req,res,next)=>{
    const {name,role,email,password}=req.body
    const user=await User.create({name,email,password,role})

    //create token
    sendTokenResponse(user, 200, res);
})

//@desc      Register user
//@route     post/api/v1/auth/register
//@access    public

exports.login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    //validate error
  if(!email || !password){
      return next(new errorResponse('please provide email and password',400))
 
  }
    
  //check for user
  const user = await User.findOne({email}).select('+password')

  if(!user){
       return next(new errorResponse('invalid credientials',401))
  }

  const ismatch=await user.matchPassword(password)
console.log(ismatch)
  if(!ismatch){
       return next(new errorResponse('invalid credientials',401))
  }
    sendTokenResponse(user,200,res)
})

exports.getMe=asyncHandler(async(req,res,next)=>{
    const user =await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        data:user
    })
})



//get token from model  nad create a cookie and send response
const  sendTokenResponse=(user,statusCode ,res)=>{
      const token=user.getSignedJwtToken()

      const  options={
          expires: new Date(Date.now() +process.env.JWT_COOKIE_EXPIRE *24 *60*60*1000),
          httpOnly:true
      }


       if (process.env.NODE_ENV === "production") {
           options.secure=true
       }

      res
      .status(statusCode)
         .cookie('token',token,options)
         .json({
             success:true,
             token,
             
         })

        
}