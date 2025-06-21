const mongoose = require("mongoose");

const AsmaulNabiSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  arabic: { type: String, required: true },
  transliteration: { type: String, required: true },
  urdu: { type: String, required: true },
  meaning: { type: String, required: true },
  urduMeaning: { type: String, required: true },
  details: { type: String, required: true },
  urduExplanation: { type: String, required: true },
  audio: { type: String, default: "" },
});

module.exports = AsmaulNabiSchema;
