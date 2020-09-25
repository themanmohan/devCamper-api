const mongoose =require('mongoose')
const bootcamp = require('./bootcamp')

const CourseSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'please add  a course title']
    },
    description:{
        type:String,
        required:[true,'please add description']
    },
    weeks:{
        type:String,
        required:[true,'please add number of weeks']
    },
    tuition: {
        type:Number,
        required:[true,'please add tution cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'please add minimum skill'],
        enum:['beginner','intermediate','advanced']
    },
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
   createdAt: {
      type:Date,
      default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required:true
    },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      }
})

//static method to get  getaverage cost
CourseSchema.statics.getAverageCost=async function(bootcampId){
  console.log('calculating average course'.blue)
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);
 try{
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
         averageCost: Math.ceil(obj[0].averageCost / 10) * 10
     });
         
    
 }catch(error){
    console.log(error)
 }
}

//calling getvaergaecost after save

CourseSchema.post("save",function(){
   this.constructor.getAverageCost(this.bootcamp);
})

//calling getvaergaecost before save

CourseSchema.pre("remove", function () {
      this.constructor.getAverageCost(this.bootcamp);
})
module.exports= mongoose.model('Course',CourseSchema)