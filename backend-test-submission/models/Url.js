const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    referrer: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: 'Unknown'
    }
});

const urlSchema = new mongoose.Schema({
    shortcode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    originalUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiry: {
        type: Date,
        required: true
    },
    clicks: [clickSchema]
}, {
    timestamps: true
});

urlSchema.index({ expiry: 1 });

urlSchema.methods.isExpired = function() {
    return new Date() > this.expiry;
};

urlSchema.methods.addClick = function(referrer = '', location = 'Unknown') {
    this.clicks.push({
        timestamp: new Date(),
        referrer,
        location
    });
    return this.save();
};

module.exports = mongoose.model('Url', urlSchema);
