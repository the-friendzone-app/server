'use strict';
const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  mainTitle: {type: String},
  description: String,
});

communitySchema.set('timestamps', true);

communitySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) => {
    delete res.__v;
  }
});

module.exports = mongoose.model('Community', communitySchema);