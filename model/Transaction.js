const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  cart:{
    type: mongoose.Types.ObjectId,
    ref: 'Cart',
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  product: [{
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

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
