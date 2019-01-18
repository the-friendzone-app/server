'use strict';

const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true},
    location: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createdBy: { type: String, required: true },
  }
);

meetupSchema.set('timestamps', true);

meetupSchema.set('toJSON',{
  virtuals: true,
  transform: (doc, res) =>{
    delete res._id;
    delete res.__v;
  }
});

module.exports = mongoose.model('Meetup', meetupSchema);