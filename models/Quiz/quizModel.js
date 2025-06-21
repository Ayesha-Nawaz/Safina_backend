const mongoose = require("mongoose");
const QuizSchema = require("../../schema/Quiz/quizSchema"); // Import Quiz schema

const Quiz = mongoose.model("Quiz", QuizSchema); // Create the model

module.exports = Quiz;
