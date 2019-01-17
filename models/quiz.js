'use strict';

const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    category: {type: String, required: true},
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}]
  }
);

quizSchema.set('timestamps', true);

quizSchema.set('toJSON',{
  virtuals: true,
  transform: (doc, res) =>{
    delete res._id;
    delete res.__v;
  }
});

module.exports = mongoose.model('Quiz', quizSchema);