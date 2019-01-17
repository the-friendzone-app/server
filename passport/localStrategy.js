'use strict';

const { Strategy: LocalStrategy } = require('passport-local');

const { LoginError } = require('./errors');
const User = require('../models/user');

const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  User.findOne({ username })
    .then((result) => {
      user = result;
      if (!user) {
        throw new LoginError();
      }

      return user.validatePassword(password);
    })
    .then((passwordIsValid) => {
      if (!passwordIsValid) {
        throw new LoginError();
      }

      done(null, user);
    })
    .catch((err) => {
      if (err instanceof LoginError) {
        done(null, false);
        return;
      }

      done(err);
    });
});

module.exports = localStrategy;