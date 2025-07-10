const express = require("express");
const { getAllUsers } = require("../controllers/Message.Controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const messageRouter = express.Router();

messageRouter.get("/user", authMiddleware, getAllUsers);

module.exports = { messageRouter };
