const  express=require('express')

const {logout,register,updatePassword,login,getMe,forgetPassword,resetPassword,updateDetails}=require('../controllers/auth')
const {protect} =require('../middleware/auth')
const router =new express.Router()

router.post("/register", register);
router.post('/login',login)
router.get('/logout', logout)

router.get('/getMe',protect, getMe)
router.put('/updateDetails', protect, updateDetails)
router.put('/updatePassword', protect, updatePassword)

router.post('/forgetpassword', forgetPassword)
router.put('/resetpassword/:resetToken', resetPassword)
module.exports=router