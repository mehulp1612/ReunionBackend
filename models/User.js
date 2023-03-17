const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: String,
    name: String,
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;