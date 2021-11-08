/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable prefer-promise-reject-errors */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Crypto = require('../../utils/Crypto');
const schema = require('../user/schema');

const InvariantError = require('../../exceptions/InvariantError');
const PostResponse = require('../../responses/PostResponse');
const NotFoundError = require('../../exceptions/NotFoundError');
// const PutResponse = require("../../responses/PutResponse");

class LoginService {
  constructor() {
    this.refreshToken = [];
    this._crypto = new Crypto();
    const mongoHost = process.env.MONGO_HOST;
    this._mongo = mongoose.createConnection(mongoHost, {
      useNewUrlParser: true,
    });

    if (!this._mongo.readyState) {
      mongoose.connection.close;
      return new InvariantError(503,
          'Service Unavaiable', 'Failed to connect to database!');
    }
  }

  async generateTokenService(username) {
    return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
  }

  async loginService(username, password) {
    const loginUser = new Promise(async (resolve, reject) => {
      const encryptedPassword = await this._crypto.encrypt(password);
      const accessToken = await this.generateTokenService(username);
      const refreshToken = jwt.sign(username, process.env.REFRESH_TOKEN_SECRET);
      this.refreshToken.push(refreshToken);

      const loginModel = this._mongo.model('user', schema.userSchema);
      loginModel.findOneAndUpdate({
        username: username,
        password: encryptedPassword.encryptedData,
      }, {token: accessToken}, (err, data) => {
        if (err) {
          mongoose.connection.close;
          return reject(new InvariantError(400, 'Bad Request', err.message));
        }

        mongoose.connection.close;
        if (data === null) return reject(new NotFoundError('User does exist or username / password is invalid'));

        const credentials = {
          accessToken: accessToken,
          refreshToken: refreshToken,
        };

        return resolve(new PostResponse(200, 'Success', credentials));
      });
    });

    return loginUser;
  }

  async logoutService(id) {
    const logoutUser = new Promise((resolve, reject) => {
      const userModel = this._mongo.model('user', schema.userSchema);
      userModel.findByIdAndUpdate(id, {token: null}, (err, user) => {
        if (err) {
          mongoose.connection.close;
          return reject(new InvariantError(400, 'Bad request', err.message));
        }

        if (user === null) {
          mongoose.connection.close;
          return reject(new NotFoundError(`User with id ${id} does not exist`));
        }

        mongoose.connection.close;
        return resolve(new PostResponse(200, 'Success', `User with id ${id} has been logged out`));
      });
    });

    return logoutUser;
  }

  async verifyAccessMiddleWareService(credentials) {
    const resultVerify = new Promise((resolve, reject) => {
      const accessModel = this._mongo.model('user', schema.userSchema);
      accessModel.findOne({
        token: credentials.token,
      }, (err, data) => {
        if (err) {
          return reject(new InvariantError(400, 'Bad Request', err.message));
        }

        if (data === null) {
          return resolve(false);
        }

        if (data.role == 'admin') {
          return resolve(true);
        } else {
          if (credentials.request == 'GET') {
            return resolve(true);
          }

          return resolve(false);
        }
      });
    });

    return resultVerify;
  }

  async seedDefaultUserService() {
    const seedUser = new Promise(async (resolve, reject) => {
      const userModel = this._mongo.model('user', schema.userSchema);
      const encryptPassword = await this._crypto.encrypt('admin');
      userModel.create({
        username: 'admin',
        password: encryptPassword.encryptedData,
        token: null,
        role: 'admin',
      }, (err, _) => {
        if (err) {
          return reject(new InvariantError(400, 'Bad Request', err.message));
        }

        return resolve(new PostResponse(201, 'Success', 'User admin has been created'));
      });
    });

    return seedUser;
  }
}

module.exports = LoginService;
