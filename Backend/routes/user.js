const express = require("express");
const router = express.Router();

const { registerUser, loginUser, AdminCreateCode, createAdmin } = require("../controllers/user");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post('/code', AdminCreateCode)
router.put('/admin/:id', createAdmin)

module.exports = router;
