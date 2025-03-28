const express = require("express");
const router = express.Router();
const {
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
  getRoommateRequests,
  updateProfile
} = require("../controllers/client-controller");
const { 
  getMessagesBetweenUsers,
  getConversations
} = require("../controllers/message-controllers");
const { authMiddleware, clientOnlyMiddleware, validate } = require("../middlewares/client-middleware"); // Updated imports
const { registerSchema, loginSchema } = require("../validators/client-validator");

router.post("/register", registerClient);
router.post("/verify-otp", verifyOTP);
router.post("/login", validate(loginSchema), loginClient);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, getProfile); // Use authMiddleware for shared access
router.get("/file/:fileId", authMiddleware, getFile); // Use authMiddleware for shared access
router.post("/send-request", clientOnlyMiddleware, sendConnectionRequest); 
router.get("/connected-landlords", clientOnlyMiddleware, getConnectedLandlords); 
// New roommate routes
router.get("/potential-roommates", clientOnlyMiddleware, getPotentialRoommates);
router.post("/send-roommate-request", clientOnlyMiddleware, sendRoommateRequest);
router.post("/handle-roommate-request", clientOnlyMiddleware, handleRoommateRequest);
router.get("/connected-roommates", clientOnlyMiddleware, getConnectedRoommates);
router.get("/roommate-requests", clientOnlyMiddleware, getRoommateRequests); // New route
router.put("/profile", clientOnlyMiddleware, updateProfile); // New route

// Add new message routes
router.get("/conversations", clientOnlyMiddleware, getConversations);
router.get("/messages/:userId1/:userId2", clientOnlyMiddleware, getMessagesBetweenUsers);


module.exports = router;