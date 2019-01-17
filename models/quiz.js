'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}]
  }
);

schema.set('timestamps', true);

schema.set('toJSON',{
  virtuals: true,
  transform: (doc, res) =>{
    delete res._id;
    delete res.__v;
  }
});

module.exports = mongoose.model('Quiz', schema);