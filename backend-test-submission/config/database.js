const mongoose = require('mongoose');
const { Logger } = require('../utils/logger');

const logger = new Logger();

const connectDB = async () => {
    try {
        // Using local MongoDB connection
        const conn = await mongoose.connect('mongodb://localhost:27017/urlshortener', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info('controller', `MongoDB Connected: ${conn.connection.host}`);
        
        // Clean up expired URLs periodically
        setInterval(async () => {
            try {
                const Url = require('../models/Url');
                const result = await Url.deleteMany({ expiry: { $lt: new Date() } });
                if (result.deletedCount > 0) {
                    logger.info('controller', `Cleaned up ${result.deletedCount} expired URLs`);
                }
            } catch (error) {
                logger.error('controller', `Error cleaning up expired URLs: ${error.message}`);
            }
        }, 5 * 60 * 1000); // Run every 5 minutes

    } catch (error) {
        logger.error('controller', `Database connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
