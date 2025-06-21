const mongoose = require('mongoose');
const progressSchema = require('../../schema/ProgressSchema/storyProgress'); // Import userSchema

// Create User model based on the userSchema
const StoryProgress = mongoose.model('StoryProgress', progressSchema);

module.exports = StoryProgress;