const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database successfully connected!");
  })
  .catch((err) => {
    console.log(err.message);
  });

//create a server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
