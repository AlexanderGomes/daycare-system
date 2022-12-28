const express = require("express");
const router = express.Router();

const { registerUser, loginUser, AdminCreateCode, createAdmin, userById , getAllUsers} = require("../controllers/user");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post('/code', AdminCreateCode)
router.put('/admin/:id', createAdmin)
router.get('/:id', userById)
router.get('/info/all', getAllUsers)



module.exports = router;
