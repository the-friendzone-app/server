const mongoose = require('mongoose');

const Quiz= require('../models/quiz');
const questions = require('./quizSeed');
const { DATABASE_URL, MONGODB_OPTIONS } = require('../config');

if (require.main === module) {
  console.log(`Connecting to mongodb: ${DATABASE_URL}`);

  mongoose
    .connect(DATABASE_URL, MONGODB_OPTIONS)
    .then(() => {
      console.info('Deleting existing questions');
      return Quiz.deleteMany();
    })
    .then(() => {
      console.info('Seeding database with questions');
      return Quiz.insertMany(questions);
    })
    .then((results) => {
      console.log('Inserted', results);
      console.info('Disconnecting...');
      return mongoose.disconnect();
    })
    .catch(err => {
      console.log(err);
      return mongoose.disconnect();
    });
}