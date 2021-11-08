/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const InvariantError = require('../../exceptions/InvariantError');

class LoginHandler {
  constructor(service) {
    this.service = service;
    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.verifyAccessMiddleWareHandler = this.verifyAccessMiddleWareHandler.bind(this);
    this.seedDefaultUserHandler = this.seedDefaultUserHandler.bind(this);
  }

  async loginHandler(request, response) {
    try {
      const auth = await this.service.loginService(
          request.body.username, request.body.password);

      response.statusCode = auth.statusCode;
      return response.json(auth);
    } catch (err) {
      response.statusCode = err.statusCode;
      return response.json(err);
    }
  }

  async logoutHandler(request, response) {
    try {
      const auth = await this.service.logoutService(request.params.id);
      response.statusCode = auth.statusCode;
      return response.json(auth);
    } catch (err) {
      response.statusCode = err.statusCode;
      return response.json(err);
    }
  }

  async verifyAccessMiddleWareHandler(request, response, next) {
    const tokenHeader = request.header('x-access-token');
    if (!tokenHeader) {
      response.statusCode = 400;
      return response.json(
          new InvariantError(400, 'Bad Request', 'Please use correct token value'),
      );
    }

    if (tokenHeader.split(' ')[0] !== 'Bearer') {
      response.statusCode = 400;
      return response.json(
          new InvariantError(400, 'Bad Request', 'Please use correct token value'),
      );
    }

    const token = tokenHeader.split(' ')[1];
    if (!token) {
      response.statusCode = 401;
      return response.json(
          new InvariantError(401, 'Unauthorized', 'Cannot access data'),
      );
    }

    try {
      const credentials = {
        request: request.method,
        token: token,
      };

      const verify = await this.service.verifyAccessMiddleWareService(credentials);
      if (verify) {
        next();
      } else {
        response.statusCode = 401;
        return response.json(
            new InvariantError(401, 'Unauthorized', 'Cannot access data'),
        );
      }
    } catch (err) {
      response.statusCode = 400;
      return response.json(err);
    }
  }

  async seedDefaultUserHandler(_, response) {
    try {
      const seedUser = await this.service.seedDefaultUserService();
      response.statusCode = seedUser.statusCode;
      return response.json(seedUser);
    } catch (err) {
      // response.statusCode = err.statusCode;
      return response.json(err);
    }
  }
}

module.exports = LoginHandler;
