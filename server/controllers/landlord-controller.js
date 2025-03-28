const Landlord = require("../models/landlord-model");
const Client = require("../models/client-model")
const Property = require("../models/property-model");
const ConnectionRequest = require("../models/connection-request-model");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFSBucket = require("mongodb").GridFSBucket;
const { Readable } = require("stream");
const { registerSchema, loginSchema } = require("../validators/landlord-valdator"); // Fixed typo
const { validate } = require("../middlewares/landlord-middleware");
const { sendEmail } = require("../utils/email");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: "verificationIdDoc", maxCount: 1 },
  { name: "proofOfOwnership", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerLandlord = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) return reject(new Error(`Multer error: ${err.message}`));
          if (err) return reject(new Error(`Upload error: ${err.message}`));
          resolve();
        });
      });
      next();
    } catch (error) {
      next(error);
    }
  },
  async (req, res, next) => {
    try {
      const parsedData = JSON.parse(req.body.data || "{}");
      req.body = parsedData;
      next();
    } catch (error) {
      next(new Error("Invalid JSON data format"));
    }
  },
  validate(registerSchema),
  async (req, res, next) => {
    try {
      const { email, verificationIdNo } = req.body;
      const existingLandlord = await Landlord.findOne({ $or: [{ email }, { verificationIdNo }] });
      if (existingLandlord) return res.status(400).json({ message: "Email or verification ID already registered" });

      if (!req.files || !req.files.verificationIdDoc || !req.files.proofOfOwnership || !req.files.profilePicture) {
        return res.status(400).json({ message: "Missing required files", details: "Verification ID, proof of ownership, and profile picture are required" });
      }

      const gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      const uploadFile = async (file) => {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${file.originalname}`);
        const bufferStream = Readable.from(file.buffer);
        await new Promise((resolve, reject) => {
          bufferStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
        });
        return uploadStream.id;
      };

      const verificationIdDocId = await uploadFile(req.files.verificationIdDoc[0]);
      const proofOfOwnershipId = await uploadFile(req.files.proofOfOwnership[0]);
      const profilePictureId = await uploadFile(req.files.profilePicture[0]);

      const otp = generateOTP();
      await sendEmail(email, "Verify Your Email", `Your OTP for RoomRentSync landlord registration is: ${otp}`);

      const tempLandlord = {
        ...req.body,
        verificationIdDoc: verificationIdDocId,
        proofOfOwnership: proofOfOwnershipId,
        profilePicture: profilePictureId,
        otp: { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 },
      };

      req.app.locals.tempLandlords = req.app.locals.tempLandlords || {};
      req.app.locals.tempLandlords[email] = tempLandlord;

      res.status(200).json({ message: "OTP sent to your email. Please verify." });
    } catch (error) {
      next(error);
    }
  },
];

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const tempLandlords = req.app.locals.tempLandlords || {};
    const tempLandlord = tempLandlords[email];
    if (!tempLandlord || tempLandlord.otp.code !== otp || Date.now() > tempLandlord.otp.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const landlord = new Landlord({ ...tempLandlord, isVerified: true });
    await landlord.save();
    const token = landlord.generateToken();

    delete req.app.locals.tempLandlords[email];
    res.status(201).json({ message: "Landlord registered successfully", token });
  } catch (error) {
    next(error);
  }
};

const loginLandlord = [
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const landlord = await Landlord.findOne({ email }).select("+password");
      if (!landlord || !(await landlord.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = landlord.generateToken();
      res.json({ message: "Login successful", token });
    } catch (error) {
      next(error);
    }
  },
];

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const landlord = await Landlord.findOne({ email });
    if (!landlord) return res.status(404).json({ message: "Email not found" });

    const otp = generateOTP();
    await sendEmail(email, "Password Reset OTP", `Your OTP to reset your RoomRentSync password is: ${otp}`);

    req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
    req.app.locals.resetOTPs[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    res.status(200).json({ message: "OTP sent to your email for password reset." });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "Email, OTP, and new password are required" });

    const resetOTPs = req.app.locals.resetOTPs || {};
    const resetData = resetOTPs[email];
    if (!resetData || resetData.otp !== otp || Date.now() > resetData.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const landlord = await Landlord.findOne({ email });
    if (!landlord) return res.status(404).json({ message: "Landlord not found" });

    landlord.password = newPassword;
    await landlord.save();

    delete req.app.locals.resetOTPs[email];
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const landlord = await Landlord.findById(req.user.userId).select("-password");
    if (!landlord) return res.status(404).json({ message: "Landlord not found" });

    const properties = await Property.find({ landlord: req.user.userId });
    res.json({ ...landlord.toObject(), properties });
  } catch (error) {
    next(error);
  }
};

const getFile = async (req, res, next) => {
  try {
    const gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const file = await gfs.find({ _id: fileId }).toArray();

    if (!file || file.length === 0) return res.status(404).json({ message: "File not found" });

    res.set("Content-Type", file[0].contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${file[0].filename}"`);
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    next(error);
  }
};

const createProperty = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) return reject(new Error(`Multer error: ${err.message}`));
          if (err) return reject(new Error(`Upload error: ${err.message}`));
          resolve();
        });
      });
      next();
    } catch (error) {
      next(error);
    }
  },
  async (req, res, next) => {
    try {
      const parsedData = JSON.parse(req.body.data || "{}");
      req.body = parsedData;
      next();
    } catch (error) {
      next(new Error("Invalid JSON data format"));
    }
  },
  async (req, res, next) => {
    try {
      const { title, description, location, price, propertyType, bedrooms, bathrooms, availableFrom, leaseDuration } = req.body;

      if (!req.files || !req.files.images || req.files.images.length < 1 || req.files.images.length > 5) {
        return res.status(400).json({ message: "Please upload between 1 and 5 images" });
      }

      const gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      const imageIds = await Promise.all(
        req.files.images.map(async (file) => {
          const uploadStream = gfs.openUploadStream(`${Date.now()}-${file.originalname}`);
          const bufferStream = Readable.from(file.buffer);
          await new Promise((resolve, reject) => {
            bufferStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
          });
          return uploadStream.id;
        })
      );

      const property = new Property({
        landlord: req.user.userId,
        title,
        description,
        location,
        price,
        propertyType,
        bedrooms,
        bathrooms,
        amenities: req.body.amenities || [],
        images: imageIds,
        availableFrom,
        leaseDuration,
        rules: req.body.rules || {},
        additionalDetails: req.body.additionalDetails || {},
      });

      await property.save();
      res.status(201).json({ message: "Property created successfully", property });
    } catch (error) {
      next(error);
    }
  },
];

const getAllProperties = async (req, res, next) => {
    try {
      const properties = await Property.find().populate("landlord", "fullName email phone"); // Optionally populate landlord details
      res.json(properties);
    } catch (error) {
      next(error);
    }
  };

  const getPropertyById = async (req, res, next) => {
    try {
      const { propertyId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
  
      const property = await Property.findById(propertyId).populate("landlord", "fullName email phone profilePicture");
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
  
      res.json(property);
    } catch (error) {
      next(error);
    }
  };

  const getLandlordById = async (req, res, next) => {
    try {
      const { landlordId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(landlordId)) {
        return res.status(400).json({ message: "Invalid landlord ID" });
      }
  
      const landlord = await Landlord.findById(landlordId).select("-password"); // Exclude password, include all else
      if (!landlord) {
        return res.status(404).json({ message: "Landlord not found" });
      }
  
      const properties = await Property.find({ landlord: landlordId });
      res.json({ ...landlord.toObject(), properties });
    } catch (error) {
      next(error);
    }
  };

  const getPendingRequests = async (req, res, next) => {
    try {
      const landlordId = req.user.userId;
      const requests = await ConnectionRequest.find({ landlord: landlordId, status: "Pending" })
        .populate("client", "fullName email phone profilePicture age gender preference")
        .populate("property", "title location price");
      res.json(requests);
    } catch (error) {
      next(error);
    }
  };
  
  const respondToConnectionRequest = async (req, res, next) => {
    try {
      const { requestId, status } = req.body;
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }
      if (!["Accepted", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Status must be 'Accepted' or 'Rejected'" });
      }
  
      const request = await ConnectionRequest.findOne({ _id: requestId, landlord: req.user.userId });
      if (!request) {
        return res.status(404).json({ message: "Request not found or not authorized" });
      }
  
      request.status = status;
      await request.save();
  
      // Optionally notify the client via email
      const client = await Client.findById(request.client);
      const property = await Property.findById(request.property);
      await sendEmail(
        client.email,
        `Connection Request ${status}`,
        `Your connection request for "${property.title}" has been ${status.toLowerCase()} by ${req.user.fullName}.`
      );
  
      res.json({ message: `Request ${status.toLowerCase()} successfully`, request });
    } catch (error) {
      next(error);
    }
  };

  const getConnectedClients = async (req, res, next) => {
    try {
      const landlordId = req.user.userId;
      const connectedRequests = await ConnectionRequest.find({ landlord: landlordId, status: "Accepted" })
        .populate("client", "fullName email phone profilePicture age gender preference")
        .populate("property", "title location price");
      res.json(connectedRequests);
    } catch (error) {
      next(error);
    }
  };
module.exports = {
  registerLandlord,
  verifyOTP,
  loginLandlord,
  forgotPassword,
  resetPassword,
  getProfile,
  getFile,
  getAllProperties,
  createProperty,
  getPropertyById,
  getLandlordById,
  getPendingRequests,
  respondToConnectionRequest,
  getConnectedClients
};