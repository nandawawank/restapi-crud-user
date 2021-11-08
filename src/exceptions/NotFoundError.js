const ClientError = require("./ClientError");

class NotFoundError extends ClientError {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = 404;
    this.statusMessage = "Not Found";
    this.errorMessage = errorMessage;
  }
}

module.exports = NotFoundError;
