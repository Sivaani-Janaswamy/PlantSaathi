// Main Express app setup and middleware configuration
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');


const plantRoutes = require('./src/routes/plant.routes');
const favoriteRoutes = require('./src/routes/favorite.routes');
const recommendationsRoutes = require('./src/routes/recommendations.routes');
const aiRoutes = require('./src/routes/ai.routes');

const logger = require('./src/utils/logger');
// Minimal logging middleware
app.use((req, res, next) => {
	const start = Date.now();
	logger.request(req.method, req.originalUrl);
	res.on('finish', () => {
		const ms = Date.now() - start;
		logger.response(res.statusCode, req.method, req.originalUrl, ms);
	});
	next();
});

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
// Remove morgan (dev logging)
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
}));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/plants', plantRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/ai', aiRoutes);
app.use('/recommendations', recommendationsRoutes);

// Error handler (basic)
app.use((err, req, res, next) => {
	logger.error(err.message, req.method, req.originalUrl);
	res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
