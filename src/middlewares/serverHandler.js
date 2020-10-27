const status = require('../helpers/status')

exports.statusNotFound = (req, res) => {
    res.json({
        success: false,
        message: "404 Not Found"
    }).status(status.NOTFOUND)
}