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
//CRUD USER
  .get("/users", getAllUsers)
  .get("/user/history/:id", getHistoryByUserId)
  .get("/user/search", findUsersData)
  .post("/users/paginate", getUsersPaginate)
  .post("/user", insertUser)
  .post("/user/photo", uploadImage)
  .patch("/user/:id", updateUser)
  .patch("/user/update-user-balance/:id", updateUserBalance)
  .delete("/user/:id", deleteUser)
   
//GET ALL TRANSACTION BY ADMIN
  .get('/history', getAllHistory_Admin)

module.exports = router;
