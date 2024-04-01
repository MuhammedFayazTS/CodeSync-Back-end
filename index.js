const express = require("express");
const cors = require("cors");
// dot env config
require("dotenv").config();
// db connection
require("./config/connectDB");
// routes
const userRoutes = require('./Routes/userRoutes')

// socket io
const { Server } = require("socket.io");

// express instance
const app = express();
// http server instance
const http = require("http");
const ACTIONS = require("./Actions/Actions");
const session = require("express-session");
const passport = require("passport");
const server = http.createServer(app);

// new socket instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// app middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// setup session middlewares
app.use(
  session({
    secret: "sample-secret",
    resave: false,
    saveUninitialized: true,
  })
);

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

require('./Middleware/auth')

// initial google auth login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}))

app.get("/auth/google/callback",passport.authenticate("google",{
  successRedirect:`${process.env.CLIENT_URL}`,
  failureRedirect:`${process.env.CLIENT}/sign-in`,
}))

// other routes
app.use('/api/user',userRoutes)


//   get all getAllConnectedClients
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

// port number
const port = process.env.PORT || 5000;
// start listening to server
server.listen(port, () => console.log(`server listening on port ${port}`));
