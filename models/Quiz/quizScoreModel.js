const mongoose = require("mongoose");
const quizScoreSchema = require("../../schema/Quiz/quizScoreSchema");

const QuizScore = mongoose.model("QuizScore", quizScoreSchema); // ✅ Correct Model Creation

module.exports = QuizScore;
