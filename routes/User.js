const express = require("express");
const routes = express();
const UserController = require("../controller/UserController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");


routes.get("/all", isAuthenticated, isAdmin, UserController.getAll);
routes.get("/details/:id", isAuthenticated, isAdmin, UserController.getOneById);
routes.delete("/delete/:id", isAuthenticated, isAdmin, UserController.deleteById);
routes.patch("/update/:id", isAuthenticated, isAdmin, UserController.updateById);
routes.delete("/delete-all", isAuthenticated, isAdmin, UserController.deleteAll);

module.exports = routes;
