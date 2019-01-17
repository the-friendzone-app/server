'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    question: {type: String},
    options: [
      {
        text: {type: String},
        pros: {type:String},
        cons: {type:String}
      }
    ]
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