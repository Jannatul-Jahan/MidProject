const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  products: [{
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  total: {
    type: Number,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
