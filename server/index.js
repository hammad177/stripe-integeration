const express = require("express");
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.CLIENT_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/strip-secret-create", async (req, res) => {
  const intent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "eur",
    payment_method_types: ["card"],
  });
  res.json({ client_secret: intent.client_secret });
});

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
