'use strict';

function LoginError(message='Incorrect username or password') {
  this.name = 'LoginError';
  this.reason = 'ValidationError';
  this.message = message;
  this.code = 401;

  this.stack = Error.captureStackTrace(this, LoginError);
}
LoginError.prototype = Object.create(Error.prototype);
LoginError.prototype.constructor = LoginError;

module.exports = {
  LoginError,
};