const Url = require('../models/Url');
const { nanoid } = require('nanoid');
const validator = require('validator');
const geoip = require('geoip-lite');
const { Logger } = require('../utils/logger');

const logger = new Logger();

class UrlController {
    static async createShortUrl(req, res) {
        try {
            const { url, validity = 30, shortcode } = req.body;

            logger.info('controller', `Creating short URL for: ${url}`);

            if (!url || !validator.isURL(url)) {
                logger.warn('controller', `Invalid URL provided: ${url}`);
                return res.status(400).json({
                    error: 'Invalid URL provided'
                });
            }

            if (validity <= 0 || !Number.isInteger(validity)) {
                logger.warn('controller', `Invalid validity period: ${validity}`);
                return res.status(400).json({
                    error: 'Validity must be a positive integer (minutes)'
                });
            }

            let finalShortcode = shortcode;

            if (shortcode) {
                if (!/^[a-zA-Z0-9_-]+$/.test(shortcode)) {
                    logger.warn('controller', `Invalid shortcode format: ${shortcode}`);
                    return res.status(400).json({
                        error: 'Shortcode must contain only alphanumeric characters, hyphens, and underscores'
                    });
                }

                const existingUrl = await Url.findOne({ shortcode });
                if (existingUrl) {
                    logger.warn('controller', `Shortcode already exists: ${shortcode}`);
                    return res.status(409).json({
                        error: 'Shortcode already exists'
                    });
                }
            } else {
                let attempts = 0;
                do {
                    finalShortcode = nanoid(8);
                    attempts++;
                    if (attempts > 10) {
                        throw new Error('Unable to generate unique shortcode');
                    }
                } while (await Url.findOne({ shortcode: finalShortcode }));
            }

            const expiry = new Date(Date.now() + validity * 60 * 1000);

            const newUrl = new Url({
                shortcode: finalShortcode,
                originalUrl: url,
                expiry: expiry,
                clicks: []
            });

            await newUrl.save();

            const shortLink = `http://localhost:${process.env.PORT || 5000}/${finalShortcode}`;

            logger.info('controller', `Short URL created successfully: ${shortLink}`);

            res.status(201).json({
                shortLink,
                expiry: expiry.toISOString()
            });

        } catch (error) {
            logger.error('controller', `Error creating short URL: ${error.message}`);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Get URL details
    static async getUrlDetails(req, res) {
        try {
            const { shortcode } = req.params;

            logger.info('controller', `Getting details for shortcode: ${shortcode}`);

            const url = await Url.findOne({ shortcode });

            if (!url) {
                logger.warn('controller', `Shortcode not found: ${shortcode}`);
                return res.status(404).json({
                    error: 'Short URL not found'
                });
            }

            logger.info('controller', `URL details retrieved for: ${shortcode}`);

            res.json({
                shortcode: url.shortcode,
                originalUrl: url.originalUrl,
                createdAt: url.createdAt.toISOString(),
                expiry: url.expiry.toISOString(),
                clicks: url.clicks.map(click => ({
                    timestamp: click.timestamp.toISOString(),
                    referrer: click.referrer,
                    location: click.location
                }))
            });

        } catch (error) {
            logger.error('controller', `Error getting URL details: ${error.message}`);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Redirect to original URL
    static async redirectToUrl(req, res) {
        try {
            const { shortcode } = req.params;

            logger.info('controller', `Redirect request for shortcode: ${shortcode}`);

            const url = await Url.findOne({ shortcode });

            if (!url) {
                logger.warn('controller', `Shortcode not found for redirect: ${shortcode}`);
                return res.status(404).json({
                    error: 'Short URL not found'
                });
            }

            // Check if URL is expired
            if (url.isExpired()) {
                logger.warn('controller', `Expired URL accessed: ${shortcode}`);
                return res.status(410).json({
                    error: 'Short URL has expired'
                });
            }

            // Track click
            const referrer = req.get('Referer') || '';
            const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
            const geo = geoip.lookup(clientIP);
            const location = geo ? geo.country : 'Unknown';

            // Add click tracking
            await url.addClick(referrer, location);

            logger.info('controller', `Redirecting ${shortcode} to ${url.originalUrl}`);

            // Redirect to original URL
            res.redirect(301, url.originalUrl);

        } catch (error) {
            logger.error('controller', `Error redirecting URL: ${error.message}`);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}

module.exports = UrlController;
