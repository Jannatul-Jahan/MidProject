const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const Book = require("../model/Book"); 
const Review = require("../model/Review");
const HTTP_STATUS = require("../constants/statusCodes");

class ReviewController {
  async addReview(req, res) {
    try {
      const { user, bookId, rating, comment } = req.body;

      const existingReview = await Review.findOne({ user, bookId });

      if (existingReview) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(failure('Review already exists'));
      } else {
        // User has not reviewed this book before, so add a new review
        const book = await Book.findById(bookId);

        if (!book) {
          return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Book not found'));
        }

        const newReview = new Review({
          user,
          bookId,
          rating,
          comment,
        });

        await newReview.save();

        // Update the book's average rating and total ratings
        book.reviews.push(newReview._id);
        book.totalRatings += rating;

        if (book.reviews.length > 0) {
          book.averageRating = book.totalRatings / book.reviews.length;
        } else {
          book.averageRating = 0;
        }

        await book.save();
      }

      return res.status(HTTP_STATUS.CREATED).send(success('Review added successfully'));
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
    }
  }

  async updateReview(req, res) {
    try {
      const { user, bookId, rating, comment } = req.body;

      const existingReview = await Review.findOne({ user, bookId });

      if (existingReview) {
        const previousRating = existingReview.rating; // Store the previous rating
        existingReview.rating = rating;
        existingReview.comment = comment;
        await existingReview.save();

        if (previousRating !== rating) {
          // If the rating has been updated, update the book's totalRatings and averageRating
          const book = await Book.findById(bookId);

          if (!book) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Book not found'));
          }

          // Calculate the new totalRatings by subtracting the previous rating and adding the updated rating
          book.totalRatings = book.totalRatings - previousRating + rating;

          // Recalculate the averageRating
          if (book.reviews.length > 0) {
            book.averageRating = book.totalRatings / book.reviews.length;
          } else {
            book.averageRating = 0;
          }

          await book.save();
        }

        return res.status(HTTP_STATUS.OK).send(success('Review updated successfully'));
      }
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
    }
  }


    async deleteReview(req, res) {
      try {
        const { user, bookId } = req.body;
  
        // Find the review by user and bookId
        const existingReview = await Review.findOne({ user, bookId });
  
        if (!existingReview) {
          return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Review not found'));
        }
  
        // Get the book associated with the review
        const book = await Book.findById(bookId);
  
        if (!book) {
          return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Book not found'));
        }
  
        // Remove the review from the book's reviews array
        book.reviews = book.reviews.filter(reviewId => reviewId.toString() !== existingReview._id.toString());
  
        // Update the book's totalRatings and averageRating
        if (book.reviews.length > 0) {
          book.totalRatings -= existingReview.rating;
          book.averageRating = book.totalRatings / book.reviews.length;
        } else {
          // No more reviews for the book, reset totalRatings and averageRating
          book.totalRatings = 0;
          book.averageRating = 0;
        }
  
        // Delete the review from the Review collection
        await Review.deleteOne({ _id: existingReview._id });
  
        // Save the updated book
        await book.save();
  
        return res.status(HTTP_STATUS.OK).send(success('Review deleted successfully'));
      } catch (error) {
        console.error(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
      }
  }

  async getAllReviews(req, res) {
    try {
      const bookId = req.params.bookId; // Correct the variable name

      const book = await Book.findById(bookId).populate('reviews.user');

      if (!book) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure('Book not found'));
      }

      const reviews = book.reviews;

      return res.status(HTTP_STATUS.OK).send(success('Reviews retrieved successfully', reviews));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure('Internal server error'));
    }
  }

}

module.exports = new ReviewController();
