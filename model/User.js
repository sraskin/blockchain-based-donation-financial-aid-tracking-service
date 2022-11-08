const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  nid: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  bc_entry_id: {
    type: Number,
    default: null,
    unique: true,
    required: false,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const User = Mongoose.model("user", UserSchema);

module.exports = User;
