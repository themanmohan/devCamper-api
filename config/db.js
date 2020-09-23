const mongoose=require('mongoose')

const connectDB=async()=>{
   const conn = await mongoose.connect(process.env.MONGO_URL, {
     useNewUrlParser: true,
     useCreateIndex: true,
     useFindAndModify: true,
     useUnifiedTopology: true,
   });

   console.log(`database connect ${conn.connection.host}`.yellow.underline)
}

module.exports=connectDB