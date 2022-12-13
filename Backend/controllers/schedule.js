const Schedule = require("../models/schedule");
const User = require("../models/user");
const Unavailable = require("../models/unavailable.dates");

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

// -- at a basic level this function do it's job, the only problem is stoping the user --
// -- from posting the same dates in different orders, for example if you post 12/12/2022 twice --
// -- is going to throw an error, but if inside of the dates array you keep the same date --
// -- and add another one with it like: [12/12/2022, 12/13/2022] the code is not gonna detect --
// -- the duplication.

const unavailableDates = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);
  const findPreviousSchedule = await Unavailable.find({
    userId: req.body.userId,
  });
  
  const scheduleAvailability = new Unavailable(req.body);


  if (findPreviousSchedule) {
    let checkSchedule;

    findPreviousSchedule?.map((p) => {
      //TODO - compare both arrays in a way where if there's one element at both arrays it cancels the function.
      checkSchedule =
        scheduleAvailability.dates.toString() === p.dates.toString();
    });

    if (checkSchedule) {
      return res.status(400).send({ msg: "dates were taken" });
    }
  }


  try {
    if (user.isAdmin) {
      const saveSchedule = await scheduleAvailability.save();
      res.status(200).json(saveSchedule);
    } else {
      res.status(400).json({ msg: "action is not allowed" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});


module.exports = {
  createSchedule,
  unavailableDates,
};
