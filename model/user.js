const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please add a name']
    },
    email:{
        type:String,
        required:[true,'please add a email'],
        unique:true,
        match:[
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please add email'
        ]
    },
    role:{
        type:String,
        enum:['user','publisher'],
        default:'user'
        
    },
    password:{
        type:String,
        required:[true,'please add password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }

    
})


//Encript password 
userSchema.pre('save',async function(next){
    const salt=await  bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})

//singn jwt and return

userSchema.methods.getSignedJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}

//compare password using jsonwebtoken
userSchema.methods.matchPassword=async function(enterpassword){
      return await bcrypt.compare(enterpassword,this.password)
      
}


module.exports=mongoose.model('User',userSchema)