const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')




const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}



const createUser = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author details' })
            return
        }

        const { name, title, email, phone, password } = requestBody

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'Title is required' })
            return
        }
        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, message: `Title should be among Mr, Mrs, Miss ` })
            return
        }

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'name is required' })
            return
        }
        if (!isValid(phone)) {
            res.status(400).send({ status: false, message: 'phone number is required' })
            return
        }

        if (!(/^[6-9]\d{9}$/gi.test(phone))) {
            res.status(400).send({ status: false, message: `phone number should be valid number` })
        }
        const isPhoneAlreadyUsed = await userModel.findOne({ phone });

        if (isPhoneAlreadyUsed) {
            res.status(400).send({ status: false, message: `${phone}  is already registered` })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }
        if (!(/[a-zA-Z0-9@]{8,15}/.test(password))) {
            res.status(400).send({ status: false, message: `password length should be betwwen 8-15` })
        }

        const isEmailAlreadyUsed = await userModel.findOne({ email });

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }


        let user = await userModel.create(req.body)
        res.status(201).send({ status: true, data: user })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

//=========================================================================================================
const loginUser = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }
        const { email, password } = requestBody;
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }
        const user = await userModel.findOne({ email, password });
        if (!user) {
            res.status(401).send({ status: false, message: `Invalid login credentials` });
            return
        }
        const token = await jwt.sign({
            userId: user._id,
            //exp: Math.floor(Date.now() / 1000) + 10*60*60
        }, '16th-Dec-Project-Books', { expiresIn: '30mins' })
        res.header('x-api-key', token);
        res.status(200).send({ status: true, message: `User logged in successfully`, data: { token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports.loginUser = loginUser
module.exports.createUser = createUser

//(jk)//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWJiMGU2MGYxOWQ1YWVhZWUzYTY3NDIiLCJpYXQiOjE2Mzk2NTAzNjMsImV4cCI6MTYzOTY1MjE2M30.baaV0I5D_5ZhV9XzP_Sc2SnZ5ReYLs5Gt_ccovSNqbA








