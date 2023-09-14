const express = require("express");
const routes = express();
const BookController = require("../controller/BookController");
// const createValidation = require("../middleware/validation");
// const updateValidation = require("../middleware/validation1");


routes.get("/all", BookController.getAll);
// routes.post("/review/:productId", ProductController.addReview);
// routes.get("/review/:productId", ProductController.getAllReviews);
// routes.get("/details/:id", ProductController.getOneById);
// routes.get("/search", ProductController.querySearch);
// routes.delete("/details", ProductController.deleteById);
routes.post("/create", BookController.create);
// routes.patch("/details/:id", updateValidation, ProductController.update);



module.exports = routes;