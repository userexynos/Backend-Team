const { getUserById } = require("../models/users");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("client", (userId) => {
      socket.join(userId);
      console.log(socket.clients());
    });

    socket.on("balance", () => {
      // console.log(userId);
      if (userId)
        getUserById(userId).then((user) => {
          // console.log(user);
          socket.to(userId).emit("balance", user[0].balance);
        });
    });

    socket.on("transfer", (id) => {
      getUserById(id).then((user) => {
        console.log(user);
        socket.to(id).emit("balance", user[0].balance);
      });
    });
  });
};
