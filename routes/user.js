'use strict';
const express = require('express');
const User = require('../models/user');
const { ValidateUser } = require('../_utils/userValidation');
const { ValidationError } = require('../_utils/validationErrors');
const router = express.Router();

// Post to register a new user
router.post('/', (req, res, next) => {
  let ValidUser = new Promise((res, rej) => {
    ValidateUser(req, res, next) ? res() : rej();
  });

  let {
    username,
    password,
    selfTalker,
    selfListener,
    preferenceTalker,
    preferenceListener

  } = req.body;
  username = username.trim();
  ValidUser
    .then(() => {
      return User.find({ username })
        .count();
    })
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken :(',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        "profile.selfTalker": selfTalker,
        "profile.selfListener": selfListener,
        "profile.preferenceTalker": preferenceTalker,
        "profile.preferenceListener": preferenceListener


      });
    })
    .then(user => {
      return res
        .status(201)
        .location(`${req.baseUrl}/${user._id}`)
        .json(user);
    })
    .catch(err => {
      return ValidationError(res, err);
    });

});

module.exports = router;