require("dotenv").config();
require("express-async-errors");
// express
const express = require("express");
const app = express();
const cors = require("cors");

// file
const notFound = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");
// routers
const routerEmployees = require("./routes/employee");

// database
const connectDb = require("./db/connect");

// PORT Listening
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

app.use(cors());

app.use(express.static("public"));

// router

app.use("/api/v1/users", routerEmployees);

// middleware errors
app.use(notFound);
app.use(errorHandlerMiddleware);

// connect to server and database
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log("listening on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
