'use strict';

const express = require('express');
const passport = require('passport');
const Community = require('../models/community/community');
const Topic = require('../models/community/topic');
const Comment = require('../models/community/comments');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.get('/', jwtAuth, (req, res, next) => {
  return Community.find({})
    .populate('topics')
    .then(results =>{
      return res.json(results);
    })
    .catch(err=>{
      console.log(err);
    });
});

router.get('/topic', jwtAuth, (req, res, next) => {
  return Topic.find({})
    .populate('comments')
    .then(results =>{
      return res.json(results);
    })
    .catch(err=>{
      console.log(err);
    });
});  
module.exports = router;