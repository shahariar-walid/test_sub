const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware
app.use(cors());
app.use(express.json());

// Path to the JSON file
const subscriptionsFile = path.resolve(__dirname, 'subscriptions.json');


// Ensure the JSON file exists
if (!fs.existsSync(subscriptionsFile)) {
  fs.writeFileSync(subscriptionsFile, JSON.stringify([]));
}

// POST endpoint to save subscription
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Read existing subscriptions
  const subscriptions = JSON.parse(fs.readFileSync(subscriptionsFile, 'utf8'));

  // Add new email
  subscriptions.push({ email, subscribedAt: new Date().toISOString() });

  // Save updated subscriptions
  fs.writeFileSync(subscriptionsFile, JSON.stringify(subscriptions, null, 2));

  res.status(201).json({ message: 'Subscription successful!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
