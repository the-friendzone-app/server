'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    answer: {
      text: {type:String},
      pros: {type:String},
      cons: {type:String}
    },
    question: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'}
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

module.exports = mongoose.model('Useranswer', schema);