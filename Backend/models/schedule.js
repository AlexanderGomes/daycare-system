const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    start: {
      type: Date,
      required: [true, "Start date is required"],
    },
    end: {
      type: Date,
    },
    days: {
      type: Number,
    },
    price: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
