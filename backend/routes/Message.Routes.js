const express = require("express");
const {
  getAllUsers,
  getMessages,
  markMessageAsSeen,
  sendMessage,
} = require("../controllers/Message.Controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const messageRouter = express.Router();

messageRouter
  .get("/user", authMiddleware, getAllUsers)
  .get("/:id", authMiddleware, getMessages)
  .put("/mark/:id", authMiddleware, markMessageAsSeen)
  .post("/send/:id", authMiddleware, sendMessage);

module.exports = { messageRouter };
