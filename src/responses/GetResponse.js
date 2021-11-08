const ClientResponse = require('./ClientResponse');

class GetResponse extends ClientResponse {
  constructor(statusCode, statusMessage, resultData) {
    super(statusCode, statusMessage, resultData);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.resultData = resultData;
  }
}

module.exports = GetResponse;
