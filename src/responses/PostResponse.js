const ClientResponse = require("./ClientResponse");

class PostResponse extends ClientResponse {
  constructor(statusCode, statusMessage, resultData) {
    super(statusCode, statusMessage, resultData);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.resultData = resultData;
  }
}

module.exports = PostResponse;
