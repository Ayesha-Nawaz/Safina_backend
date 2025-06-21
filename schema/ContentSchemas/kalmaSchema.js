const mongoose = require('mongoose');

const kalmaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleUrdu: {
    type: String,
    required: true,
  },
  arabic: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contentUrdu: {
    type: String,
    required: true,
  },


   // New fields for tracking progress
   progress: { // Tracks progress (e.g., 0 for not read, 100 for read)
    type: Number,
    default: 0, // Default to 0% (not read)
  },
  completedAt: { // Timestamp when the story is completed
    type: Date,
    default: null,
  },
});

module.exports = kalmaSchema;  // Export only the schema
