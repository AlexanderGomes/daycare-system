const User = require("../models/user");
const Code = require("../models/code");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const dbConnect = require("../utils/dbConnect");
dbConnect();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, code } = req.body;

  if (!name || !email || !password || !code) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  const senha = await Code.findOne({ code });

//TODO - handle error when code is not found on the db
    if (code !== senha.code) {
      return res.status(400).json({ msg: "user's code unavailable" });
    }


  const findUser = await User.findOne({ email });
  if (findUser) {
    return res.status(400).json({ msg: "there's an account on this email" });
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

//TODO - find all admins
//TODO - set schedule availability

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT__SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  AdminCreateCode,
  createAdmin,
};
