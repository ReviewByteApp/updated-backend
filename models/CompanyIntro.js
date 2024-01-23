const mongoose = require("mongoose");

const CompanyIntroSchema = mongoose.Schema({
  images: [
    {
      type: String,
      required: false,
    },
  ],
  video: {
    type: String,
    required: false,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
});

const CompanyIntro = mongoose.model("companyIntro", CompanyIntroSchema);

module.exports = CompanyIntro;
