const { getUserById } = require("../models/users");

module.exports = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    socket.join(userId);
    socket.on("balance", () => {
      getUserById(userId).then((user) => console.log(user));
    });
    socket.on("transfer", (id) => {
      getUserById(id).then((user) =>
        socket.to(id).emit("balance", user[0].balance)
      );
    });
  });
};
