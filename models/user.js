'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  username: { type: String, required: true, unique: true },
  hashedUsername: { type: String },
  password: { type: String, required: true },
  userVerificationCode: { type: String},
  verified: { type: Boolean, default: false },
  introQuizCompleted: { type: Boolean, default: false },
  profile: {
    selfType: { type: String },
    preferenceType: { type: String },
  }
});

userSchema.set('toJSON', {
  virtual: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password;
    delete result.userVerificationCode;
    delete result.verified;
    delete result.introQuizCompleted;
  }
});

userSchema.methods.validatePassword = function (pwd) {
  const currentUser = this;
  return bcrypt.compare(pwd, currentUser.password);
};


userSchema.statics.hashPassword = function (pwd) {
  return bcrypt.hash(pwd, 10);
};

module.exports = mongoose.model('User', userSchema);



// 'use strict';

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const schema = new mongoose.Schema(
//   {
//     username: {type: String, required: true, unique: true},
//     hashedUsername: {type: String},
//     password: {type: String, required: true},
//     userVerificationCode: {type: String, required: true},
//     verified: {type: Boolean, default: false},
//     introQuizCompleted: {type: Boolean, default: false},
//     location: {type: String, default: ''},
//     lists:{
//       suggestedFriendsList: [{type: Object}],
//       friendsList: [{type: Object}],
//       ignoreList:[{type: Object}],
//       meetupJoinedList: [{type: Object}],
//       meetupCreatedList: [{type: Object}],
//     },
//     scores: {
//       friendScore: {type: Number, default: 0},
//       strikeScore: {type: Number, default: 0},
//       aggroScore: {type: Number, default: 0},
//       meetupCreateScore: {type: Number, default: 0},
//       meetupJoinScore: {type: Number, default: 0},
//       pollScore: {type: Number, default: 0},
//       communityScore: {type: Number, default: 0},
//     },
//     profile: {
//       selfTalker: {type: Boolean},
//       selfListener: {type: Boolean},
//       preferenceTalker: {type: Boolean},
//       preferenceListener: {type: Boolean},
//     }
//   }
// );

// schema.set('timestamps', true);

// schema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, res) => {
//     delete res._id;
//     delete res.hashedUsername;
//     delete res.location;
//     delete res.__v;
//     delete res.password;
//     delete res.introQuizCompleted;
//     delete res.lists;
//     delete res.scores;
//     delete res.profile;
//   }
// });

// schema.methods.validatePassword = function(password){
//   return bcrypt.compare(password, this.password);
// };

// schema.statics.hashPassword = function(password){
//   return bcrypt.hash(password, 10);
// };

// module.exports = mongoose.model('User', schema);