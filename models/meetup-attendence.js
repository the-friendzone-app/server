'use strict';

const mongoose = require('mongoose');

const meetupAttendenceSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    meetupId: { type: String, required: true },
  }
);

meetupAttendenceSchema.set('timestamps', true);

meetupAttendenceSchema.set('toJSON',{
  virtuals: true,
  transform: (doc, res) =>{
    delete res._id;
    delete res.__v;
  }
});

module.exports = mongoose.model('MeetupAttendence', meetupAttendenceSchema);