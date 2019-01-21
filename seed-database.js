'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('./config');

const Community = require('./models/community/community');
const Topic = require('./models/community/topic');
const Comments = require('./models/community/comments');

const { communities, topics, comments} = require('./seed-data');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useCreateIndex : true })
  .then(() => {
    return Promise.all([
      Community.deleteMany(),
      Topic.deleteMany(),
      Comments.deleteMany(),
    ]);
  })
  .then(() => {
    return Promise.all([
      Community.insertMany(communities),
      Topic.insertMany(topics),
      Comments.insertMany(comments),
    ]);
  })
  .then(results => {
    console.log('Inserted', results);
    console.info('Disconnecting...');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });