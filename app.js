const express = require('express');
const app = express();
const stripe = require('stripe')('your-secret-key-here');
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount is already in cents
      currency: currency,
    });
    res.json({ client_secret: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
