'use strict';

const express = require('express');
const passport = require('passport');

const Meetup = require('../models/meetup');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use(jwtAuth);

router.get('/', jwtAuth, (req, res, next) => {
  Meetup.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.post('/', jwtAuth, (req, res, next)=> {
  let { name, location, description, startTime, endTime, createdBy } = req.body;
  const newMeetup = { name, location, description, startTime, endTime, createdBy };
  
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!location) {
    const err = new Error('Missing `location` in request body');
    err.status = 400;
    return next(err);
  }

  if (!description) {
    const err = new Error('Missing `description` in request body');
    err.status = 400;
    return next(err);
  }

  if (!startTime) {
    const err = new Error('Missing `startTime` in request body');
    err.status = 400;
    return next(err);
  }

  if (!endTime) {
    const err = new Error('Missing `endTime` in request body');
    err.status = 400;
    return next(err);
  }

  if (!createdBy) {
    const err = new Error('Missing `createdBy` in request body');
    err.status = 400;
    return next(err);
  }

  Meetup.create(newMeetup)
    .then(result => {
      res.location(`${req.baseUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Meetup name already exists');
        err.status = 400;
      }
      next(err);
    });
});
module.exports = router;