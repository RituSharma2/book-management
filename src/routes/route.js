const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController.js")


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});
// API FOR COLLEGE CREATATION 
router.post('/functionUp/Colleges', collegeController.collegeCreate);

// API FOR INTERN CREATATION
router.post('/functionup/interns', internController.internCreate);

// API FOR GET INTERNS 
router.get('/functionup/collegeDetails', collegeController.getAllIntern);


module.exports = router;