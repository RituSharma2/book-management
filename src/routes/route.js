const express = require('express');
const router = express.Router();


const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const mid1=require('../middleware/tokenAuth')


//POST FOR USER
router.post('/register', userController.createUser)

//POST FOR LOGIN USER
router.post('/login', userController.loginUser)

//POST FOR BOOK
router.post('/books', mid1.mid1,bookController.createBook)


module.exports = router;