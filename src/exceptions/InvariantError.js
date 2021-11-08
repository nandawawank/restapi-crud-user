const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(statusCode, statusMessage, errorMessage) {
    super(statusCode, statusMessage, errorMessage);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.errorMessage = errorMessage;
  }
}

module.exports = InvariantError;
