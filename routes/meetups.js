'use strict';

const express = require('express');
const passport = require('passport');

const Meetup = require('../models/meetup');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use(jwtAuth);

router.post('/', jwtAuth, (req, res, next)=> {
  let { name, location, description, startTime, endTime } = req.body;
  const newMeetup = { name, location, description, startTime, endTime };
  
  Meetup.create(newMeetup)
    .then(result => {
      res.location(`${req.baseUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});
module.exports = router;