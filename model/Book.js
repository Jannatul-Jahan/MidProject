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
  discountprice: {
    type: Number,
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
},
  { timestamps: true }
);



const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
