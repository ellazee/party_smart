var mongoose = require('mongoose');

var SessionSchema = mongoose.Schema({
  weight: Number,
  height: Number,
  drinks: Number,
  hours: Number
});

module.exports = mongoose.model('Session', SessionSchema);