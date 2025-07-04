// schema/Quiz/quizScoreSchema.js
const mongoose = require("mongoose");

const quizScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scores: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Quiz",
      },
      category: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
      totalQuestions: {
        type: Number,
        required: true,
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
      
    },
  ],
});

module.exports = quizScoreSchema;