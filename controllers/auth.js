const User = require('../model/user')
const asyncHandler = require('../middleware/async')
const errorResponse = require('../utils/errorResponse')
const sendEmail=require('../utils/sendEmail')
const crypto=require('crypto')



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

  if(!ismatch){
       return next(new errorResponse('invalid credientials',401))
  }
    sendTokenResponse(user,200,res)
})


//@desc      logout user
//@route     get/api/v1/auth/logout
//@access    public
// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});


//@desc      login ser
//@route     post/api/v1/auth/getMe
//@access    public
exports.getMe=asyncHandler(async(req,res,next)=>{
    const user =await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        data:user
    })
})



//@desc      forget password
//@route     post/api/v1/auth/forgetpassword
//@access    public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email:req.body.email})
    if(!user){
         return next(new errorResponse('email not founs', 404))
    }

    //get restepassord token

    const getrestToken=user.getPasswordRestToken()

    await user.save({validateBeforeSave:false})
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${getrestToken}`;
    const message =' you are getting this message because of you are requesting for the reset password '+resetURL
    try{
       sendEmail({
           email:user.email,
           subject:'Password reset',
           message
       })
       res.status(200).json({success:true,data:'email send'})
    }catch(err){

        console.log(err)
        user.resetPasswordToken=undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave:false})

        return next(new errorResponse('email could not send',500))

    }
    
    res.status(200).json({
        success: true,
        data: user
    })
})


exports.resetPassword=asyncHandler(async(req,res,next)=>{

    //get hashed token
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex')


    const user =await User.findOne({
        resetPasswordToken,
        
    })
    
    if(!user){
         return next(new errorResponse('user could not found',404))
    }
    user.password=req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire=undefined

    await user.save()

    sendTokenResponse(user, 200, res);
})



//@desc      update user detail
//@route     update/api/v1/auth/updateDetails
//@access    private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieltoupdate={
        role:req.body.role
        
    }

  const user = await User.findByIdAndUpdate(req.user.id,fieltoupdate,{
      new:true,
      runValidators:true
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});


//@desc      update user password
//@route     update/api/v1/auth/updatePassword
//@access    private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
   
    //checking current password
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next (new errorResponse(`password is  incorrect`,401))

    }

    user.password = req.body.newPassword
    await user.save()

    sendTokenResponse(user, 200, res);
});



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



