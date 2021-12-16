const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController.js")

const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});
// API FOR COLLEGE CREATATION 
router.post('/functionup/Colleges', collegeController.collegeCreate);

// API FOR INTERN CREATATION
router.post('/functionup/interns', internController.internCreate);

// API FOR GET INTERNS 
router.get('/functionup/collegeDetails', collegeController.getAllIntern);


router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.post('/books', bookController.createBook)


module.exports = router;