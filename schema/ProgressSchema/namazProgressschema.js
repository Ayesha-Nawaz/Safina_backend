const mongoose = require("mongoose");

const namazProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  progress: [{
    category: {
      type: String,
      required: true
    },
    learnedItems: [{
      namazId: {
        type: String,
        required: true
      },
      dua: {
        type: String,
        default: null
      }
    }]
  }]
}, {
  timestamps: true
});


module.exports = namazProgressSchema;