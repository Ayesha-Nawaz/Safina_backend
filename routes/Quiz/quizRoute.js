// // const express = require("express");
// // const Quiz = require("../../models/Quiz/quizModel");

// // const router = express.Router();

// // /**
// //  * Get all quizzes, optionally filter by language
// //  * Example: /quizzes?lang=ur
// //  */
// // router.get("/quizzes", async (req, res) => {
// //   try {
// //     const { lang = "en" } = req.query;

// //     const quizzes = await Quiz.find();

// //     const formattedQuizzes = quizzes.map(quiz => {
// //       // Check if name is an object with language keys
// //       const name = typeof quiz.name === 'object' && quiz.name !== null 
// //         ? quiz.name[lang] || Object.values(quiz.name)[0] // Fallback to first available
// //         : quiz.name;

// //       return {
// //         id: quiz.id,
// //         name: name,
// //         quizzes: quiz.quizzes.map(q => {
// //           // Handle title (string or object)
// //           const title = typeof q.title === 'object' && q.title !== null
// //             ? q.title[lang] || Object.values(q.title)[0]
// //             : q.title;
          
// //           // Handle syllabus (array or object with language arrays)
// //           const syllabus = Array.isArray(q.syllabus) 
// //             ? q.syllabus 
// //             : (q.syllabus && q.syllabus[lang]) || [];

// //           return {
// //             _id: q._id,
// //             title: title,
// //             syllabus: syllabus,
// //             questions: q.questions.map(question => {
// //               // Handle question text
// //               const questionText = typeof question.question === 'object' && question.question !== null
// //                 ? question.question[lang] || Object.values(question.question)[0]
// //                 : question.question;
              
// //               // Handle options (array of strings or array of objects)
// //               const options = question.options.map(opt => 
// //                 typeof opt === 'object' && opt !== null ? (opt[lang] || Object.values(opt)[0]) : opt
// //               );

// //               // Handle correct answer
// //               const correctAnswer = typeof question.correctAnswer === 'object' && question.correctAnswer !== null
// //                 ? question.correctAnswer[lang] || Object.values(question.correctAnswer)[0]
// //                 : question.correctAnswer;

// //               return {
// //                 _id: question._id,
// //                 question: questionText,
// //                 options: options,
// //                 correctAnswer: correctAnswer
// //               };
// //             })
// //           };
// //         })
// //       };
// //     });

// //     res.json(formattedQuizzes);
// //   } catch (error) {
// //     console.error("Error in /quizzes route:", error);
// //     res.status(500).json({ message: "Error fetching quizzes", error: error.message });
// //   }
// // });
// // /**
// //  * Get a single quiz by ID
// //  * Example: /quiz/65ab123?lang=ur
// //  */
// // router.get("/quiz/:id", async (req, res) => {
// //   try {
// //     const { lang = "en" } = req.query;
// //     // Use findOne with id field instead of findById
// //     const quiz = await Quiz.findOne({ id: parseInt(req.params.id) });

// //     if (!quiz) {
// //       return res.status(404).json({ message: "Quiz not found" });
// //     }

// //     // Format response based on requested language
// //     const formattedQuiz = {
// //       id: quiz.id,
// //       name: typeof quiz.name === 'object' ? quiz.name[lang] : quiz.name,
// //       quizzes: quiz.quizzes.map(q => {
// //         // Similar formatting logic as in /quizzes route
// //         // ...
// //       })
// //     };

// //     res.json(formattedQuiz);
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // });
// // /**
// //  * Add a new quiz (Supports Urdu & English)
// //  */
// // router.post("/newQuiz", async (req, res) => {
// //   try {
// //     const { name, quizzes } = req.body; // Expecting quizzes array with multiple languages

// //     const newQuiz = new Quiz({
// //       name,
// //       quizzes, // Should contain "language" field (e.g., { title: "Quiz 1", language: "ur" })
// //     });

// //     await newQuiz.save();
// //     res.status(201).json(newQuiz);
// //   } catch (error) {
// //     res.status(400).json({ message: "Error saving quiz", error });
// //   }
// // });

// // /**
// //  * Bulk Add Quizzes (Supports Urdu & English)
// //  */
// // router.post("/addQuizzes", async (req, res) => {
// //   try {
// //     const quizzes = await Quiz.insertMany(req.body);
// //     res.status(201).json({ message: "Quizzes added successfully", quizzes });
// //   } catch (error) {
// //     res.status(400).json({ message: "Error adding quizzes", error });
// //   }
// // });

// // /**
// //  * Get only quiz categories
// //  */
// // router.get("/quiz-categories", async (req, res) => {
// //   try {
// //     const categories = await Quiz.find({}, "name");
// //     res.json(categories);
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error });
// //   }
// // });

// // /**
// //  * Delete a quiz by ID
// //  */
// // router.delete("/quiz/:id", async (req, res) => {
// //   try {
// //     const quiz = await Quiz.findByIdAndDelete(req.params.id);
// //     if (!quiz) {
// //       return res.status(404).json({ message: "Quiz not found" });
// //     }
// //     res.json({ message: "Quiz deleted successfully" });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error deleting quiz", error });
// //   }
// // });

// // /**
// //  * Update existing quizzes (Reset user answers & scores)
// //  */
// // router.put("/update-existing-quizzes", async (req, res) => {
// //   try {
// //     const result = await Quiz.updateMany(
// //       {},
// //       { $set: { "quizzes.$[].questions.$[].userAnswer": null, "quizzes.$[].questions.$[].score": 0 } }
// //     );

// //     res.json({ message: "Existing quizzes updated successfully", result });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error updating quizzes", error });
// //   }
// // });

// // module.exports = router;
// const express = require("express");
// const Quiz = require("../../models/Quiz/quizModel");

// const router = express.Router();

// // Get all quizzes
// router.get("/quizzes", async (req, res) => {
//   try {
//     const quizzes = await Quiz.find();
//     res.json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching quizzes" });
//   }
// });

// // Get a single quiz by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.id);
//     res.json(quiz);
//   } catch (error) {
//     res.status(404).json({ message: "Quiz not found" });
//   }
// });

// // Add a new quiz
// router.post("/newQuiz", async (req, res) => {
//   try {
//     const newQuiz = new Quiz(req.body);
//     await newQuiz.save();
//     res.status(201).json(newQuiz);
//   } catch (error) {
//     res.status(400).json({ message: "Error saving quiz" });
//   }
// });

// router.post("/addQuizzes", async (req, res) => {
//   try {
//     // Check if the request body is an array
//     if (!Array.isArray(req.body)) {
//       return res.status(400).json({ message: "Request body must be an array of quizzes" });
//     }

//     // Validate each quiz in the array
//     for (const quiz of req.body) {
//       if (!quiz.id || !quiz.name || !quiz.name.en || !quiz.name.ur || !quiz.quizzes) {
//         return res.status(400).json({ message: "Missing required fields in one or more quizzes" });
//       }

//       for (const q of quiz.quizzes) {
//         if (!q.title || !q.title.en || !q.title.ur || !q.syllabus || !q.syllabus.en || !q.syllabus.ur || !q.questions) {
//           return res.status(400).json({ message: "Missing required fields in one or more quizzes" });
//         }

//         for (const question of q.questions) {
//           if (!question.question || !question.question.en || !question.question.ur || !question.options || !question.correctAnswer || !question.correctAnswer.en || !question.correctAnswer.ur) {
//             return res.status(400).json({ message: "Missing required fields in one or more questions" });
//           }
//         }
//       }
//     }

//     // Insert the quizzes into the database
//     const insertedQuizzes = await Quiz.insertMany(req.body);
//     res.status(201).json({ message: "Quizzes added successfully", quizzes: insertedQuizzes });
//   } catch (error) {
//     res.status(400).json({ message: "Error adding quizzes", error: error.message });
//   }
// });
// // Get only quiz categories
// router.get("/quiz-categories", async (req, res) => {
//   try {
//     const quizzes = await Quiz.find({}, "name"); // Fetch only the 'name' field
//     res.json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });



// router.delete("/:id", async (req, res) => {
//   try {
//     const quiz = await Quiz.findByIdAndDelete(req.params.id);
//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }
//     res.json({ message: "Quiz deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting quiz" });
//   }
// });

// router.get("/quizzes/:id", async (req, res) => {
//   try {
//     const quiz = await QuizModel.findById(req.params.id);
//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }
//     res.json(quiz);
//   } catch (error) {
//     console.error("Error fetching quiz:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.put("/update-existing-quizzes", async (req, res) => {
//   try {
//     const result = await Quiz.updateMany(
//       {},
//       { $set: { "quizzes.$[].questions.$[].userAnswer": null, "quizzes.$[].questions.$[].score": 0 } }
//     );

//     res.json({ message: "Existing quizzes updated successfully", result });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating existing quizzes", error });
//   }
// });




// module.exports = router;
// backend/routes/Quiz/quizRoute.js
const express = require("express");
const Quiz = require("../../models/Quiz/quizModel");

const router = express.Router();

// Get all quizzes
router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes" });
  }
});

// Get a single quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (error) {
    res.status(404).json({ message: "Quiz not found" });
  }
});

// Add a new quiz
router.post("/newQuiz", async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(400).json({ message: "Error saving quiz" });
  }
});

router.post("/addQuizzes", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "Request body must be an array of quizzes" });
    }

    for (const quiz of req.body) {
      if (!quiz.id || !quiz.name || !quiz.name.en || !quiz.name.ur || !quiz.quizzes) {
        return res.status(400).json({ message: "Missing required fields in one or more quizzes" });
      }
      for (const q of quiz.quizzes) {
        if (!q.title || !q.title.en || !q.title.ur || !q.syllabus || !q.syllabus.en || !q.syllabus.ur || !q.questions) {
          return res.status(400).json({ message: "Missing required fields in one or more quizzes" });
        }
        for (const question of q.questions) {
          if (!question.question || !question.question.en || !question.question.ur || !question.options || !question.correctAnswer || !question.correctAnswer.en || !question.correctAnswer.ur) {
            return res.status(400).json({ message: "Missing required fields in one or more questions" });
          }
        }
      }
    }

    const insertedQuizzes = await Quiz.insertMany(req.body);
    res.status(201).json({ message: "Quizzes added successfully", quizzes: insertedQuizzes });
  } catch (error) {
    res.status(400).json({ message: "Error adding quizzes", error: error.message });
  }
});

// Get only quiz categories
router.get("/quiz-categories", async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, "name");
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz" });
  }
});

// Fixed /quizzes/:id route
router.get("/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id); // Changed QuizModel to Quiz
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-existing-quizzes", async (req, res) => {
  try {
    const result = await Quiz.updateMany(
      {},
      { $set: { "quizzes.$[].questions.$[].userAnswer": null, "quizzes.$[].questions.$[].score": 0 } }
    );
    res.json({ message: "Existing quizzes updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error updating existing quizzes", error });
  }
});

module.exports = router;