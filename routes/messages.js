'use strict';
const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const Schat = require('../models/schat');

//suggested
router.get('/suggested/:id', (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  Schat.findOne({ _id: id })
    .populate({ path: 'suggested', select: 'username' })
    .then((chat) => {
      // console.log(chat);
      let user2 = chat.suggested.filter(user => user._id.toString() !== userId);
      if (user2.length < chat.suggested.length) {
        for (let i = 0; i < chat.messages.length; i++) {
          chat.messages[i].room = id;
        }
        let response = {
          chatroom: { _id: id },
          _id: user2[0],
          messages: chat.messages
        };
        res.json(response);
      } else {
        let err = new Error('Message retrieval went wrong');
        err.status = 401;
        next(err);
      }
    })
    .catch(err => next(err));

});
router.put('/suggested/:id', (req, res, next) => {
  // console.log(req.body);
  const userId = req.user._id;
  // console.log('USER ID', userId);
  const { id } = req.params;
  const { messages } = req.body;
  // console.log(messages);
  Schat.findOne({ _id: id })
    .then((chat) => {
      if (chat.suggested.find(user => user.toString() === userId)) {
        chat.suggested.find(user => user.toString() === userId);
        return Schat.findOneAndUpdate({ _id: id }, { messages }, { new: true })
          .then(() => res.sendStatus(204))
      } else {
        let err = new Error('Message sending went wrong');
        err.status = 401;
        next(err);
      }
    })
    .catch(err => next(err));
});
//friends
router.get('/:id', (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  Chat.findOne({ _id: id })
    .populate({ path: 'friended', select: 'username' })
    .then((chat) => {
      let user2 = chat.friended.filter(user => user._id.toString() !== userId);
      if (user2.length < chat.friended.length) {
        for (let i = 0; i < chat.messages.length; i++) {
          chat.messages[i].room = id;
        }
        let response = {
          chatroom: { _id: id },
          _id: user2[0],
          messages: chat.messages
        };
        res.json(response);
      }
      else {
        let err = new Error('Message retrieval went wrong');
        err.status = 401;
        next(err);
      }
    })
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  // console.log(req.body);
  const userId = req.user._id;
  // console.log('USER ID', userId);
  const { id } = req.params;
  const { messages } = req.body;
  // console.log(messages);
  Chat.findOne({ _id: id })
    .then((chat) => {
      // console.log('chat', chat);
      // console.log('chat friended', chat.friended);
      // console.log('USER ID', userId);
      if (chat.friended.find(user => user.toString() === userId)) {
        chat.friended.find(user => user.toString() === userId);
        return Chat.findOneAndUpdate({ _id: id }, { messages }, { new: true })
          .then(() => res.sendStatus(204))
      } else {
        let err = new Error('Message sending went wrong');
        err.status = 401;
        next(err);
      }
    })
    .catch(err => next(err));
});

module.exports = router;