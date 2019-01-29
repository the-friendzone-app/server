'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const SchatSchema = mongoose.Schema({
  suggested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      room: { type: mongoose.Schema.Types.ObjectId, ref: 'Schat' },
      message: { type: String },
      handle: String
    }
  ]
});

module.exports = mongoose.model('Schat', SchatSchema);