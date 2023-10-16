const { body, query, param } = require("express-validator");

const authValidator = {
  signup:[
    body("email")
      .exists()
      .withMessage("Email must be provided")
      .bail()
      .isEmail()
      .withMessage("Email must be in valid format"),
    body("password")
      .exists()
      .withMessage("Password must be provided")
      // .bail()
      // .isString()
      // .withMessage("Password must be a string")
      .bail().isStrongPassword({minLength : 6, maxLength:20, minLowercase: 1, minUppercase: 1, minSymbols:1, minNumbers:1})
      .withMessage("the password need to contain at least 8 characters, with a minimum of 1 lower case, 1 upper case, 1 number, and 1 symbol."),
    body("name")
      .exists()
      .withMessage("Name was not provided")
      .bail()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 6, max: 20 })
      .withMessage("Name must be 6 to 20 characters"),
    body("address")
      .exists()
      .withMessage("Address was not provided")
      .bail()
      .notEmpty()
      .withMessage("Address cannot be empty")
      .bail()
      .isString()
      .withMessage("Address must be a string")
      .isLength({ max: 30 })
      .withMessage("Address cannot be more than 30 characters"),

  ],
  login:[
    body("email")
    .exists()
    .withMessage("Email must be provided")
    .bail()
    .isEmail()
    .withMessage("Email must be in valid format"),
    body("password")
    .exists()
    .withMessage("Password must be provided")
    .bail()
    .isString()
    .withMessage("Password must be a string")
    .bail().isStrongPassword({minLength : 8, minLowercase: 1, minUppercase: 1, minSymbols:1, minNumbers:1}),
  ],
};



const cartValidator = {
    addItemToCart: [
      body("user")
        .exists()
        .withMessage("UserId was not provided"),
      body("products")
        .exists()
        .withMessage("BookId was not provided"),
    ],
  };

  const bookValidator = {
    addItemToBook: [
      body("title")
        .exists()
        .withMessage("Title was not provided")
        .bail()
        .isString()
        .withMessage("Password must be a string"),
      body("price")
        .exists()
        .withMessage("Price was not provided")
        .bail()
        .isNumeric()
        .withMessage('Price must be a numeric value')
        .bail()
        .isInt({ min: 1 })
        .withMessage('Price must be 1 or more than 1'),
      body("stock")
        .exists()
        .withMessage("Stock was not provided")
        .bail()
        .isNumeric()
        .withMessage('Stock must be a numeric value')
        .isInt({ min: 1 })
        .withMessage('Price must be 1 or more than 1'),
      body("category")
        .exists()
        .withMessage("Category was not provided")
        .bail()
       .isString()
       .withMessage("Password must be a string"),
    ],
  };

  const reviewValidator= {
    addReview: [
      body("user")
        .exists()
        .withMessage("User was not provided"),
      body("bookId")
        .exists()
        .withMessage("BookId was not provided"),
      body("rating")
        .exists()
        .withMessage("Rating was not provided")
        .bail()
        .isNumeric()
        .withMessage('Rating must be a numeric value')
        .bail()
        .isInt({ min: 1, max: 10 })
        .withMessage('Rating must be between 1 and 10'),
      body("comment")
        .exists()
        .withMessage("Comment was not provided")
        .bail()
        .isString()
        .withMessage("Comment must be a string"),
    ],
  };

  const balanceValidator= {
    addBalance: [
      body("user")
        .exists()
        .withMessage("User was not provided"),
      body("balance")
        .exists()
        .withMessage("Balance was not provided")
        .bail()
        .isNumeric()
        .withMessage('Balance must be a numeric value')
        .bail()
        .isInt({ min:1 })
        .withMessage('Balance must be  1 or more'),
    ],
  };


  const discountValidator= {
    addDiscount: [
      body("productId")
        .exists()
        .withMessage("productId was not provided"),
      body("discountPercent")
        .exists()
        .withMessage("Discount percentage was not provided")
        .bail()
        .isNumeric()
        .withMessage('Discount percentage must be a numeric value')
        .bail()
        .isInt({ min:1,  max: 80 })
        .withMessage('Discount percent must be between 1 to 80'),
      body("startTime")
        .exists()
        .withMessage("startTime was not provided"),
      body("endTime")
        .exists()
        .withMessage("endTime was not provided"),
    ],
    updateDiscount: [
      body("discountId")
        .exists()
        .withMessage("Discount id was not provided"),
      body("discountPercent")
        .exists()
        .withMessage("Discount percentage was not provided")
        .bail()
        .isNumeric()
        .withMessage('Discount percentage must be a numeric value')
        .bail()
        .isInt({  min:1, max: 80 })
        .withMessage('Discount percent must be between 1 to 80'),
      body("startTime")
        .exists()
        .withMessage("startTime was not provided"),
      body("endTime")
        .exists()
        .withMessage("endTime was not provided"),
    ],
  };

  


module.exports = { authValidator, cartValidator, bookValidator, reviewValidator, balanceValidator, discountValidator};
