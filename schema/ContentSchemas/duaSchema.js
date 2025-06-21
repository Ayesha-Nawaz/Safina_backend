const mongoose = require("mongoose");

const duaSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the image URL or file path
    required: true,
  },
  duas: [
    {
      id: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      titleEng: {
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
      contentEng: {
        type: String,
        required: true,
      },
      contentUrdu: {
        type: String,
        required: true,
      },
      image: {
        type: String, // Path for the dua image if needed
      },
      audio: {
        type: String,
        required: true,
      },
    },
  ], // New fields for tracking progress
  progress: {
    // Tracks progress (e.g., 0 for not read, 100 for read)
    type: Number,
    default: 0, // Default to 0% (not read)
  },
  completedAt: {
    // Timestamp when the story is completed
    type: Date,
    default: null,
  },
});

module.exports = duaSchema;
