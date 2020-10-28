const express = require('express')
const router = express.Router()

const { getAllTopup, getTopup, updateTopup, deleteTopup, insertTopup } = require('../controllers/topup')

router
  .get('/', getAllTopup)
  .get('/:id', getTopup)
  .post('/', insertTopup)
  .patch('/:id', updateTopup)
  .delete('/:id', deleteTopup)
module.exports = router


// INI KAYANYA GA KEPAKE KAN,
// GET TOPUP NYA USER NGAMBIL DI ROUTE USERS, CRUD NYA ADMIN AMBIL DI ROUTE ADMIN.
// JD INI KAYA NYA GA GUNA LAGI:3