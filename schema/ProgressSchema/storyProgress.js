const mongoose = require("mongoose");

const storyprogressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  readStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story', default: [] }], // Reference to the Story model
});

module.exports = storyprogressSchema;
