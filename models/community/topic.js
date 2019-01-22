'use strict';
const mongoose = require('mongoose');

const topicSchema = mongoose.Schema({
  topicName: {type: String, required: true},
  creator: { type:  mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: {type: String},
  tags: [{type:String}],
  comments: [{ type:  mongoose.Schema.Types.ObjectId, ref: 'Thread'}],
  community: { type:  mongoose.Schema.Types.ObjectId, ref: 'Community'}
});

topicSchema.set('timestamps', true);

topicSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) => {
    delete res.__v;
  }
});

module.exports = mongoose.model('Topic', topicSchema);