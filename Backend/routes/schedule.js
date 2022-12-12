const express = require("express");
const router = express.Router();

const { createSchedule } = require("../controllers/schedule");

router.post("/", createSchedule);

module.exports = router;
