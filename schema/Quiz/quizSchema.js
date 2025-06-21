const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { 
    en: { type: String, required: true }, // English name
    ur: { type: String, required: true }  // Urdu name
  },
  quizzes: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, 
      title: { 
        en: { type: String, required: true }, // English title
        ur: { type: String, required: true }  // Urdu title
      },
      syllabus: { 
        en: { type: [String], required: true }, 
        ur: { type: [String], required: true } 
      },
      questions: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          question: { 
            en: { type: String, required: true }, 
            ur: { type: String, required: true } 
          },
          options: [
            {
              en: { type: String, required: true },
              ur: { type: String, required: true }
            }
          ],
          correctAnswer: { 
            en: { type: String, required: true },
            ur: { type: String, required: true }
          }
        }
      ]
    }
  ]
});

module.exports = QuizSchema;