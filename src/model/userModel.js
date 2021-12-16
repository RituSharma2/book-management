const mongoose = require("mongoose")
//const validator = require("validator")
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (phone) {
                return /^[6-9]\d{9}$/gi.test(phone)
            }, message: 'Please fill a valid mobile number', isAsync: false
        },
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,

        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLen: 8,
        maxLen: 15
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        pincode: {
            type: String,
            trim: true,
        }
    },
}, { timestamps: true })
module.exports = mongoose.model('user', userSchema)
