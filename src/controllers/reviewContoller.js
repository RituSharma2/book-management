const bookModel = require("../model/bookModel")
const reviewModel = require('../model/reviewModel')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId


//======= VALIDATION ======================================================================================
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

//=======================================================================================================
const createReview = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide blog details' })

        }
        const { bookId, reviewedBy, reviewedAt, rating } = requestBody;


        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: 'bookId is required' })

        }
        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: `name is required` })

        }

        if (!isValid(reviewedAt)) {
            return res.status(400).send({ status: false, message: 'date is required' })

        }
        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: ' Please provide a valid rating between 1-5' })

        }

        const user = await bookModel.findById(bookId);
        if (!user) {
            return res.status(400).send({ status: false, message: `book does not exists` })

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

//===========================================================================================================

const addReview = async (req, res) => {
    try {
        if (!(isValid(req.params.bookId) && isValidObjectId(req.params.bookId))) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }
        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: ' Review body is empty' })

        }
        let { reviewedBy, rating, review } = req.body

        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: 'reviewedBy is not valid ' })

        }
        if (!isValid(review)) {
            return res.status(400).send({ status: false, message: 'review is not valid ' })

        }

        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: 'rating is not valid ' })

        }
        if (!([1, 2, 3, 4, 5].includes(Number(rating)))) {
            return res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })

        }

        let book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (book) {

            req.body["bookId"] = req.params.bookId
            req.body["reviewedAt"] = new Date()

            let review = await reviewModel.create(req.body)

            let ReviewCount = await reviewModel.find({ bookId: req.params.bookId }).count()
            console.log(ReviewCount)

            let countUpdate = await bookModel.findOneAndUpdate({ _id: req.params.bookId }, { reviews: ReviewCount })

            return res.status(201).send({ status: true, msg: "Thank you for Reviewing the book !!", addedReview: review })

        } else {
            return res.status(404).send({ status: true, msg: "no such book exist to be review" })


        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message })

    }
}
module.exports.addReview = addReview

//====================================================================================================

const updateReview = async (req, res) => {

    try {
        let update = {}

        if (!(isValid(req.params.bookId) && isValidObjectId(req.params.bookId))) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }

        if (!(isValid(req.params.reviewId) && isValidObjectId(req.params.reviewId))) {
            return res.status(400).send({ status: false, msg: "reviewId is not valid" })
        }

        let book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (!book) {
            return res.status(400).send({ status: false, msg: "book not exist can't update it's review !!!!" })
        }

        let revieww = await reviewModel.findOne({ _id: req.params.reviewId, isDeleted: false })

        if (!revieww) {
            return res.status(400).send({ status: false, msg: "review not exist can't update it !!" })
        }

        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: ' Review update body is empty' })

        }

        let { reviewedBy, rating, review } = req.body
        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: 'reviewedAt is not valid value ' })
            }
            update["reviewedBy"] = reviewedBy
        }
        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, message: 'reviewedAt is not valid value ' })
            }
            update["review"] = review
        }
        if (rating) {
            if (!([1, 2, 3, 4, 5].includes(Number(rating)))) {
                return res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })

            }
            update["rating"] = rating
        }
        let updatedReview = await reviewModel.findOneAndUpdate({ _id: req.params.reviewId, isDeleted: false }, update, { new: true })

        return res.status(200).send({ status: false, msg: "review update is successfull...", updatedReview })


    } catch (err) {

        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.updateReview = updateReview
//=====================================================================================================


const deleteReview = async (req, res) => {

    try {

        if (!(isValid(req.params.bookId) && isValidObjectId(req.params.bookId))) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }

        if (!(isValid(req.params.reviewId) && isValidObjectId(req.params.reviewId))) {
            return res.status(400).send({ status: false, msg: "reviewId is not valid" })
        }

        let book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })

        if (!book) {
            return res.status(400).send({ status: false, msg: " book not exist " })
        }

        let deletedReview = await reviewModel.findOneAndUpdate({ _id: req.params.reviewId, isDeleted: false }, { isDeleted: true })

        if (deletedReview) {
            let reviewount = await reviewModel.find({ bookId: req.params.bookId, isDeleted: false }).count()
            await bookModel.findOneAndUpdate({ _id: req.params.bookId }, { reviews: reviewount })
            return res.status(200).send({ status: true, msg: "review is deleted successfully" })
        } else {
            return res.status(400).send({ status: false, msg: "review not exist" })
        }

    } catch (err) {

        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.deleteReview = deleteReview