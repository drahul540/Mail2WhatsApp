const mongoose = require("mongoose");

const usersDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: false,
    },
    username: {
      type: String,
      require: false,
    },
    role: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: false,
    },
    wallet: {
      type: String,
      require: true,
    },
    status: {
      type: Number,
      require: true,
      default: 1
    }
  },
  { timestamps: true},
);

const UsersDataSchema = mongoose.model("users", usersDataSchema);

module.exports = UsersDataSchema;
