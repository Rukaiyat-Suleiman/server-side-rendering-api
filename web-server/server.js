require("dotenv").config()

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.WEB_PORT || 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Route for specific HTML files
app.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  
  // Only allow .html files
  if (!filename.endsWith('.html')) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
  
  const filePath = path.join(__dirname, 'public', filename);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

// Default route for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Web server running on http://localhost:${PORT}`);
});