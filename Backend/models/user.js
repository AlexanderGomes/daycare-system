const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
    },
    code: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    activity: {
      type: Array,
      default: [],
    },
    hasSchedule: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
