const express = require("express");
const mongoose = require("mongoose");
const QuizScore = require("../../models/Quiz/quizScoreModel");
const Quiz = require("../../models/Quiz/quizModel");
const QuizProgress = require("../../models/Progress/quizProgressModel");

const router = express.Router();

// Enable CORS for all routes
const cors = require("cors");
router.use(cors({
  origin: "*", // Allow all origins for development
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware to parse JSON
router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add logging middleware
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  next();
});

// POST route to submit quiz scores
router.post("/submitscore", async (req, res) => {
  try {
    const { userId, scores } = req.body;

    console.log("=== QUIZ SCORE SUBMISSION ===");
    console.log("Received payload:", JSON.stringify(req.body, null, 2));

    // Validate request data
    if (!userId) {
      console.error("Missing userId in request");
      return res.status(400).json({ 
        error: "Missing userId", 
        received: { userId, scoresLength: scores?.length }
      });
    }

    if (!Array.isArray(scores) || scores.length === 0) {
      console.error("Invalid scores array:", scores);
      return res.status(400).json({ 
        error: "Scores must be a non-empty array",
        received: { scores }
      });
    }

    // Convert userId to ObjectId
    let userObjectId;
    try {
      userObjectId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : new mongoose.Types.ObjectId();
      console.log("User ObjectId:", userObjectId);
    } catch (err) {
      console.error("Error converting userId to ObjectId:", err);
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const processedScores = [];

    // Process each score in the scores array
    for (const scoreData of scores) {
      const { quizId, selectedAnswers, score, totalQuestions, category, date } = scoreData;

      console.log("Processing score data:", JSON.stringify(scoreData, null, 2));

      // Validate score data
      if (!quizId || !Array.isArray(selectedAnswers) || typeof score !== "number" || typeof totalQuestions !== "number") {
        console.error("Invalid score data format:", scoreData);
        return res.status(400).json({ 
          error: "Invalid score data format",
          expected: {
            quizId: "string",
            selectedAnswers: "array", 
            score: "number",
            totalQuestions: "number"
          },
          received: scoreData
        });
      }

      // Validate question limit (maximum 5 questions per submission)
      if (totalQuestions > 5) {
        console.error("Too many questions in submission:", totalQuestions);
        return res.status(400).json({
          error: "Maximum 5 questions allowed per submission",
          received: { totalQuestions }
        });
      }

      let quizObjectId;
      try {
        quizObjectId = mongoose.Types.ObjectId.isValid(quizId)
          ? new mongoose.Types.ObjectId(quizId)
          : new mongoose.Types.ObjectId();
        console.log("Quiz ObjectId:", quizObjectId);
      } catch (err) {
        console.error("Error converting quizId to ObjectId:", err);
        return res.status(400).json({ error: "Invalid quizId format" });
      }

      // Fetch the quiz to get category info
      let quizCategory = category || "General";
      try {
        const quiz = await Quiz.findOne({ "quizzes._id": quizObjectId });
        if (quiz) {
          const selectedQuiz = quiz.quizzes.find((q) => q._id.toString() === quizObjectId.toString());
          if (selectedQuiz) {
            quizCategory = quiz.name?.en || selectedQuiz.title?.en || category || "General";
            console.log("Found quiz category:", quizCategory);
          }
        } else {
          console.warn("Quiz not found, using default category");
        }
      } catch (quizError) {
        console.warn("Error fetching quiz for category:", quizError.message);
      }

      // Format answers
      const formattedAnswers = selectedAnswers.map((ans) => {
        if (!ans.questionId) {
          throw new Error("Missing questionId in answer");
        }

        let questionObjectId;
        try {
          questionObjectId = mongoose.Types.ObjectId.isValid(ans.questionId)
            ? new mongoose.Types.ObjectId(ans.questionId)
            : new mongoose.Types.ObjectId();
        } catch (err) {
          throw new Error("Invalid questionId format");
        }

        return {
          questionId: questionObjectId,
          selectedOption: ans.selectedOption && ans.selectedOption !== "No Answer"
            ? ans.selectedOption.toString().trim()
            : "No Answer",
          isCorrect: ans.isCorrect || false
        };
      });

      // Validate number of answers matches totalQuestions and doesn't exceed 5
      if (formattedAnswers.length > 5) {
        console.error("Too many answers in submission:", formattedAnswers.length);
        return res.status(400).json({
          error: "Maximum 5 answers allowed per submission",
          received: { answerCount: formattedAnswers.length }
        });
      }

      // Prepare score object
      const scoreObject = {
        quizId: quizObjectId,
        category: quizCategory,
        selectedAnswers: formattedAnswers,
        score: score,
        totalQuestions: totalQuestions,
        date: date ? new Date(date) : new Date(),
      };

      console.log("Formatted score object:", JSON.stringify(scoreObject, null, 2));

      // Check if a score for this quiz and user already exists
      try {
        const existingScore = await QuizScore.findOne({
          userId: userObjectId,
          "scores.quizId": quizObjectId
        });

        if (existingScore) {
          // Update existing score
          const result = await QuizScore.findOneAndUpdate(
            { userId: userObjectId, "scores.quizId": quizObjectId },
            {
              $set: {
                "scores.$": scoreObject
              }
            },
            { 
              new: true,
              runValidators: true
            }
          );
          console.log("Score updated successfully. Document ID:", result._id);
        } else {
          // Add new score
          const result = await QuizScore.findOneAndUpdate(
            { userId: userObjectId },
            {
              $push: {
                scores: scoreObject
              }
            },
            { 
              upsert: true, 
              new: true,
              runValidators: true
            }
          );
          console.log("Score saved successfully. Document ID:", result._id);
        }

        processedScores.push({
          quizId: quizId,
          score: score,
          totalQuestions: totalQuestions,
          category: quizCategory
        });

      } catch (dbError) {
        console.error("Database error saving score:", dbError);
        return res.status(500).json({ 
          error: "Failed to save score to database", 
          details: dbError.message,
          stack: dbError.stack
        });
      }

      // Update QuizProgress
      try {
        let userProgress = await QuizProgress.findOne({ userId: userObjectId });
        
        if (!userProgress) {
          userProgress = new QuizProgress({
            userId: userObjectId,
            progress: [],
          });
          console.log("Created new QuizProgress document");
        }

        const answeredCount = formattedAnswers.filter(ans => ans.selectedOption !== "No Answer").length;
        const isCompleted = answeredCount >= totalQuestions;

        const existingProgressIndex = userProgress.progress.findIndex(
          (p) => p.quizId.toString() === quizObjectId.toString()
        );

        const progressObject = {
          quizId: quizObjectId,
          category: quizCategory,
          totalQuestions: totalQuestions,
          answeredCount: answeredCount,
          isCompleted: isCompleted,
          selectedAnswers: formattedAnswers,
          lastUpdated: new Date(),
        };

        if (existingProgressIndex >= 0) {
          userProgress.progress[existingProgressIndex] = progressObject;
          console.log("Updated existing progress");
        } else {
          userProgress.progress.push(progressObject);
          console.log("Added new progress");
        }

        await userProgress.save();
        console.log("Progress saved successfully");

      } catch (progressError) {
        console.error("Error saving progress:", progressError);
        // Don't return error here, as score was saved successfully
      }
    }

    console.log("=== SUBMISSION COMPLETE ===");
    return res.status(200).json({
      message: "Quiz scores submitted successfully",
      success: true,
      userId: userId,
      processedScores: processedScores,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("=== SUBMISSION ERROR ===");
    console.error("Error submitting quiz:", error);
    console.error("Stack trace:", error.stack);
    
    return res.status(400).json({ 
      error: "Invalid submission", 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET quiz scores for a user
router.get("/scores/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`Fetching scores for user: ${userId}`);
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    let userObjectId;
    try {
      userObjectId = mongoose.Types.ObjectId.isValid(userId) ? 
                    new mongoose.Types.ObjectId(userId) : userId;
    } catch (err) {
      console.error("Error converting user ID to ObjectId:", err);
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    
    const userScores = await QuizScore.findOne({ userId: userObjectId });
    
    if (!userScores || !userScores.scores || userScores.scores.length === 0) {
      return res.status(200).json({ 
        message: "No quiz scores found for this user",
        userId: userId,
        totalQuizzesTaken: 0,
        averageScore: 0,
        scores: []
      });
    }
    
    const scoresWithDetails = userScores.scores.map(score => ({
      quizId: score.quizId,
      category: score.category,
      score: score.score,
      totalQuestions: score.totalQuestions,
      percentage: Math.round((score.score / (score.totalQuestions * 2)) * 100), // Assuming 2 points per question
      selectedAnswers: score.selectedAnswers,
      date: score.date
    }));
    
    scoresWithDetails.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return res.status(200).json({
      userId: userId,
      totalQuizzesTaken: scoresWithDetails.length,
      averageScore: scoresWithDetails.length > 0 
        ? Math.round(scoresWithDetails.reduce((sum, score) => sum + score.percentage, 0) / scoresWithDetails.length) 
        : 0,
      scores: scoresWithDetails
    });
    
  } catch (error) {
    console.error("Error fetching quiz scores:", error);
    return res.status(500).json({ 
      error: "Server error", 
      message: error.message 
    });
  }
});

// Test route to check if the router is working
router.get("/test", (req, res) => {
  res.json({ 
    message: "Quiz score routes are working",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;