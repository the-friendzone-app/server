'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ChatSchema = mongoose.Schema({
  friended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      room: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
      message: { type: String },
      handle: String
    }
  ]
});

module.exports = mongoose.model('Chat', ChatSchema);