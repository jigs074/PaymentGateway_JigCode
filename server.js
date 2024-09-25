// server.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Load secret key from environment variables
const app = express();
const port = 5000;
const path = require('path'); 

console.log(process.env.STRIPE_SECRET_KEY); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); 
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // Send back the client_secret
    res.status(200).send({
      clientSecret: paymentIntent.client_secret, // Corrected to client_secret
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
