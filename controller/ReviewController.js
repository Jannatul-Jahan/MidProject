const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const Book = require("../model/Book");
const Review = require("../model/Review");
const HTTP_STATUS = require("../constants/statusCodes");

class ReviewController {
    async addReview(req, res){
        try {
            const { user, bookId, rating, comment } = req.body;
    
            const book = await Book.findById(bookId);
    
            if (!book) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Book not found'));
            }
    
            const newReview = new Review({
                user: user,
                bookId: book, // Set the book reference
                rating,
                comment,
            });
    
            await newReview.save();
            console.log(newReview._id);
            // Update the book's average rating and total ratings
            book.reviews.push(newReview._id); // Add the review reference
            book.totalRatings += rating;
            book.averageRating = book.totalRatings / book.reviews.length;

    
            await book.save();
    
            return res.status(HTTP_STATUS.CREATED).send(success('Review added successfully'));
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
        }
    }
      
      async getAllReviews(req, res) {
        try {
          const productId = req.params.productId;
      
          const product = await ProductModel.findById(productId)
            .populate("reviews.user");  
      
          if (!product) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Product not found'));
          }
      
          const reviews = product.reviews;
      
          return res.status(HTTP_STATUS.OK).send(success('Reviews retrieved successfully', reviews));
        } catch (error) {
          console.log(error);
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
        }
      }

}

module.exports = new ReviewController();