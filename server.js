const fs = require('fs').promises;
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// Existing subscription route
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const filePath = path.join(__dirname, 'subscriptions.json');
    const data = JSON.parse(await fs.readFile(filePath, 'utf8') || '[]');
    data.push({ email });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Subscription successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again!' });
  }
});

// New route to serve the JSON file
app.get('/api/subscriptions', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'subscriptions.json');
    const data = await fs.readFile(filePath, 'utf8');
    res.status(200).json(JSON.parse(data)); // Send JSON content
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to read subscriptions' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
