const  express=require('express')
const router=express.Router()

const {
    getAllBootcamp,
    createBootcamp,
    deleteBootcamp,
    getBootcamp,
    updateBootcamp,
    getBootcompInRaduis,
    uploadPhotoBootcamp
} = require('../controllers/bootcamps')

const Bootcamp=require('../model/bootcamp')
const {protect,authorize} =require('../middleware/auth')

//middlware
const advancedresult=require('../middleware/advancedResult')

//resource router 

const courseRouter=require('./Courses')
const reviewRouter = require('./review')


router.use('/:bootcampsId/courses',courseRouter)
router.use('/:bootcampsId/review', reviewRouter)

router.route('/:id/photo').put(protect,authorize('publisher','admin'),uploadPhotoBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootcompInRaduis)
router.route('/').get(advancedresult(Bootcamp, 'courses'), getAllBootcamp).post(protect, authorize('publisher', 'admin'), createBootcamp)

router.route('/:id').put(protect, authorize('publisher','admin'), updateBootcamp).get(getBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

module.exports=router