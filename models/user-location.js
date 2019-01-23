'use strict';

const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema(
  {
    location: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    userId: { type: String },
  }
);

userLocationSchema.set('timestamps', true);

userLocationSchema.set('toJSON',{
  virtuals: true,
  transform: (doc, res) =>{
    delete res._id;
    delete res.__v;
  }
});

module.exports = mongoose.model('userLocation', userLocationSchema);