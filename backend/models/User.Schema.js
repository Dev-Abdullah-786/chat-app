const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(this.password, salt);
  this.password = hashPassword;
});

// Compare Password
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT Token
userSchema.methods.generateToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
