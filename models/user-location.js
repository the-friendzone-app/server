'use strict';

const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    userId: { type: String, required: true },
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