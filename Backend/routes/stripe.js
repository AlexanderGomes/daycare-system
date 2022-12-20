const stripe = require("stripe")(process.env.STRIPE__SECRET__KEY);
const express = require("express");
require("dotenv").config();

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const line_items = req.body.data.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          id: item.id,
        },
        unit_amount: item.price * 100,
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    phone_number_collection: {
      enabled: true,
    },

    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT__URL}/checkout/success`,
    cancel_url: `${process.env.CLIENT__URL}/checkout`,
    automatic_tax: { enabled: true },
  });

  res.send({ url: session.url });
});

module.exports = router;
