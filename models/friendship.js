'use strict';

const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema(
  {
    user_id1: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    user_id2: { type: mongoose.Schema.Types.ObjectId , ref: 'User' },
    accepted: { type: Boolean, default: false },
  }
);

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) => {
    delete res.accepted;
    delete res.__v;
  }
});

module.exports = mongoose.model('Friendship', friendshipSchema);