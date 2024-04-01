// :: imports
const express = require("express");
const http = require("http");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// dot env config
require("dotenv").config();
// db connection
require("./config/connectDB");
// routes
const userRoutes = require('./Routes/userRoutes')
// socket io
const { Server } = require("socket.io");
// socket manager 
const socketEmitters = require('./Listeners/socketManagers');
// passport js 
const passport = require("passport");
const connectPassport = require("./Utils/Provider");
// error middleware 
const errorMiddleware = require("./Middleware/errorMiddleWare");

// express instance
const app = express();
// http server instance
const server = http.createServer(app);

// new socket instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// :: app middlewares
// cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// json parser middleware
app.use(express.json());

// setup session middlewares
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// error middleware
app.use(errorMiddleware)

app.use(cookieParser())

// passport initialization
app.use(passport.authenticate("session"))
app.use(passport.initialize());
app.use(passport.session());

// google auth passport
connectPassport()

// test route
app.get('/',(req,res)=>{
  res.send("API Working")
})

// other routes
app.use('/api/v1',userRoutes)

// socket manager for emitter handling
socketEmitters(io);


// port number
const port = process.env.PORT || 5000;
// start listening to server
server.listen(port, () => console.log(`server listening on port ${port}`));
