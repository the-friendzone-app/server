'use strict';

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://dev:devdev1234567890@ds161804.mlab.com:61804/friendzone-test',
  //   TEST_DATABASE_URL:
  //         process.env.TEST_DATABASE_URL ||
  //         'mongodb://localhost/thinkful-backend-test',
  
  JWT_SECRET : process.env.JWT_SECRET || 'Friendz4Ever',
  JWT_EXPIRY : process.env.JWT_EXPIRY || '7d',
};
