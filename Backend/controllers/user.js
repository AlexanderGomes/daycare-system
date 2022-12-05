const User = require("../models/user");
const Code = require("../models/code");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const dbConnect = require("../utils/dbConnect");
dbConnect();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, code} = req.body;

  //TODO - improve how this code is created
  const senha = "81377662Aa@?/";

  if (!name || !email || !password || !code) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  const findUser = await User.findOne({ email });
  if (findUser) {
    return res.status(400).json({ msg: "there's an account on this email" });
  }

  if (code !== senha) {
    return res.status(400).json({ msg: "user's code unavailable" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
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
      token: generateToken(user._id),
    });
  }
});

const createCodeAdmin = asyncHandler(async (req, res) => {
  const code = new Code(req.body);
  const user = User.findById(req.body.userID);


    try {
      const savedCode = await code.save();
      if(user.isAdmin == true) {
          res.status(200).json(savedCode);
      } else {
      res.status(400).json('error');
      }
    } catch (error) {
      res.status(400).json(error.message);
    }

});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT__SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  createCodeAdmin,
};
