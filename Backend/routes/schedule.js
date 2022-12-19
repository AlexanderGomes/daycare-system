const express = require("express");
const router = express.Router();

const { createSchedule, unavailableDates, checkInUser, checkOutUser, getAllSchedule } = require("../controllers/schedule");

router.post("/", createSchedule);
router.post("/admin", unavailableDates);
router.post("/checkin", checkInUser);
router.put("/checkout", checkOutUser);
router.get("/:userId", getAllSchedule);





module.exports = router;
