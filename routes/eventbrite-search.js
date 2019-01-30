'use strict';

const express = require('express');
const passport = require('passport');
const request = require('request');
const EventbriteSearch = require('../models/eventbrite-search');
const { EVENTBRITE_API_KEY } = require('../config');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use(jwtAuth);

router.put('/', jwtAuth, (req, res, next) => {
  const { latitude, longitude, search, searchDistance, price, categories, formats, startTime, endTime } = req.body;

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

  request({
    method: 'GET',
    url: `https://www.eventbriteapi.com/v3/events/search?q=${search}&location.latitude=${latitude}&location.longitude=${longitude}&location.within=${searchDistance}&price=${price}&categories=${categories}&formats=${formats}&start_date.range_start=${startTime}&start_date.range_end=${endTime}`,
    headers: {
      'Authorization': `Bearer ${EVENTBRITE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    json: true
  }, function (error, response, body) {
    // console.log('NAME ----->', body.events[0].name.text);
    // console.log('DESCRIPTION', body.events[0].description.text);
    // console.log('URL ----->', body.events[0].url);
    // console.log('START TIME ----->', body.events[0].start.utc);
    // console.log('END TIME ----->', body.events[0].end.utc);
    // console.log('VENUE_ID ----->', body.events[0].venue_id);

    // map over body.events and pull out the above values --        
    let events = body.events.map(event => {
      return ({ name: event.name.text, description: event.description.text, url: event.url, start: event.start.utc, end: event.end.utc, venueId: event.venue_id});
    });
    // console.log('EVENTS AFTER MAP -----> ', events);
    events = { events };
    EventbriteSearch.findOneAndUpdate({ userId: req.user._id }, events, { new: true, upsert: true })
      .then(result => {
        res.location(`${req.baseUrl}/${result.id}`).status(201).json(result);
      })
      .catch(err => next(err));
  });
});
module.exports = router;