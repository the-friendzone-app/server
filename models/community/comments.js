'use strict';
const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  topic: { type:  mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  community: { type:  mongoose.Schema.Types.ObjectId, ref: 'Community' },
  user: { type:  mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: {type: String, required: true},
  edited: {type: Boolean, default: false}
});

commentSchema.set('timestamps', true);

module.exports = mongoose.model('Thread', commentSchema);