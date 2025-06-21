const mongoose = require("mongoose");

const duaprogressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  dualearnt: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dua', default: [] }], 
});

module.exports = duaprogressSchema;
