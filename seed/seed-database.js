'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

// const Question = require('../models/question');
const User = require('../models/user');
// const Chat = require('../models/chat');

const { users, chat } = require('./data');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true })
  // .then(() => {
  //   console.info('Deleting Data...');
  //   return Promise.all([
  //     User.deleteMany()
  //   ]);
  // })
  .then(() => {
    console.info('Seeding Database...');
    return Promise.all([
      User.insertMany(users),
      // Chat.insertMany(chat)
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
