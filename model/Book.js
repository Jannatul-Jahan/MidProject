const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  discountPercentage: {
    type: Number,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  stock: {
    type: Number,
  },
  author: {
    type: String,
  },
  category: {
    type: String,
  },
  averageRating: {
    type: Number,
    default: 0, // Initialize to 0
},
totalRatings: {
    type: Number,
    default: 0, // Initialize to 0
},
reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
}],
},
  { timestamps: true }
);



const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
