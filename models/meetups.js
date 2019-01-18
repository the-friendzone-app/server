'use strict';

const mongoose = require('mongoose');

const meetupsSchema = new mongoose.Schema(
  {
    meetups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meetup'}]
  }
);

meetupsSchema.set('toJSON',{
  virtuals: true,
  transform: (doc, res) =>{
    delete res._id;
    delete res.__v;
  }
});

module.exports = mongoose.model('Meetups', meetupsSchema);