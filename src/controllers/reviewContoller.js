const bookModel = require("../model/bookModel")
const reviewModel=require('../model/reviewModel')



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const createReview = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide blog details' })
            return
        }
        const {bookId,reviewedBy,reviewedAt,rating } = requestBody;
       
        
        if (!isValid(bookId)) {
            res.status(400).send({ status: false, message: 'bookId is required' })
            return
        }
        if (!isValid(reviewedBy)) {
            res.status(400).send({ status: false, message: `name is required` })
            return
        }
        
        if (!isValid(reviewedAt)) {
            res.status(400).send({ status: false, message: 'date is required' })
            return
        }
        if (!isValid(rating)) {
            res.status(400).send({ status: false, message: ' Please provide a valid rating between 1-5' })
            return
        }
     
        
        const user = await bookModel.findById(bookId);
        if (!user) {
            res.status(400).send({ status: false, message: `book does not exists` })
            return
        }
        const reviewData = {
            bookId,
            reviewedBy,
            reviewedAt,
            rating,
            review,
            isDeleted: isDeleted ? isDeleted : false,
            
        }
        const newReview = await reviewModel.create(reviewData)
        res.status(201).send({ status: true, message: 'review created successfully', data: newReview })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports.createReview = createReview