const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const Discount = require("../model/Discount");
const Book = require("../model/Book");
const HTTP_STATUS = require("../constants/statusCodes");


class DiscountController {
  async getAll(req, res) {
    try {
      const discounts = await Discount.find({});
      
      if (discounts) {
        if (discounts.length > 0) {
                return res.status(HTTP_STATUS.OK).send(success("Successfully received all users", { result: discounts, total: discounts.length }));
              }
         return res.status(HTTP_STATUS.OK).send(success("No discounts were found"));
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to filter discount data"));
      }
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

    async create(req, res) {
      try{
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0) {
          return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Validation failed", validationErrors));
        }
            const { productId, discountPercent, startTime, endTime } = req.body;
            if (endTime < startTime) {
              return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("End time cannot be less than start time"));
            }

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
            return res.status(HTTP_STATUS.OK).send(success("Successfully added the discount"));
         } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
          }

    }

    async update(req,res){
        try {
          const validationErrors = validationResult(req).array();
          if (validationErrors.length > 0) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Validation failed", validationErrors));
          }
            const { discountId, discountPercent, startTime, endTime } = req.body;
            if (endTime < startTime) {
              return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("End time cannot be less than start time"));
            }
      
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
      
            return res.status(HTTP_STATUS.OK).send(success("Successfully updated the discount"));
          } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
          }
    }

}


module.exports = new DiscountController();