const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUsersPaginate,
  insertUser,
  updateUser,
  updateUserBalance,
  deleteUser,
  getHistoryByUserId,
  findUsersData,
  uploadImage,
} = require("../controllers/admin");

const {
  getAllTopup,
  getTopup,
  updateTopup,
  deleteTopup,
  insertTopup,
} = require("../controllers/topup");

//tab users
router
  .get("/users", getAllUsers)
  .post("/users/paginate", getUsersPaginate)
  .post("/users", insertUser)
  .patch("/users/:id", updateUser)
  .patch("/users/update-user-balance/:id", updateUserBalance)
  .delete("/users/:id", deleteUser)
  .get("/users/history/:id", getHistoryByUserId)
  .get("/users/search", findUsersData)
  .post("/users/photo", uploadImage)

//tab topup
router
  .get('/topup', getAllTopup)
  .get('/topup/:id', getTopup)
  .post('/topup', insertTopup)
  .patch('/topup/:id', updateTopup)
  .delete('/topup/:id', deleteTopup)

module.exports = router;
