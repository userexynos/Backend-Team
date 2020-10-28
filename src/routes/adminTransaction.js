const express = require('express')
const router = express.Router()

const { getAllHistory_Admin } = require('../controllers/transfer')

router
.get('/history', getAllHistory_Admin)
module.exports = router