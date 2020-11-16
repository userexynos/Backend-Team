const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("./src/configs/firebase");
require("dotenv").config();
require("./src/configs/database").connect((err) =>
  console.log(err ? err : "Database working")
);

// Middlewares
const { statusNotFound } = require("./src/middlewares/serverHandler");
const { verify, verifyAdmin } = require("./src/middlewares/auth");

// Routers
const indexRouter = require("./src/routes/index");
const authRouter = require("./src/routes/auth");
const usersRouter = require("./src/routes/users");
const adminRouter = require("./src/routes/admin");
const { midtransPaymentProcess } = require("./src/controllers/users");
// const topupRouter = require('./src/routes/topup')
// const transferRouter = require('./src/routes/transfer')

const app = express();
const prefix = process.env.PREFIX_URL || "/api/v1";

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("*", cors());
app.use(`${prefix}/`, indexRouter);
app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/users`, verify, usersRouter);
app.use(`${prefix}/admin`, verifyAdmin, adminRouter);
app.post(`${prefix}/midtrans/payment-process`, midtransPaymentProcess);

// app.use(`${prefix}/topup`, verifyAdmin, topupRouter)
// app.use(`${prefix}/transfer`, transferRouter)

// Handle Error Notfound
app.use(statusNotFound);

module.exports = app;
