// Simple test to isolate the schema.validate error
const express = require('express');
const app = express();

// Test route without any middleware
app.get('/test-simple', (req, res) => {
  res.json({ 
    message: 'Simple test works',
    query: req.query,
    body: req.body,
    params: req.params 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Simple test server running on port ${PORT}`);
});
