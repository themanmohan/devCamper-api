const Review = require('../model/review')
const asyncHandler = require('../middleware/async')
const errorResponse = require('../utils/errorResponse')
const Bootcamp = require('../model/bootcamp')
const Course = require('../model/Course')

//@desc      Get reviews
//@route     GET/api/v1/review
//@route     GET/api/v1/bootcamp/:bootcampId/review
//@access    public

exports.getReview = asyncHandler(async (req, res, next) => {


    if (req.params.bootcampsId) {
        const review = await Review.find({
            bootcamp: req.params.bootcampsId
        })
        return res.status(200).json({
            success: true,
            count: review.length,
            data: review
        })
    } else {

        res.status(200).json(res.advancedresult)
    }
})


//@desc      Get reviews
//@route     GET/api/v1/review
//@route     GET/api/v1/bootcamp/:bootcampId/review
//@access    public

exports.getsingleReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })

    if(!review){
        return next(new errorResponse('review not found',404))
    }

        return res.status(200).json({
            success: true,
            count: review.length,
            data: review
        })
    
})


//@desc      create review for bootcamp
//@route     post/api/v1/review
//@route     post/api/v1/bootcamp/:bootcampId/review
//@access    private

exports.createReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp=req.params.bootcampsId
    req.body.user=req.user.id

    const bootcamp=await Bootcamp.findById(req.params.bootcampsId)

    if (!bootcamp) {
        return next(new errorResponse('bootcamp not found', 404))
    }

    const review=await Review.create(req.body)

    return res.status(201).json({
        success: true,
        count: review.length,
        data: review
    })

})





//@desc      update review 
//@route     put/api/v1/review/id
//@access    private

exports.deleteReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id)

    if (!review) {
        return next(new errorResponse('Review is  not found', 404))
    }

    if(review.user.toString()!==req.user.id  && req.user.role!=='admin'){
         return next(new errorResponse('you are not athorixe to update this review', 401))
    }

  await review.remove()

    return res.status(201).json({
        success: true,
      
        data:{}
     })

})


//@desc      selete review 
//@route     delete/api/v1/review/id
//@access    private

exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id)

    if (!review) {
        return next(new errorResponse('Review is  not found', 404))
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse('you are not athorixe to update this review', 401))
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    return res.status(201).json({
        success: true,
        count: review.length,
        data: review
    })

})