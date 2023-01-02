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

const unavailableDates = asyncHandler(async (req, res) => {
  const newSchedule = new Unavailable(req.body);
  try {
    const savedSchedule = await newSchedule.save();

    res.status(200).json(savedSchedule);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getUnavailableDates = asyncHandler(async (req, res) => {
  try {
    const dates = await Unavailable.find();
    res.status(200).json(dates);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// two payment options, make a schedule before hand and pay it all, or don't make an schedule at all and just pay for the days you get checked-in
const checkInUser = asyncHandler(async (req, res) => {
  const checkInClient = new CheckIn(req.body);
  const adminUser = await User.findById(req.body.userId);
  const client = await User.findById(req.body.clientId);
  const clientHistory = await CheckIn.find({ clientId: client._id });
  const ClientSchedule = await Schedule.find({ userId: req.body.clientId });

  let compareClientHistory;
  let isTaken = false;

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

  //create a schedule if it's not collapsing
  let isCollapsing = false;

  ClientSchedule.map((schedule) => {
    if (schedule.isPaid === false) {
      const date1 = new Date(schedule.start)
        .toISOString()
        .slice(0, 10)
        .replace(/T/, " ")
        .replace(/\..+/, "");

      const date2 = new Date(schedule.end)
        .toISOString()
        .slice(0, 10)
        .replace(/T/, " ")
        .replace(/\..+/, "");

      const currentDate = req.body.start;

      if (currentDate >= date1 && currentDate <= date2) {
        isCollapsing = true;
      }
    }
  });

  try {
    if (adminUser.isAdmin) {
      if (isCollapsing === false) {
        const order = new Schedule({
          userId: client._id,
          start: req.body.start,
          end: req.body.start,
          days: 1,
          price: 35,
          isAdmin: true
        });
        const savedClient = await checkInClient.save();
        await client.updateOne({
          $set: { isCheckIn: true },
        });
        await order.save();
        res.status(200).json(savedClient);
      } else {
        res.status(420).send({ msg: "schedule is already done" });
      }
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//high risk function
const checkOutUser = asyncHandler(async (req, res) => {
  const adminUser = await User.findById(req.body.userId);
  const client = await User.findById(req.body.clientId);

  const lastCheckedInTime = await CheckIn.findOne({
    clientId: client._id,
  }).sort({
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
  getUnavailableDates,
};
