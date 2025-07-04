const express = require("express");
const { Signup } = require("../controllers/User.Controller");
const userRouter = express.Router();

userRouter.post("/signup", Signup);

module.exports = { userRouter };
