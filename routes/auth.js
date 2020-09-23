const  express=require('express')

const {register,login,getMe}=require('../controllers/auth')
const {protect} =require('../middleware/auth')
const router =new express.Router()

router.post("/register", register);
router.post('/login',login)
router.get('/getMe',protect, getMe)
module.exports=router