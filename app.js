const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");
const User = require("./models/user");

const PORT = 4000;

mongoose
  .connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, authorization, Content-Type, Accept");
  next();
});
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));


app.listen(PORT, () => {
  console.log("Listening on Port " + PORT);
});
