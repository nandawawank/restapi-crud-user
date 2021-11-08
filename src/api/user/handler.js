/* eslint-disable require-jsdoc */
class UserHadler {
  constructor(service) {
    this.service = service;
    this.getUserHandler = this.getUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.addUserHandler = this.addUserHandler.bind(this);
    this.updateUserHandler = this.updateUserHandler.bind(this);
    this.deleteUserHandler = this.deleteUserHandler.bind(this);
  }

  async getUserHandler(request, response) {
    try {
      const userData = await this.service.getUserService();
      response.statusCode = userData.statusCode;
      return response.json(userData);
    } catch (err) {
      response.statusCode = err.statusCode;
      return response.json(err);
    }
  }

  async getUserByIdHandler(request, response) {
    try {
      const id = request.params.id;
      const userData = await this.service.getUserByIdService(id);
      response.statusCode = userData.statusCode;
      return response.json(userData);
    } catch (err) {
      response.statusCode = err.statusCode;
      return response.json(err);
    }
  }

  async addUserHandler(request, response) {
    try {
      const newUser = await this.service.addUserService(request.body);
      response.statusCode = newUser.statusCode;
      return response.json(newUser);
    } catch (err) {
      response.statusCode = err.statusCode;
      return response.json(err);
    }
  }

  async updateUserHandler(request, response) {
    try {
      const id = request.params.id;
      const updateUser = await this.service.updateUserService(id, request.body);
      response.statusCode = updateUser.statusCode;
      return response.json(updateUser);
    } catch (err) {
      response.statusCode = err.statusCode;
      return response.json(err);
    }
  }

  async deleteUserHandler(request, response) {
    try {
      const id = request.params.id;
      const deletedUser = await this.service.deleteUserService(id);
      response.statusCode = deletedUser.statusCode;
      return response.json(deletedUser);
    } catch (err) {
      response.statusCode = err.statusCode;
      return response.json(err);
    }
  }
}

module.exports = UserHadler;
