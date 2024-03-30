const express = require('express');
const { Server } = require("socket.io");

const app = express();

const io = new Server(app);

const port = 5000

app.listen(port,()=>console.log(`server listening on port ${port}`));