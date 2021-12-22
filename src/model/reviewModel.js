const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({


    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        refs: 'Book'
    },
    reviewedBy: {
        type: String,
        required: true,
        trim: true,
        default: 'Guest',
        //value: reviewer's name
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    review: {
        type: String,
        trim: true,
        optional: true,

    },
    isDeleted: {
        type: Boolean,
        default: false
    },




}, { timestamps: true })
module.exports = mongoose.model('Review', reviewSchema)