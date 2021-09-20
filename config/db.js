require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = () => {
  // mongoose.connect(process.env.DATABASE_URL, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useCreateIndex: true,
  //   useFindAndModify: true,
  // });

  // const connection = mongoose.connection;

  // connection
  //   .once("open", () => {
  //     console.log("Database connected");
  //   })
  //   .catch((err) => {
  //     console.log("Connection to the database failed");
  //   });

  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MONGO Connected ");
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connectDB;
