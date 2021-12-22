const express = require('express');
const router = express.Router();


const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const mid1 = require('../middleware/tokenAuth')
const reviewController = require('../controllers/reviewContoller')


//POST FOR USER
router.post('/register', userController.createUser)

//POST FOR LOGIN USER
router.post('/login', userController.loginUser)

//POST FOR BOOK
router.post('/books', mid1.mid1, bookController.createBook)

// get Book
router.get('/books', mid1.mid1, bookController.getBook)

//get books with all reviews
router.get("/books/:bookId", mid1.mid1, bookController.getBookWithreview)

//update Book
router.put('/books/:bookId', mid1.mid1, bookController.updateBook)

//delete book by bookId
router.delete('/books/:bookId', mid1.mid1, bookController.deleteById)

//add review

router.post('/books/:bookId/review', reviewController.addReview)

//Update review
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)

//delete
router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview)


module.exports = router;
