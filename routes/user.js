'use strict';

const express = require('express');
const faker = require('faker');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});

//router.use(jwtAuth);

function validateNewUser(req, res, next) {
  const { email, username, password } = req.body;

  let err;
  if (!email) {

    err = new Error('Username is required');
    err.location = 'username';
    err.code = 400;
  }
  else if (!username) {
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
  } else if (username.trim() !== username) {
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
  console.log('post attempting...')
  // username = username.trim();

  const { email, username, password, selfType, preferenceType } = req.body;
  // console.log(req.body)
  let hashedPassword, hashedUsername, verificationCode;
  return User.hashPassword(password)
    .then(_hashedPassword => {
      hashedPassword = _hashedPassword;


      hashedUsername = User.hashUsername();

      verificationCode = User.createVerificationCode();


      return { hashedPassword, hashedUsername, verificationCode };
    })
    .then(({ hashedPassword, hashedUsername, verificationCode, introQuizQuestions }) => {
      return User.create({
        email: email,
        username: username,
        hashedUsername: hashedUsername,
        password: hashedPassword,
        userVerificationCode: verificationCode,
        "profile.selfType": selfType,
        "profile.preferenceType": preferenceType,
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
        const error = new Error('Username already taken');
        error.location = 'username';
        error.code = 422;
        error.reason = 'ValidationError';

        next(error);
      }
    });
});

router.get('/info', jwtAuth, (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user));
});
router.get('/:id', (req, res) => {
  let { id } = req.params;

  return User.findById(id).then(user =>
    res.json({
      user
    })
  );
});

module.exports = router;