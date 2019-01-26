'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const faker = require('faker');
const Quiz = require('./quiz');

const userSchema = new mongoose.Schema({

  username: { type: String, required: true, unique: true },
  hashedUsername: { type: String },
  password: { type: String, required: true },
  userVerificationCode: { type: String },
  verified: { type: Boolean, default: false },
  introQuizCompleted: { type: Boolean, default: false },
  introQuizQuestions: [
    {
      questionID: {type: mongoose.Schema.Types.ObjectId, ref: Quiz},
      userAnswer: String
    }
  ],
  profile: {
    selfType: { type: String },
    preferenceType: { type: String },
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friended: [{
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chatroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }
  }]
});

userSchema.set('toJSON', {
  virtual: true,
  transform: (doc, result) => {
    delete result.__v;
    delete result.password;
    delete result.userVerificationCode;
    delete result.verified;
    // delete result.introQuizCompleted;
  }
});




userSchema.statics.hashUsername = function () {
  let randomAdjectives = ['Awesome','Futuristic','Happy','Evil','Sleepy','Wild','Sneaky','Cute','Chibi','Kawaii','Giant','Tiny','Super','Practical','Little','Silent','Smoky','Opalescent','Dark','Sparkling','Tasty','Secret','Misty','Shiny','Rare','Special','Friendly','Perfect','Wonderful','Incredible','Amazing','Ethereal','Clever','Phantom','Sophisticated','Intelligent','Super','Blue','Red','Green','Yellow','Purple','Pink','Orange','Smart']
  let randomAdjective = randomAdjectives[Math.floor(Math.random()*randomAdjectives.length)];
  let randomWords = ['Cat', 'Hotdog', 'Dragon', 'Fish', 'Tomato', 'Fire', 'Shrimp','Poodle','Glasses','Leaf','Key','Dog','Sandwich','Puppy','Teacup','Sunset','Orangutan','Guide','Electricity','Spoon','Bed','Pajamas','Mountain','Waterfall','Pirate','Sailor','Socks','Ninja','Assassin','Warrior','Druid','Viper','Genius','Banana','Grapefruit','Llama','Skeleton','Duckling','Wizard','Tiger','Lion','Bear','Crab','Rogue','Magician','Detective','Lizard','Racecar','Hacker','Winter','Omelette','Pterodactyl','Waffle','Astronaut','Dinosaur','Porcupine','Jaguar','Spaceship','Sloth','Midnight','Birthdaycake','Potion','Axolotl','Hawk','Spider','Grasshopper','Octopus','Dolphin','Thunder','Lightning','Blizzard','Donut','Volcano','Captain','Meteor','Swordfish','Crumpet']
  let randomWord = randomWords[Math.floor(Math.random()*randomWords.length)];
let hashedname = 
randomAdjective+'-'+randomWord+faker.random.number();

return hashedname;
};

userSchema.statics.createVerificationCode = function () {
  let code = ''
for(let i = 0; i < 8; i++){
  code += faker.random.alphaNumeric();

}
  return code;

};
userSchema.methods.validatePassword = function (pwd) {
  const currentUser = this;

  return bcrypt.compare(pwd, currentUser.password);
};


userSchema.statics.hashPassword = function (pwd) {
 return bcrypt.hash(pwd, 10);
};

userSchema.statics.generateQuestions = function () {
  return Quiz.find().then(results => {
    this.introQuizQuestions = results.map((questions, i) => ({
      questions
    }));
  });
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