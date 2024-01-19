const mongoose = require("mongoose");

const AdminContactSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  map: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
});

const AdminContact = mongoose.model("adminContact", AdminContactSchema);

module.exports = AdminContact;
