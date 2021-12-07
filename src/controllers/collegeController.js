const collegeModel = require('../models/collegeModel')

const createCollege = async function (req, res) {
    try {
        let collegeDetails = req.body
        let collegeCreated = await collegeModel.create(collegeDetails)
        res.status(200).send({ data: collegeCreated })
    } catch (err) {
        res.status(500).send({ status: false, msg: err })
    }
}
//const 
module.exports.createCollege = createCollege