'use strict';


const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.put('/:id', (req, res, next) => {
  let { id } = req.params;
  let ignoredUser = req.body.ignoredUser;
  console.log(id);
  console.log(ignoredUser);
  User.findOne({ _id: id })
    .then((user) => {
      // console.log(user);
      user.ignored = user.ignored.filter(id => String(id) !== ignoredUser);
      // console.log(user.ignored);
      user.ignored.push(ignoredUser);
      // console.log(user.ignored);
      return User.findOneAndUpdate({ _id: id }, {
        ignored: user.ignored
      }, { new: true });
    })
    .then(() => {
      User.findOne({ _id: ignoredUser })
        .then(user => {
          user.ignored = user.ignored.filter(id => String(id) !== ignoredUser);
          user.ignored.push(id);
          return User.findOneAndUpdate({ _id: ignoredUser }, {
            ignored: user.ignored
          }, { new: true });
        });
    })
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});

module.exports = router;