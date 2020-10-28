const { validationResult } = require("express-validator");
const status = require('../helpers/status')
const { verify } = require("jsonwebtoken");
const {
  getUsers,
  getUserById,
  getUsersPaginate,
  insertUser,
  updateUserBalance,
  updateUser,
  deleteUser,
  findUsers,
} = require("../models/users");
const {
  getTransactionsByUserid,
  getTransactions_Admin
  // getAllTransactionsByUserid,
} = require("../models/transactions");
const upload = require("../helpers/multer");
const { compareSync, hashSync, genSaltSync } = require("bcryptjs");
const {
  resSuccess,
  resFailure,
  OK,
  BADREQUEST,
  INTERNALSERVERERROR,
  CREATED,
  UNAUTHORIZED,
} = require("../helpers/status");

class Admin {

  async getUserById(req, res) {
      const { id } = req.params;
      try {
        const data = await getUserById(id);
        delete data[0].balance;
        delete data[0].pin;
        delete data[0].password;
        if (!data.length)
          return resFailure(res, BADREQUEST, "User id isn't available", {});

        return resSuccess(res, OK, "Success get user data", data[0]);
      } catch (error) {
        return resFailure(res, INTERNALSERVERERROR, "Internal Server Error", {});
      }
    }

  async getAllUsers(req, res) {
    console.log();
    try {
      const data = await getUsers();
      return resSuccess(res, OK, "Success get user data", data);
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async getUsersPaginate(req, res) {
    const { offset, limit } = req.query;
    console.log(req.query);
    try {
      const data = await getUsersPaginate(limit, offset);
      return resSuccess(res, OK, "Success get user data", data);
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async insertUser(req, res) {
    if (
      req.body.name &&
      req.body.phone &&
      req.body.email &&
      req.body.password &&
      req.body.balance &&
      req.body.verified &&
      req.body.pin
    ) {
      try {
        const password = await hashSync(req.body.password, genSaltSync(10));
        const newBody = { ...req.body, password: password };
        await insertUser(newBody);
        return resSuccess(res, CREATED, "Success add user data");
      } catch (error) {
        return resSuccess(res, INTERNALSERVERERROR, "Failed add user data");
      }
    } else {
      return resSuccess(res, BADREQUEST, "There are field not filled");
    }
  }

  async updateUser(req, res) {
    const { name, phone, email } = req.body;
    const { id } = req.params;
    if (!id) return resSuccess(res, BADREQUEST, "There are field not filled");
    if (name && phone && email) {
      try {
        const checkUser = await getUserById(id);
        if (!checkUser.length) {
          return resSuccess(res, BADREQUEST, "user id is not available");
        } else {
          await updateUser(req.body, id);
          return resSuccess(res, OK, "Success update user data");
        }
      } catch (error) {
        return resSuccess(res, INTERNALSERVERERROR, "Failed update user dataa");
      }
    } else {
      return resSuccess(res, BADREQUEST, "There are field not filled");
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const checkUser = await getUserById(id);

      if (checkUser.length) {
        await deleteUser(id);
        return resSuccess(res, OK, "Success delete user data");
      } else {
        return resSuccess(res, BADREQUEST, "user id is not available");
      }
    } catch (error) {
      return resSuccess(res, BADREQUEST, "Failed delete user data");
    }
  }

  async updateUserBalance(req, res) {
    const { id } = req.params;
    try {
      const checkUser = await getUserById(id);
      if (!checkUser.length) {
        return resSuccess(res, BADREQUEST, "user id is not available");
      } else {
        await updateUserBalance({ id: id, balance: req.body.balance });
        return resSuccess(res, OK, "Success update user balance");
      }
    } catch (error) {
      return resSuccess(res, BADREQUEST, "Failed update user balance");
    }
  }

  async getHistoryByUserId(req, res) {
    const {id}= req.params
    try {
      const data = await getTransactionsByUserid(id)
      if (!data.length)
        return resSuccess(res, OK, "You don't have any transaction", [])

      return resSuccess(res, OK, "Success get Transactions History", data)
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error", [])
    }
  }

  async findUsersData(req, res) {
    const { nm, id, limit, offset } = req.query;
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);

    try {
      const data = await findUsers(nm, id, limit, offset);
      if (!data.length)
        return resSuccess(res, OK, "Users data isn't available", []);

      return resSuccess(res, OK, "Success find users data", data);
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Failed find users data", []);
    }
  }

  async uploadImage(req, res) {
    const uploadImage = upload(4).single("photo");
    uploadImage(req, res, async (err) => {
      if (err) return resFailure(res, BADREQUEST, err.message);

      const file = req.file;
      if (!file)
        return resFailure(res, BADREQUEST, "Field photo must be filled");

      const {id} = req.params
      try {
        const photo = `${process.env.BASE_URL}/images/${req.file.filename}`;
        await updateUser({ photo }, id);

        return resSuccess(res, CREATED, "Success upload photo");
      } catch (error) {
        return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
      }
    });
  }

  async getAllHistory_Admin(req, res) {
    try {
      const data = await getTransactions_Admin()
      if (!data.length)
        return res.status(status.OK).json({
          status: true,
          message: "Don't have any transaction",
          data: []
        })

      res.status(status.OK).json({
        status: true,
        message: "Success get All data Transaction",
        data
      })
    } catch (error) {
      console.log(error)

      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed get history transaction data",
        data: []
      })
    }
  }

}

module.exports = new Admin();
