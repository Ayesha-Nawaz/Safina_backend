const mongoose = require("mongoose");

const namazProgressSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  progress: [
    {
      category: { 
        type: String, 
        required: true 
      },
      dua: { 
        type: String, 
        required: false // Change to false if it's not always required
      },
      namazItems: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Namaz" 
      }],
    }
  ],
});

module.exports = namazProgressSchema;