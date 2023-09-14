const express = require("express");
const routes = express();
const UserController = require("../controller/UserController");
// const { userValidator } = require("../middleware/validation");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

routes.get("/all", isAuthenticated, isAdmin, UserController.getAll);
// routes.get("/detail/:id", UserController.getOneById);
// routes.delete("/delete/:id", UserController.deleteById);
// routes.patch("/update/:id", UserController.updateById);
// routes.delete("/delete-all", UserController.deleteAll);

module.exports = routes;
