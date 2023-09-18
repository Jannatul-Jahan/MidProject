const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      },
    bookId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    rating: {
        type: Number,
        required: true,
      },
    comment: {
        type: String,
        required: true,
      },
    date: {
        type: Date,
        default: Date.now,
      },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
