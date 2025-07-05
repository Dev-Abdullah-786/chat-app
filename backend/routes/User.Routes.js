const express = require("express");
const {
  Signup,
  login
} = require("../controllers/User.Controller");
const userRouter = express.Router();

userRouter
  .post("/signup", Signup)
  .post("/login", login)

module.exports = { userRouter };
