const express = require("express");
const cors = require("cors");
const app = express();
const BookRouter = require("./routes/Book");
const UserRouter = require("./routes/User");
const AuthRouter = require("./routes/Auth");
const CartRouter = require("./routes/Cart");
const ReviewRouter = require("./routes/Review");
const DiscountRouter = require("./routes/Discount");
const TransactionRouter = require("./routes/Transaction");
const BalanceRouter = require("./routes/Balance");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json()); 
app.use(express.text()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/books", BookRouter);
app.use("/users", UserRouter);
app.use("/users", AuthRouter);
app.use("/cart", CartRouter);
app.use("/discounts", DiscountRouter);
app.use("/transactions", TransactionRouter);
app.use("/reviews", ReviewRouter);
app.use("/balance", BalanceRouter);



databaseConnection(() => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
