const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const router = require('./routes');
dotenv.config();

const databaseConnection = require("./dbConnection");
const morgan = require("morgan");

const PORT = 5000;
const app = express();
app.use(morgan('dev'));

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

databaseConnection();

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});

module.exports = app;