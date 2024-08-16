const express = require('express');
const app = express();
const cron = require('node-cron');
const fs = require('fs');
const stripe = require('stripe')('sk_test_51Po493GUkeROApSJ7w41UHAoJk5HMyHPLO9hQXmwRJKCUOewUxKvLGYgJioi8Jdt0TrDbUApXF1eB0y5x2FENMDB00DfUfmoKL');
app.use(express.json());

app.get("/", function (req, res, next) {
  res.json({ title: "Stripe App" });
});

cron.schedule('*/50 * * * * *', () => {
  const now = new Date();
  const timeString = now.toISOString();
  console.log(`Current Time: ${timeString}`);

  // Optionally, log the time to a file
  fs.appendFileSync('time-log.txt', `Current Time: ${timeString}\n`);
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  
  // Basic validation
  if (!amount || !currency) {
    return res.status(400).json({ error: 'Missing amount or currency' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount is in cents
      currency: currency
    });
    console.log(`paymentIntent : ${paymentIntent}`);
    res.json({ client_secret: paymentIntent.client_secret });
  } catch (e) {
    console.log(`error : ${e}`);
    console.error('Error creating PaymentIntent:', e);
    res.status(400).json({ error: e.message });
  }
});


app.listen(3000, () => console.log('Server listening on port 3000'));
