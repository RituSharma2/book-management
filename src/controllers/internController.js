const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const internCreate = async function (req, res) {
    try {
        let dataByuser = req.body
        const collegeId = await collegeModel.findOne({ name: req.body.collegeName })
        if (!collegeId) {
            res.status(404).send({ status: false, msg: "college name not found" })
        } else {
            const createIntern = {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                collegeId: collegeId._id
            }
            const internCreate = await internModel.create(createIntern)
            res.status(200).send({ status: true, data: internCreate })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error })
    }
}
module.exports.internCreate = internCreate;