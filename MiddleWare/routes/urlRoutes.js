const express = require('express');
const router = express.Router();
const { createShortURL, getShortURLStats } = require('../controllers/urlController');

router.post('/shorturls', createShortURL);
router.get('/shorturls/:shortcode', getShortURLStats);

module.exports = router;
