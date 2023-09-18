const express = require("express");
const routes = express();
const ReviewController = require("../controller/ReviewController");
const { isAuthenticated, isUser, isSpecificUser } = require("../middleware/auth");

//routes.get("/all", DiscountController.getAll);
routes.post("/add", isAuthenticated, isUser, isSpecificUser, ReviewController.addReview);
routes.patch("/update", isAuthenticated, isUser, isSpecificUser, ReviewController.updateReview);
routes.delete("/delete", isAuthenticated, isUser, isSpecificUser, ReviewController.deleteReview);
//routes.patch("/update", isAuthenticated, isUser, ReviewController.update);


module.exports = routes;