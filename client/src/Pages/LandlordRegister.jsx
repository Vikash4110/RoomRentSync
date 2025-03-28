// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faEnvelope,
//   faLock,
//   faPhone,
//   faHome,
//   faVenusMars,
//   faMoneyBill,
//   faMapMarkerAlt,
//   faKey,
//   faFileUpload,
//   faUserCircle, // Added for profile picture
// } from "@fortawesome/free-solid-svg-icons";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../Store/auth.jsx";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const LandlordRegister = () => {
//   const navigate = useNavigate();
//   const { storeTokenInLS } = useAuth();
//   const [landlord, setLandlord] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     phone: "",
//     address: { street: "", city: "", state: "", postalCode: "", country: "USA" },
//     maritalStatus: "",
//     verificationIdNo: "",
//     age: "",
//     gender: "",
//     preferredTenantType: "",
//     leaseDuration: "",
//     budget: "",
//     preferredLocation: "",
//     termsAccepted: false,
//   });
//   const [verificationIdDoc, setVerificationIdDoc] = useState(null);
//   const [proofOfOwnership, setProofOfOwnership] = useState(null);
//   const [profilePicture, setProfilePicture] = useState(null); // Added profile picture state
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const handleInput = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name.includes("address.")) {
//       const field = name.split(".")[1];
//       setLandlord((prev) => ({
//         ...prev,
//         address: { ...prev.address, [field]: value },
//       }));
//     } else {
//       setLandlord((prev) => ({
//         ...prev,
//         [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
//       }));
//     }
//   };

//   const handleFileChange = (e, setFile) => {
//     const file = e.target.files[0];
//     if (file && file.size > 5 * 1024 * 1024) {
//       toast.error("File Too Large", { description: "File size must be less than 5MB." });
//       return;
//     }
//     setFile(file);
//     const fileName = file?.name;
//     if (fileName) {
//       const fileDisplay = document.getElementById(`${e.target.name}-display`);
//       if (fileDisplay) {
//         fileDisplay.textContent = fileName;
//         fileDisplay.classList.remove("hidden");
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!landlord.termsAccepted) {
//       toast.error("Terms Not Accepted", { description: "Please accept the terms and conditions to proceed." });
//       return;
//     }
//     if (landlord.phone.length < 10 || !/^\d+$/.test(landlord.phone)) {
//       toast.error("Invalid Phone Number", { description: "Phone number must be at least 10 digits and contain only numbers." });
//       return;
//     }
//     if (!verificationIdDoc || !proofOfOwnership || !profilePicture) {
//       toast.error("Documents Required", {
//         description: "Please upload verification ID, proof of ownership, and profile picture.",
//       });
//       return;
//     }
//     if (!landlord.preferredLocation || !landlord.budget || !landlord.leaseDuration || !landlord.preferredTenantType) {
//       toast.error("Missing Required Fields", {
//         description: "Please fill in all required fields: Preferred Location, Budget, Lease Duration, and Preferred Tenant Type.",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       const updatedLandlord = {
//         ...landlord,
//         age: Number(landlord.age),
//         budget: Number(landlord.budget),
//         termsAccepted: Boolean(landlord.termsAccepted),
//       };

//       formData.append("data", JSON.stringify(updatedLandlord));
//       formData.append("verificationIdDoc", verificationIdDoc);
//       formData.append("proofOfOwnership", proofOfOwnership);
//       formData.append("profilePicture", profilePicture); // Added profile picture

//       const response = await fetch(`${backendUrl}/api/landlords/register`, {
//         method: "POST",
//         body: formData,
//       });

//       const resData = await response.json();

//       if (!response.ok) {
//         if (response.status === 400) {
//           if (resData.message === "Email or verification ID already registered") {
//             toast.error("Registration Failed", { description: "This email or verification ID is already registered." });
//           } else if (resData.message === "Missing required files") {
//             toast.error("Missing Files", { description: resData.details });
//           } else {
//             toast.error("Registration Failed", { description: resData.message || "An unexpected error occurred." });
//           }
//         } else if (response.status === 422) {
//           toast.error("Validation Error", { description: resData.extraDetails || "Please check your input." });
//         } else {
//           toast.error("Server Error", { description: "An unexpected error occurred. Please try again later." });
//         }
//         throw new Error(resData.message || "Registration failed");
//       }

//       toast.success("OTP Sent", { description: "An OTP has been sent to your email. Please verify it." });
//       setStep(6);
//     } catch (error) {
//       console.error("Registration error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     if (!otp) {
//       toast.error("OTP Required", { description: "Please enter the OTP sent to your email." });
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${backendUrl}/api/landlords/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: landlord.email, otp }),
//       });
//       const resData = await response.json();

//       if (!response.ok) {
//         if (resData.message === "Invalid or expired OTP") {
//           toast.error("Invalid OTP", { description: "The OTP is incorrect or has expired." });
//         } else if (resData.message === "Email and OTP are required") {
//           toast.error("Input Error", { description: "Please provide both email and OTP." });
//         } else {
//           toast.error("OTP Verification Failed", { description: resData.message || "An unexpected error occurred." });
//         }
//         throw new Error(resData.message || "OTP verification failed");
//       }

//       storeTokenInLS(resData.token);
//       toast.success("Registration Successful", { description: "Welcome! Redirecting to your dashboard..." });
//       setTimeout(() => navigate("/landlord-dashboard"), 1500);
//     } catch (error) {
//       console.error("OTP verification error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const bgVariants = {
//     animate: {
//       backgroundPosition: ["0% 0%", "100% 100%"],
//       transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
//     },
//   };

//   const stepVariants = {
//     hidden: { opacity: 0, x: -50 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
//     exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
//   };

//   return (
//     <motion.div
//       className="min-h-screen bg-gradient-to-br from-gray-100 via-teal-50 to-teal-100 flex items-center justify-center p-6 overflow-hidden"
//       variants={bgVariants}
//       animate="animate"
//       style={{ backgroundSize: "200% 200%" }}
//     >
//       <motion.div
//         className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8"
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         <motion.h1
//           className="text-3xl font-bold text-gray-800 text-center mb-6"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           Landlord Registration
//         </motion.h1>

//         <motion.div
//           className="mb-6 flex justify-center gap-3"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//         >
//           {step <= 6 && [1, 2, 3, 4, 5, 6].map((s) => (
//             <motion.div
//               key={s}
//               className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                 step >= s ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"
//               }`}
//               whileHover={{ scale: 1.1 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             >
//               {s}
//             </motion.div>
//           ))}
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {step === 1 && (
//             <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
//               <InputField
//                 icon={faUser}
//                 type="text"
//                 name="fullName"
//                 value={landlord.fullName}
//                 onChange={handleInput}
//                 placeholder="Full Name"
//                 required
//               />
//               <InputField
//                 icon={faEnvelope}
//                 type="email"
//                 name="email"
//                 value={landlord.email}
//                 onChange={handleInput}
//                 placeholder="Email"
//                 required
//               />
//               <InputField
//                 icon={faLock}
//                 type="password"
//                 name="password"
//                 value={landlord.password}
//                 onChange={handleInput}
//                 placeholder="Password"
//                 required
//               />
//               <InputField
//                 icon={faPhone}
//                 type="text"
//                 name="phone"
//                 value={landlord.phone}
//                 onChange={handleInput}
//                 placeholder="Phone Number"
//                 required
//               />
//               <div className="flex justify-between gap-4 mt-6">
//                 <motion.button
//                   type="button"
//                   onClick={() => navigate("/")}
//                   className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Cancel
//                 </motion.button>
//                 <motion.button
//                   type="button"
//                   onClick={() => setStep(2)}
//                   className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Next
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}

//           {step === 2 && (
//             <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
//               <InputField
//                 icon={faHome}
//                 type="text"
//                 name="address.street"
//                 value={landlord.address.street}
//                 onChange={handleInput}
//                 placeholder="Street"
//               />
//               <InputField
//                 icon={faHome}
//                 type="text"
//                 name="address.city"
//                 value={landlord.address.city}
//                 onChange={handleInput}
//                 placeholder="City"
//               />
//               <InputField
//                 icon={faHome}
//                 type="text"
//                 name="address.state"
//                 value={landlord.address.state}
//                 onChange={handleInput}
//                 placeholder="State"
//               />
//               <InputField
//                 icon={faHome}
//                 type="text"
//                 name="address.postalCode"
//                 value={landlord.address.postalCode}
//                 onChange={handleInput}
//                 placeholder="Postal Code"
//               />
//               <div className="flex justify-between gap-4 mt-6">
//                 <motion.button
//                   type="button"
//                   onClick={() => setStep(1)}
//                   className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Back
//                 </motion.button>
//                 <motion.button
//                   type="button"
//                   onClick={() => setStep(3)}
//                   className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Next
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}

//           {step === 3 && (
//             <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
//               <select
//                 name="maritalStatus"
//                 value={landlord.maritalStatus}
//                 onChange={handleInput}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 required
//               >
//                 <option value="">Select Marital Status</option>
//                 <option value="Single">Single</option>
//                 <option value="Married">Married</option>
//                 <option value="Divorced">Divorced</option>
//                 <option value="Widowed">Widowed</option>
//                 <option value="Other">Other</option>
//               </select>
//               <InputField
//                 icon={faUser}
//                 type="text"
//                 name="verificationIdNo"
//                 value={landlord.verificationIdNo}
//                 onChange={handleInput}
//                 placeholder="Verification ID Number"
//                 required
//               />
//               <InputField
//                 icon={faUser}
//                 type="number"
//                 name="age"
//                 value={landlord.age}
//                 onChange={handleInput}
//                 placeholder="Age"
//                 required
//               />
//               <select
//                 name="gender"
//                 value={landlord.gender}
//                 onChange={handleInput}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//               <div className="flex justify-between gap-4 mt-6">
//                 <motion.button
//                   type="button"
//                   onClick={() => setStep(2)}
//                   className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Back
//                 </motion.button>
//                 <motion.button
//                   type="button"
//                   onClick={() => setStep(4)}
//                   className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Next
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}

//           {step === 4 && (
//             <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
//               <select
//                 name="leaseDuration"
//                 value={landlord.leaseDuration}
//                 onChange={handleInput}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 required
//               >
//                 <option value="">Select Lease Duration</option>
//                 <option value="1-3 months">1-3 months</option>
//                 <option value="3-6 months">3-6 months</option>
//                 <option value="6-12 months">6-12 months</option>
//                 <option value="12+ months">12+ months</option>
//               </select>
//               <InputField
//                 icon={faMoneyBill}
//                 type="number"
//                 name="budget"
//                 value={landlord.budget}
//                 onChange={handleInput}
//                 placeholder="Budget (in USD)"
//                 required
//               />
//               <InputField
//                 icon={faMapMarkerAlt}
//                 type="text"
//                 name="preferredLocation"
//                 value={landlord.preferredLocation}
//                 onChange={handleInput}
//                 placeholder="Preferred Location"
//                 required
//               />
//               <select
//                 name="preferredTenantType"
//                 value={landlord.preferredTenantType}
//                 onChange={handleInput}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 required
//               >
//                 <option value="">Select Preferred Tenant Type</option>
//                 <option value="Student">Student</option>
//                 <option value="Working Professional">Working Professional</option>
//                 <option value="Family">Family</option>
//                 <option value="Any">Any</option>
//               </select>
//               <div className="flex justify-between gap-4 mt-6">
//                 <motion.button
//                   type="button"
//                   onClick={() => setStep(3)}
//                   className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Back
//                 </motion.button>
//                 <motion.button
//                   type="button"
//                   onClick={() => setStep(5)}
//                   className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Next
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}

//           {step === 5 && (
//             <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
//               <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
//                 <input
//                   type="file"
//                   name="verificationIdDoc"
//                   onChange={(e) => handleFileChange(e, setVerificationIdDoc)}
//                   className="hidden"
//                   id="verificationIdDoc-upload"
//                 />
//                 <label
//                   htmlFor="verificationIdDoc-upload"
//                   className="cursor-pointer bg-teal-600 text-white py-1 px-3 rounded-md hover:bg-teal-700 transition-all text-sm font-medium"
//                 >
//                   Upload ID Document
//                 </label>
//                 <div id="verificationIdDoc-display" className="hidden text-sm text-gray-600 truncate"></div>
//               </div>
//               <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
//                 <input
//                   type="file"
//                   name="proofOfOwnership"
//                   onChange={(e) => handleFileChange(e, setProofOfOwnership)}
//                   className="hidden"
//                   id="proofOfOwnership-upload"
//                 />
//                 <label
//                   htmlFor="proofOfOwnership-upload"
//                   className="cursor-pointer bg-teal-600 text-white py-1 px-3 rounded-md hover:bg-teal-700 transition-all text-sm font-medium"
//                 >
//                   Upload Proof of Ownership
//                 </label>
//                 <div id="proofOfOwnership-display" className="hidden text-sm text-gray-600 truncate"></div>
//               </div>
//               <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
//                 <input
//                   type="file"
//                   name="profilePicture"
//                   onChange={(e) => handleFileChange(e, setProfilePicture)}
//                   className="hidden"
//                   id="profilePicture-upload"
//                 />
//                 <label
//                   htmlFor="profilePicture-upload"
//                   className="cursor-pointer bg-teal-600 text-white py-1 px-3 rounded-md hover:bg-teal-700 transition-all text-sm font-medium"
//                 >
//                   Upload Profile Picture
//                 </label>
//                 <div id="profilePicture-display" className="hidden text-sm text-gray-600 truncate"></div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="termsAccepted"
//                   checked={landlord.termsAccepted}
//                   onChange={handleInput}
//                   className="h-4 w-4 text-teal-600"
//                   required
//                 />
//                 <label className="text-gray-700 text-sm">
//                   I accept the <a href="#" className="text-teal-600 hover:underline">terms and conditions</a>
//                 </label>
//               </div>
//               <div className="flex justify-between gap-4 mt-6">
//                 <motion.button
//                   type="button"
//                   onClick={() => setStep(4)}
//                   className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Back
//                 </motion.button>
//                 <motion.button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className={`w-full py-2 px-4 bg-teal-600 text-white rounded-lg font-medium ${
//                     loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700"
//                   } transition-all`}
//                   whileHover={{ scale: loading ? 1 : 1.05 }}
//                   whileTap={{ scale: loading ? 1 : 0.95 }}
//                 >
//                   {loading ? "Registering..." : "Register"}
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}

//           {step === 6 && (
//             <motion.div key="step6" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
//               <h2 className="text-xl font-semibold text-gray-800 text-center">Verify Your Email</h2>
//               <p className="text-gray-600 text-center text-sm">An OTP has been sent to {landlord.email}. Please enter it below.</p>
//               <InputField
//                 icon={faKey}
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="Enter OTP"
//                 required
//               />
//               <motion.button
//                 onClick={handleVerifyOTP}
//                 disabled={loading}
//                 className={`w-full py-2 px-4 bg-teal-600 text-white rounded-lg font-medium ${
//                   loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700"
//                 } transition-all`}
//                 whileHover={{ scale: loading ? 1 : 1.05 }}
//                 whileTap={{ scale: loading ? 1 : 0.95 }}
//               >
//                 {loading ? "Verifying..." : "Verify OTP"}
//               </motion.button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </motion.div>
//   );
// };

// const InputField = ({ icon, ...props }) => (
//   <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500">
//     <FontAwesomeIcon icon={icon} className="text-gray-500" />
//     <input {...props} className="w-full focus:outline-none bg-transparent text-gray-700" />
//   </div>
// );

// export default LandlordRegister;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Store/auth.jsx";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaHome, 
  FaVenusMars, 
  FaMoneyBill, 
  FaMapMarkerAlt, 
  FaKey,
  FaFileUpload,
  FaUserCircle,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaIdCard,
  FaFileContract,
  FaUserShield
} from "react-icons/fa";
import { RiHomeGearLine } from "react-icons/ri";
import { GiFamilyHouse } from "react-icons/gi";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const LandlordRegister = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [landlord, setLandlord] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: { street: "", city: "", state: "", postalCode: "", country: "USA" },
    maritalStatus: "",
    verificationIdNo: "",
    age: "",
    gender: "",
    preferredTenantType: "",
    leaseDuration: "",
    budget: "",
    preferredLocation: "",
    termsAccepted: false,
  });
  const [verificationIdDoc, setVerificationIdDoc] = useState(null);
  const [proofOfOwnership, setProofOfOwnership] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);


  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setLandlord((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setLandlord((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", { description: "File size must be less than 5MB." });
      return;
    }
    setFile(file);
    const fileName = file?.name;
    if (fileName) {
      const fileDisplay = document.getElementById(`${e.target.name}-display`);
      if (fileDisplay) {
        fileDisplay.textContent = fileName;
        fileDisplay.classList.remove("hidden");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!landlord.termsAccepted) {
      toast.error("Terms Not Accepted", { description: "Please accept the terms and conditions to proceed." });
      return;
    }
    if (landlord.phone.length < 10 || !/^\d+$/.test(landlord.phone)) {
      toast.error("Invalid Phone Number", { description: "Phone number must be at least 10 digits and contain only numbers." });
      return;
    }
    if (!verificationIdDoc || !proofOfOwnership || !profilePicture) {
      toast.error("Documents Required", {
        description: "Please upload verification ID, proof of ownership, and profile picture.",
      });
      return;
    }
    if (!landlord.preferredLocation || !landlord.budget || !landlord.leaseDuration || !landlord.preferredTenantType) {
      toast.error("Missing Required Fields", {
        description: "Please fill in all required fields: Preferred Location, Budget, Lease Duration, and Preferred Tenant Type.",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const updatedLandlord = {
        ...landlord,
        age: Number(landlord.age),
        budget: Number(landlord.budget),
        termsAccepted: Boolean(landlord.termsAccepted),
      };

      formData.append("data", JSON.stringify(updatedLandlord));
      formData.append("verificationIdDoc", verificationIdDoc);
      formData.append("proofOfOwnership", proofOfOwnership);
      formData.append("profilePicture", profilePicture); // Added profile picture

      const response = await fetch(`${backendUrl}/api/landlords/register`, {
        method: "POST",
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          if (resData.message === "Email or verification ID already registered") {
            toast.error("Registration Failed", { description: "This email or verification ID is already registered." });
          } else if (resData.message === "Missing required files") {
            toast.error("Missing Files", { description: resData.details });
          } else {
            toast.error("Registration Failed", { description: resData.message || "An unexpected error occurred." });
          }
        } else if (response.status === 422) {
          toast.error("Validation Error", { description: resData.extraDetails || "Please check your input." });
        } else {
          toast.error("Server Error", { description: "An unexpected error occurred. Please try again later." });
        }
        throw new Error(resData.message || "Registration failed");
      }

      toast.success("OTP Sent", { description: "An OTP has been sent to your email. Please verify it." });
      setStep(6);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("OTP Required", { description: "Please enter the OTP sent to your email." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/landlords/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: landlord.email, otp }),
      });
      const resData = await response.json();

      if (!response.ok) {
        if (resData.message === "Invalid or expired OTP") {
          toast.error("Invalid OTP", { description: "The OTP is incorrect or has expired." });
        } else if (resData.message === "Email and OTP are required") {
          toast.error("Input Error", { description: "Please provide both email and OTP." });
        } else {
          toast.error("OTP Verification Failed", { description: resData.message || "An unexpected error occurred." });
        }
        throw new Error(resData.message || "OTP verification failed");
      }

      storeTokenInLS(resData.token);
      toast.success("Registration Successful", { description: "Welcome! Redirecting to your dashboard..." });
      setTimeout(() => navigate("/landlord-dashboard"), 1500);
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
  };

  const stepTitles = [
    "Personal Information",
    "Address Details",
    "Personal Details",
    "Property Preferences",
    "Document Verification",
    "Email Verification"
  ];

  const stepIcons = [
    <FaUser className="text-teal-500" />,
    <FaHome className="text-teal-500" />,
    <FaUserShield className="text-teal-500" />,
    <RiHomeGearLine className="text-teal-500" />,
    <FaFileContract className="text-teal-500" />,
    <FaKey className="text-teal-500" />
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <GiFamilyHouse className="text-2xl" />
                Landlord Registration
              </h1>
              <p className="text-teal-100 mt-1">Join our platform to manage your properties</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaUserCircle className="text-xl" />
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center ${index < step ? 'text-teal-600' : 'text-gray-400'}`}
                onClick={() => step > index + 1 && setStep(index + 1)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  step > index + 1 ? 'bg-teal-100' : step === index + 1 ? 'bg-teal-600 text-white' : 'bg-gray-100'
                }`}>
                  {step > index + 1 ? <FaCheck className="text-teal-600" /> : stepIcons[index]}
                </div>
                <span className="text-xs font-medium text-center">{title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {stepIcons[step - 1]}
                {stepTitles[step - 1]}
              </h2>

              {step === 1 && (
                <div className="space-y-4">
                  <InputField
                    icon={<FaUser className="text-gray-500" />}
                    type="text"
                    name="fullName"
                    value={landlord.fullName}
                    onChange={handleInput}
                    placeholder="Full Name"
                    required
                  />
                  <InputField
                    icon={<FaEnvelope className="text-gray-500" />}
                    type="email"
                    name="email"
                    value={landlord.email}
                    onChange={handleInput}
                    placeholder="Email"
                    required
                  />
                  <InputField
                    icon={<FaLock className="text-gray-500" />}
                    type="password"
                    name="password"
                    value={landlord.password}
                    onChange={handleInput}
                    placeholder="Password"
                    required
                  />
                  <InputField
                    icon={<FaPhone className="text-gray-500" />}
                    type="text"
                    name="phone"
                    value={landlord.phone}
                    onChange={handleInput}
                    placeholder="Phone Number"
                    required
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <InputField
                    icon={<FaHome className="text-gray-500" />}
                    type="text"
                    name="address.street"
                    value={landlord.address.street}
                    onChange={handleInput}
                    placeholder="Street Address"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      type="text"
                      name="address.city"
                      value={landlord.address.city}
                      onChange={handleInput}
                      placeholder="City"
                    />
                    <InputField
                      type="text"
                      name="address.state"
                      value={landlord.address.state}
                      onChange={handleInput}
                      placeholder="State"
                    />
                    <InputField
                      type="text"
                      name="address.postalCode"
                      value={landlord.address.postalCode}
                      onChange={handleInput}
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <SelectField
                    icon={<FaUser className="text-gray-500" />}
                    name="maritalStatus"
                    value={landlord.maritalStatus}
                    onChange={handleInput}
                    options={["Single", "Married", "Divorced", "Widowed", "Other"]}
                    placeholder="Marital Status"
                  />
                  <InputField
                    icon={<FaIdCard className="text-gray-500" />}
                    type="text"
                    name="verificationIdNo"
                    value={landlord.verificationIdNo}
                    onChange={handleInput}
                    placeholder="Verification ID Number"
                    required
                  />
                  <InputField
                    icon={<FaUser className="text-gray-500" />}
                    type="number"
                    name="age"
                    value={landlord.age}
                    onChange={handleInput}
                    placeholder="Age"
                    required
                  />
                  <SelectField
                    icon={<FaVenusMars className="text-gray-500" />}
                    name="gender"
                    value={landlord.gender}
                    onChange={handleInput}
                    options={["Male", "Female", "Other"]}
                    placeholder="Gender"
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <SelectField
                    icon={<RiHomeGearLine className="text-gray-500" />}
                    name="leaseDuration"
                    value={landlord.leaseDuration}
                    onChange={handleInput}
                    options={["1-3 months", "3-6 months", "6-12 months", "12+ months"]}
                    placeholder="Lease Duration"
                  />
                  <InputField
                    icon={<FaMoneyBill className="text-gray-500" />}
                    type="number"
                    name="budget"
                    value={landlord.budget}
                    onChange={handleInput}
                    placeholder="Budget (in USD)"
                    required
                  />
                  <InputField
                    icon={<FaMapMarkerAlt className="text-gray-500" />}
                    type="text"
                    name="preferredLocation"
                    value={landlord.preferredLocation}
                    onChange={handleInput}
                    placeholder="Preferred Location"
                    required
                  />
                  <SelectField
                    icon={<FaUserShield className="text-gray-500" />}
                    name="preferredTenantType"
                    value={landlord.preferredTenantType}
                    onChange={handleInput}
                    options={["Student", "Working Professional", "Family", "Any"]}
                    placeholder="Preferred Tenant Type"
                  />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <FileUpload
                    icon={<FaIdCard className="text-teal-500" />}
                    label="Verification ID Document"
                    name="verificationIdDoc"
                    onChange={(e) => handleFileChange(e, setVerificationIdDoc)}
                    fileName={verificationIdDoc?.name}
                  />
                  <FileUpload
                    icon={<FaFileContract className="text-teal-500" />}
                    label="Proof of Ownership"
                    name="proofOfOwnership"
                    onChange={(e) => handleFileChange(e, setProofOfOwnership)}
                    fileName={proofOfOwnership?.name}
                  />
                  <FileUpload
                    icon={<FaUserCircle className="text-teal-500" />}
                    label="Profile Picture"
                    name="profilePicture"
                    onChange={(e) => handleFileChange(e, setProfilePicture)}
                    fileName={profilePicture?.name}
                  />
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={landlord.termsAccepted}
                      onChange={handleInput}
                      className="h-5 w-5 text-teal-600 mt-1"
                      required
                    />
                    <label className="text-gray-700 text-sm">
                      I agree to the <a href="#" className="text-teal-600 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <FaEnvelope className="text-blue-500 text-3xl mx-auto mb-2" />
                    <h3 className="font-medium text-blue-800">Verify Your Email</h3>
                    <p className="text-blue-600 text-sm mt-1">
                      We've sent a verification code to <span className="font-medium">{landlord.email}</span>
                    </p>
                  </div>
                  <InputField
                    icon={<FaKey className="text-gray-500" />}
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>
              )}

              <div className="flex justify-between gap-4 pt-4">
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaArrowLeft />
                    Back
                  </motion.button>
                )}
                {step < 5 ? (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                    <FaArrowRight />
                  </motion.button>
                ) : step === 5 ? (
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
                    } transition-all`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
                    } transition-all`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? "Verifying..." : "Verify & Complete"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Components
const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
    {icon}
    <input 
      {...props} 
      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
    />
  </div>
);

const SelectField = ({ icon, options, ...props }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
    {icon}
    <select 
      {...props} 
      className="w-full focus:outline-none bg-transparent text-gray-700 appearance-none"
    >
      <option value="">{props.placeholder}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ icon, label, name, onChange, fileName }) => (
  <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-400 transition-all">
    <div className="flex items-center gap-3">
      <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
        {icon}
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-teal-600 text-white py-1 px-3 rounded-md hover:bg-teal-700 transition-all text-sm font-medium">
            Choose File
            <input 
              type="file" 
              name={name}
              onChange={onChange}
              className="hidden" 
            />
          </label>
          {fileName && (
            <span className="text-sm text-gray-600 truncate">{fileName}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default LandlordRegister;
