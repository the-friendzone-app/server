const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  questionText: { type: String },
  option1: { type: String },
  option2: { type: String },
  option3: { type: String },
  trapdoor: { type: String },
  category: { type: String },
  active: {type: Boolean}
});

quizSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) => {
    delete res._id;
    delete res.__v;
    delete res.trapdoor;
  }
});

module.exports = mongoose.model('Quiz', quizSchema);