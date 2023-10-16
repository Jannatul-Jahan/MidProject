const express = require("express");
const routes = express();
const AuthController = require("../controller/AuthController");
const { authValidator } = require("../middleware/validation");

routes.post("/sign-up", authValidator.signup, AuthController.signup);
routes.post("/login", authValidator.login, AuthController.login);
routes.post("/forgetpassword", AuthController.sendForgotPasswordEmail);
routes.patch("/resetpassword", AuthController.resetPassword);
routes.post("/reset-password/:token/:userId", AuthController.validatePasswordResetRequest);


module.exports = routes;
