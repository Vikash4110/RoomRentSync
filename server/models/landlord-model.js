// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const landlordSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: [true, "Full name is required"],
//       trim: true,
//       maxlength: [50, "Name cannot exceed 50 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
//     },
//     age: {
//       type: Number,
//       required: [true, "Age is required"],
//       min: [18, "Must be at least 18 years old"],
//       max: [120, "Age seems invalid"],
//     },
//     maritalStatus: {
//       type: String,
//       enum: ["Single", "Married", "Divorced", "Widowed", "Other"],
//       required: [true, "Marital status is required"],
//     },
//     phone: {
//       type: String,
//       required: [true, "Phone number is required"],
//       trim: true,
//       match: [/^\d{10,15}$/, "Phone number must be 10-15 digits"],
//     },
//     gender: {
//       type: String,
//       enum: ["Male", "Female", "Other"],
//       required: [true, "Gender is required"],
//     },
//     address: {
//       street: { type: String, default: "" },
//       city: { type: String, default: "" },
//       state: { type: String, default: "" },
//       postalCode: { type: String, default: "" },
//       country: { type: String, default: "USA" },
//     },
//     verificationIdNo: {
//       type: String,
//       required: [true, "Verification ID number is required"],
//       unique: true,
//       trim: true,
//       minlength: [5, "Verification ID must be at least 5 characters"],
//       maxlength: [20, "Verification ID cannot exceed 20 characters"],
//     },
//     verificationIdDoc: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "uploads.files",
//     },
//     proofOfOwnership: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "uploads.files",
//       required: [true, "Proof of ownership is required"],
//     },
//     profilePicture: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "uploads.files",
//     }, // Added profile picture
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [8, "Password must be at least 8 characters"],
//       select: false,
//     },
//     role: {
//       type: String,
//       default: "landlord",
//       enum: ["landlord", "admin"],
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     otp: {
//       code: { type: String },
//       expiresAt: { type: Date },
//     },
//     termsAccepted: {
//       type: Boolean,
//       required: [true, "You must accept the terms"],
//     },
//     properties: [
//       {
//         title: { type: String, required: true },
//         description: { type: String, required: true },
//         location: {
//           street: { type: String, required: true },
//           city: { type: String, required: true },
//           state: { type: String, required: true },
//           postalCode: { type: String, required: true },
//           country: { type: String, default: "USA" },
//         },
//         rent: { type: Number, required: true, min: [1, "Rent must be a positive number"] },
//         availableFrom: { type: Date, required: true },
//         leaseDuration: {
//           type: String,
//           enum: ["1-3 months", "3-6 months", "6-12 months", "12+ months"],
//           required: true,
//         },
//         propertyType: {
//           type: String,
//           enum: ["Apartment", "House", "Room", "Studio"],
//           required: true,
//         },
//         bedrooms: { type: Number, min: 1, required: true },
//         bathrooms: { type: Number, min: 1, required: true },
//         furnished: { type: Boolean, default: false },
//         utilitiesIncluded: { type: Boolean, default: false },
//         images: [{ type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }],
//       },
//     ],
//     preferredTenantType: {
//       type: String,
//       enum: ["Student", "Working Professional", "Family", "Any"],
//       required: [true, "Preferred tenant type is required"],
//     },
//     communicationPreference: {
//       type: String,
//       enum: ["Email", "Phone", "Both"],
//       default: "Email",
//     },
//     verificationStatus: {
//       type: String,
//       enum: ["Pending", "Verified", "Rejected"],
//       default: "Pending",
//     },
//     rating: {
//       type: Number,
//       min: 0,
//       max: 5,
//       default: 0,
//     },
//     reviews: [
//       {
//         reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
//         rating: { type: Number, min: 1, max: 5, required: true },
//         comment: { type: String },
//         date: { type: Date, default: Date.now },
//       },
//     ],
//     availabilitySchedule: {
//       type: String,
//       default: "Flexible",
//     },
//     emergencyContact: {
//       name: { type: String },
//       phone: { type: String, match: [/^\d{10,15}$/, "Phone number must be 10-15 digits"] },
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Active", "Suspended"],
//       default: "Pending",
//     },
//   },
//   { timestamps: true }
// );

// landlordSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// landlordSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// landlordSchema.methods.generateToken = function () {
//   return jwt.sign({ userId: this._id, role: this.role }, process.env.JWT_KEY, { expiresIn: "24h" });
// };

// module.exports = mongoose.model("Landlord", landlordSchema);

// landlord-model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const landlordSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Must be at least 18 years old"],
      max: [120, "Age seems invalid"],
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed", "Other"],
      required: [true, "Marital status is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{10,15}$/, "Phone number must be 10-15 digits"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "USA" },
    },
    verificationIdNo: {
      type: String,
      required: [true, "Verification ID number is required"],
      unique: true,
      trim: true,
      minlength: [5, "Verification ID must be at least 5 characters"],
      maxlength: [20, "Verification ID cannot exceed 20 characters"],
    },
    verificationIdDoc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uploads.files",
    },
    proofOfOwnership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uploads.files",
      required: [true, "Proof of ownership is required"],
    },
    profilePicture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uploads.files",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      default: "landlord",
      enum: ["landlord", "admin"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
    termsAccepted: {
      type: Boolean,
      required: [true, "You must accept the terms"],
    },
    communicationPreference: {
      type: String,
      enum: ["Email", "Phone", "Both"],
      default: "Email",
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Suspended"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

landlordSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

landlordSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

landlordSchema.methods.generateToken = function () {
  return jwt.sign({ userId: this._id, role: this.role }, process.env.JWT_KEY, { expiresIn: "24h" });
};

module.exports = mongoose.model("Landlord", landlordSchema);