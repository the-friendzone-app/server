'use strict';

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',

  DATABASE_URL:
  process.env.DATABASE_URL || 'mongodb+srv://devdev:dev1234567890@friendzone-test-zgr8s.mongodb.net/test?retryWrites=true',
//   TEST_DATABASE_URL:
//         process.env.TEST_DATABASE_URL ||
//         'mongodb://localhost/thinkful-backend-test',

  
  JWT_SECRET : process.env.JWT_SECRET || 'Friendz4Ever',
  JWT_EXPIRY : process.env.JWT_EXPIRY || '7d',
};
