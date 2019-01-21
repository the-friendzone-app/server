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
  
  Meetup.create(newMeetup)
    .then(result => {
      res.location(`${req.baseUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});
module.exports = router;