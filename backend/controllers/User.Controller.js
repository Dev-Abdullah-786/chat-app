const { default: cloudinary } = require("../lib/cloudinary");
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
      password,
      bio
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

// Login user
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(errorhandler(400, "Please fill all required fields"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(errorhandler(401, "Invalid Email or Password"));
    }

    const comparePassword = await user.checkPassword(password);

    if (!comparePassword) {
      return next(errorhandler(401, "Invalid Email or Password"));
    }

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      token: await user.generateToken(),
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
  }
};

// Check Auth
const checkAuth = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: req.user,
  });
};

// Update Profile
const updateProfile = async (req, res, next) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const { _id } = req.user;
    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        _id,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        _id,
        { profileImage: upload.secure_url, bio, fullName },
        { new: true }
      );
    }
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { Signup, login, checkAuth, updateProfile };
