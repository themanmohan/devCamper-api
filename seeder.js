const fs =require('fs')
const Bootcamp=require('./model/bootcamp')
const  Course=require('./model/Course')
const User = require('./model/user')

const dotenv=require('dotenv')
const  color=require('colors')
const mongoose = require('mongoose')
///laoding env var
dotenv.config({path:'config/config.env'})


 mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
 })

 const bootcamp=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
 const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const user = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
 //immport data
  const insertdata=async()=>{
      try{
          await Bootcamp.create(bootcamp)
          console.log('Data Imported.....'.green.inverse)
          process.exit()
      }catch(erro){
           console.log(erro)
      }
 }

 const insertcourse = async () => {
     try {
         await Course.create(courses)
          await User.create(user)
         console.log('Data Imported.....'.green.inverse)
         process.exit()
     } catch (erro) {
         console.log(erro)
     }
 }

 //delete data
 const deletecourses = async () => {
     try {
         await Course.deleteMany()
         await User.deleteMany()
         console.log('Data deleted.....'.red.inverse)
         process.exit()
     } catch (erro) {
         console.log(erro)
     }
 }
  //delete data
  const deleteData = async () => {
      try {
          await Bootcamp.deleteMany()
          
          console.log('Data deleted.....'.red.inverse)
          process.exit()
      } catch (erro) {
          console.log(erro)
      }
  }


  if(process.argv[2]=='-i'){
      insertdata()
  }else if(process.argv[2]=='-d'){
      deleteData()
  }

  if (process.argv[2] == '-ci') {
      insertcourse()
  } else if (process.argv[2] == '-cd') {
      deletecourses()
      deleteData()
  }