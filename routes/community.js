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
  if(!communityId){
    const err = new Error('Missing community ID');
    err.status = 400;
    return next(err); 
  }
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
  let { topicName, description } = req.body; 
  
  const newTopic = {
    community: req.body.community, 
    topicName: req.body.topicName,
    description: req.body.description,
    creator: req.user._id,
    comments:[],
    tags:[]
  };

  if(!topicName || !description){
    const err = new Error('Missing required content');
    err.status = 400;
    return next(err); 
  }
  
  let topicId;
  let created;
  return Topic.create(newTopic)
    .then(result => {
      created = result;
      topicId = result.id;
      return Community.findOneAndUpdate({_id: req.body.community}, {'$push': {'topics':  topicId}});
    })
    .then(() =>{
      return res.status(201).json(created);
    })
    .catch(err => next(err));
}); 

router.post('/comments', jwtAuth, (req, res, next) => {
  const { topicId } = req.body;

  if(!topicId){
    const err = new Error('Missing topicId');
    err.status = 400;
    return next(err); 
  }

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
    user: req.user._id,
    replyTo: req.body.replyTo,
  };

  let commentId;
  let created;
  return Thread.create(newComment)
    .then(result => {
      created = result;
      commentId = result.id;

      if(req.body.replyTo){
        return Thread.findOneAndUpdate({_id: req.body.replyTo}, {'$push': {'responses': commentId }})
          .then(() => {
            return Topic.findOneAndUpdate({_id: req.body.topic}, {'$push': {'comments':  commentId}});
          });
      }
      return Topic.findOneAndUpdate({_id: req.body.topic}, {'$push': {'comments':  commentId}});
    })
    .then(()=> res.status(201).json(created))
    .catch(err => next(err));
});

router.put('/comments/delete', jwtAuth, (req, res, next) => {
  const deletedComment = {
    _id: req.body._id,
    community: req.body.community, 
    topic: req.body.topic, 
    comment: req.body.comment,
    user: '000000000000000000000000'
  };
  
  return Thread.findOneAndUpdate({_id: deletedComment._id}, { '$set': {'comment': deletedComment.comment, 'user': deletedComment.user,  'edited': false}}, {new: true})
    .then(() => {
      return res.json({message: 'Your comment has been deleted'});  
    })
    .catch(err => next(err));
  
}); 

router.put('/comments/edit', jwtAuth, (req, res, next) => {
  const editedComment = {
    _id: req.body._id,
    community: req.body.community, 
    topic: req.body.topic, 
    comment: req.body.comment,
    user: req.user._id,
    edited: req.body.edited
  };
  
  return Thread.findOneAndUpdate({_id: editedComment._id}, { '$set': {'comment': editedComment.comment, 'edited': editedComment.edited}}, {new: true})
    .then(() => {
      return res.json({message: 'Your comment has been edited'});  
    })
    .catch(err => next(err));
  
});  



module.exports = router;