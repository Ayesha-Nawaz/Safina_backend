// backend/models/Quiz/quizProgressModel.js
const mongoose = require("mongoose");
const quizProgressSchema = require("../../schema/ProgressSchema/quizProgressSchema");

const QuizProgress = mongoose.model("QuizProgress", quizProgressSchema);

module.exports = QuizProgress;