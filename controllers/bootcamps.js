const Bootcamp=require('../model/bootcamp')
const path =require('path')
const asyncHandler = require('../middleware/async')
const errorResponse=require('../utils/errorResponse')
const geocoder=require('../utils/geocoder')

//@desc      Get all bootcamps
//@route     GET/api/v1/bootcapms
//@access    public
exports.getAllBootcamp=asyncHandler(async(req,res,next)=>{
         

         res.status(200).json(res.advancedresult)
    
})

//@desc      Get single bootcamps
//@route     GET/api/v1/bootcapms/:id
//@access    public
exports.getBootcamp = asyncHandler(async(req, res, next) => {
       const bootcamp=await Bootcamp.findById(req.params.id)

        if (!bootcamp){
           return next(new errorResponse(`Bootcamp not found with id ${req.params.id}`, 404))
        }
       res.status(200).json({
           success:true,
           data:bootcamp
       })
   
})
//@desc      create New bootcamps
//@route     POST/api/v1/bootcapms
//@access    private
exports.createBootcamp = asyncHandler(async(req, res, next) => {

    //adding user to req
    req.body.user=req.user.id

    //checking for published bootcamp

    const publishedBootcamp=await Bootcamp.findOne({user:req.user.id})
     
     // if the user is not  admin they can only add one bootcamp
     if(publishedBootcamp &&  req.user.role!=='admin'){
         return next(new errorResponse(`The User With Id ${req.user.id} has already published`,404))
     }

    
     const bootcamp = await Bootcamp.create(req.body)
     res.status(201).json({
         success:true,
         data: bootcamp
     })
   
   
})


//@desc      Update  bootcamps
//@route     Put/api/v1/bootcapms/:id
//@access    private
exports.updateBootcamp = asyncHandler(async(req, res, next) => {
        let bootcamp = await Bootcamp.findById(req.params.id)

        if (!bootcamp) {
          return next(new errorResponse(`Bootcamp not found with id ${req.params.id}`, 404))
        }
    
        //make sure onluy owner  update
        if(bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
            
            return next(new errorResponse(`User with id ${req.params.id} not authorie to update`, 401))
        }

        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true,
            useFindAndModify: false
        })
        res.status(200).json({
            success: true,
            data: bootcamp
        })
 
})

//@desc     delete bootcamp
//@route    DELETE .api/v1/bootcamps/:id
//@access   private

exports.deleteBootcamp=asyncHandler(async(req,res,next)=>{
    const bootcamp=await  Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(new errorResponse('Bootcamp not found '))
    }

     if(bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
            return next(new errorResponse(`User with id ${req.params.id} not authorie to update`, 401))
        }

    bootcamp.remove()
    res.status(200).json({success:true,data:{}})
})


//@desc      getbootcmap with in raduis 
//@route     delte/api/v1/bootcapms/raduis/:zipcode/:distance
//@access    private
exports.getBootcompInRaduis = asyncHandler(async(req, res, next) => {
    
      const {zipcode,distance}=req.params;
      
      //getting lag,log
      const loc=await geocoder.geocode(zipcode)
      const lat=loc[0].latitude
     const lng=loc[0].longitude

      //calculating radius
      const radius=distance / 3963;

      const bootcamps=await Bootcamp.find({
          location:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
          
      })
     
       res.status(200).json({
           success:true,
           count:bootcamps.length,
           data:bootcamps
       })
    
})

//@desc     upload photo bootcamp
//@route    PUT .api/v1/bootcamps/:id/photo
//@access   private

exports.uploadPhotoBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new errorResponse('Bootcamp not found ',404))
    }

    //make sure ownership
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse(`User with id ${req.params.id} not authorie to update`, 401))
    }


    if(!req.files){
        return next(new errorResponse(' please upload file ',500))
    }

    const file=req.files.file

    //make sure upload image file
    if(!file.mimetype.startsWith('image')){
          return next(new errorResponse(' please upload image  file ', 500))
    }

    //checking file size

    if (file.size > process.env.FILE_MAX_UPLOAD){
         return next(new errorResponse(' please upload image  file size less than  ' + process.env.FILE_MAX_UPLOAD, 400))
    }
    const name=file.name.split('.')[0]
      
    file.name=`${name}${req.params.id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
        if(err){
             return next(new errorResponse(' problem with file upload ', 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
    })
    res.status(200).json({
        success:true,
        data:file.name
    })
})