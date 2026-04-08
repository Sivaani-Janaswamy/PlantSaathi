// Main Express app setup and middleware configuration
const express = require('express');
const cors = require('cors');
const plantRoutes = require('./src/routes/plant.routes');
const favoriteRoutes = require('./src/routes/favorite.routes');
const aiRoutes = require('./src/routes/ai.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/plants', plantRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/ai', aiRoutes);

// Error handler (basic)
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
