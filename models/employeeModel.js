const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  username: {
    type: String,
    required: [true, "Please enter your user name!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
  },
  role: {
    type: String,
    required: true,
    enum: ["Project Manager", "Team Leader", "General Worker"],
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: [true, "Admin id not added"],
  },
});

module.exports = mongoose.model("Employees", employeeSchema);
