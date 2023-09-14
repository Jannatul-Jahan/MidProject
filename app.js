const express = require("express");
const cors = require("cors");
const app = express();
const BookRouter = require("./routes/Book.js");
// const AuthRouter = require("./routes/Auth");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json()); 
app.use(express.text()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/books", BookRouter);
// app.use("/users", UserRouter);
// app.use("/users", AuthRouter);


databaseConnection(() => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
