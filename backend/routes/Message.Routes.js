const express = require("express");
const {
  getAllUsers,
  getMessages
} = require("../controllers/Message.Controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const messageRouter = express.Router();

messageRouter
  .get("/user", authMiddleware, getAllUsers)
  .get("/:id", authMiddleware, getMessages)

module.exports = { messageRouter };
