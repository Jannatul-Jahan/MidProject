const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
    productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", 
        required: true,
      }],
      discountPercent: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      startTime: {
        type: Date,
      },
      endTime: {
        type: Date,
      },
});

module.exports = mongoose.model("Discount", discountSchema);
