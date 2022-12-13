const express = require("express");
const router = express.Router();

const { createSchedule, unavailableDates } = require("../controllers/schedule");

router.post("/", createSchedule);
router.post("/admin", unavailableDates);


module.exports = router;
