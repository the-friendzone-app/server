'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ChatSchema = mongoose.Schema({
  friended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: { type: String }
    }
  ]
});

module.exports = mongoose.model('Chat', ChatSchema);