const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim:true,
        unique: true
    },
    excerpt: {
        type: String,
        trim:true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim:true,
        refs: 'user'
    },
    ISBN: {
        type: String,
        requireed: true,
        trim:true,
        unique: true
    },
    category: {
        type: String,
        trim:true,
        required: true
    },
    subcategory: {
        type: String,
        trim:true,
        required: true
    },
    reviews: {
        type: Number,
        default: 0,
        //comment: Holds number of reviews of this book
    },
    deletedAt: {
        type: Date,
        //when the document is deleted
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true,// format("YYYY-MM-DD")
    },



}, { timestamps: true })
module.exports = mongoose.model('Book', bookSchema)