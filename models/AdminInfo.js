const mongoose = require("mongoose");

const AdminInfoSchema = mongoose.Schema({
  services: [
    {
      type: String,
      required: true,
    },
  ],
  website: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
});

const AdminInfo = mongoose.model("adminInfo", AdminInfoSchema);

module.exports = AdminInfo;
