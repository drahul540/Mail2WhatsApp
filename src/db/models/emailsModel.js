const mongoose = require("mongoose");

const emailsSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      unique: true,
      require: true
    },
    metadata: {
      type: String,
      require: true,
    },
    from: {
      type: String,
      require: true,
    },
    subject: {
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

const EmailsSchema = mongoose.model("emails", emailsSchema);

module.exports = EmailsSchema;
