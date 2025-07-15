const express = require("express");
const {
  Signup,
  login,
  checkAuth,
  updateProfile,
} = require("../controllers/User.Controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

userRouter
  .post("/signup", Signup)
  .post("/login", login)
  .put("/update-profile",authMiddleware, updateProfile)
  .get("/check", authMiddleware, checkAuth);

module.exports = { userRouter };
