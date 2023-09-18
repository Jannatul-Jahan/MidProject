const express = require("express");
const routes = express();
const CartController = require("../controller/CartController");
const { isAuthenticated, isUser, isSpecificUser} = require("../middleware/auth");
const { cartValidator } = require("../middleware/validation");

routes.get("/getbyId", isAuthenticated, isUser, isSpecificUser, CartController.getById);
routes.post("/add", cartValidator.addItemToCart, isAuthenticated, isUser, isSpecificUser, CartController.addToCart);
routes.patch("/remove", isAuthenticated, isUser, isSpecificUser, CartController.removeFromCart);

module.exports = routes;
