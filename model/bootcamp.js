const mongoose=require('mongoose')
const slugify=require('slugify')
const geocoder=require('../utils/geocoder')
const BootcampSchema= new mongoose.Schema({
      name:{
          type:String,
          required:[true,'please add name'],
          unique:true,
          trim:true,
          maxlength:[30,'Name canot be more than 30 character']
      },
      slug:String,
      description:{
         type:String,
          required: [true, 'please add descriptiion'],
          maxlength:[1000,'description canot be more than 100 character']
      },
       website:{
           type:String,
           match:[
               /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
           ]
       },

       phone:{
           type:String,
            maxlength: [100, 'phone number length canot be more than 10 character']
       },
       email:{
           type:String,
           match:[
               /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
               'please add valid email'
           ]
       },
       address:{
           type:String,
           required:[true,'please add address']
       },
       location:{
           //geojson point
            type: {
                type: String,
                enum: ['point'],
                },
                coordinates: {
                    type:[Number],
                    index:'2dsphere'
                },
                formattedAddress:String,
                street:String,
                city:String,
                state:String,
                zipcode:String,
                country:String
       },
       careers:{
           //arra of string
           type:[String],
           required:true,
           enum:[
               'Web Development',
               'Mobile Development',
               'UI/UX',
               'Data Science',
               'Business',
               'other'
           ]
       },
       averageRating: {
           type:Number,
           min:[1,'Rating  must latleast 1 '],
           max:[10,'Rating cnnot be be more than 10']
       },
       averageCost:Number,
       photo:{
           type:String,
           default:'no-photo.jpeg'
       },
       housing:{
           type:Boolean,
           default:false
       },
       jobAssistance:{
            type:Boolean,
           default:false
       },
       jobGuarantee: {
           type: Boolean,
           default: false
       },
       acceptGi: {
           type: Boolean,
           default: false
       },
       createdAt:{
           type:Date,
           default:Date.now
       },
       user: {
           type: mongoose.Schema.ObjectId,
           ref: 'User',
           required: true
       }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

BootcampSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true})
     next()
})
// //geocoder
BootcampSchema.pre('save',async function(next){
   const loc=await geocoder.geocode(this.address)
   this.location={
       type:'Point',
       coordinates:[loc[0].longitude,loc[0].latitude],
       formattedAddress:loc[0].formattedAddress,
       street:loc[0].streetName,
       city: loc[0].city,
       state: loc[0].stateCode,
       zipcode: loc[0].zipcode,
       country: loc[0].countryCode
   }
   //Dont save adddress in db
   this.address=undefined;
   next()
})
 
//delete course when bootcamp delete
BootcampSchema.pre('remove',function(next){
    console.log(`courses remove id ${this._id}`)
    this.model('Course').deleteMany({bootcamp:this._id})
    next()
})

//reverse populate
BootcampSchema.virtual('courses',{
    ref:'Course',
    localField:'_id',
    foreignField:'bootcamp',

    justOne:false
})
module.exports=mongoose.model('Bootcamp',BootcampSchema)
