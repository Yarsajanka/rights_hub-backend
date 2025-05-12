const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// No routes as backend is only used for media upload now

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
