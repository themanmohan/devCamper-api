const Courses = require('../model/Course')
const asyncHandler = require('../middleware/async')
const errorResponse = require('../utils/errorResponse')
const Bootcamp=require('../model/bootcamp')
const Course = require('../model/Course')

//@desc      Get courses
//@route     GET/api/v1/courses
//@route     GET/api/v1/bootcamp/:bootcampId/courses
//@access    public

exports.getCourse=asyncHandler(async(req,res,next)=>{
   

    if(req.params.bootcampsId){
        const courses=await Courses.find({bootcamp:req.params.bootcampsId})
        return res.status(200).json({
            success:true,
            count:courses.length,
            data:courses
        })
    }else{
      
      res.status(200).json(res.advancedresult)
    }

  
})

//@desc      Get single courses
//@route     GET/api/v1/courses/:id
//@access    public

exports.getSingleCourse=asyncHandler(async(req,res,next)=>{
   
    const courses=await Courses.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name descripption'
    })

    if(!courses){
        return next(new errorResponse(`No course find with id ${req.params.id}`,404))
    }

    res.status(200).json({
        success:true,
        data:courses
        
    })
})


//@desc       add courses
//@route     POST/api/v1/bootcamp/:bootcampId/courses
//@access    private

exports.addCourse=asyncHandler(async(req,res,next)=>{
   req.body.bootcamp=req.params.bootcampsId
   req.body.user=req.user.id

    const bootcamp=await Bootcamp.findById(req.params.bootcampsId)



    if(!bootcamp){
        return next(new errorResponse(`No bootcamp find with id ${req.params.id}`,404))
    }
 
    //make sure ownership
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse(`User with id ${req.params.id} not authorie to add 
        cousre to bootcamp with id${req.params.bootcampsId}`, 401))
    }
 
    const courses=await Course.create(req.body)

    res.status(200).json({
        success:true,
        data:courses
        
    })
})


//@desc       update courses
//@route     PUT/api/v1/courses
//@access    private

exports.updateCourses=asyncHandler(async(req,res,next)=>{
    let courses=await Courses.findById(req.params.id)
    if(!courses){
        return next(new errorResponse(`No courses find with id ${req.params.id}`,404))
    }
       //make sure owneship
    if (courses.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse(`User with id ${req.params.id} not authorie to update 
        cousre `, 401))
    }


     courses=await Course.findByIdAndUpdate(req.params.id,req.body,{
         new:true,
         runValidators:true
     })
    res.status(200).json({
        success:true,
        data:courses
        
    })
})

//@desc       delete courses
//@route     PUT/api/v1/courses
//@access    private

exports.deleteCourses=asyncHandler(async(req,res,next)=>{
    const courses=await Courses.findById(req.params.id)
    if(!courses){
        return next(new errorResponse(`No courses find with id ${req.params.id}`,404))
    }

       //make sure owneship
       if (courses.user.toString() !== req.user.id && req.user.role !== 'admin') {
           return next(new errorResponse(`User with id ${req.params.id} not authorie to update 
        cousre `, 401))
       }

       
    courses.remove()
    res.status(200).json({
        success:true,
        data:{}
        
    })
})