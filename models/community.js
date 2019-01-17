'use strict';
const mongoose = require('mongoose');

const userCommentsSchema = new mongoose.Schema(
  {
    comment: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    post: 
  }
);

userCommentsSchema.set('timestamps', true);

const userPostSchema = new mongoose.Schema(
  {
    threadTitle: {type: String, required: true},
    userComments: [userCommentsSchema]
  }
);

userPostSchema.set('timestamps', true);

const communitySchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    userPosts: [userPostSchema],
  }
);

communitySchema.set('timestamps', true);

communitySchema.set('toJSON',{
  virtuals: true,
  transform: (doc, res) => {
    delete res.__v;
  }
});

module.exports = mongoose.model('Community', communitySchema);