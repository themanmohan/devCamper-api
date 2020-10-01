const express = require('express')
const router = express.Router({
    mergeParams: true
})

const { getReview,getsingleReview,createReview,updateReview,deleteReview } = require('../controllers/review')
//middleware


const advancedresult = require('../middleware/advancedResult')
const {
    protect,
    authorize
} = require('../middleware/auth')

   const Review = require('../model/review')
const { route } = require('./Courses')

    router.route('/').get(advancedresult(Review, {
    path: 'bootcamp',
    select: 'name description'
}), getReview)

router.route('/').post(protect,authorize('user','admin'),createReview)
router.route('/:id').get(getsingleReview).put(protect, authorize('admin', 'user'), updateReview).delete(protect, authorize('admin', 'user'), deleteReview)

module.exports = router