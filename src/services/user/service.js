/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const mongoose = require('mongoose');
const Crypto = require('../../utils/Crypto');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

const GetResponse = require('../../responses/GetResponse');
const PostResponse = require('../../responses/PostResponse');
const PutResponse = require('../../responses/PutResponse');
const DeleteResponse = require('../../responses/DeleteResponse');

const schema = require('./schema');

class UserService {
  constructor() {
    const mongoHost = process.env.MONGO_HOST;
    this._mongo = mongoose.createConnection(mongoHost, {useNewUrlParser: true});
    this._crypto = new Crypto();

    if (!this._mongo.readyState) {
      mongoose.connection.close;
      return new InvariantError(503,
          'Service Unavaiable', 'Failed to connect to database!');
    }
  }

  async getUserService() {
    const resultUser = new Promise((resolve, reject) => {
      const userModel = this._mongo.model('user', schema.userSchema);
      userModel.find({}, (err, user) => {
        if (err) {
          mongoose.connection.close;
          return reject(new InvariantError(400,
              'Bad Request', err.message));
        }

        if (user.length < 1) {
          return reject(new NotFoundError('Not found user data'));
        }

        mongoose.connection.close;
        return resolve(new GetResponse(200, 'Success', user));
      });
    });

    return resultUser;
  }

  async getUserByIdService(id) {
    const resultUserById = new Promise((resolve, reject) => {
      const userModel = this._mongo.model('user', schema.userSchema);
      userModel.findById(id, (err, user) => {
        if (err) {
          mongoose.connection.close;
          return reject(new InvariantError(400, 'Bad Request', err.message));
        }

        if (user === null) {
          return reject(new NotFoundError(`User with id ${id} not found!`));
        }

        mongoose.connection.close;
        return resolve(new GetResponse(200, 'Success', user));
      });
    });

    return resultUserById;
  }

  async checkUserExist(username) {
    const userExist = new Promise((resolve, reject) => {
      const userModel = this._mongo.model('user', schema.userSchema);
      userModel.findOne({username: username}, (err, user) => {
        if (err) {
          return reject(new InvariantError(400, 'Bad Request', err));
        }

        if (user === null) return resolve(false);
        return resolve(true);
      });
    });

    return userExist;
  }

  async addUserService(data) {
    const newUser = new Promise(async (resolve, reject) => {
      const isExist = await this.checkUserExist(data.username);

      if (isExist) {
        return reject(new InvariantError(409,
            'Conflict', `Data with username ${data.username} has been exist`));
      }

      const userModel = this._mongo.model('user', schema.userSchema);
      const encryptPassword = await this._crypto.encrypt(data.password);
      userModel.create({
        username: data.username,
        password: encryptPassword.encryptedData,
        token: data.token != undefined ? data.token : null,
        role: data.role,
      }, (err, _) => {
        if (err) {
          mongoose.connection.close;
          return reject(new InvariantError(400, 'Bad Request', err.message));
        }

        mongoose.connection.close;
        return resolve(new PostResponse(201,
            'Created', 'Success add new user!'));
      });
    });

    return newUser;
  }

  async updateUserService(id, data) {
    const updateUser = new Promise(async (resolve, reject) => {
      const userModel = this._mongo.model('user', schema.userSchema);

      let values = {};
      if (data.password !== undefined) {
        const encryptPassword = await this._crypto.encrypt(data.password);
        values = {
          username: data.username,
          password: encryptPassword.encryptedData,
          role: data.role,
        };
      } else {
        values = {
          username: data.username,
          role: data.role,
        };
      }

      userModel.updateOne({_id: id}, values, (err, data) => {
        if (err) {
          mongoose.connection.close;
          return reject(new InvariantError(400,
              'Bad Request', err.message));
        }

        if (data.matchedCount < 1) {
          return reject(new NotFoundError(`Sorry user with id ${id} does not exist`));
        }

        mongoose.connection.close;
        return resolve(new PutResponse(200,
            'Updated', 'Data has been updated'));
      });
    });

    return updateUser;
  }

  async deleteUserService(id) {
    const deleteData = new Promise((resolve, reject) => {
      const userModel = this._mongo.model('user', schema.userSchema);

      userModel.deleteOne({_id: id}, (err, data) => {
        if (err) {
          mongoose.connection.close;
          return reject(new InvariantError(400, 'Bad Request', err.message));
        }

        if (data.deletedCount < 1) {
          return reject(new NotFoundError(`Sorry user with id ${id} does not exist`));
        }

        mongoose.connection.close;
        return resolve(new DeleteResponse(200,
            'Deleted', 'Data has been deleted'));
      });
    });

    return deleteData;
  }
}

module.exports = UserService;
