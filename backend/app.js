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



const app = express();

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

// Security middleware
app.use(helmet());

// CORS configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const allowedOrigins = isDevelopment
  ? ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://127.0.0.1:5000']
  : ['https://plantsaathi.com', 'https://www.plantsaathi.com'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Request timeout middleware
app.use((req, res, next) => {
	const timeout = 30000; // 30 seconds
	const timer = setTimeout(() => {
		if (!res.headersSent) {
			res.status(408).json({
				success: false,
				message: 'Request timeout. Please try again.'
			});
		}
	}, timeout);

	res.on('finish', () => clearTimeout(timer));
	res.on('close', () => clearTimeout(timer));
	next();
});

// Dev logging
app.use(morgan('dev'));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/plants', plantRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/ai', aiRoutes);
app.use('/recommendations', recommendationsRoutes);

// Test route
app.get('/test', (req, res) => res.json({ message: 'test works' }));

// Error handler
app.use((err, req, res, next) => {
	logger.error(err.message, req.method, req.originalUrl);
	res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;
