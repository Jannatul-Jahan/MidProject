const express = require("express");
const routes = express();
const CartController = require("../controller/CartController");
const { isAuthenticated, isUser, isSpecificUser} = require("../middleware/auth");
const { cartValidator } = require("../middleware/validation");

//routes.get("/getbyId", isAuthenticated, isUser, isSpecificUser, CartController.getById);
routes.get("/getbyId/:user", isAuthenticated, isUser, CartController.getById);
//routes.post("/add", isAuthenticated, isUser, isSpecificUser, cartValidator.addItemToCart, CartController.addToCart);
routes.patch("/remove",  isAuthenticated, isUser, isSpecificUser, CartController.removeFromCart);
routes.post("/add", isAuthenticated, isUser, isSpecificUser, CartController.addToCart);
module.exports = routes;
