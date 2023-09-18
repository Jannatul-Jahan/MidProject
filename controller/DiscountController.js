const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const Discount = require("../model/Discount");
const Book = require("../model/Book");
const HTTP_STATUS = require("../constants/statusCodes");


class DiscountController {
    async create(req, res) {
      try{
            const { productId, discountPercent, startTime, endTime } = req.body;

            // Create a new discount record
         const discount = new Discount({
            productId,
            discountPercent,
            startTime,
            endTime,
         });

         

        // Save the discount record to the database
         await discount.save();

         // Update the discount price of the associated books
         const books = await Book.find({ _id: { $in: productId } });
          if (!books || books.length !== productId.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure("One or more books not found"));
          }

           // Calculate the discounted price and update the books
         for (const book of books) {
             book.discountPercentage = discountPercent;
             book.startTime = startTime;
             book.endTime = endTime;
             await book.save();
            }
            return res.status(HTTP_STATUS.OK).send(success("Successfully updated the discountprice"));
         } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
          }

    }

    async update(req,res){
        try {
            const { discountId, discountPercent, startTime, endTime } = req.body;
      
            // Find the discount record by ID
            const discount = await Discount.findById(discountId);
            if (!discount) {
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Discount not found"));
            }
      
            // Update the discount record
            discount.discountPercent = discountPercent;
            discount.startTime = startTime;
            discount.endTime = endTime;
            await discount.save();
      
            // Update the discount price of the associated books
            const books = await Book.find({ _id: { $in: discount.productId } });
            if (!books) {
              return res.status(HTTP_STATUS.NOT_FOUND).send(failure("One or more books not found"));
            }
      
            // Calculate the discounted price and update the books
            for (const book of books) {
              book.discountPercentage = discountPercent;
              book.startTime = startTime;
              book.endTime = endTime;
              await book.save();
            }
      
            return res.status(HTTP_STATUS.OK).send(success("Successfully updated the discount and discount price"));
          } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
          }
    }

}


module.exports = new DiscountController();