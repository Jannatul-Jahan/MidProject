const express = require("express");
const routes = express();
const BalanceController = require("../controller/BalanceController");
const { isAuthenticated, isUser, isSpecificUser} = require("../middleware/auth");
//const { cartValidator } = require("../middleware/validation");

routes.get("/check", isAuthenticated, isUser, isSpecificUser, BalanceController.check);
routes.post("/add", isAuthenticated, isUser, isSpecificUser, BalanceController.addToBalance);
//routes.patch("/remove", isAuthenticated, isUser, isSpecificUser, CartController.removeFromCart);

module.exports = routes;
