const { request } = require("express")
const bookModel = require("../model/bookModel")
const userModel = require('../model/userModel')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const reviewModel = require('../model/reviewModel')



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



//======================================================================================================
const createBook = async function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin','*')
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide blog details' })
            return
        }
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt,bookCover } = requestBody;
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'Book Title is required' })
            return
        }
        const isTitleUsed = await bookModel.findOne({ title });

        if (isTitleUsed) {
            res.status(400).send({ status: false, message: `${title}  already registered` })
            return
        }
        if (!isValid(excerpt)) {
            res.status(400).send({ status: false, message: 'Excerpt is required' })
            return
        }
        if (!isValid(userId)) {
            res.status(400).send({ status: false, message: 'UserId is required' })
            return
        }
        if (!isValid(ISBN)) {
            res.status(400).send({ status: false, message: `ISBN is not a valid` })
            return
        }
        const isISBNalreadyUsed = await bookModel.findOne({ ISBN });

        if (isISBNalreadyUsed) {
            res.status(400).send({ status: false, message: `${ISBN} should be unique` })
            return
        }
        if (!isValid(category)) {
            res.status(400).send({ status: false, message: 'Book category is required' })
            return
        }
        if (!isValid(subcategory)) {
            res.status(400).send({ status: false, message: 'Book subcategory is required' })
            return
        }

        if (!isValid(releasedAt)) {
            res.status(400).send({ status: false, message: ' Please provide a valid ReleasedAt date' })
            return
        }
        //Validation of releasedAt

        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
            return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
        }


        const user = await userModel.findById(userId);
        if (!user) {
            res.status(400).send({ status: false, message: `User does not exists` })

        }
        const bookData = {
            title,
            excerpt,
            userId,
            ISBN,
            bookCover,
            category,
            subcategory,
            reviews,
            releasedAt,
            isDeleted: isDeleted ? isDeleted : false,
            deletedAt: isDeleted ? new Date() : null
        }
        const newBook = await bookModel.create(bookData)
        res.status(201).send({ status: true, message: 'New book created successfully', data: newBook })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports.createBook = createBook

//=======================================================================================================


const getBook = async (req, res) => {
    try {
        let filter = {
            isDeleted: false
        }
        if (req.query.userId) {

            if (!(isValid(req.query.userId) && isValidObjectId(req.query.userId))) {
                return res.status(400).send({ status: false, msg: "userId is not valid" })
            }
            filter["userId"] = req.query.userId
        }
        if (req.query.category) {

            if (!isValid(req.query.category)) {
                return res.status(400).send({ status: false, message: 'Book category is not valid ' })
            }
            filter["category"] = req.query.category
        }
        if (req.query.subcategory) {

            if (!isValid(req.query.subcategory)) {
                return res.status(400).send({ status: false, message: 'Book subcategory is not valid' })

            }
            filter["subcategory"] = req.query.subcategory
        }
        let book = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (book.length > 0) {
            res.status(200).send({ status: true, message: "book  list", data: book })
            return
        } else {
            res.status(400).send({ status: false, message: "no such book found !!" })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: "i found the error", error: err.message })
    }
}

module.exports.getBook = getBook

//========================================================================================================

const getBookWithreview = async (req, res) => {

    try {

        if (!(isValid(req.params.bookId) && isValidObjectId(req.params.bookId))) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }

        let tempbook = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })

        if (tempbook) {

            let reviews = await reviewModel.find({ bookId: req.params.bookId, isDeleted: false })
            let reviewCount = reviews.length

            if (reviews.length > 0) {

                tempbook.reviews = reviewCount
                res.status(200).send({
                    status: true, data: {
                        ...tempbook.toObject(), reviewData: reviews
                    }
                })
                return
            } else {
                res.status(200).send({
                    status: true, data: {
                        ...tempbook.toObject(), reviewData: reviews
                    }
                })
            }
        } else {
            res.status(404).send({ status: false, msg: "book not exist" })
            return
        }

    } catch (err) {

        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }
}
module.exports.getBookWithreview = getBookWithreview

//==========================================================================================================

const updateBook = async (req, res) => {

    try {

        let filter = {
            _id: req.params.bookId,
            isDeleted: false,
            userId: req.decodeToken._id
        }

        let update = {}

        if (!isValidRequestBody(req.body)) {
            res.status(400).send({ status: false, message: 'body is empty' })
            return
        }

        let { title, excerpt, releasedAt, ISBN } = req.body

        if (title) {

            if (!isValid(title)) {
                return res.status(400).send({ status: false, message: 'title is not valid or empty' })
            }

            update['title'] = title

        }

        // else{
        //     return res.status(400).send({ status: false, message: 'title is not valid or empty' })
        // }

        if (excerpt) {

            if (!isValid(excerpt)) {

                return res.status(400).send({ status: false, message: 'excerpt is not valid ' })
            }

            update['excerpt'] = excerpt

        }

        // else{
        //     return res.status(400).send({ status: false, message: 'excerpt is not valid or empty' })
        // }


        if (ISBN) {

            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, message: 'ISBN is not valid ' })
            }

            update['ISBN'] = ISBN
        }

        // else{
        //     return res.status(400).send({ status: false, message: 'ISBN is not valid or empty' })
        // }

        if (releasedAt) {

            if (!isValid(releasedAt)) {
                return res.status(400).send({ status: false, message: 'releasedAt is not valid value ' })
            }

            if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
                return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
            }


        }

        // else{
        //     return res.status(400).send({ status: false, message: 'releasedAt is not valid or empty' })
        // }



        let updatedBook = await bookModel.findOneAndUpdate(filter, update, { new: true })

        if (updatedBook) {
            res.status(200).send({ status: true, message: "success", data: updatedBook })
            return
        } else {
            res.status(200).send({ status: false, message: "either book is deleted or u are not valid user to update this book" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message })
    }


}

module.exports.updateBook = updateBook




//===================================================================================================


const deleteById = async (req, res) => {

    try {

        if (!(isValid(req.params.bookId) && isValidObjectId(req.params.bookId))) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }

        let filter = {

            isDeleted: false,
            _id: req.params.bookId,
            userId: req.decodeToken._id
        }

        let deletedBook = await bookModel.findOneAndUpdate(filter, { isDeleted: true, deletedAt: new Date() })


        if (deletedBook) {
            return res.status(200).send({ status: true, msg: "book is successfully deleted" })
        } else {
            return res.status(400).send({ status: false, msg: "either the book is deleted or u have no access to delet this book" })

        }


    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: "i found the error", error: err.message })
    }
}

module.exports.deleteById = deleteById

//======================================================================================================

const addReview = async (req, res) => {
    try {
        if (!(isValid(req.params.bookId) && isValidObjectId(req.params.bookId))) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }
        if (!isValidRequestBody(req.body)) {
            res.status(400).send({ status: false, message: ' Review body is empty' })
            return
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
            res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })
            return
        }

        let book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (book) {

            req.body["bookId"] = req.params.bookId
            req.body["reviewedAt"] = new Date()

            let review = await reviewModel.create(req.body)

            let ReviewCount = await reviewModel.find({ bookId: req.params.bookId }).count()
            console.log(ReviewCount)

            let countUpdate = await bookModel.findOneAndUpdate({ _id: req.params.bookId }, { reviews: ReviewCount })

            res.status(201).send({ status: true, msg: "Thank you for Reviewing the book !!", addedReview: review })
            return
        } else {
            res.status(400).send({ status: true, msg: "no such book exist to be review" })
            return

        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: "i found the error", error: err.message })

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
            res.status(400).send({ status: false, message: ' Review update body is empty' })
            return
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
                res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })
                return
            }
            update["rating"] = rating
        }
        let updatedReview = await reviewModel.findOneAndUpdate({ _id: req.params.reviewId, isDeleted: false }, update, { new: true })

        res.status(200).send({ status: false, msg: "review update is successfull...", updatedReview })
        return

    } catch (err) {

        console.log(err)
        res.status(500).send({ msg: "i found the error", error: err.message })
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

        if (book) {

            let deletedReview = await reviewModel.findOneAndUpdate({ _id: req.params.reviewId, isDeleted: false }, { isDeleted: true })

            let reviews_left = await reviewModel.find({ bookId: req.params.bookId, isDeleted: false })

            let reviewCount = reviews_left.length

            if (deletedReview) {

                res.status(200).send({
                    status: true, msg: "review is deleted successfully", data: {
                        ...book.toObject(), reviewData: reviews_left, reviews: reviewCount
                    }
                })


            } else {

                return res.status(400).send({
                    status: false, msg: "User review not exist or is already deleted", data: {
                        ...book.toObject(), reviewData: reviews_left, reviews: reviewCount
                    }
                })

            }
        } else {
            return res.status(400).send({ status: false, msg: "book do not exist" })
        }

    } catch (err) {

        console.log(err)
        res.status(500).send({ status: false, error: err.message })

    }

}

module.exports.deleteReview = deleteReview






































