const express = require("express");
const {
  Signup,
  login,
  checkAuth,
  updateProfile,
} = require("../controllers/User.Controller");
const userRouter = express.Router();

userRouter
  .post("/signup", Signup)
  .post("/login", login)
  .put("/update-profile", updateProfile)
  .get("/check", checkAuth);

module.exports = { userRouter };
