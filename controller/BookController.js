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

    async create(req, res){
      try {
          const validationErrors = validationResult(req).array();
          if (validationErrors.length > 0) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Validation failed", validationErrors));
          }
      
          const { title, description, price, discountprice, rating, stock, author, category } = req.body;
          const Product = await BookModel.create({ title, description, price, discountprice, rating, stock, author, category});
      
          if (Product) {
              return res.status(HTTP_STATUS.CREATED).send(success("Product created successfully", Product));
            } else {
              return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Failed to create"));
            }
        } catch (error) {
          console.log(error);
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
        }
  
    }
    
    
  }
  
  module.exports = new BookController();