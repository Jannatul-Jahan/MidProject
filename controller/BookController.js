const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const BookModel = require("../model/Book");
// const UserModel = require("../model/User");
const HTTP_STATUS = require("../constants/statusCodes");

class BookController {
    async totalAll(req, res) {
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

    async getAll(req, res) {
        try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 50;
          const sortField = req.query.sortField || 'price';
          const sortOrder = req.query.sortOrder || 'asc';
          const skip = (page - 1) * limit;
      
          if (page < 1 || limit < 1) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid page or limit value. Both must be greater than or equal to 1."));
          }
      
          if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid query: Please use 'asc' or 'desc' for sorting order"));
          }
      
          const minPrice = req.query.minPrice !== undefined ? parseFloat(req.query.minPrice) : undefined;
          const maxPrice = req.query.maxPrice !== undefined ? parseFloat(req.query.maxPrice) : undefined;
          const minStock = req.query.minStock !== undefined ? parseInt(req.query.minStock) : undefined;
          const maxStock = req.query.maxStock !== undefined ? parseInt(req.query.maxStock) : undefined;
          const minRating = req.query.minRating !== undefined ? parseFloat(req.query.minRating) : undefined;
          const maxRating = req.query.maxRating !== undefined ? parseFloat(req.query.maxRating) : undefined;
      
          if (
            (req.query.minPrice !== undefined && isNaN(minPrice)) ||
            (req.query.maxPrice !== undefined && isNaN(maxPrice)) ||
            (req.query.minStock !== undefined && isNaN(minStock)) ||
            (req.query.maxStock !== undefined && isNaN(maxStock)) ||
            (req.query.minRating !== undefined && isNaN(minRating)) ||
            (req.query.maxRating !== undefined && isNaN(maxRating))
          ) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid query: minPrice, maxPrice, minStock, maxStock, minRating, and maxRating must be numeric values."));
          }
      
          const allProducts = await BookModel.find({}, { title: 1, description: 1, price: 1, stock: 1, rating: 1 });
      
          if (allProducts.length === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(success("No products were found"));
          }
      
          const searchText = req.query.searchText || '';
      
          const filteredProducts = allProducts.filter(product => {
            const productPrice = parseFloat(product.price);
            const productStock = parseInt(product.stock);
            const productRating = parseFloat(product.rating);
    
            const PriceFilter = (minPrice ? productPrice >= minPrice : true) &&
              (maxPrice ? productPrice <= maxPrice : true);
            const StockFilter = (minStock ? productStock >= minStock : true) &&
              (maxStock ? productStock <= maxStock : true);
            const RatingFilter = (minRating ? productRating >= minRating : true) &&
              (maxRating ? productRating <= maxRating : true);
      
            const searchRegex = new RegExp(searchText, 'i');
            const titleMatch = searchRegex.test(product.title);
            const descriptionMatch = searchRegex.test(product.description);
      
            return PriceFilter && StockFilter && RatingFilter && (titleMatch || descriptionMatch);
          });
      
          const sortedProducts = filteredProducts.sort((a, b) => {
            const aValue = parseFloat(a[sortField]);
            const bValue = parseFloat(b[sortField]);
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          });
      
          const total = sortedProducts.length;
      
          const finalData = sortedProducts.slice(skip, skip + limit);
          const responseData = {
            total,
            countPerPage: finalData.length,
            page,
            limit,
            data: finalData,
          };
      
          return res.status(HTTP_STATUS.OK).send(success("Successfully received all products", responseData));
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
    
    async getOneById(req, res){
        try{
          const { id } = req.params;
          const books = await BookModel.findById(id).populate("reviews");
          
          if(books){
            return res.status(200).send(success("Successfully received the product", books));
          } else{
            return res.status(400).send(failure("Failed to receive the product"));
          }
        } catch(error){
          return res.status(500).send(failure("Internal server error!"));
        }
      }
    
      async deleteById(req, res) {
        try {
          const { id } = req.query;

          const products = await BookModel.findByIdAndDelete(id);
          
          if (products) {
            return res.status(200).send(success("Successfully deleted the product"));
          } else {
            return res.status(401).send(failure("Product couldn't be found!"));
          }
        } catch (error) {
          console.log(error);
          return res.status(500).send(failure("Internal server error!"));
        }
      }
    
    

      async update(req, res) {
        try {
            const { id } = req.params;
            const updatedProductData = req.body;
    
            const updatedProduct = await BookModel.findByIdAndUpdate(id, updatedProductData, { new: true });
    
            if (updatedProduct) {
                return res.status(HTTP_STATUS.OK).send(success("Successfully updated the product", updatedProduct));
            } else {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Product not found"));
            }
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
        }
    }
    
  }
  
  module.exports = new BookController();