const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [2, 'Title must be at least 2 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  time: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Accept both 24-hour format and the format coming from frontend
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v) || 
               /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(am|pm)$/i.test(v);
      },
      message: props => `${props.value} is not a valid time format!`
    }
  },
  durationWeeks: { 
    type: Number, 
    required: true, 
    min: [1, 'Duration must be at least 1 week'],
    max: [52, 'Duration cannot exceed 52 weeks'],
    default: 1
  },
  color: { 
    type: String,
    default: '#4A90E2'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: { type: Date, default: Date.now }
});

const scheduleSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User',
    unique: true
  },
  activities: [activitySchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

scheduleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

scheduleSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Schedule', scheduleSchema);