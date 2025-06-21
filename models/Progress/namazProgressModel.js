const mongoose = require('mongoose');
const NamazProgresss = require('../../schema/ProgressSchema/namazProgressschema'); // Import userSchema

// Create User model based on the userSchema
const NamazProgress = mongoose.model('NamazProgress', NamazProgresss);

module.exports = NamazProgress;