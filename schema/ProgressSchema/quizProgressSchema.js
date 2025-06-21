// backend/schema/ProgressSchema/quizProgressSchema.js
const mongoose = require("mongoose");

const quizProgressItemSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Quiz",
  },
  category: {
    type: String,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  answeredCount: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  selectedAnswers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      selectedOption: {
        type: String,
        required: true,
      },
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const quizProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  progress: [quizProgressItemSchema],
});

module.exports = quizProgressSchema;