const mongoose = require('mongoose');

const shortURLSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortcode: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    expiry: { type: Date, required: true },
    clicks: [
        {
            timestamp: Date,
            referrer: String,
            geo: String
        }
    ]
});

module.exports = mongoose.model('ShortURL', shortURLSchema);
