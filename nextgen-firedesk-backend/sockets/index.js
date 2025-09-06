// /src/sockets/index.js
const pumpRoomHandlers = require("./pumpRoom");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Register handlers per feature, keeping each file small & cohesive
    pumpRoomHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", socket.id, reason);
    });
  });
};
