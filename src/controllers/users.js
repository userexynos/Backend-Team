const { validationResult } = require("express-validator");
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
const upload = require("../helpers/multer");
const {
  getAllTransactionsByUserid,
  getTransactionsByUserid,
  getTransactionsByid,
  insertTransactions,
} = require("../models/transactions");
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

class Users {

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

  async findUsersData(req, res) {
    const { q, limit, offset } = req.query;
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);

    try {
      const data = await findUsers(q, decoded.id, limit, offset);
      if (!data.length)
        return resSuccess(res, OK, "Users data isn't available", []);

      return resSuccess(res, OK, "Success find users data", data);
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Failed find users data", []);
    }
  }

  async createPin(req, res) {
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return resFailure(res, BADREQUEST, errors.array()[0].msg);

      await updateUser({ pin: req.body.pin }, decoded.id);
      return resSuccess(res, CREATED, "Success create pin");
    } catch (e) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async getUserByToken(req, res) {
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);
    try {
      const data = await getUserById(decoded.id);
      const isPin = data[0].pin ? true : false;
      delete data[0].pin;
      delete data[0].password;

      const user = { ...data[0], pin: isPin };
      return resSuccess(res, OK, "Success get user", user);
    } catch (e) {
      console.log(e);
      return resFailure(res, INTERNALSERVERERROR, "Internal1 Server Error", {});
    }
  }

  async getAllHistoryByUserId(req, res) {
    const { limit, offset } = req.query;
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);

    try {
      const data = await getAllTransactionsByUserid(decoded.id, limit, offset);
      if (!data.length)
        return resSuccess(res, OK, "You don't have any transaction", []);

      return resSuccess(res, OK, "Success get Transactions History", data);
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error", []);
    }
  }

  async transferBalance(req, res) {
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);
    let { id, note, total, pin } = req.body;
    total = parseInt(total);

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return resFailure(res, BADREQUEST, errors.array()[0].msg);

      const checkFrom = await getUserById(decoded.id);
      if (checkFrom[0].pin !== pin)
        return resFailure(res, BADREQUEST, "Wrong Pin");

      const checkTo = await getUserById(id);
      if (!checkTo.length)
        return resFailure(res, BADREQUEST, "ID User To isn't available");

      const currentBalanceFrom = checkFrom[0].balance;
      const currentBalanceTo = checkTo[0].balance;
      if (currentBalanceFrom < total)
        return resFailure(res, BADREQUEST, "Balance isn't enough");

      await updateUserBalance({
        id: decoded.id,
        balance: currentBalanceFrom - total,
      });
      await updateUserBalance({ id: id, balance: currentBalanceTo + total });

      const data = await insertTransactions({
        id_from_user: decoded.id,
        id_to_user: id,
        note,
        total,
      });

      return resSuccess(res, OK, "Success Transfer", { id: data.insertId });
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async getHistoryById(req, res) {
    const { id } = req.params;
    try {
      const data = await getTransactionsByid(id);

      if (!data.length)
        return resFailure(res, BADREQUEST, "History isn't available");

      return resSuccess(res, OK, "Success Get History", data[0]);
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error", {});
    }
  }

  async addPhoneNumber(req, res) {
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return resFailure(res, BADREQUEST, errors.array()[0].msg);

      await updateUser({ phone: req.body.phone }, decoded.id);
      return resSuccess(res, OK, "Success add phone number");
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async deletePhoneNumber(req, res) {
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);
    try {
      await updateUser({ phone: null }, decoded.id);
      return resSuccess(res, OK, "Success delete phone number");
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async changePassword(req, res) {
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return resFailure(res, BADREQUEST, errors.array()[0].msg);

      const data = await getUserById(decoded.id);
      if (!compareSync(req.body.password, data[0].password))
        return resFailure(res, UNAUTHORIZED, "Password not match!");

      await updateUser(
        { password: hashSync(req.body.passwordNew, genSaltSync(10)) },
        decoded.id
      );
      return resSuccess(res, OK, "Success change password");
    } catch (e) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async uploadImage(req, res) {
    const uploadImage = upload(4).single("photo");
    uploadImage(req, res, async (err) => {
      if (err) return resFailure(res, BADREQUEST, err.message);

      const file = req.file;
      if (!file)
        return resFailure(res, BADREQUEST, "Field photo must be filled");

      const bearerToken = req.headers["authorization"].split(" ")[1];
      const decoded = verify(bearerToken, process.env.SECRET);
      try {
        const photo = `${process.env.BASE_URL}/images/${req.file.filename}`;
        await updateUser({ photo }, decoded.id);

        return resSuccess(res, CREATED, "Success upload photo");
      } catch (error) {
        return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
      }
    });
  }
}

module.exports = new Users();
