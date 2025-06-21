const mongoose = require('mongoose');
const duaProgress = require('../../schema/ProgressSchema/duaProgressSchema'); // Import userSchema

// Create User model based on the userSchema
const DuaProgress = mongoose.model('DuaProgress', duaProgress);

module.exports = DuaProgress;