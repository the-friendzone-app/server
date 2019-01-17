'use strict';

const express = require('express');
const faker = require('faker');
const User = require('../models/user');

const router = express.Router();

function validateNewUser(req, res, next) {
  const { username, password } = req.body;

  let err;
  if (!username) {
    err = new Error('Username is required');
    err.location = 'username';
    err.code = 400;
  } else if (!password) {
    err = new Error('Password is required');
    err.location = 'password';
    err.code = 400;
  } else if (username.length < 5) {
    err = new Error('Username must be at least 5 character long');
    err.location = 'password';
    err.code = 422;
  } else if (password.length < 8 || password.length > 72) {
    err = new Error('Password must be between 8 and 72 characters long');
    err.location = 'password';
    err.code = 422;
  } else if(username.trim() !== username) {
    err = new Error('Username must not have leading/trailing whitespace');
    err.location = 'username';
    err.code = 422;
  } else if (password.trim() !== password) {
    err = new Error('Password must not have leading/trailing whitespace');
    err.location = 'password';
    err.code = 422;
  }

  if (err) {
    err.reason = 'ValidationError'; // For reduxForm
    next(err);
    return;
  }

  next();
}

// Post to register a new user
router.post('/', validateNewUser, (req, res, next) => {

  let { username, password, selfType, preferenceType}  = req.body;

  username = username.trim();

  return User.find({ username })
    .then(() => {
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        // hashedUsername: (faker.commerce.productAdjective()+faker.random.word()+faker.random.number),
        "profile.selfType": selfType,
        "profile.preferenceType": preferenceType,
        // userVerificationCode: faker.random.alphaNumeric(), //ask TJ how to generate 7 length calling itself
      });
    })
    .then(user => { 
      return res
        .status(201)
        .location(`${req.baseUrl}/${user._id}`)
        .json(user);
    })
    .catch((err) => {
      if (err.code === 11000 && err.name === 'MongoError') {
        // Username already exists
        const error = new Error('Username already taken');
        error.location = 'username';
        error.code = 422;
        error.reason = 'ValidationError';

        next(error);
      }
    });
});

module.exports = router;