const express = require("express");
const routes = express();
const DiscountController = require("../controller/DiscountController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const { discountValidator } = require("../middleware/validation");

routes.get("/all", isAuthenticated, isAdmin, DiscountController.getAll);
routes.post("/create", isAuthenticated, isAdmin, discountValidator.addDiscount, DiscountController.create);
routes.patch("/update", isAuthenticated, isAdmin, discountValidator.updateDiscount, DiscountController.update);


module.exports = routes;