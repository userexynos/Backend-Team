const { validationResult } = require("express-validator");
const midtrans = require('midtrans-client')
const { verify } = require("jsonwebtoken");
const upload = require("../helpers/multer");
const randString = require("../helpers/randomString")
const { compareSync, hashSync, genSaltSync } = require("bcryptjs");
const {
  getUserById,
  updateUserBalance,
  updateUser,
  findUsers,
} = require("../models/users");
const {
  getAllTransactionsByUserid,
  getTransactionsByid,
  insertTransactions,
  getIncomeTransaction,
  getExpenseTransaction,
  insertTransfer,
  insertTopup,
  getTransactionsByOrderid,
  updateTopup
} = require("../models/transactions");
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
      let history = await getAllTransactionsByUserid(decoded.id, limit, offset);
      history = history.map(item => ({ ...item, is_income: decoded.id === item.id_receiver || item.type === "topup" }))
      const incomer = await getIncomeTransaction(decoded.id)
      const expenser = await getExpenseTransaction(decoded.id)
      const income = (incomer[0].transfer ? incomer[0].transfer : 0) + incomer[0].topup
      const expense = expenser[0].transfer ? expenser[0].transfer : 0
      if (!history.length)
        return resSuccess(res, OK, "You don't have any transaction", { expense: 0, income: 0, history: [] });

      return resSuccess(res, OK, "Success get Transactions History", { expense, income, history });
    } catch (error) {
      console.log(error)
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error", {});
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

      await updateUserBalance({ id: decoded.id, balance: currentBalanceFrom - total });
      await updateUserBalance({ id: id, balance: currentBalanceTo + total });

      const transfer = await insertTransfer({ id_receiver: id, note, amount: total, balance: currentBalanceFrom })
      const transactions = await insertTransactions({ id_user: decoded.id, id_transfer: transfer.insertId, type: "transfer", created_at: new Date() });

      return resSuccess(res, OK, "Success Transfer", { id: transactions.insertId });
    } catch (error) {
      console.log(error)
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async getHistoryById(req, res) {
    const { id } = req.params;
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);
    try {
      const data = await getTransactionsByid(id, decoded.id);

      if (!data.length || data[0].type === "topup")
        return resFailure(res, BADREQUEST, "History isn't available");

      const historyData = { ...data[0], is_income: data[0].id_user === data[0].id_receiver || data[0].type === "topup" }
      return resSuccess(res, OK, "Success Get History", historyData);
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

  async getPaymentToken(req, res) {
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return resFailure(res, BADREQUEST, errors.array()[0].msg);

    const snap = new midtrans.Snap({ isProduction: false, serverKey: process.env.SERVER_KEY })
    const midtransParam = {
      "transaction_details": {
        "order_id": `TOPUP-ID-${randString(18)}`,
        "gross_amount": req.body.amount
      },
      "item_details": [{
        "type": "Topup",
        "amount": `Rp ${req.body.amount}`
      }],
      "credit_card": {
        "secure": true
      }
    }

    try {
      const data = await getUserById(decoded.id);
      const parameter = {
        ...midtransParam,
        customer_details: {
          first_name: data[0].name,
          last_name: "",
          email: data[0].email,
          phone: data[0].phone,
        }
      }

      const createTransaction = await snap.createTransaction(parameter)
      return resSuccess(res, CREATED, "Success get token", createTransaction);
    } catch (error) {
      console.log(error)
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async getHistoryPayment(req, res) {
    const { order_id } = req.query
    try {
      const data = await getTransactionsByOrderid(order_id);

      if (!data.length)
        return resFailure(res, BADREQUEST, "History isn't available");
      else if (order_id === undefined || order_id === null)
        return resFailure(res, BADREQUEST, "Bad Request");

      return resSuccess(res, OK, "Success Get History", data[0]);
    } catch (error) {
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async processPayment(req, res) {
    const { va_numbers, transaction_time, order_id, gross_amount } = req.body
    const bearerToken = req.headers["authorization"].split(" ")[1];
    const decoded = verify(bearerToken, process.env.SECRET);

    try {
      const dataTopup = {
        order_id,
        va_number: va_numbers[0].va_number,
        va_type: va_numbers[0].bank,
        status: 0,
        amount: parseInt(gross_amount),
        paydate_at: null
      }
      const topup = await insertTopup(dataTopup)
      await insertTransactions({ id_user: decoded.id, id_topup: topup.insertId, type: "topup", created_at: transaction_time });

      return resSuccess(res, CREATED, "Success", { id: order_id });
    } catch (error) {
      console.log(error)
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }

  async midtransPaymentProcess(req, res) {
    const { va_numbers, settlement_time, transaction_status, order_id, gross_amount } = req.body

    try {
      const findTransaction = await getTransactionsByOrderid(order_id)
      const dataTopup = {
        order_id,
        va_number: va_numbers[0].va_number,
        va_type: va_numbers[0].bank,
        status: transaction_status !== "settlement" ? 0 : 1,
        amount: parseInt(gross_amount),
        paydate_at: settlement_time !== "undefined" ? settlement_time : null
      }

      if (!findTransaction.length) {
        return resSuccess(res, UNAUTHORIZED, "Bad Request");
      } else if (transaction_status === "pending") {
        return resSuccess(res, CREATED, "Payment Pending");
      }

      const userData = await getUserById(findTransaction[0].id_user);
      console.log(findTransaction[0].id_user)
      console.log(userData)
      await updateTopup(dataTopup, { order_id: findTransaction[0].order_id })
      await updateUserBalance({ id: findTransaction[0].id_user, balance: userData[0].balance + parseInt(gross_amount) })
      return resSuccess(res, CREATED, "Payment Succesfully");
    } catch (error) {
      console.log(error)
      return resFailure(res, INTERNALSERVERERROR, "Internal Server Error");
    }
  }
}
module.exports = new Users();
