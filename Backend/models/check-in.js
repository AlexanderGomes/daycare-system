const mongoose = require("mongoose");

const checkInSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    start: {
      type: Date,
      required: [true, "checked-in time is required"],
    },
    end: {
      type: Date,
    },
    location: {
      type: String,
      required: [true, "location is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Check-in", checkInSchema);
