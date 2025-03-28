// property-model.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
      required: [true, "Landlord reference is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    location: {
      address: { type: String, required: [true, "Address is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      zipCode: { type: String, required: [true, "Zip code is required"] },
      coordinates: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Condo", "Studio", "Villa"],
      required: [true, "Property type is required"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [1, "Must have at least 1 bedroom"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [1, "Must have at least 1 bathroom"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }],
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 5,
        message: "Must upload between 1 and 5 images",
      },
      required: [true, "At least one image is required"],
    },
    availableFrom: {
      type: Date,
      required: [true, "Availability date is required"],
    },
    status: {
      type: String,
      enum: ["Available", "Rented", "Pending"],
      default: "Available",
    },
    leaseDuration: {
      type: String,
      enum: ["1-3 months", "3-6 months", "6-12 months", "12+ months"],
      required: [true, "Lease duration is required"],
    },
    rules: {
      smoking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      alcohol: { type: Boolean, default: false },
      guests: { type: Boolean, default: true },
      additionalRules: { type: String, default: "" },
    },
    reviews: [
      {
        reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    additionalDetails: {
      furnished: { type: Boolean, default: false },
      utilitiesIncluded: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      squareFootage: { type: Number, min: 0, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);