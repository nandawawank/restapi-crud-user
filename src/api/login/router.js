/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const LoginService = require('../../services/login/service');
const LoginHandler = require('./handler');

const loginService = new LoginService();
const loginHandler = new LoginHandler(loginService);

router.post('/login-user', loginHandler.loginHandler);
router.post('/logout-user/:id', loginHandler.logoutHandler);
router.post('/seed-user', loginHandler.seedDefaultUserHandler);

module.exports = router;
