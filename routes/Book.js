const express = require("express");
const routes = express();
const BookController = require("../controller/BookController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const { bookValidator } = require("../middleware/validation");

routes.get("/total", BookController.totalAll);
routes.get("/all", BookController.getAll);
routes.get("/details/:id", BookController.getOneById);
//routes.post("/create", isAuthenticated, isAdmin, bookValidator.addItemToBook, BookController.create);
routes.post("/create", isAuthenticated, isAdmin, BookController.create);
routes.patch("/update/:id", isAuthenticated, isAdmin, BookController.update);
//routes.patch("/update/:id", isAuthenticated, isAdmin, BookController.update);
routes.delete("/delete", isAuthenticated, isAdmin, BookController.deleteById);


module.exports = routes;