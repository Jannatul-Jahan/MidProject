const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const BookModel = require("../model/Book");
// const UserModel = require("../model/User");
const HTTP_STATUS = require("../constants/statusCodes");

class BookController {
    async getAll(req, res) {
        try {
          const books = await BookModel.find({});
          if (books.length > 0) {
            return res
              .status(HTTP_STATUS.OK)
              .send(success("Successfully received all books", { result: books, total: books.length }));
          }
          return res.status(HTTP_STATUS.OK).send(success("No data found"));
        } catch (error) {
          console.log(error);
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
        }
      }


      async create(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res
                    .status(HTTP_STATUS.OK)
                    .send(failure("Failed to add the product", validation));
            }
            const { title, description, price, rating, discountprice, stock, author, category} = req.body;

            const existingProduct = await BookModel.findOne({ title: title });

            if (existingProduct) {
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Book with same title already exists"));
            }

            const newProduct = await BookModel.create({
                title: title,
                description: description,
                price: price,
                rating: rating, 
                discountprice:discountprice, 
                stock: stock,
                author:author,
                category:category,

            });
        
            if (newProduct) {
                return res
                    .status(HTTP_STATUS.OK)
                    .send(success("Successfully added product", newProduct));
            }
        } catch (error) {
            console.log(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }
    
    
  }
  
  module.exports = new BookController();