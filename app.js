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
const HTTP_STATUS = require("./constants/statusCodes");
const { success, failure } = require("./util/common");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

dotenv.config();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const logFormat = ':method :url :status :res[content-length] - :response-time ms :error';


function customLogger(tokens, req, res) {
  const errorMessage = req.error ? ` - ${req.error}` : '';
  return `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} ${tokens.res(req, res, 'content-length')}${errorMessage} - ${tokens['response-time'](req, res)} ms`;
}


app.use(morgan(customLogger, { stream: accessLogStream }));

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid JSON file"));
  }
  next();
});


app.use("/books", BookRouter);
app.use("/users", UserRouter);
app.use("/users", AuthRouter);
app.use("/cart", CartRouter);
app.use("/discounts", DiscountRouter);
app.use("/transactions", TransactionRouter);
app.use("/reviews", ReviewRouter);
app.use("/balance", BalanceRouter);

app.all('*', (req, res) => {
  return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Route not found"));
});



app.use((err, req, res, next) => {
  req.error = err.message;
  next(err);
});


app.use((err, req, res, next) => {
  console.error(err);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure({ error: req.error }));
});

databaseConnection(() => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
