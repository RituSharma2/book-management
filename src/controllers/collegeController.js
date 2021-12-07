const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

// POST FOR COLLEGE CREATATION 

const collegeCreate = async function (req, res) {
    try {
        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
            return
        }
        if (!isValid(requestBody.name)) {
            res.status(400).send({ status: false, message: 'college name is required' })
            return
        }
        if (!isValid(requestBody.fullName)) {
            res.status(400).send({ status: false, message: 'college full name is required' })
            return
        }
        if (!isValid(requestBody.logoLink)) {
            res.status(400).send({ status: false, message: 'logo link is required' })
            return
        }
        let collegeCreate = await collegeModel.create(requestBody)
        res.status(200).send({ status: true, data: collegeCreate })

    } catch (error) {
        res.status(500).send({ status: false, msg: error })
    }

}
//=================================================================================================================================>

// GET INTERN FROM EACH COLLEGE
const getAllIntern = async function (req, res) {
    try {
        let collegeName = req.query.collegeName;
        if (!collegeName) {
            return res.status(400).send({ status: false, msg: "please provide college name in query params" })
        }
        let collegeDetail = await collegeModel.findOne({ name: collegeName })
        console.log(collegeDetail)
        if (!collegeDetail) {
            return res.status(400).send({ status: false, msg: "College name not found" })
        }
        let internDetail = await internModel.find({ collegeId: collegeDetail._id }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        let result = {
            name: collegeDetail.name,
            fullName: collegeDetail.fullName,
            logoLink: collegeDetail.logoLink,
            interests: internDetail
        }
        console.log(result)
        res.status(200).send({ status: true, data: result })

    } catch (error) {
        res.status(500).send({ status: false, msg: error })
    }

}
module.exports.collegeCreate = collegeCreate;
module.exports.getAllIntern = getAllIntern;