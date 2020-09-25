const express = require('express')
const router = express.Router({mergeParams:true})

const {
   getCourse,
   getSingleCourse,
   addCourse,
   updateCourses,
   deleteCourses
} = require('../controllers/courses')
//middleware

const advancedresult=require('../middleware/advancedResult')
const {protect,authorize} =require('../middleware/auth')
const Course=require('../model/Course')
router.route('/').get(advancedresult(Course, {
   path: 'bootcamp',
   select: 'name description'
}), getCourse).post(protect, authorize('publisher', 'admin'), addCourse)
router.route('/:id').get(getSingleCourse).put(protect, authorize('publisher', 'admin'), updateCourses).delete(protect, authorize('publisher', 'admin'), deleteCourses)


module.exports = router