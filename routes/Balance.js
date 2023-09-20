const express = require("express");
const routes = express();
const BalanceController = require("../controller/BalanceController");
const { isAuthenticated, isUser, isSpecificUser} = require("../middleware/auth");
const { balanceValidator } = require("../middleware/validation");

routes.get("/check", isAuthenticated, isUser, isSpecificUser, BalanceController.check);
routes.post("/add", isAuthenticated, isUser, isSpecificUser,balanceValidator.addBalance, BalanceController.addToBalance);

module.exports = routes;
