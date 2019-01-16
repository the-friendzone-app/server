'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema(
  {
    username: {type: String, required: true, unique: true},
    hashedUsername: {type: String},
    password: {type: String, required: true},
    userVerificationCode: {type: String, required: true},
    verified: {type: Boolean, default: false},
    introQuizCompleted: {type: Boolean, default: false},
    location: {type: String, default: ''},
    lists:{
      suggestedFriendsList: [{type: Object}],
      friendsList: [{type: Object}],
      ignoreList:[{type: Object}],
      meetupJoinedList: [{type: Object}],
      meetupCreatedList: [{type: Object}],
    },
    scores: {
      friendScore: {type: Number, default: 0},
      strikeScore: {type: Number, default: 0},
      aggroScore: {type: Number, default: 0},
      meetupCreateScore: {type: Number, default: 0},
      meetupJoinScore: {type: Number, default: 0},
      pollScore: {type: Number, default: 0},
      communityScore: {type: Number, default: 0},
    },
    profile: {
      selfTalker: {type: Boolean},
      selfListener: {type: Boolean},
      preferenceTalker: {type: Boolean},
      preferenceListener: {type: Boolean},
    }
  }
);

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) => {
    delete res._id;
    delete res.hashedUsername;
    delete res.location;
    delete res.__v;
    delete res.password;
    delete res.introQuizCompleted;
    delete res.lists;
    delete res.scores;
    delete res.profile;
  }
});

schema.methods.validatePassword = function(password){
  return bcrypt.compare(password, this.password);
};

schema.statics.hashPassword = function(password){
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', schema);