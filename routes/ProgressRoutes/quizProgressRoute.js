// backend/routes/Quiz/quizProgressRoute.js
const express = require("express");
const mongoose = require("mongoose");
const Quiz = require("../../models/Quiz/quizModel");
const QuizProgress = require("../../models/Progress/quizProgressModel");

const router = express.Router();

router.get("/quizprogress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // Fetch all quizzes
    const allQuizzes = await Quiz.find();

    // Flatten quizzes into an array with quizId, category, and totalQuestions
    const flatQuizzes = allQuizzes.flatMap(q =>
      q.quizzes.map(innerQuiz => ({
        quizId: innerQuiz._id.toString(),
        category: q.name.en || "General",
        totalQuestions: innerQuiz.questions.length,
      }))
    );

    // Fetch user's progress
    const userProgress = await QuizProgress.findOne({ userId: userObjectId });

    const progressDetails = userProgress ? userProgress.progress : [];

    // Calculate progress by category
    const progressByCategory = {};

    for (const quiz of flatQuizzes) {
      const { quizId, category, totalQuestions } = quiz;

      if (!progressByCategory[category]) {
        progressByCategory[category] = {
          totalQuizzes: 0,
          attemptedQuizzes: 0,
          completedQuizzes: 0,
          totalQuestions: 0,
          answeredQuestions: 0,
        };
      }

      progressByCategory[category].totalQuizzes += 1;
      progressByCategory[category].totalQuestions += totalQuestions;

      const userQuizProgress = progressDetails.find(p => p.quizId.toString() === quizId);
      if (userQuizProgress) {
        progressByCategory[category].attemptedQuizzes += 1;
        progressByCategory[category].answeredQuestions += userQuizProgress.answeredCount;
        if (userQuizProgress.isCompleted) {
          progressByCategory[category].completedQuizzes += 1;
        }
      }
    }

    // Calculate progress percentages
    const categoryProgress = Object.entries(progressByCategory).map(
      ([category, data]) => ({
        category,
        totalQuizzes: data.totalQuizzes,
        attemptedQuizzes: data.attemptedQuizzes,
        completedQuizzes: data.completedQuizzes,
        totalQuestions: data.totalQuestions,
        answeredQuestions: data.answeredQuestions,
        quizCompletionPercentage: data.totalQuizzes > 0
          ? Math.round((data.completedQuizzes / data.totalQuizzes) * 100)
          : 0,
        questionCompletionPercentage: data.totalQuestions > 0
          ? Math.round((data.answeredQuestions / data.totalQuestions) * 100)
          : 0,
      })
    );

    // Calculate overall progress
    const totalQuizzes = flatQuizzes.length;
    const totalQuestions = flatQuizzes.reduce((sum, q) => sum + q.totalQuestions, 0);
    const attemptedQuizzes = progressDetails.length;
    const completedQuizzes = progressDetails.filter(p => p.isCompleted).length;
    const answeredQuestions = progressDetails.reduce((sum, p) => sum + p.answeredCount, 0);

    res.status(200).json({
      userId,
      totalQuizzes,
      attemptedQuizzes,
      completedQuizzes,
      totalQuestions,
      answeredQuestions,
      overallQuizProgress: totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0,
      overallQuestionProgress: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
      categoryProgress,
    });
  } catch (error) {
    console.error("Error fetching quiz progress:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

module.exports = router;