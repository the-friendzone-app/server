'use strict';

const express = require('express');
const passport = require('passport');
const Community = require('../models/community/community');
const Topic = require('../models/community/topic');
const Thread = require('../models/community/comments');
const User = require('../models/user');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.get('/', jwtAuth, (req, res, next) => {
  return Community.find({})
    .populate('topics')
    .then(results =>{
      return res.json(results);
    })
    .catch(err=>{
      next(err);
    });
});

router.post('/topic', jwtAuth, (req, res, next) => {
  const { communityId } = req.body;
  return Topic.find({community: communityId })
    .populate('creator')
    .then(results =>{
      return res.json(results);
    })
    .catch(err=>{
      next(err);
    });
});

router.post('/topic/post', jwtAuth, (req, res, next) => {
  const newTopic = {
    community: req.body.community, 
    topicName: req.body.topicName,
    description: req.body.description,
    creator: req.user._id,
    comments:[],
    tags:[]
  };
  
  let topicId;
  return Topic.create(newTopic)
    .then(result => {
      topicId = result.id;
      return Community.findOneAndUpdate({_id: req.body.community}, {'$push': {'topics':  topicId}})
        .then((result) =>{
          return res.json('IT HAS BEEN COMPLETED!');
        });
    })
  
    .catch(err => next(err));
}); 

router.post('/comments', jwtAuth, (req, res, next) => {
  const { topicId } = req.body;
  return Thread.find({topic: topicId})
    .populate('user')
    .then(results =>{
      return res.json(results);
    })
    .catch(err=>{
      next(err);
    });
});

router.post('/comments/post', jwtAuth, (req, res, next) => {
  const newComment = {
    community: req.body.community, 
    topic: req.body.topic, 
    comment: req.body.comment,
    user: req.user._id 
  };
  
  let commentId;
  return Thread.create(newComment)
    .then(result => {
      commentId = result.id;
      return Topic.findOneAndUpdate({_id: req.body.topic}, {'$push': {'comments':  commentId}})
        .then((result) =>{
          return res.json('IT HAS BEEN COMPLETED!');
        });
    })
  
    .catch(err => next(err));
});  


module.exports = router;