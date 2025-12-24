// 1. Import the tools we installed
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// 2. Create the "App" (The actual server object)
const app = express();

// 3. specific settings (Middleware)
app.use(express.json()); // Allows the server to understand JSON data (like text sent from a form)
app.use(cors()); // Allows your frontend to talk to this backend

// 4. Create a "Test Route"
app.get('/', (req, res) => {
  res.send('API is running! Great job.');
});

// 5. Turn on the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is successfully running on port ${PORT}`);
});