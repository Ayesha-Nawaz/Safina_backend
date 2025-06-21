// models/Bookmark.js
const mongoose = require('mongoose');
const BookmarkSchema = require('../schema/bookmarkSchema'); // Import the Bookmark schema

const Bookmark = mongoose.model('Bookmark', BookmarkSchema); // Create the model

// Export the model
module.exports = Bookmark;