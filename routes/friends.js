'use strict';
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const bodyParser = require('body-parser');
const JSONParser = bodyParser.json();
const Chat = require('../models/chat');
const Schat = require('../models/schat');
// const Friendship = require('../models/friendship');


const router = express.Router();

router.get('/friended/:id', (req, res, next) => {
  let { id } = req.params;
  // console.log(id);
  User.findOne({ _id: id })
    .populate({ path: 'friended._id', select: ['hashedUsername', 'username'] })
    .populate({ path: 'friended.chatroom', select: '_id' })
    .then(friends => {
      // console.log(friends);
      res.json(friends);

    })
    .catch(err => next(err));
});
router.delete('/friended/:userId/:id', (req, res, next) => {
  let { id } = req.params; //chatroom id
  let { userId } = req.params;
  // console.log(id);
  // console.log(userId);
  Chat.findOneAndDelete({ _id: id })
    .then(() => {
      return User.find({ _id: userId });
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

//retrieve suggested like friended above
router.get('/schat/:id', (req, res, next) => {
  let { id } = req.params;
  // console.log(id);
  User.findOne({ _id: id })
    .populate({ path: 'suggested._id', select: ['hashedUsername', 'username'] })
    .populate({ path: 'suggested.chatroom', select: '_id' })
    .then(suggested => {
      // console.log(suggested.suggested);
      res.json(suggested);

    })
    .catch(err => next(err));
});


//gets suggested list where perference and self matches up
//self= talker, listener, both 
//preference = listener, both, talker
//don't need to return anything just push it to suggested and change to put
router.put('/suggested/:id', (req, res, next) => {
  const { id } = req.params;
  // console.log(id);
  let _userSelfType;
  let _userPreferenceType;
  User.findOne({ _id: id })
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
    .then(listOfUsers => {
      //gets rid of self
      let suggestedList = [];
      // console.log(listOfUsers);
      for (let key in listOfUsers) {
        if (String(listOfUsers[key]._id) !== String(id)) {
          suggestedList.push(listOfUsers[key]);
        }
      }
      // console.log(suggestedList);
      return suggestedList;
    })
    .then(suggestedList => {
      let _user;
      //console.log('suggestedList', suggestedList);
      return User.findOne({ _id: id })
        .then(user => {
          _user = user;
          if (suggestedList.length !== _user.suggested.length) {
            // console.log('_user', _user);
            for (let key in suggestedList) {

              User.findOne({ _id: suggestedList[key]._id })
                .then(user => {
                  // console.log('********USER*****', user.username, '********************');
                  //is there anything in suggested
                  //NEED TO STILL CREATE SUGGESTED IF USER NOT IN SUGGESTED LIST 
                  if ((_user.suggested && _user.suggested.length)) { //if user has nothing in suggested
                    if ((user.suggested && user.suggested.length)) { //if suggested user has nothing in suggested
                      // console.log('_user.suggested', _user.suggested);
                      // console.log('user._Id', user._id);
                      // console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

                      let userSuggested = _user.suggested.filter(suggest => String(suggest._id) === String(user._id));
                      // console.log(userSuggested);
                      if (userSuggested && userSuggested.length) {
                        // console.log('user is already in suggested');
                        return;

                      } else {
                        // console.log('IT DOESNT EXIST');
                        Schat.create({ suggested: [user._id, _user._id] }).then(
                          chat => {
                            let chatroom = chat._id;
                            _user.suggested.push({ _id: user._id, chatroom });
                            user.suggested.push({ _id: _user._id, chatroom });

                            return Promise.all([
                              User.findOneAndUpdate(
                                { _id: _user._id },
                                { suggested: _user.suggested }
                              ).exec(),
                              User.findOneAndUpdate(
                                { _id: user._id },
                                { suggested: user.suggested }
                              ).exec()
                            ]);
                          }
                        );
                      }
                    } else {
                      // console.log('hit create new suggested and Schat');
                      Schat.create({ suggested: [user._id, _user._id] }).then(
                        chat => {
                          let chatroom = chat._id;
                          _user.suggested.push({ _id: user._id, chatroom });
                          user.suggested.push({ _id: _user._id, chatroom });

                          return Promise.all([
                            User.findOneAndUpdate(
                              { _id: _user._id },
                              { suggested: _user.suggested }
                            ).exec(),
                            User.findOneAndUpdate(
                              { _id: user._id },
                              { suggested: user.suggested }
                            ).exec()
                          ]);
                        }
                      );
                    }
                  } else {
                    // console.log('NEW USER, create schats');
                    Schat.create({ suggested: [user._id, _user._id] }).then(
                      chat => {
                        let chatroom = chat._id;
                        _user.suggested.push({ _id: user._id, chatroom });
                        user.suggested.push({ _id: _user._id, chatroom });
                        return Promise.all([
                          User.findOneAndUpdate(
                            { _id: _user._id },
                            { suggested: _user.suggested }
                          ).exec(),
                          User.findOneAndUpdate(
                            { _id: user._id },
                            { suggested: user.suggested }
                          ).exec()
                        ]);
                      }
                    );
                  }
                });
            }
          }
          // console.log('user suggested is fine');
          return;
        });

    })
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});
router.put('/addfriend/:userId/:id', (req, res, next) => {
  //reciever id = person youre adding
  //sender id = actual user
  let { id } = req.params;
  let recieverId = id;
  let { userId } = req.params;
  let senderId = userId;
  let _user;
  // console.log(recieverId);
  User.findOne({ _id: senderId })
    .then(user => {
      _user = user;
      return User.findOne({ _id: recieverId })
        .then(user => {
          // console.log(user.friended);
          if (user.friended.find(id => id._id._id.toString() === senderId)) {
            console.log('user is already a friend');
            return;
          } else if (_user.sentRequest.find(id => id._id._id.toString() === recieverId)) {
            console.log('friend request already sent');
            return;
          }
          else if (_user.recievedRequest.find(id => id.toString() === recieverId)) {
            Chat.create({ friended: [recieverId, senderId] }).then(
              chat => {
                let chatroom = chat._id;
                _user.recievedRequest = _user.recievedRequest.filter(
                  userId => userId.toString() !== recieverId
                );
                _user.friended.push({ _id: recieverId, chatroom });
                user.sentRequest = user.sentRequest.filter(userId => userId.toString() !== senderId);
                user.friended.push({ _id: senderId, chatroom });

                return Promise.all([
                  User.findOneAndUpdate(
                    { _id: senderId },
                    {
                      recievedRequest: _user.recievedRequest,
                      friended: _user.friended,
                    }
                  ),
                  User.findOneAndUpdate(
                    { _id: recieverId },
                    {
                      sentRequest: user.sentRequest,
                      friended: user.friended
                    }
                  )
                ]);
              }
            );
          } else {
            return Promise.all([
              User.findOneAndUpdate(
                { _id: recieverId },
                { $push: { recievedRequest: senderId } },
                { new: true }
              ),
              User.findOneAndUpdate(
                { _id: senderId },
                { $push: { sentRequest: recieverId } },
                { new: true }
              )
            ]);
          }
        });
      // console.log(friends);
    })
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});
module.exports = router;