// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const clientSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true },
//     phone: { type: String, required: true },
//     address: {
//       street: { type: String, default: "" },
//       city: { type: String, default: "" },
//       state: { type: String, default: "" },
//       postalCode: { type: String, default: "" },
//     },
//     profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
//     maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Other"], required: true },
//     verificationIdNo: { type: String, required: true, unique: true },
//     verificationIdDoc: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
//     preference: { type: String, enum: ["Student", "Working Professional"], required: true },
//     age: { type: Number, required: true, min: 18 },
//     gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
//     leaseDuration: { type: String, enum: ["1-3 months", "3-6 months", "6-12 months", "12+ months"], required: true },
//     budget: { type: Number, required: true },
//     preferredLocation: { type: String, required: true },
//     lifestyle: {
//       sleepSchedule: { type: String, enum: ["Early Bird", "Night Owl"], default: "Early Bird" },
//       cleanliness: { type: Number, min: 1, max: 5, default: 3 },
//       smoking: { type: Boolean, default: false },
//       pets: { type: Boolean, default: false },
//     },
//     role: { type: String, default: "client" },
//     termsAccepted: { type: Boolean, required: true },
//   },
//   { timestamps: true }
// );

// clientSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// clientSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// clientSchema.methods.generateToken = function () {
//   return jwt.sign(
//     { userId: this._id, role: this.role },
//     process.env.JWT_KEY,
//     { expiresIn: "24h" }
//   );
// };

// module.exports = mongoose.model("Client", clientSchema);

// models/client-model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const clientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },
    profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
    maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Other"], required: true },
    verificationIdNo: { type: String, required: true, unique: true },
    verificationIdDoc: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
    preference: { type: String, enum: ["Student", "Working Professional"], required: true },
    age: { type: Number, required: true, min: 18 },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    leaseDuration: { type: String, enum: ["1-3 months", "3-6 months", "6-12 months", "12+ months"], required: true },
    budget: { type: Number, required: true },
    preferredLocation: { type: String, required: true },
    lifestyle: {
      sleepSchedule: { type: String, enum: ["Early Bird", "Night Owl"], default: "Early Bird" },
      cleanliness: { type: Number, min: 1, max: 5, default: 3 },
      smoking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
    },
    role: { type: String, default: "client" },
    termsAccepted: { type: Boolean, required: true },
    // New fields for roommate finder
    lookingForRoommate: { type: Boolean, default: false },
    roommatePreferences: {
      minAge: { type: Number, min: 18 },
      maxAge: { type: Number },
      gender: { type: String, enum: ["Male", "Female", "Other", "No Preference"], default: "No Preference" },
      sleepSchedule: { type: String, enum: ["Early Bird", "Night Owl", "No Preference"], default: "No Preference" },
      cleanliness: { type: Number, min: 1, max: 5 },
      smoking: { type: Boolean },
      pets: { type: Boolean },
    },
    roommateRequests: [{
      requester: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
      status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
      requestedAt: { type: Date, default: Date.now },
    }],
    connectedRoommates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
  },
  { timestamps: true }
);

clientSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

clientSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

clientSchema.methods.generateToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  );
};

module.exports = mongoose.model("Client", clientSchema);