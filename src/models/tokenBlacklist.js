const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60 // Expira em 24 horas
  }
});

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema); 