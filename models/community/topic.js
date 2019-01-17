'use strict';
const mongoose = require('mongoose');

const topicSchema = mongoose.Schema({
  topicName: String,
});

topicSchema.set('timestamps', true);

topicSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) => {
    delete res.__v;
  }
});

module.exports = mongoose.model('Topic', topicSchema);