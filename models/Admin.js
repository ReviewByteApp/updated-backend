const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  map: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
  },

  reviewCount: {
    type: Number,
  },
  reviewScore: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current timestamp
  },
  updatedAt: {
    type: Date,
    default: null, // Set the default value to null for the initial creation
  },
  website: {
    type: String,
  },
  logo: {
    type: String,
  },
  services: [
    {
      type: String,
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  video: {
    type: String,
  },
});

// Middleware to update `updatedAt` whenever a document is updated
adminSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
