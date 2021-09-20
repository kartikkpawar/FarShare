const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

connectDB();
// Template engine

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
// Routes
app.use("/api", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.listen(PORT, () => {
  console.log("Server up and running on port", PORT);
});
