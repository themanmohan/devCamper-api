const User = require('../model/user')
const asyncHandler = require('../middleware/async')
const errorResponse = require('../utils/errorResponse')


//@desc      get all user
//@route     get/api/v1/auth/users
//@access    private/admin

exports.getUsers = asyncHandler(async (req, res, next) => {
   res.status(200).json(res.advancedresult)
})

//@desc      get single   user
//@route     get/api/v1/auth/users
//@access    private/admin
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    const user=await User.findById(req.params.id)

    res.status(200).json({
        success:true,
        data:user
    })
})


//@desc      create   user
//@route     post/api/v1/auth/users
//@access    private/admin
exports.createUsers = asyncHandler(async (req, res, next) => {
    const user=await User.create(req.body)

    res.status(201).json({
        success:true,
        data:user
    })
})

//@desc      update   user
//@route     update/api/v1/auth/users
//@access    private/admin
exports.updateUsers = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc      delete   user
//@route     update/api/v1/auth/users
//@access    private/admin
exports.deleteUsers = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        
    })
})