const ShortURL = require('../models/ShortURL.js');
const generateShortcode = require('../utils/generateShortcode');
const { HOST_URL } = process.env;

exports.createShortURL = async (req, res) => {
    const { url, validity = 30, shortcode } = req.body;

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    let code = shortcode || generateShortcode();
    let expiryDate = new Date(Date.now() + validity * 60000);

    try {
        const exists = await ShortURL.findOne({ shortcode: code });
        if (exists && !shortcode) code = generateShortcode();
        else if (exists && shortcode) return res.status(409).json({ error: 'Shortcode already exists' });

        const newURL = new ShortURL({
            originalUrl: url,
            shortcode: code,
            expiry: expiryDate
        });

        await newURL.save();

        return res.status(201).json({
            shortLink: `${HOST_URL}/${code}`,
            expiry: expiryDate.toISOString()
        });

    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getShortURLStats = async (req, res) => {
    const { shortcode } = req.params;

    try {
        const data = await ShortURL.findOne({ shortcode });

        if (!data) return res.status(404).json({ error: 'Shortcode not found' });

        return res.json({
            originalUrl: data.originalUrl,
            createdAt: data.createdAt,
            expiry: data.expiry,
            totalClicks: data.clicks.length,
            clicks: data.clicks.map(click => ({
                timestamp: click.timestamp,
                referrer: click.referrer,
                geo: click.geo
            }))
        });

    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
