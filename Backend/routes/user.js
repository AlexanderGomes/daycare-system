const express = require("express");
const router = express.Router();

const { registerUser, loginUser, createCodeAdmin } = require("../controllers/user");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post('/code', createCodeAdmin)

module.exports = router;
