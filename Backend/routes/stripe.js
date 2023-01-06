const { compareSync } = require("bcryptjs");
const express = require("express");
const Schedule = require("../models/schedule");
const User = require("../models/user");
const stripe = require("stripe")(process.env.STRIPE__SECRET__KEY);

const router = express.Router();
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

router.post("/create-checkout-session", async (req, res) => {
  //current user

  //data being passed down, all the schedules that are supposed to be paid
  const line_items = req.body.data.map((item) => {
    const date1 = new Date(item.start)
      .toISOString()
      .slice(0, 10)
      .replace(/T/, " ")
      .replace(/\..+/, "");
    const date2 = new Date(item.end)
      .toISOString()
      .slice(0, 10)
      .replace(/T/, " ")
      .replace(/\..+/, "");

    return {
      price_data: {
        currency: "usd",
        tax_behavior: "exclusive",
        product_data: {
          name: "Gomes Daycare",
          description: `schedule from ${date1} to ${date2}`,
          metadata: {
            schedule_id: item._id,
            user_id: item.user_id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    };
  });

  const abc = [];
  line_items.map((p) => {
    abc.push(p.price_data.product_data.metadata.schedule_id);
  });

  const string = abc.toString();

  const session = await stripe.checkout.sessions.create({
    phone_number_collection: {
      enabled: true,
    },

    metadata: {
      schedules_id: string,
    },

    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT__URL}/checkout`,
    cancel_url: `${process.env.CLIENT__URL}/checkout`,
    automatic_tax: { enabled: true },
  });

  res.send({ url: session.url });
});

const fulfillOrder = async (data) => {
  const a = data.metadata.schedules_id;
 const arr = Array.from(a)
 console.log(arr.length)
  //length of id

  // let currentDate = new Date();
  // const time = currentDate
  //   .toLocaleString("en-US", {
  //     timeZone: "America/Los_Angeles",
  //   })
  //   .slice(0, 10)
  //   .replace(/T/, " ")
  //   .replace(/\..+/, "");
  // const date2 = new Date(time)
  //   .toISOString()
  //   .slice(0, 10)
  //   .replace(/T/, " ")
  //   .replace(/\..+/, "");
  // const user = await User.find({ _id: { $in: userInfo } });
  // user.map((u) => {
  //   client.messages
  //     .create({
  //       body: `payment done by client ${u.name}, date: ${date2}`,
  //       from: "+12515128063",
  //       to: `+15106305188`,
  //     })
  //     .then((message) => console.log(message.sid))
  //     .catch((err) => console.log(err));
  //   client.messages
  //     .create({
  //       body: `payment confirmation ${u.name}, date: ${date2}`,
  //       from: "+12515128063",
  //       to: `${u.phoneNumber}`,
  //     })
  //     .then((message) => console.log(message.sid))
  //     .catch((err) => console.log(err));
  // });
};

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    let webhookSecret = process.env.WEBHOOK;

    if (webhookSecret) {
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    if (eventType === "checkout.session.completed") {
      fulfillOrder(data);
    }

    res.status(200).end();
  }
);

module.exports = router;
