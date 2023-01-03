const express = require("express");
const Schedule = require("../models/schedule");
const stripe = require("stripe")(process.env.STRIPE__SECRET__KEY);

const router = express.Router();
require("dotenv").config();
let result = [];

router.post("/create-checkout-session", async (req, res) => {
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
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    };
  });

  line_items?.map((p) => {
    result.push(p.price_data.product_data.metadata.schedule_id);
  });


  const session = await stripe.checkout.sessions.create({
    phone_number_collection: {
      enabled: true,
    },

    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT__URL}/checkout`,
    cancel_url: `${process.env.CLIENT__URL}/checkout`,
    automatic_tax: { enabled: true },
  });

  res.send({ url: session.url });
});

const fulfillOrder = async () => {
  await Schedule.updateMany(
    { _id: { $in: result } },
    { $set: { isPaid: true } },
    { multi: true }
  );
};

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret = process.env.WEBHOOK;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
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
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      fulfillOrder();
    }

    res.status(200).end();
  }
);
module.exports = router;
