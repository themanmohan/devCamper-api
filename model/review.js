const mongoose = require('mongoose')
const bootcamp = require('./bootcamp')

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'please add  title for review'],
        maxlength:100
    },
    text: {
        type: String,
        required: [true, 'please add some text']
    },
    rating: {
        type: Number,
        min:1,
        max:10,
        required: [true, 'please addrating between 1 and 0']
    },
   
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})


module.exports = mongoose.model('Review', ReviewSchema)