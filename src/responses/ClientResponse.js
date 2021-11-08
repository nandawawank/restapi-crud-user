class ClientResponse {
  constructor(statusCode, statusMessage, resultData) {
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.resultData = resultData;
  }
}

module.exports = ClientResponse;
