const mongoose = require('mongoose');
const NamazSchema = new mongoose.Schema({
    id: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    arabic: {
      type: String,
      required: true,
    },
    english_translation: {
      type: String,
      required: true,
    },
    urdu_translation: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    dua: {
      type: String,
      required: true,
    },
  });
// Export the schema correctly
module.exports = NamazSchema;  // Ensure the variable name matches here