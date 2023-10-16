const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const Balance = require("../model/Balance");
const Product = require("../model/Book");
const Cart = require("../model/Cart");
const HTTP_STATUS = require("../constants/statusCodes");

class BalanceController {
  async check(req, res) {
    try {
      //const { user } = req.body; 
      const { user } = req.params;
      const balance = await Balance.find({ user: user });
      console.log(balance.length);
      if (balance.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully showed balance", { result: balance }));
      }
      return res.status(HTTP_STATUS.OK).send(success("No users were found"));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }


  async addToBalance(req, res) {
    try {
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0) {
          return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Validation failed", validationErrors));
        }
  
        const { user, balance } = req.body;
  
        // Check if the user exists in the Balance database
        let existingBalance = await Balance.findOne({ user });
  
        if (existingBalance) {
          // User exists, update their balance
          existingBalance.balance += balance;
          await existingBalance.save();
        } else {
          // User doesn't exist, create a new balance record
          existingBalance = new Balance({ user, balance });
          await existingBalance.save();
        }
  
        return res.status(HTTP_STATUS.CREATED).send(success("Balance added successfully"));
  
      } catch (error) {
        console.error(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
      }
  }
  

}

module.exports = new BalanceController();