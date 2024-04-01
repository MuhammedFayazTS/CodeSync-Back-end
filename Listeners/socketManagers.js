// socket emitters code
const ACTIONS = require("../Utils/Actions");

// Define a function that takes io as a parameter
const socketEmitters = (io) => {
  // get all getAllConnectedClients
  const getAllConnectedClients = (roomId) => {
    // io.socket.rooms.get returns map so convert to array
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
      (socketId) => {
        return {
          socketId,
          // userName: userSocketMap[socketId]
        };
      }
    );
  };

  // socket connection
  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.emit("welcome", `welcome to the server ${socket.id}`);

    socket.on(ACTIONS.JOIN, ({ roomId }) => {
      console.log(roomId);
      socket.join(roomId);
      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED);
      });
    });
  });
};

// Export the function
module.exports = socketEmitters;
