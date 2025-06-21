const { mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true }, // 'male', 'female', 'other'
  age: { type: Number, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Role field
  verificationCode: { type: String }, // Add verificationCode field
  codeExpiry: { type: Date }, // Add codeExpiry field
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = userSchema;
