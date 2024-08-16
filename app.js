const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51PU1tb08kFrd3w5s8LLZs9DJGIx7800CYYvMkSCOFwbfmAolplKg2UPwhXI0IIiqJfVAJewCnrKqBvckcfe4ck4x00g9Z6XdYX');
app.use(express.json());

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
