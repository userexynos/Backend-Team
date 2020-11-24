const { getUserById } = require("../models/users");

const user = [];

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("userConnect", (id) => {
      socket.join("balance-room");

      const checkUser = user.filter((item) => item.id === id);
      if (!checkUser.length) {
        user.push({ id, socketId: socket.id });
      } else {
        const findUserIndex = user.findIndex((item) => item.id === id);
        user[findUserIndex] = { id, socketId: socket.id };
      }
      console.log("Total Connect User: ", user);
    });

    socket.on("userBalance", (id) => {
      const checkUser = user.filter((item) => item.id === id);
      if (checkUser.length) {
        return getUserById(id).then((data) => {
          socket.to(checkUser[0].socketId).emit("getBalance", data[0].balance);
        });
      }
      console.log("user not connected");
    });
  });
};
