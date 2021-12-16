const bookModel = require("../model/bookModel")
const userModel =require('../model/userModel')



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const createBook = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide blog details' })
            return
        }
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt } = requestBody;
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
      //  if (!isValid(reviews)) {
          //  res.status(400).send({ status: false, message: ' Please provide a valid Review between 1-5' })
           // return
       // }
        if (!isValid(releasedAt)) {
            res.status(400).send({ status: false, message: ' Please provide a valid ReleasedAt date' })
            return
        }
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(400).send({ status: false, message: `User does not exists` })
            return
        }
        const bookData = {
            title,
            excerpt,
            userId,
            ISBN,
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