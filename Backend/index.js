const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const dbConnect = require("./utils/dbConnect");

//folders
const userRoutes = require("./routes/user");
const scheduleRoutes = require("./routes/schedule");
const stripe = require('./routes/stripe')

//activating
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/user", userRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/payment", stripe);



app.listen(port, async () => {
  await dbConnect();
  console.log("mongodb connected");
  console.log(`server on port ${port}`);
});
