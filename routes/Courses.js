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
const {protect} =require('../middleware/auth')
const Course=require('../model/Course')
router.route('/').get(advancedresult(Course, {
   path: 'bootcamp',
   select: 'name description'
}), getCourse).post(protect, addCourse)
router.route('/:id').get(getSingleCourse).put(protect, updateCourses).delete(protect, deleteCourses)


module.exports = router