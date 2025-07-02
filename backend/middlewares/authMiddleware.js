const jwt = require("jsonwebtoken");
const { errorhandler } = require("./error.Middleware");
const User = require("../models/User.Schema");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers["authorization"] || req.headers.token;

    if (!token) {
      return next(errorhandler(401, "Please Login"));
    }

    // If using "Bearer <token>", extract it
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(errorhandler(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(errorhandler(401, "Invalid or expired token"));
  }
};

module.exports = { authMiddleware };
