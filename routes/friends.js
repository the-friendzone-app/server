'use strict';

const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const bodyParser = require('body-parser');
const JSONParser = bodyParser.json();
const Chat = require('../models/chat');
// const Friendship = require('../models/friendship');


const router = express.Router();

// const jwtAuth = passport.authenticate('jwt', {
//     session: false,
//     failWithError: true
// });
// router.use(jwtAuth);
//returns users friends
router.get('/:id', (req, res, next) => {
  let { id } = req.params;
  User.find({ _id: id }).populate({
    path: 'friends',
    select: 'username'
  })
    .then(user => {
      const { friends } = user[0];
      //console.log(friends);
      res.json(friends);

    })
    .catch(err => next(err));
});

router.get('/friended/:id', (req, res, next) => {
  let { id } = req.params;
  // console.log(id);
  User.findOne({ _id: id }, { friends: 1 })
    .populate({ path: 'friended._id', select: ['hashedUsername', 'username'] })
    .populate({ path: 'friended.chatroom', select: '_id' })
    .then(friends => {
      // console.log(friends);
      res.json(friends);

    })
    .catch(err => next(err));
});

//gets suggested list where perference and self matches up
//self= talker, listener, both 
//preference = listener, both, talker
router.get('/suggested/:id', (req, res, next) => {
  const { id } = req.params;
  // console.log(id);
  let _userSelfType;
  let _userPreferenceType;
  User.findById(id)
    .then(user => {
      _userSelfType = user.profile.selfType;
      _userPreferenceType = user.profile.preferenceType;
      //make sure you're returning the right suggested users
      //frodo self:talker, pref:both
      //gollum self:listener, pref:talker
      if (_userSelfType === 'both') {
        if (_userPreferenceType === 'both') {
          return User.find({ 'profile.preferenceType': { $in: ['talker', 'listener', 'both'] } });
        } else {
          return User.find({ 'profile.selfType': { $in: [_userPreferenceType] } });
        }
      }
      if (_userSelfType === 'listener') {
        if (_userPreferenceType === 'both') {
          return User.find({ 'profile.preferenceType': { $in: ['talker', 'listener', 'both'] } });
        }
        return User.find({
          $and: [
            { 'profile.preferenceType': { $in: ['listener', 'both'] } },
            { 'profile.selfType': { $in: [_userPreferenceType, 'both'] } }
          ]
        });
      }
      if (_userSelfType === 'talker') {
        if (_userPreferenceType === 'both') {
          return User.find({ 'profile.preferenceType': { $in: ['talker', 'listener', 'both'] } });
        }
        return User.find({
          $and: [
            { 'profile.preferenceType': { $in: ['talker', 'both'] } },
            { 'profile.selfType': { $in: [_userPreferenceType, 'both'] } }
          ]
        });
      }
    })
    .then(suggested => {
      let suggestedList = [];
      for (let key in suggested) {
        if (String(suggested[key]._id) !== String(id)) {
          suggestedList.push(suggested[key]);
        }
      }
      res.json(suggestedList);
    })
    .catch(err => next(err));
});
module.exports = router;