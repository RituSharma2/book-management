
const jwt = require('jsonwebtoken')
const mid1 = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) {
            return res.status(401).send({ status: false, msg: "no authentication token" })
        } else {
            let decodeToken = jwt.verify(token, '16th-Dec-Project-Books')
            if (decodeToken) {
                req.decodeToken = decodeToken
                next()

            } else {
                res.status(401).send({ status: false, msg: "not a valid token" })
            }
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error })
    }


}
module.exports.mid1=mid1