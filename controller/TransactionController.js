const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const TransactionModel = require("../model/Transaction");
const Product = require("../model/Book");
const Cart = require("../model/Cart");
const Balance = require("../model/Balance");
const HTTP_STATUS = require("../constants/statusCodes");

class TransactionController {
  async getAll(req, res) {
    try {
      const transactions = await TransactionModel.find({});
      if (transactions.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully received all user's transactions", { result: transactions, total: transactions.length }));
      }
      return res.status(HTTP_STATUS.OK).send(success("No users were found"));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async getByuserId(req, res) {
    try {
      const { user } = req.body; 
      const transactions = await TransactionModel.find({ user: user });
      if (transactions.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully received all transactions", { result: transactions, total: transactions.length }));
      }
      return res.status(HTTP_STATUS.OK).send(success("No users were found"));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async checkOut(req, res) {
    try {
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0) {
          return res
            .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
            .send(failure("Validation failed", validationErrors));
        }
  
        const { user } = req.body;
  
        // Fetch the user's cart from the database
        const userCart = await Cart.findOne({ user }).populate("products.product");
  
        if (!userCart) {
          return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Cart not found"));
        }
  
        const stockUpdates = [];
  
        let total = 0;
  
        for (const cartItem of userCart.products) {
          const product = cartItem.product;
          const quantity = parseInt(cartItem.quantity);
          
          
  
          const price = parseFloat(product.price);


        
          let discountPercentage = 0;
          const now = new Date();
          if (
            product.startTime &&
            product.endTime &&
            now > product.startTime &&
            now < product.endTime
          ) {
            discountPercentage = product.discountPercentage;
          }
  
          
          const discountedPrice = price * (1 - discountPercentage / 100);
          const productPrice = discountedPrice * quantity;
          
          
  
          if (product.stock < quantity) {
            //throw new Error(`Not enough stock for product: ${product.title}`);
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Not enough stock for product"));
          }
  
          stockUpdates.push({
            updateOne: {
              filter: { _id: product._id },
              update: { $inc: { stock: -quantity } },
            },
          });
          total += productPrice;
        }
  
        if (isNaN(total)) {
          return res
            .status(HTTP_STATUS.BAD_REQUEST)
            .send(failure("Invalid total price"));
        }
  
    
        const userBalance = await Balance.findOne({ user });
  
        if (!userBalance || userBalance.balance < total) {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Insufficient balance"));
        }
  
        
        userBalance.balance -= total;
        await userBalance.save();
  
        await Product.bulkWrite(stockUpdates);
        const transaction = new TransactionModel({
          cart: userCart._id,
          user: user,
          product: userCart.products, 
          total: total,
        });
  
        
        await transaction.save();
        return res.status(HTTP_STATUS.CREATED).send(success("Transaction successful"));
      } catch (error) {
        console.error(error);
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .send(failure("Internal server error"));
      }
    }
}

module.exports = new TransactionController();