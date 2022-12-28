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
  const user = await User.findById(req.body.userId);

  let compareStartValues;
  let compareEndValues;
  let isTaken = false;

  previousSchedule?.map((p) => {
    compareStartValues = p.start.toString() === newSchedule.start.toString();
    compareEndValues = p?.end?.toString() === newSchedule?.end?.toString();

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
    await user.updateOne({ $set: { hasSchedule: true } }, { new: true });
    const savedSchedule = await newSchedule.save();
    await user.updateOne(
      { $push: { activity: savedSchedule._id } },
      { new: true }
    );
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
      await client.updateOne({
        $set: { isCheckIn: true },
      });
      res.status(200).json(savedClient);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//high risk function
const checkOutUser = asyncHandler(async (req, res) => {
  const adminUser = await User.findById(req.body.userId);
  const client = await User.findById(req.body.clientId);

  const lastCheckedInTime = await CheckIn.findOne({ clientId: client._id }).sort({
    _id: -1,
  });



  try {
    if (adminUser.isAdmin === true) {
      await client.updateOne({
        $set: { isCheckIn: false },
      });
      await lastCheckedInTime.updateOne(
        { $set: { end: req.body.end } },
        { new: true }
      );
      res.status(200).json(lastCheckedInTime);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getAllSchedule = asyncHandler(async (req, res) => {
  const userSchedule = await Schedule.find({ userId: req.params.userId });

  try {
    res.status(200).json(userSchedule);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const paidSchedules = asyncHandler(async (req, res) => {
  let paid = [];
  let unpaid = [];
  let revenue;
  let valueOfUnpaid;

  try {
    const schedules = await Schedule.find();

    schedules.map((s) => {
      if (s.isPaid === true) {
        paid.push(s.price);
      } else {
        unpaid.push(s.price);
      }
    });

    revenue = paid.reduce((a, b) => a + b, 0);
    valueOfUnpaid = unpaid.reduce((a, b) => a + b, 0);

    res.status(200).json([
      {
        numberOfPaidSchedules: paid.length,
        revenue: revenue,
        numberOfUnpaidSchedules: unpaid.length,
        valueOfUnpaid: valueOfUnpaid,
        allSchedules: schedules.length,
      },
    ]);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getUserData = asyncHandler(async (req, res) => {
  let totalUsers = [];
  let userScheduleOn = 0;

  try {
    const users = await User.find();
    users?.map((user) => {
      if (user.isAdmin === false) {
        totalUsers.push(user);
      }

      if (user.hasSchedule === true) {
        userScheduleOn += 1;
      }
    });
    res.status(200).json([
      {
        totalUsers: totalUsers.length,
        userScheduleOn: userScheduleOn,
      },
    ]);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// get paid and unpaid balance
const getBalance = asyncHandler(async (req, res) => {
  const paidBalance = [];
  let revenue;
  const unpaidBalance = [];
  let unpaid;

  try {
    const previousSchedule = await Schedule.find({ userId: req.params.id });
    const user = await User.findById(req.params.id);
    previousSchedule.map((p) => {
      if (p.isPaid === true) {
        paidBalance.push(p.price);
      }

      if (p.isPaid === false) {
        unpaidBalance.push(p.price);
      }
    });

    revenue = paidBalance.reduce((a, b) => a + b, 0);
    unpaid = unpaidBalance.reduce((a, b) => a + b, 0);

    await user.updateOne({
      $set: { paidBalance: revenue, unpaidBalance: unpaid },
    });

    res.status(200).json([{ paidBalance: revenue, unpaidBalance: unpaid }]);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getCheckIn = asyncHandler(async (req, res) => {
  try {
    const checkin = await CheckIn.find();
    res.status(200).json(checkin);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = {
  createSchedule,
  unavailableDates,
  checkInUser,
  checkOutUser,
  getAllSchedule,
  paidSchedules,
  getUserData,
  getBalance,
  getCheckIn,
};
