const { compareSync, genSaltSync, hashSync } = require("bcryptjs");
const { validationResult } = require("express-validator");
const { sign } = require("jsonwebtoken");
const {
  insertUser,
  getUserByEmail,
  getUserByDevice,
  updateUser,
  updateUserDevice,
} = require("../models/users");
const {
  resSuccess,
  resFailure,
  BADREQUEST,
  UNAUTHORIZED,
  CREATED,
  INTERNALSERVERERROR,
} = require("../helpers/status");

class Auth {
  async loginUser(req, res) {
    const { email, password: passwordBody, device } = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return resFailure(res, BADREQUEST, errors.array()[0].msg, {});

      const checkEmail = await getUserByEmail(email);
      if (!checkEmail.length)
        return resFailure(
          res,
          UNAUTHORIZED,
          "Email and Password incorrect",
          {}
        );

      const { password, role, id } = checkEmail[0];
      const compare = compareSync(passwordBody, password);
      if (!compare)
        return resFailure(
          res,
          UNAUTHORIZED,
          "Email and Password incorrect",
          {}
        );

      if (device) {
        const checkDevice = getUserByDevice(device);
        if (checkDevice.length) updateUser({ device: "" }, checkDevice[0].id);
        updateUserDevice({ device, email });
      }

      const data = { role, token: sign({ id, role }, process.env.SECRET) };
      return resSuccess(res, CREATED, "Login succesfully", data);
    } catch (e) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error", {});
    }
  }

  async registerUser(req, res) {
    const { name, email, password } = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return resFailure(res, BADREQUEST, errors.array()[0].msg, {});

      let checkEmail = await getUserByEmail(email);
      if (checkEmail.length)
        return resFailure(res, UNAUTHORIZED, "Email has been taken", {});

      const register = await insertUser({
        name: name,
        email: email,
        password: hashSync(password, genSaltSync(10)),
      });

      const data = {
        role: "user",
        token: sign(
          { id: register.insertId, role: "user" },
          process.env.SECRET
        ),
      };
      return resSuccess(res, CREATED, "Register succesfully", data);
    } catch (e) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error", {});
    }
  }
}

module.exports = new Auth();
