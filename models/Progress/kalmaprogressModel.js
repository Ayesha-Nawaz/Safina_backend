const mongoose = require('mongoose');
const kalmaProgress = require('../../schema/ProgressSchema/KalmaProgressSchema'); // Import userSchema

// Create User model based on the userSchema
const KalmaProgress = mongoose.model('KalmaProgress', kalmaProgress);

module.exports = KalmaProgress;