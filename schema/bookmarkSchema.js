const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookmarks: [
    {
      contentId: {
        type: String,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Export the schema
module.exports = BookmarkSchema;