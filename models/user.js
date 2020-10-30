const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value) {
      if (value.toLowerCase() == "password") {
        throw new Error("Password must not be named as password");
      }
    },
  },
  resetToken: String,
  expireToken: Date,
  github: {
    type: String
  },
  linkedin: {
    type: String
  },
  pic: {
    type: String,
    default: "https://res.cloudinary.com/devimg/image/upload/v1600697065/defaultpic_dg4iun.png"
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
