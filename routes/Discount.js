const express = require("express");
const routes = express();
const DiscountController = require("../controller/DiscountController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

//routes.get("/all", DiscountController.getAll);
//routes.delete("/details", isAuthenticated, isAdmin, DiscountController.deleteById);
routes.post("/create", isAuthenticated, isAdmin, DiscountController.create);
routes.patch("/update", isAuthenticated, isAdmin, DiscountController.update);


module.exports = routes;