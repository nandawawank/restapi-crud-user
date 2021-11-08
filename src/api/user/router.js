/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();

const UserService = require("../../services/user/service");
const UserHandler = require("./handler");

const LoginService = require("../../services/login/service");
const LoginHandler = require("../login/handler");

const userService = new UserService();
const userHandler = new UserHandler(userService);

const loginService = new LoginService();
const loginHandler = new LoginHandler(loginService);

router.get("/user", loginHandler.verifyAccessMiddleWareHandler, userHandler.getUserHandler);
router.get("/user/:id", loginHandler.verifyAccessMiddleWareHandler, userHandler.getUserByIdHandler);
router.post("/user", loginHandler.verifyAccessMiddleWareHandler, userHandler.addUserHandler);
router.put("/user/:id", loginHandler.verifyAccessMiddleWareHandler, userHandler.updateUserHandler);
router.delete("/user/:id", loginHandler.verifyAccessMiddleWareHandler, userHandler.deleteUserHandler);

module.exports = router;
