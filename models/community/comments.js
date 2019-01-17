'use strict';
const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  topicId: mongoose.Schema.ObjectId,
  topic: { type: mongoose.Schema.ObjectId, ref: 'Topic' },
  communityId: mongoose.Schema.ObjectId,
  community: { type: mongoose.Schema.ObjectId, ref: 'Community' },
  userId: mongoose.Schema.ObjectId,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  date: Date,
  content: String,
});

module.exports = mongoose.model('Comment', commentSchema);