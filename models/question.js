'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    question: {type: String},
    answers: [{type: Object}],
    category: {type: String}
  }
);

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) =>{
    delete res._id;
    delete res.__v;
    delete res.answers;
  }
});

module.exports = mongoose.model('Question', schema);