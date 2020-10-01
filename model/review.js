const mongoose = require('mongoose')
const Bootcamp = require('./bootcamp')

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

//preventing usrr to reviw more than one
ReviewSchema.index({bootcamp: 1,user: 1},{unique:true})



// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([{
            $match: {
                bootcamp: bootcampId
            }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: {
                    $avg: '$rating'
                }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageCost after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema)