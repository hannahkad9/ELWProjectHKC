// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roundsPlayed: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
