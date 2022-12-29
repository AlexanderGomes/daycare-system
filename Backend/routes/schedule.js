const express = require("express");
const router = express.Router();

const { createSchedule, unavailableDates, checkInUser, checkOutUser, getAllSchedule, paidSchedules, getUserData, getBalance, getCheckIn, getUnavailableDates } = require("../controllers/schedule");

router.post("/", createSchedule);
router.post("/admin", unavailableDates);
router.post("/checkin", checkInUser);
router.put("/checkout", checkOutUser);
router.get("/:userId", getAllSchedule);
router.get("/payment/history", paidSchedules);
router.get("/payment/history/user", getUserData);
router.get("/payment/user/balance/:id", getBalance);
router.get("/checkin/data", getCheckIn);
router.get("/admin/dates/available", getUnavailableDates);










module.exports = router;
