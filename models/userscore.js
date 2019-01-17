'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    friendScore: {type: Number, default: 0},
    strikeScore: {type: Number, default: 0},
    aggroScore: {type: Number, default: 0},
    meetupCreateScore: {type: Number, default: 0},
    meetupJoinScore: {type: Number, default: 0},
    pollScore: {type: Number, default: 0},
    communityScore: {type: Number, default: 0},
  }
);

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) =>{
    delete res._id;
    delete res.__v;
  }
});

module.exports = mongoose.model('Userscore', schema);