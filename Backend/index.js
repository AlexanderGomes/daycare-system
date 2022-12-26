const express = require("express");
const port = process.env.PORT || 5000;

require("dotenv").config();
const dbConnect = require("./utils/dbConnect");

//folders
const userRoutes = require("./routes/user");
const scheduleRoutes = require("./routes/schedule");
const stripe = require("./routes/stripe");

//activating
const app = express();

// middleware

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

//routes
app.use("/api/user", userRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/payment", stripe);

app.listen(port, async () => {
  await dbConnect();
  console.log("mongodb connected");
  console.log(`server on port ${port}`);
});
