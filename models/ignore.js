'use strict';

const mongoose = require('mongoose');

const ignoreSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ignored_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }
);

ignoreSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) => {
    delete res.__v;
  }
});

module.exports = mongoose.model('Ignore', ignoreSchema);



// my id 01
// blocked 02

// suggested
// 01 preferences
// 02 03 04 (goes into the state)
// if suggested id's appear in 01's ignored_user_id don't show
// ignored list in state?
// show 03 04
