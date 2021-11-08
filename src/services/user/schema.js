const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: {
    type: String, defaultValue: String,
  },
  role: String,
});

module.exports = {userSchema};
