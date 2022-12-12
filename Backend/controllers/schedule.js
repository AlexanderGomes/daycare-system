const Schedule = require("../models/schedule");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const dbConnect = require("../utils/dbConnect");
dbConnect();


const createSchedule = asyncHandler(async (req, res) => {
  const newSchedule = new Schedule(req.body);

  const startDate = await Schedule.findOne({
    start: req.body.start,
  });
  const endDate = await Schedule.findOne({
    end: req.body.end,
  });

  const takenDate = startDate || endDate;

  if (takenDate !== null) {
    return res.status(400).json({ msg: "taken schedule" });
  }

  try {
    const savedSchedule = await newSchedule.save();
    res.status(200).json(savedSchedule);
  } catch (error) {
    res.status(400).json(error.message);
  }
});


module.exports = {
  createSchedule,
};
