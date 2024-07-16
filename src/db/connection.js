const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/node_web3_starter");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connection is open");
});
