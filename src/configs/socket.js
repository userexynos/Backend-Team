const { getUserById } = require("../models/users");

module.exports = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    socket.join(userId);
    socket.on("balance", () => {
      const user = getUserById(userId);
      socket.to(userId).emit("balance", user[0].balance);
    });
    socket.on("transfer", (id) => {
      const user = getUserById(id);
      socket.to(id).emit("balance", user[0].balance);
    });
  });
};
