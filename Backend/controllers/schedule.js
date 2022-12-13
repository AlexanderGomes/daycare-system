const Schedule = require("../models/schedule");
const User = require("../models/user");
const Unavailable = require("../models/unavailable.dates");
const CheckIn = require("../models/check-in");

const asyncHandler = require("express-async-handler");
const dbConnect = require("../utils/dbConnect");

dbConnect();

//high risk function
const createSchedule = asyncHandler(async (req, res) => {
  const newSchedule = new Schedule(req.body);

  const previousSchedule = await Schedule.find({ userId: req.body.userId });

  let compareStartValues;
  let compareEndValues;
  let isTaken = false;

  previousSchedule?.map((p) => {
    compareStartValues = p.start.toString() === newSchedule.start.toString();
    compareEndValues = p.end.toString() === newSchedule.end.toString();
    if (compareStartValues || compareEndValues === true) {
      isTaken = true;
    }
  });

  if (isTaken) {
    return res
      .status(400)
      .send({ msg: "the chosen dates were already taken by you" });
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

//low risk function
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
        scheduleAvailability.dates.toString() == p.dates.toString();
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

//high risk function
const checkInUser = asyncHandler(async (req, res) => {
  const checkInClient = new CheckIn(req.body);
  const adminUser = await User.findById(req.body.userId);
  const client = await User.findById(req.body.clientId);
  const clientHistory = await CheckIn.find({ clientId: client._id });

  let compareClientHistory;

  // improved funciton to use a boolean to detect when there's duplication when comparing the client history
  // and the current chosen date, instead of realocation space.
  let isTaken = false;

  // maping through the client history to get all the start checkin times, if the time we're
  //writing right now (chechInClient.start) matchs with any of the previous values, it will
  // push to the result array which means that if there's anything on the result array we have
  // a collision.
  clientHistory?.map((c) => {
    compareClientHistory =
      c.start.toString() === checkInClient.start.toString();

    if (compareClientHistory === true) {
      isTaken = true;
    }
  });

  if (isTaken) {
    return res
      .status(400)
      .send({ msg: "client is already checked-in at this specific date" });
  }

  try {
    if (adminUser.isAdmin) {
      const savedClient = await checkInClient.save();
      res.status(200).json(savedClient);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//high risk function
const checkOutUser = asyncHandler(async (req, res) => {
  //getting the last time user was checked-in
  const clientCheckingHistory = await CheckIn.find({clientId: req.body.clientId}).sort({_id:-1}).limit(1)

  
});

module.exports = {
  createSchedule,
  unavailableDates,
  checkInUser,
  checkOutUser,
};
