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
const {protect} =require('../middleware/auth')

//middlware
const advancedresult=require('../middleware/advancedResult')

//resource router 

const courseRouter=require('./Courses')

router.use('/:bootcampsId/courses',courseRouter)
router.route('/:id/photo').put(protect,uploadPhotoBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootcompInRaduis)
router.route('/').get(advancedresult(Bootcamp, 'courses'), getAllBootcamp).post(protect, createBootcamp)

router.route('/:id').put(protect, updateBootcamp).get(getBootcamp).delete(protect, deleteBootcamp)

module.exports=router