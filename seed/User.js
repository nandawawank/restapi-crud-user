#!/usr/bin/env node
/* eslint-disable max-len */
require('dotenv').config();
const mongoose = require('mongoose');
const Crypto = require('../src/utils/Crypto');

// const mongoHost = process.env.MONGO_HOST;
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: {
    type: String, defaultValue: String,
  },
  role: String,
});

this._crypto = new Crypto();
this._mongo = mongoose.createConnection('mongodb://root:toor@localhost:27017/admin', {useNewUrlParser: true});
if (!this._mongo.readyState) {
  mongoose.connection.close;
  return reject(new InvariantError(503,
      'Service Unavaiable', 'Failed to connect to database!'));
}

const User = this._mongo.model('user', userSchema);
this._crypto.encrypt('admin')
    .then((data) => {
      User.create({
        username: 'admin',
        password: data.encryptedData,
        token: null,
        role: 'admin',
      }, (err) => {
        if (err) console.error('Some thing wrong : ', err);
        if (!err) console.log('Success, user admin has been created');
        console.log('Finish, for exit press CTRL + C');
        process.exit(1);
      });
    });

