'use strict';

const express = require('express');
const passport = require('passport');
const request = require('request-promise');
const EventbriteSearch = require('../models/eventbrite-search');
const { EVENTBRITE_API_KEY } = require('../config');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use(jwtAuth);

router.put('/', jwtAuth, (req, res) => {

  let { events } = req.body;
  let count = 0;
  
  events.forEach((event, index, next) => {
    request({
      method: 'GET',
      url: `https://www.eventbriteapi.com/v3/venues/${event.venueId}/`,
      headers: {
        'Authorization': `Bearer ${EVENTBRITE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      json: true
    })
      .then(res => {
        events[index].venueData = {
          address: res.address.localized_address_display,
          latitude: res.address.latitude,
          longitude: res.address.longitude,
        };
        checkDone();
      });
  });

  function checkDone(){
    count++;
    if(count === events.length){
      // res.send(events);
      console.log(events);
      EventbriteSearch.findOne({ userId: req.user._id })
        .then(result => {
          result.events = events;
          return result.save();
        })
        .then(savedResult => {
          res.location(`${req.baseUrl}/${savedResult.id}`).status(201).json(savedResult);
        })
        .catch(err => next(err));
    }
  }

});
module.exports = router;