'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const router = express.Router();

const localAuth = passport.authenticate('local', { session: false, failWithError: true });

router.post('/login', localAuth, (req, res, next) => {
  const id = req.user._id;
  return User.findOne({_id: id})
    .then((user)=> {
      if(user.marked === true){
        const err = new Error('This account has been marked');
        err.status = 400;
        return next(err);
      }
      const authToken = createAuthToken(req.user);
      res.json({ authToken });
    });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

module.exports = router;