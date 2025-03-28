// const express = require("express");
// const router = express.Router();
// const {
//   registerLandlord,
//   verifyOTP,
//   loginLandlord,
//   forgotPassword,
//   resetPassword,
//   getProfile,
//   getFile,
//   createProperty,
// } = require("../controllers/landlord-controller");
// const { landlordMiddleware, validate } = require("../middlewares/landlord-middleware");
// const { clientMiddleware } = require("../middlewares/client-middleware");
// const { loginSchema } = require("../validators/landlord-valdator");
// router.post("/register", registerLandlord);
// router.post("/verify-otp", verifyOTP);
// router.post("/login", validate(loginSchema), loginLandlord);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
// router.get("/profile", landlordMiddleware, getProfile);
// router.get("/file/:fileId", landlordMiddleware, getFile);
// router.post("/create-property", landlordMiddleware, createProperty);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  registerLandlord,
  verifyOTP,
  loginLandlord,
  forgotPassword,
  resetPassword,
  getProfile,
  getFile,
  getAllProperties,
  getPropertyById,
  getLandlordById,
  createProperty,
  getConnectedClients,
  respondToConnectionRequest,
  getPendingRequests
} = require("../controllers/landlord-controller");
const { authMiddleware, landlordOnlyMiddleware, validate } = require("../middlewares/landlord-middleware");
const { loginSchema } = require("../validators/landlord-valdator");

router.post("/register", registerLandlord);
router.post("/verify-otp", verifyOTP);
router.post("/login", validate(loginSchema), loginLandlord);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, getProfile); // Accessible to both clients and landlords
router.get("/file/:fileId", authMiddleware, getFile); // Accessible to both clients and landlords
router.post("/create-property", landlordOnlyMiddleware, createProperty); 
router.get("/properties", authMiddleware, getAllProperties); // New route for all properties
router.get("/properties/:propertyId", authMiddleware, getPropertyById); // New route for single property
router.get("/landlord/:landlordId", authMiddleware, getLandlordById); // New route for landlord profile
router.get("/pending-requests", landlordOnlyMiddleware, getPendingRequests); // New route
router.post("/respond-request", landlordOnlyMiddleware, respondToConnectionRequest); // New route
router.get("/connected-clients", landlordOnlyMiddleware, getConnectedClients);
module.exports = router;
