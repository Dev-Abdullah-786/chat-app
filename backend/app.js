const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const { createServer } = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDb = require("./database/connectDb");
const { errorMiddleware } = require("./middlewares/error.Middleware");
const { userRouter } = require("./routes/User.Routes");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
module.exports.io = io;

module.exports.userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected with id: ", userId);
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("User disconnected with id: ", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("api/v1/auth", userRouter);

connectDb();

app.use(errorMiddleware);

module.exports = httpServer;
