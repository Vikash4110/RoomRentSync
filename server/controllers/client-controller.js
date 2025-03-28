const Landlord = require("../models/landlord-model");
const Client = require("../models/client-model");
const Property = require("../models/property-model"); 
const ConnectionRequest = require("../models/connection-request-model"); 
const mongoose = require("mongoose");
const multer = require("multer");
const GridFSBucket = require("mongodb").GridFSBucket;
const { Readable } = require("stream");
const { registerSchema } = require("../validators/client-validator");
const { validate } = require("../middlewares/client-middleware");
const { sendEmail } = require("../utils/email");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "verificationIdDoc", maxCount: 1 },
]);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerClient = [
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
      // Parse JSON data from the 'data' field
      const parsedData = JSON.parse(req.body.data || "{}");
      req.body = parsedData; // Replace req.body with parsed data
      next();
    } catch (error) {
      next(new Error("Invalid JSON data format"));
    }
  },
  validate(registerSchema),
  async (req, res, next) => {
    try {
      console.log("Request Body:", req.body);
      console.log("Request Files:", req.files);
      const { email, verificationIdNo } = req.body;

      const existingClient = await Client.findOne({ $or: [{ email }, { verificationIdNo }] });
      if (existingClient) {
        return res.status(400).json({ message: "Email or verification ID already registered" });
      }

      const gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      let profilePictureId = null;
      let verificationIdDocId = null;

      if (req.files?.profilePicture) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.files.profilePicture[0].originalname}`);
        const bufferStream = Readable.from(req.files.profilePicture[0].buffer);
        profilePictureId = uploadStream.id;
        await new Promise((resolve, reject) => {
          bufferStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
        });
      }

      if (req.files?.verificationIdDoc) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.files.verificationIdDoc[0].originalname}`);
        const bufferStream = Readable.from(req.files.verificationIdDoc[0].buffer);
        verificationIdDocId = uploadStream.id;
        await new Promise((resolve, reject) => {
          bufferStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
        });
      }

      const otp = generateOTP();
      await sendEmail(email, "Verify Your Email", `Your OTP for RoomRentSync registration is: ${otp}`);

      const tempClient = {
        ...req.body,
        profilePicture: profilePictureId,
        verificationIdDoc: verificationIdDocId,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };

      req.app.locals.tempClients = req.app.locals.tempClients || {};
      req.app.locals.tempClients[email] = tempClient;

      console.log("Registration OTP Sent:", { email, otp });
      res.status(200).json({ message: "OTP sent to your email. Please verify." });
    } catch (error) {
      next(error);
    }
  },
];

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const tempClients = req.app.locals.tempClients || {};
    const tempClient = tempClients[email];

    if (!tempClient || tempClient.otp !== otp || Date.now() > tempClient.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const client = new Client({
      fullName: tempClient.fullName,
      email: tempClient.email,
      password: tempClient.password,
      phone: tempClient.phone,
      address: tempClient.address,
      profilePicture: tempClient.profilePicture,
      maritalStatus: tempClient.maritalStatus,
      verificationIdNo: tempClient.verificationIdNo,
      verificationIdDoc: tempClient.verificationIdDoc,
      preference: tempClient.preference,
      age: tempClient.age,
      gender: tempClient.gender,
      leaseDuration: tempClient.leaseDuration,
      budget: tempClient.budget,
      preferredLocation: tempClient.preferredLocation,
      lifestyle: tempClient.lifestyle,
      termsAccepted: tempClient.termsAccepted,
    });
    await client.save();
    const token = client.generateToken();

    delete req.app.locals.tempClients[email];
    res.status(201).json({ message: "Client registered successfully", token });
  } catch (error) {
    next(error);
  }
};

// Rest of the controller remains unchanged
const loginClient = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (!client || !(await client.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = client.generateToken();
    res.json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = generateOTP();
    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP to reset your RoomRentSync password is: ${otp}`
    );

    req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
    req.app.locals.resetOTPs[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res.status(200).json({ message: "OTP sent to your email for password reset." });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const resetOTPs = req.app.locals.resetOTPs || {};
    const resetData = resetOTPs[email];

    if (!resetData || resetData.otp !== otp || Date.now() > resetData.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.password = newPassword;
    await client.save();

    delete req.app.locals.resetOTPs[email];
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const client = await Client.findById(req.user.userId).select("-password");
    if (!client) {
      const error = new Error("Client not found");
      error.status = 404;
      throw error;
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

const getFile = async (req, res, next) => {
  try {
    const gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const file = await gfs.find({ _id: fileId }).toArray();

    if (!file || file.length === 0) {
      const error = new Error("File not found");
      error.status = 404;
      throw error;
    }

    res.set("Content-Type", file[0].contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${file[0].filename}"`);
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    next(error);
  }
};

const sendConnectionRequest = async (req, res, next) => {
    try {
      const { landlordId, propertyId, message } = req.body;
      const clientId = req.user.userId;
  
      if (!mongoose.Types.ObjectId.isValid(landlordId) || !mongoose.Types.ObjectId.isValid(propertyId)) {
        return res.status(400).json({ message: "Invalid landlord or property ID" });
      }
  
      // Check if a request already exists
      const existingRequest = await ConnectionRequest.findOne({
        client: clientId,
        landlord: landlordId,
        property: propertyId,
        status: "Pending",
      });
      if (existingRequest) {
        return res.status(400).json({ message: "Connection request already sent" });
      }
  
      const request = new ConnectionRequest({
        client: clientId,
        landlord: landlordId,
        property: propertyId,
        message: message || "I am interested in renting this property.",
      });
      await request.save();
  
      // Notify the landlord via email
      const landlord = await Landlord.findById(landlordId);
      const property = await Property.findById(propertyId); // Fetch property for title
      if (!landlord || !property) {
        return res.status(404).json({ message: "Landlord or property not found" });
      }
  
      await sendEmail(
        landlord.email,
        "New Connection Request",
        `You have received a connection request from ${req.user.fullName} for your property "${property.title}". Log in to review and respond.`
      );
  
      res.status(201).json({ message: "Connection request sent successfully", request });
    } catch (error) {
      next(error);
    }
  };

  const getConnectedLandlords = async (req, res, next) => {
    try {
      const clientId = req.user.userId;
  
      const connectionRequests = await ConnectionRequest.find({
        client: clientId,
        status: "Accepted",
      })
        .populate({
          path: "landlord",
          select: "fullName email phone profilePicture",
        })
        .populate({
          path: "property",
          select: "title location price images",
        });
  
      if (!connectionRequests.length) {
        return res.status(200).json({ message: "No connected landlords yet.", landlords: [] });
      }
  
      const connectedLandlords = connectionRequests.map((request) => {
        // Format location as a string if it's an object
        let locationString = "N/A";
        if (request.property.location) {
          if (typeof request.property.location === "object") {
            const { address, city, state, zipCode } = request.property.location;
            locationString = `${address || ""}, ${city || ""}, ${state || ""} ${zipCode || ""}`.trim();
          } else {
            locationString = request.property.location;
          }
        }
  
        return {
          landlordId: request.landlord._id,
          fullName: request.landlord.fullName,
          email: request.landlord.email,
          phone: request.landlord.phone || "N/A",
          profilePicture: request.landlord.profilePicture
            ? `/api/clients/file/${request.landlord.profilePicture}`
            : null,
          property: {
            id: request.property._id,
            title: request.property.title,
            location: locationString, // Use formatted string
            price: request.property.price,
            image: request.property.images && request.property.images.length > 0
              ? `/api/clients/file/${request.property.images[0]}`
              : null,
          },
          connectedOn: request.updatedAt,
        };
      });
  
      res.status(200).json({
        message: "Connected landlords retrieved successfully",
        landlords: connectedLandlords,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get potential roommates (Tinder-like swipe candidates)
const getPotentialRoommates = async (req, res, next) => {
    try {
      const clientId = req.user.userId;
      const currentClient = await Client.findById(clientId);
  
      if (!currentClient.lookingForRoommate) {
        return res.status(400).json({ message: "Enable 'Looking for Roommate' in your profile first" });
      }
  
      const potentialRoommates = await Client.find({
        _id: { $ne: clientId },
        lookingForRoommate: true,
        "roommateRequests.requester": { $ne: clientId }, // Exclude already requested
        connectedRoommates: { $ne: clientId }, // Exclude already connected
      }).select("fullName age gender lifestyle profilePicture preferredLocation budget leaseDuration");
  
      res.status(200).json({
        message: "Potential roommates retrieved successfully",
        roommates: potentialRoommates,
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Send roommate request
  const sendRoommateRequest = async (req, res, next) => {
    try {
      const { roommateId } = req.body;
      const clientId = req.user.userId;
  
      if (!mongoose.Types.ObjectId.isValid(roommateId)) {
        return res.status(400).json({ message: "Invalid roommate ID" });
      }
  
      const targetClient = await Client.findById(roommateId);
      if (!targetClient || !targetClient.lookingForRoommate) {
        return res.status(404).json({ message: "Roommate not found or not looking" });
      }
  
      const existingRequest = targetClient.roommateRequests.find(
        (req) => req.requester.toString() === clientId && req.status === "Pending"
      );
      if (existingRequest) {
        return res.status(400).json({ message: "Request already sent" });
      }
  
      targetClient.roommateRequests.push({ requester: clientId });
      await targetClient.save();
  
      await sendEmail(
        targetClient.email,
        "New Roommate Request",
        `You have received a roommate request from ${req.user.fullName}. Log in to review and respond.`
      );
  
      res.status(201).json({ message: "Roommate request sent successfully" });
    } catch (error) {
      next(error);
    }
  };
  
  // Handle roommate request (accept/reject)
  const handleRoommateRequest = async (req, res, next) => {
    try {
      const { requesterId, action } = req.body; // action: "accept" or "reject"
      const clientId = req.user.userId;
  
      if (!mongoose.Types.ObjectId.isValid(requesterId)) {
        return res.status(400).json({ message: "Invalid requester ID" });
      }
  
      const client = await Client.findById(clientId);
      const request = client.roommateRequests.find(
        (req) => req.requester.toString() === requesterId && req.status === "Pending"
      );
  
      if (!request) {
        return res.status(404).json({ message: "Request not found or already handled" });
      }
  
      request.status = action === "accept" ? "Accepted" : "Rejected";
      if (action === "accept") {
        client.connectedRoommates.push(requesterId);
        const requester = await Client.findById(requesterId);
        requester.connectedRoommates.push(clientId);
        await requester.save();
      }
      await client.save();
  
      const requester = await Client.findById(requesterId);
      await sendEmail(
        requester.email,
        `Roommate Request ${action === "accept" ? "Accepted" : "Rejected"}`,
        `${client.fullName} has ${action === "accept" ? "accepted" : "rejected"} your roommate request.`
      );
  
      res.status(200).json({ message: `Roommate request ${action}ed successfully` });
    } catch (error) {
      next(error);
    }
  };
  
  // Get connected roommates
  const getConnectedRoommates = async (req, res, next) => {
    try {
      const clientId = req.user.userId;
      const client = await Client.findById(clientId).populate(
        "connectedRoommates",
        "fullName email phone profilePicture lifestyle"
      );
  
      res.status(200).json({
        message: "Connected roommates retrieved successfully",
        roommates: client.connectedRoommates,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateProfile = async (req, res, next) => {
    try {
      const clientId = req.user.userId;
      const { lookingForRoommate, roommatePreferences } = req.body;
  
      const updateData = {};
      if (typeof lookingForRoommate !== "undefined") updateData.lookingForRoommate = lookingForRoommate;
      if (roommatePreferences) updateData.roommatePreferences = roommatePreferences;
  
      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");
  
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
  
      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedClient,
      });
    } catch (error) {
      next(error);
    }
  };

  // New endpoint to get pending roommate requests
const getRoommateRequests = async (req, res, next) => {
    try {
      const clientId = req.user.userId;
      const client = await Client.findById(clientId)
        .populate("roommateRequests.requester", "fullName email profilePicture age gender lifestyle preferredLocation budget leaseDuration")
        .select("roommateRequests");
  
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
  
      const pendingRequests = client.roommateRequests.filter((req) => req.status === "Pending");
  
      res.status(200).json({
        message: "Pending roommate requests retrieved successfully",
        requests: pendingRequests,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  registerClient,
  verifyOTP,
  loginClient,
  forgotPassword,
  resetPassword,
  getProfile,
  getFile,
  sendConnectionRequest,
  getConnectedLandlords,
  getPotentialRoommates,
  sendRoommateRequest,
  handleRoommateRequest,
  getConnectedRoommates,
  updateProfile, 
  getRoommateRequests
};