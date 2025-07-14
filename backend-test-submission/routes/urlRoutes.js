const express = require('express');
const UrlController = require('../controllers/urlController');
const { Logger } = require('../utils/logger');

const logger = new Logger();
const router = express.Router();

router.post('/shorturls', async (req, res) => {
    logger.info('route', 'POST /shorturls endpoint hit');
    await UrlController.createShortUrl(req, res);
});

router.get('/shorturls/:shortcode', async (req, res) => {
    logger.info('route', `GET /shorturls/${req.params.shortcode} endpoint hit`);
    await UrlController.getUrlDetails(req, res);
});

router.get('/:shortcode', async (req, res) => {
    logger.info('route', `GET /${req.params.shortcode} redirect endpoint hit`);
    await UrlController.redirectToUrl(req, res);
});

module.exports = router;
