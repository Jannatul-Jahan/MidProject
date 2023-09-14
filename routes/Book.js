const express = require("express");
const routes = express();
const BookController = require("../controller/BookController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

routes.get("/all", BookController.getAll);
// routes.post("/review/:productId", ProductController.addReview);
// routes.get("/review/:productId", ProductController.getAllReviews);
// routes.get("/details/:id", ProductController.getOneById);
// routes.get("/search", ProductController.querySearch);
// routes.delete("/details", ProductController.deleteById);
routes.post("/create", isAuthenticated, isAdmin, BookController.create);
// routes.patch("/details/:id", updateValidation, ProductController.update);



module.exports = routes;