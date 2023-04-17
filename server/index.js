const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());

//any routes that begin with "/api/auth" should be handled by the userRoutes router
app.use("/api/auth", userRoutes);

mongoose
  //from .env
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database successfully connected!");
  })
  .catch((err) => {
    console.log(err.message);
  });

//start the server and listen for incoming request on port specified
const server = app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
