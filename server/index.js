const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");

const app = express();
const socket = require("socket.io");
require("dotenv").config();
app.use(cors());
app.use(express.json());

//any routes that begin with "/api/" should be handled by the userRoutes and messagesRoute router
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);

mongoose
  //from .env
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database successfully connected!");
  })
  .catch((err) => {
    console.log(err.message);
  });

//start the server and listen for incoming request on port specified
const server = app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const onlineUsers = require("./users/onlineUsers");

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    //if user is online
    if (sendUserSocket) {
      //socket.to(sendUserSocket).emit("msg-receive", data.message);
      socket.to(sendUserSocket).emit("msg-receive", data);
    }
  });
});
