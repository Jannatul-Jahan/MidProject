const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const Cart = require("../model/Cart");
const Product = require("../model/Book");
const HTTP_STATUS = require("../constants/statusCodes");

class CartController {
  async getById(req, res) {
    try {
       //const { user } = req.body; 
      const { user } = req.params;
      console.log(user);
      const userCart = await Cart.findOne({ user: user }).populate("products.product"); 
      
      if (!userCart) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User's cart not found"));
      }
  
      return res.status(HTTP_STATUS.OK).send(success("Successfully received user's cart", { result: userCart }));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }


  
  async addToCart(req, res) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length > 0) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Validation failed", validationErrors));
      }
  
      const { user, products } = req.body;
  
      // Check if the user already exists in the database
      const existingUser = await Cart.findOne({ user });
  
      if (existingUser) {
      
        const productDocuments = await Promise.all(products.map(async (item) => {
          const product = await Product.findById(item.product).select("-thumbnails");

          if (!product) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Product id not found"));
          }
          const price = parseFloat(product.price);
          const discount = parseInt(product.discountPercentage);
          const quantity = parseInt(item.quantity, 10);
      
          if (isNaN(price) || isNaN(quantity)) {
            console.log("Invalid price or quantity:", price, quantity);
          }
      
          
          if (product.stock < quantity) {
            throw new Error(`Not enough stock for product: ${product.title}`);
            //return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Not enough stock"));
            
          }
        
        
          let DiscountPercentage = 0;
          const now = new Date();
          if (product.startTime && product.endTime && (now > product.startTime && now < product.endTime)) {
            DiscountPercentage = discount;
          }

          const discountedPrice = price * (1 - DiscountPercentage / 100);
          const productPrice = discountedPrice * quantity;
          const existingProduct = existingUser.products.find(p => p.product.equals(product._id));

          if (existingProduct) {
            
            existingProduct.quantity += quantity;

            return {
                product: product._id,
                quantity: existingProduct.quantity,
                price: productPrice,
              };
            
            
          } else {
            // Product doesn't exist in the cart, add it
            existingUser.products.push({
              product: product._id,
              quantity: quantity,
              price: productPrice,
            });

            return {
                product: product._id,
                quantity: quantity,
                price: productPrice,
              };
          }
      
          
        }));
      
        const total = productDocuments.reduce((acc, item) => {
          return acc + item.price;
        }, 0);
      
        if (isNaN(total)) {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid total price"));
        }
      
        existingUser.total += total;
      
        const updatedCart = await existingUser.save();
      
        return res.status(HTTP_STATUS.OK).send(success("Cart updated successfully", updatedCart));
      } else {
  
        const productDocuments = await Promise.all(products.map(async (item) => {
          const product = await Product.findById(item.product).select("-thumbnails");

          if (!product) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Product id not found"));
          }
  
          const price = parseFloat(product.price);
          const discount = parseInt(product.discountPercentage);
          const quantity = parseInt(item.quantity, 10);
  
          if (isNaN(price) || isNaN(quantity)) {
            console.log("Invalid price or quantity:", price, quantity);
          }
          let DiscountPercentage = 0;
          const now = new Date();
         
          if (product.startTime && product.endTime && (now > product.startTime && now < product.endTime)) {
            DiscountPercentage = discount;
          }

          const discountedPrice = price * (1 - DiscountPercentage / 100);
          const productPrice = discountedPrice * quantity;
  
          if (product.stock < quantity) {
            throw new Error(`Not enough stock for product: ${product.title}`);
            //return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Not enough stock"));
          }
  
          return {
            product: product._id,
            quantity: quantity,
            price: productPrice,
          };
        }));
  
        const total = productDocuments.reduce((acc, item) => {
          return acc + item.price;
        }, 0);
  
        if (isNaN(total)) {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid total price"));
        }
  
        // Create a new cart for the user
        const newCart = await Cart.create({ user, products: productDocuments, total });
  
        return res.status(HTTP_STATUS.CREATED).send(success("Cart created successfully", newCart));
      }
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }
    
  async removeFromCart(req, res) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length > 0) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Validation failed", validationErrors));
      }
  
      const { user, products } = req.body;
  
      // Check if the user already exists in the database
      const existingUser = await Cart.findOne({ user });
  
      if (existingUser) {
        // User exists, update the cart
  
        const productDocuments = await Promise.all(products.map(async (item) => {
          const product = await Product.findById(item.product).select("-thumbnails");
  
          const price = parseFloat(product.price);
          const discount = parseInt(product.discountPercentage);
          const quantity = parseInt(item.quantity, 10);
  
          if (isNaN(price) || isNaN(quantity)) {
            console.log("Invalid price or quantity:", price, quantity);
          }
  
          let DiscountPercentage = 0;
          const now = new Date();
         
          if (product.startTime && product.endTime && (now > product.startTime && now < product.endTime)) {
            DiscountPercentage = discount;
          }

          const discountedPrice = price * (1 - DiscountPercentage / 100);
          const productPrice = discountedPrice * quantity;
  
  
          if (product.stock < quantity) {
            throw new Error(`Not enough stock for product: ${product.title}`);
          }
  
          // Check if the product already exists in the user's cart
          const existingProduct = existingUser.products.find(p => p.product.equals(product._id));
          
        
            if (existingProduct.quantity >= quantity) {
              
              // Product exists in the cart, update the quantity and price
              existingProduct.quantity -= quantity;
              existingUser.total -= productPrice;} else{ console.log("stock is less");}
           
  
          return {
            product: product._id,
            quantity: existingProduct.quantity,
            price: existingUser.total, 
          };
        }));
  
        const updatedCart = await existingUser.save();

        return res.status(HTTP_STATUS.OK).send(success("Cart updated successfully", updatedCart));
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Cart not found"));
      }
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }
  

}

module.exports = new CartController();