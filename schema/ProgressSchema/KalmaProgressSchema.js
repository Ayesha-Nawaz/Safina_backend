const mongoose = require("mongoose");

const kalmaprogressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  kalmalearnt: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Kalma', default: [] }], 
});

module.exports = kalmaprogressSchema;
