'use strict';

const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const uniqid = require('uniqid');
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
  console.log(id);
  User.findOne({ _id: id }, { friends: 1 })
    .populate({ path: 'friended._id', select: 'username' })
    .populate({ path: 'friended.chatroom', select: '_id' })
    .then(friends => {
      res.json(friends);
    })
    .catch(err => next(err));
});
// router.get('/friends-list', jwtAuth, (req, res, next) => {
//     Friendship.find({
//         $and: [
//             { $or: [{ user_id1: req.user.id }, { user_id2: req.user.id }] },
//             { approved: true }
//         ]
//     })
//         .then(results => {
//             res.json(results);
//         })
//         .catch(err => {
//             next(err);
//         })
// });
module.exports = router;