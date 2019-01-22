'use strict';
const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/:id', jsonParser, (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  Chat.findOne({ _id: id })
    .populate({ path: 'friended', select: 'username' })
    .then((chat) => {
      let otherUser = chat.friended.filter(user => user._id.toString() !== userId);
      if (otherUser.length < chat.friended.length) {
        for (let i = 0; i < chat.messages.length; i++) {
          chat.messages[i].room = id;
          console.log(chat.messages[i]);
        }
        let response = {
          chatroom: { _id: id },
          _id: otherUser[0],
          messages: chat.messages
        };
        res.json(response);
      }
    })
    .catch(err => next(err));
});

router.put('/:id', jsonParser, (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { messages } = req.body;
  Chat.findOne({ _id: id })
    .then((chat) => {
      if (chat.friended.find(user => user.toString() === userId)) {
        return Chat.findOneAndUpdate({ _id: id }, { messages }, { new: true });
      }
    })
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});

module.exports = router;