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
  getAllHistory_Admin

} = require("../controllers/admin");

router
  .get("/", getAllUsers)
  .post("/paginate", getUsersPaginate)
  .post("/", insertUser)
  .patch("/:id", updateUser)
  .patch("/update-user-balance/:id", updateUserBalance)
  .delete("/:id", deleteUser)
  .get("/history/:id", getHistoryByUserId)
  .get("/search", findUsersData)
  .post("/photo", uploadImage)
  
  .get('/history', getAllHistory_Admin)

module.exports = router;
