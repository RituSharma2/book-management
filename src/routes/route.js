const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController')
const internController = require('../controllers/internController')

router.post('/functionup/colleges', collegeController.createCollege)

router.post('/functionup/interns', internController.internCreate)

//router.get('/functionup/collegeDetails',collegeController)


module.exports = router;