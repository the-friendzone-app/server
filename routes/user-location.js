'use strict';

const express = require('express');
const passport = require('passport');

const UserLocation = require('../models/user-location');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use(jwtAuth);

router.get('/', jwtAuth, (req, res, next) => {
  let userId = req.user._id;

  UserLocation.find({ userId, })
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.put('/', jwtAuth, (req, res, next) => {
  let { location, latitude, longitude, userId } = req.body;
  const updateLocation = { location, latitude, longitude, userId };

  if (!userId) {
    const err = new Error('Missing `userId` in request body');
    err.status = 400;
    return next(err);
  }

  if (!latitude) {
    const err = new Error('Missing `latitude` in request body');
    err.status = 400;
    return next(err);
  }

  if (!longitude) {
    const err = new Error('Missing `longitude` in request body');
    err.status = 400;
    return next(err);
  }

  if (!location) {
    const err = new Error('Missing `location` in request body');
    err.status = 400;
    return next(err);
  }

  UserLocation.findOneAndUpdate({ userId: req.user._id }, updateLocation, { new: true, upsert: true })
    .then(result => {
      res.location(`${req.baseUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));

});

router.post('/', jwtAuth, (req, res, next) => {
  let { location, latitude, longitude, userId } = req.body;
  const updateLocation = { location, latitude, longitude, userId };

  UserLocation.create(updateLocation)
    .then(result => {
      res.location(`${req.baseUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});
module.exports = router;