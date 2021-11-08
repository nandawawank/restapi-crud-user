class ClientError extends Error {
  constructor(statusCode, statusMessage, errorMessage) {
    super(statusCode, statusMessage, errorMessage);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.errorMessage = "ClientError";
  }
}

module.exports = ClientError;

