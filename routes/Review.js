const express = require("express");
const routes = express();
const ReviewController = require("../controller/ReviewController");
const { isAuthenticated, isUser, isSpecificUser } = require("../middleware/auth");
const { reviewValidator } = require("../middleware/validation");


routes.get("/byId", ReviewController.getAllReviews);
routes.post("/add", isAuthenticated, isUser, isSpecificUser, reviewValidator.addReview, ReviewController.addReview);
routes.patch("/update", isAuthenticated, isUser, isSpecificUser, ReviewController.updateReview);
routes.delete("/delete", isAuthenticated, isUser, isSpecificUser, ReviewController.deleteReview);



module.exports = routes;