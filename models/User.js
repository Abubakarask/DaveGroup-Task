const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a Username"],
    unique: [true, "Username already exists"]
  },

  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  avatar: {
    public_id: String,
    url: String,
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
  },

  status: {
    type: String
  },

  comapany: {
    type: String
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  bio: {
    type: String
  },

  birthdate: { 
    type: Date,
    trim: true,
  },

  website: {
    type: String
  },

  languages: {
    type: String
  },
  
  phone: {
    type: String
  },

  country: {
   type: String
  },

  gender: {
    type: String
  },

  

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
