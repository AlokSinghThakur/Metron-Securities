const mongoose = require("mongoose");

// Define Schema (like a Table Structure)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },      // Required String
  email: { type: String, required: true, unique: true }, // Unique Email
  password: { type: String, required: true },  // Hashed Password
  age: { type: Number, default: 18 },   
  pancard: { type: String, required: false },       // Default value is 18
  creditCard: { type: String, required: true, unique: true }, // Added Credit Card Column
  createdAt: { type: Date, default: Date.now } // Auto Timestamp
});

// Create Model (like a Table)
const User = mongoose.model("User", userSchema);

module.exports = User;
