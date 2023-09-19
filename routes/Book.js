const express = require("express");
const routes = express();
const BookController = require("../controller/BookController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

routes.get("/all", BookController.getAll);
routes.get("/details/:id", BookController.getOneById);
routes.delete("/delete", isAuthenticated, isAdmin, BookController.deleteById);
routes.post("/create", isAuthenticated, isAdmin, BookController.create);
routes.patch("/update/:id", isAuthenticated, isAdmin, BookController.update);



module.exports = routes;