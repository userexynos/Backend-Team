const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { getAllTopup } = require("../controllers/topup");
const {
  uploadImage,
  transferBalance,
  findUsersData,
  createPin,
  getUserByToken,
  addPhoneNumber,
  deletePhoneNumber,
  changePassword,
  getAllHistoryByUserId,
  getUserById,
} = require("../controllers/users");

const validatePin = [
  body("pin")
    .isLength({ min: 6, max: 6 })
    .withMessage("PIN must be 6 character"),
];

const validateTransfer = [
  body("id").not().isEmpty().withMessage("ID Cannot be empty"),
  body("total").not().isEmpty().withMessage("Total Cannot be empty"),
  body("note").not().isEmpty().withMessage("Note Cannot be empty"),
  ...validatePin,
];

const validateAddPhone = [
  body("phone").not().isEmpty().withMessage("Phone Cannot be empty"),
];

const validatePassword = [
  body("password").not().isEmpty().withMessage("Password cannot be null"),
  body("passwordNew")
    .not()
    .isEmpty()
    .withMessage("Password New cannot be null"),
];

router
  .get("/histories", getAllHistoryByUserId)
  .get("/detail", getUserByToken)
  .get("/search", findUsersData)
  .get("/guide-topup", getAllTopup)
  .get("/:id", getUserById)
  .post("/photo", uploadImage)
  .post("/transfer", validateTransfer, transferBalance)
  .patch("/phone", validateAddPhone, addPhoneNumber)
  .patch("/create_pin", validatePin, createPin)
  .patch("/password", validatePassword, changePassword)
  .delete("/phone", deletePhoneNumber)
module.exports = router;
