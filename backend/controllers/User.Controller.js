const { default: cloundinary } = require("../lib/cloudinary");
const { errorhandler } = require("../middlewares/error.Middleware");
const User = require("../models/User.Schema");

// Signup user
const Signup = async (req, res, next) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return next(errorhandler(400, "Please fill all required fields"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorhandler(400, "Account already exists"));
    }
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
      token: await user.generateToken(),
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { Signup };
