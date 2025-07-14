const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const urlRoutes = require('./routes/urlRoutes');
const { Logger, loggingMiddleware } = require('./utils/logger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const logger = new Logger();

connectDB();

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true);

app.get('/health', (req, res) => {
    logger.info('handler', 'Health check endpoint accessed');
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'URL Shortener Microservice'
    });
});

app.use('/', urlRoutes);

app.use('*', (req, res) => {
    logger.warn('handler', `404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found'
    });
});

app.use((error, req, res, next) => {
    logger.error('handler', `Unhandled error: ${error.message}`);
    res.status(500).json({
        error: 'Internal server error'
    });
});

app.listen(PORT, () => {
    logger.info('handler', `Server is running on port ${PORT}`);
    console.log(`🚀 URL Shortener Microservice running on http://localhost:${PORT}`);
});

module.exports = app;
