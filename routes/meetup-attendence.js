'use strict';

const express = require('express');
const passport = require('passport');

const MeetupAttendence = require('../models/meetup-attendence');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use(jwtAuth);

router.get('/', jwtAuth, (req, res, next) => {
  MeetupAttendence.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.post('/', jwtAuth, (req, res, next)=> {
  let { username, meetupId } = req.body;
  const newMeetupAttendence = { username, meetupId };
  
  if (!username) {
    const err = new Error('Missing `username` in request body');
    err.status = 400;
    return next(err);
  }

  if (!meetupId) {
    const err = new Error('Missing `meetupId` in request body');
    err.status = 400;
    return next(err);
  }

  MeetupAttendence.create(newMeetupAttendence)
    .then(result => {
      res.location(`${req.baseUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('meetup-attendence already exists');
        err.status = 400;
      }
      next(err);
    });
});
module.exports = router;