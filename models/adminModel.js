const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    unique: [true],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
});

module.exports = mongoose.model("Admin", adminSchema);
