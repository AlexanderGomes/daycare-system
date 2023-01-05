const User = require("../models/user");
const Code = require("../models/code");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const dbConnect = require("../utils/dbConnect");
dbConnect();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, code, phoneNumber } = req.body;

  if (!name || !email || !password || !code) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  const senha = await Code.findOne({ code });

  const findUser = await User.findOne({ email });
  if (findUser) {
    return res.status(400).json({ msg: "there's an account on this email" });
  }

  //TODO - handle error when code is not found on the db
  if (code !== senha.code) {
    return res.status(400).json({ msg: "user's code unavailable" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } else {
    res.status(400).json("invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //finding user
  const user = await User.findOne({ email });

  //validation
  if (!user) {
    res.status(400).json("Wrong email");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(402).json({ msg: "passwords don't match" });
  }

  //comparing hashed password and sending back information
  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  }
});

const AdminCreateCode = asyncHandler(async (req, res) => {
  const code = new Code(req.body);
  const user = await User.findById(req.body.userId);

  if (user.isAdmin === true) {
    try {
      const savedCode = await code.save();
      res.status(200).json(savedCode);
    } catch (error) {
      res.status(400).json(error.message);
    }
  } else {
    res.status(400).json({ msg: "user is not an admin" });
  }
});

const createAdmin = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.params.id);
  const client = await User.findById(req.body.userId);

  try {
    if (currentUser.isAdmin === true) {
      if (client.isAdmin === false) {
        await client.updateOne({ $set: { isAdmin: true } });
        res.status(200).json(client);
      } else {
        await client.updateOne({ $set: { isAdmin: false } });
        res.status(200).json(client);
      }
    } else {
      res.status(400).json({ msg: "user is not an admin" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const userById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const user = await User.find();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//EMAIL VERIFICATION
let allCodes = [];
const sendCodeToUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const random = Math.floor(Math.random() * 9000 + 1000);
  allCodes.push(random);

  const lastCode = allCodes[allCodes.length - 1];

  //sending code to client email email
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "sander.alex0909@gmail.com",
      pass: "ukwnrwylaeurxybz",
    },
  });

  let info = await transporter.sendMail({
    from: '"Gomes Daycare" <sander.alex0909@gmail.com>', // sender address
    to: `${user.email}`, // list of receivers
    subject: "verification code", // Subject line
    text: `verification code: ${lastCode}`,
  });

  res.status(200).json(info);
  try {
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//EMAIL VERIFICATION
const confirmCode = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const { code } = req.body;

  try {
    if (code === allCodes[allCodes.length - 1]) {
      await user.updateOne({ $set: { isEmailVerified: true } });
    } else {
      res.status(392).send({msg: 'wrong code'})
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//PHONE VERIFICAITON
let phoneCodes = [];
const sendPhoneCode = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const random = Math.floor(Math.random() * 9000 + 1000);
  phoneCodes.push(random);

  const lastCode = phoneCodes[phoneCodes.length - 1];

  try {
    client.messages
      .create({
        body: `GOMES DAYCARE -- confirmation code: ${lastCode} `,
        from: "+12515128063",
        to: `${user.phoneNumber}`,
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.log(err));
    res.status(200).json({ msg: "phone code was sent" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//PHONE VERIFICATION
const confirmPhoneCode = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const { code } = req.body;

  try {
    if (code === phoneCodes[phoneCodes.length - 1]) {
      await user.updateOne({ $set: { isPhoneVerified: true } });
      res.status(200).json({ msg: "user's phone number verified" });
    } else {
      res.status(430).send({ msg: "wrong code, try again" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = {
  registerUser,
  loginUser,
  AdminCreateCode,
  createAdmin,
  userById,
  getAllUsers,
  sendCodeToUser,
  confirmCode,
  confirmCode,
  sendPhoneCode,
  confirmPhoneCode,
};
