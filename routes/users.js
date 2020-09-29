const express = require('express')
const router = express.Router({mergeParams:true})

const {
  getUsers,updateUsers,deleteUsers,getSingleUser,createUsers
} = require('../controllers/users')
//middleware

const advancedresult=require('../middleware/advancedResult')
const {protect,authorize} =require('../middleware/auth')
const User=require('../model/user')

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedresult(User),getUsers)
router.route('/:id').post(createUsers).get(getSingleUser).put(updateUsers).delete(deleteUsers)


module.exports = router