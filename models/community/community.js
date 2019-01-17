'use strict';
const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
  topicId: mongoose.Schema.ObjectId,
  topic: { type: mongoose.Schema.ObjectId, ref: 'Topic' },
  userId: mongoose.Schema.ObjectId,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  title: String,
  date: Date,
  content: String,
  tags: Array
});

communitySchema.set('timestamps', true);

communitySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) => {
    delete res.__v;
  }
});

module.exports = mongoose.model('Community', communitySchema);