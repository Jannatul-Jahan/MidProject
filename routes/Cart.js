const express = require("express");
const routes = express();
const CartController = require("../controller/CartController");
const { isAuthenticated, isUser } = require("../middleware/auth");
const { cartValidator } = require("../middleware/validation");

// routes.get("/all", CartController.getAll);
// routes.get("/:id", CartController.getById);
routes.post("/create", cartValidator.addItemToCart, isAuthenticated, isUser, CartController.addToCart);
//routes.patch("/remove", CartController.removeFromCart);

module.exports = routes;
