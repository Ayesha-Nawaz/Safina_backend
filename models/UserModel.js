const mongoose = require('mongoose');
const userSchema = require('../schema/userschema'); // Import userSchema

// Create User model based on the userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;