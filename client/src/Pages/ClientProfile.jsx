

// // Pages/ClientProfile.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../Store/auth";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faEnvelope,
//   faPhone,
//   faHome,
//   faVenusMars,
//   faMoneyBillWave,
//   faMapMarkerAlt,
//   faFileAlt,
//   faEye,
//   faSignOutAlt,
//   faFileUpload,
//   faCalendarAlt,
//   faSmoking,
//   faPaw,
//   faBed,
//   faUserFriends,
// } from "@fortawesome/free-solid-svg-icons";
// import { RotatingLines } from "react-loader-spinner";
// import { motion } from "framer-motion";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const ClientProfile = () => {
//   const { user, logoutUser, isLoading, authorizationToken, setUser } = useAuth();
//   const [profilePictureUrl, setProfilePictureUrl] = useState(null);
//   const [verificationDocUrl, setVerificationDocUrl] = useState(null);
//   const [downloading, setDownloading] = useState(null);
//   const [lookingForRoommate, setLookingForRoommate] = useState(user?.lookingForRoommate || false);
//   const [roommatePrefs, setRoommatePrefs] = useState({
//     minAge: user?.roommatePreferences?.minAge || 18,
//     maxAge: user?.roommatePreferences?.maxAge || 100,
//     gender: user?.roommatePreferences?.gender || "No Preference",
//     sleepSchedule: user?.roommatePreferences?.sleepSchedule || "No Preference",
//     cleanliness: user?.roommatePreferences?.cleanliness || 3,
//     smoking: user?.roommatePreferences?.smoking || false,
//     pets: user?.roommatePreferences?.pets || false,
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         if (user?.profilePicture) {
//           const response = await fetch(`${backendUrl}/api/clients/file/${user.profilePicture}`, {
//             headers: { Authorization: authorizationToken },
//           });
//           if (response.ok) setProfilePictureUrl(URL.createObjectURL(await response.blob()));
//         }
//         if (user?.verificationIdDoc) {
//           const response = await fetch(`${backendUrl}/api/clients/file/${user.verificationIdDoc}`, {
//             headers: { Authorization: authorizationToken },
//           });
//           if (response.ok) setVerificationDocUrl(URL.createObjectURL(await response.blob()));
//         }
//       } catch (error) {
//         console.error("Error fetching files:", error);
//       }
//     };
//     fetchFiles();

//     return () => {
//       if (profilePictureUrl) URL.revokeObjectURL(profilePictureUrl);
//       if (verificationDocUrl) URL.revokeObjectURL(verificationDocUrl);
//     };
//   }, [user, authorizationToken]);

//   const handleDocumentClick = async (fileId, fileName) => {
//     setDownloading(fileId);
//     try {
//       const response = await fetch(`${backendUrl}/api/clients/file/${fileId}`, {
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) throw new Error("Failed to fetch document");
//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);
//       window.open(url, "_blank", "noopener,noreferrer");
//       toast.success(`Opened ${fileName} in a new tab`);
//       setTimeout(() => URL.revokeObjectURL(url), 1000);
//     } catch (error) {
//       toast.error("Failed to open document: " + error.message);
//     } finally {
//       setDownloading(null);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       const response = await fetch(`${backendUrl}/api/clients/profile`, {
//         method: "PUT",
//         headers: {
//           Authorization: authorizationToken,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           lookingForRoommate,
//           roommatePreferences: roommatePrefs,
//         }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to update profile");
//       setUser(data.user); // Update user in context
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   if (isLoading) {
//     return (
//       <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100">
//         <RotatingLines strokeColor="#0f6f5c" width="48" visible />
//       </motion.div>
//     );
//   }

//   if (!user) {
//     return (
//       <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100">
//         <div className="text-xl text-gray-600">Please log in to view your profile.</div>
//       </motion.div>
//     );
//   }

//   const bgVariants = {
//     animate: {
//       backgroundPosition: ["0% 0%", "100% 100%"],
//       transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
//     },
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
//   };

//   return (
//     <motion.div
//       className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 flex items-center justify-center px-4 lg:px-10 py-10"
//       variants={bgVariants}
//       animate="animate"
//       style={{ backgroundSize: "200% 200%" }}
//     >
//       <motion.div className="w-full max-w-5xl bg-white rounded-3xl p-8 shadow-2xl border border-gray-100" variants={cardVariants} initial="hidden" animate="visible">
//         <motion.h1 className="text-4xl font-extrabold text-[#0f6f5c] mb-8 text-center flex items-center justify-center gap-2">
//           <FontAwesomeIcon icon={faUser} /> Client Profile
//         </motion.h1>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left Column: Profile Picture and Key Info */}
//           <motion.div className="lg:w-1/3 flex flex-col items-center lg:items-start gap-6">
//             {profilePictureUrl ? (
//               <img src={profilePictureUrl} alt="Profile" className="w-48 h-48 rounded-full object-cover border-4 border-[#0f6f5c] shadow-md" />
//             ) : (
//               <FontAwesomeIcon icon={faUser} className="w-48 h-48 text-gray-300" />
//             )}
//             <div className="text-center lg:text-left">
//               <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
//               <p className="text-gray-600 mt-1 flex items-center justify-center lg:justify-start gap-2">
//                 <FontAwesomeIcon icon={faEnvelope} className="text-[#0f6f5c]" /> {user.email}
//               </p>
//               <p className="text-gray-600 flex items-center justify-center lg:justify-start gap-2">
//                 <FontAwesomeIcon icon={faPhone} className="text-[#0f6f5c]" /> {user.phone}
//               </p>
//             </div>
//             <motion.button
//               onClick={logoutUser}
//               className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-full flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <FontAwesomeIcon icon={faSignOutAlt} /> Logout
//             </motion.button>
//           </motion.div>

//           {/* Right Column: Detailed Info and Documents */}
//           <motion.div className="lg:w-2/3 space-y-8">
//             {/* Personal Information */}
//             <div>
//               <h2 className="text-2xl font-semibold text-[#0f6f5c] mb-4 flex items-center gap-2">
//                 <FontAwesomeIcon icon={faUser} /> Personal Information
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 bg-teal-50 p-4 rounded-xl shadow-sm">
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faVenusMars} className="text-[#0f6f5c]" /><span className="font-semibold">Gender:</span> {user.gender}</p>
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendarAlt} className="text-[#0f6f5c]" /><span className="font-semibold">Age:</span> {user.age}</p>
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faHome} className="text-[#0f6f5c]" /><span className="font-semibold">Marital Status:</span> {user.maritalStatus}</p>
//                 <p className="md:col-span-2 flex items-center gap-2">
//                   <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#0f6f5c]" />
//                   <span className="font-semibold">Address:</span> 
//                   {user.address.street || user.address.city || user.address.state || user.address.postalCode
//                     ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}`.replace(/, ,/g, ",").trim()
//                     : "Not provided"}
//                 </p>
//               </div>
//             </div>

//             {/* Rental Preferences */}
//             <div>
//               <h2 className="text-2xl font-semibold text-[#0f6f5c] mb-4 flex items-center gap-2">
//                 <FontAwesomeIcon icon={faHome} /> Rental Preferences
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 bg-teal-50 p-4 rounded-xl shadow-sm">
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faHome} className="text-[#0f6f5c]" /><span className="font-semibold">Preference:</span> {user.preference}</p>
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendarAlt} className="text-[#0f6f5c]" /><span className="font-semibold">Lease Duration:</span> {user.leaseDuration}</p>
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faMoneyBillWave} className="text-[#0f6f5c]" /><span className="font-semibold">Budget:</span> ₹{user.budget}</p>
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#0f6f5c]" /><span className="font-semibold">Preferred Location:</span> {user.preferredLocation}</p>
//               </div>
//             </div>

//             {/* Lifestyle */}
//             <div>
//               <h2 className="text-2xl font-semibold text-[#0f6f5c] mb-4 flex items-center gap-2">
//                 <FontAwesomeIcon icon={faBed} /> Lifestyle
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 bg-teal-50 p-4 rounded-xl shadow-sm">
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faBed} className="text-[#0f6f5c]" /><span className="font-semibold">Sleep Schedule:</span> {user.lifestyle.sleepSchedule}</p>
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faSmoking} className="text-[#0f6f5c]" /><span className="font-semibold">Smoking:</span> {user.lifestyle.smoking ? "Yes" : "No"}</p>
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faPaw} className="text-[#0f6f5c]" /><span className="font-semibold">Pets:</span> {user.lifestyle.pets ? "Yes" : "No"}</p>
//                 <p className="flex items-center gap-2"><FontAwesomeIcon icon={faHome} className="text-[#0f6f5c]" /><span className="font-semibold">Cleanliness:</span> {user.lifestyle.cleanliness}/5</p>
//               </div>
//             </div>

//             {/* Roommate Preferences */}
//             <div>
//               <h2 className="text-2xl font-semibold text-[#0f6f5c] mb-4 flex items-center gap-2">
//                 <FontAwesomeIcon icon={faUserFriends} /> Roommate Preferences
//               </h2>
//               <div className="bg-teal-50 p-4 rounded-xl shadow-sm space-y-4">
//                 <div className="flex items-center gap-4">
//                   <label className="text-gray-700 font-semibold">Looking for Roommate:</label>
//                   <input
//                     type="checkbox"
//                     checked={lookingForRoommate}
//                     onChange={(e) => setLookingForRoommate(e.target.checked)}
//                     className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
//                   />
//                 </div>
//                 {lookingForRoommate && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
//                     <div>
//                       <label className="block font-semibold">Min Age:</label>
//                       <input
//                         type="number"
//                         value={roommatePrefs.minAge}
//                         onChange={(e) => setRoommatePrefs({ ...roommatePrefs, minAge: Number(e.target.value) })}
//                         min="18"
//                         className="w-full p-2 rounded border border-gray-300"
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-semibold">Max Age:</label>
//                       <input
//                         type="number"
//                         value={roommatePrefs.maxAge}
//                         onChange={(e) => setRoommatePrefs({ ...roommatePrefs, maxAge: Number(e.target.value) })}
//                         min="18"
//                         className="w-full p-2 rounded border border-gray-300"
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-semibold">Gender:</label>
//                       <select
//                         value={roommatePrefs.gender}
//                         onChange={(e) => setRoommatePrefs({ ...roommatePrefs, gender: e.target.value })}
//                         className="w-full p-2 rounded border border-gray-300"
//                       >
//                         <option>No Preference</option>
//                         <option>Male</option>
//                         <option>Female</option>
//                         <option>Other</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block font-semibold">Sleep Schedule:</label>
//                       <select
//                         value={roommatePrefs.sleepSchedule}
//                         onChange={(e) => setRoommatePrefs({ ...roommatePrefs, sleepSchedule: e.target.value })}
//                         className="w-full p-2 rounded border border-gray-300"
//                       >
//                         <option>No Preference</option>
//                         <option>Early Bird</option>
//                         <option>Night Owl</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block font-semibold">Cleanliness (1-5):</label>
//                       <input
//                         type="number"
//                         value={roommatePrefs.cleanliness}
//                         onChange={(e) => setRoommatePrefs({ ...roommatePrefs, cleanliness: Number(e.target.value) })}
//                         min="1"
//                         max="5"
//                         className="w-full p-2 rounded border border-gray-300"
//                       />
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <label className="font-semibold">Smoking:</label>
//                       <input
//                         type="checkbox"
//                         checked={roommatePrefs.smoking}
//                         onChange={(e) => setRoommatePrefs({ ...roommatePrefs, smoking: e.target.checked })}
//                         className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
//                       />
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <label className="font-semibold">Pets:</label>
//                       <input
//                         type="checkbox"
//                         checked={roommatePrefs.pets}
//                         onChange={(e) => setRoommatePrefs({ ...roommatePrefs, pets: e.target.checked })}
//                         className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
//                       />
//                     </div>
//                   </div>
//                 )}
//                 <motion.button
//                   onClick={handleUpdateProfile}
//                   className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-full flex items-center justify-center gap-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Save Preferences
//                 </motion.button>
//               </div>
//             </div>

//             {/* Documents */}
//             <div>
//               <h2 className="text-2xl font-semibold text-[#0f6f5c] mb-4 flex items-center gap-2">
//                 <FontAwesomeIcon icon={faFileAlt} /> Documents
//               </h2>
//               <div className="bg-teal-50 p-4 rounded-xl shadow-sm">
//                 {user.verificationIdDoc || user.profilePicture ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {user.profilePicture && (
//                       <motion.button
//                         onClick={() => handleDocumentClick(user.profilePicture, "Profile Picture")}
//                         className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-200 hover:bg-teal-100 hover:shadow-md transition duration-300 text-left w-full"
//                         whileHover={{ scale: 1.03 }}
//                         whileTap={{ scale: 0.97 }}
//                       >
//                         <FontAwesomeIcon icon={faFileAlt} className="text-[#0f6f5c] text-xl" />
//                         <span className="text-gray-700 font-medium truncate">Profile Picture</span>
//                         {downloading === user.profilePicture ? (
//                           <RotatingLines strokeColor="#0f6f5c" width="20" visible />
//                         ) : (
//                           <FontAwesomeIcon icon={faEye} className="text-[#0f6f5c] ml-auto" />
//                         )}
//                       </motion.button>
//                     )}
//                     {user.verificationIdDoc && (
//                       <motion.button
//                         onClick={() => handleDocumentClick(user.verificationIdDoc, "Verification ID Document")}
//                         className="flex items-center gap-3 p-3 bg-white rounded-xl border border-teal-200 hover:bg-teal-100 hover:shadow-md transition duration-300 text-left w-full"
//                         whileHover={{ scale: 1.03 }}
//                         whileTap={{ scale: 0.97 }}
//                       >
//                         <FontAwesomeIcon icon={faFileAlt} className="text-[#0f6f5c] text-xl" />
//                         <span className="text-gray-700 font-medium truncate">Verification ID</span>
//                         {downloading === user.verificationIdDoc ? (
//                           <RotatingLines strokeColor="#0f6f5c" width="20" visible />
//                         ) : (
//                           <FontAwesomeIcon icon={faEye} className="text-[#0f6f5c] ml-auto" />
//                         )}
//                       </motion.button>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-200">
//                     <FontAwesomeIcon icon={faFileUpload} className="text-gray-400 text-xl" />
//                     <p className="text-gray-600 italic">No documents available.</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ClientProfile;

import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaHome, 
  FaVenusMars, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaFileAlt, 
  FaEye, 
  FaSignOutAlt, 
  FaFileUpload,
  FaCalendarAlt,
  FaSmoking,
  FaPaw,
  FaBed,
  FaUserFriends,
  FaEdit,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import { GiNightSleep } from "react-icons/gi";
import { MdCleaningServices } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const ClientProfile = () => {
  const { user, logoutUser, isLoading, authorizationToken, setUser } = useAuth();
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [verificationDocUrl, setVerificationDocUrl] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [lookingForRoommate, setLookingForRoommate] = useState(user?.lookingForRoommate || false);
  const [isEditing, setIsEditing] = useState(false);
  const [roommatePrefs, setRoommatePrefs] = useState({
    minAge: user?.roommatePreferences?.minAge || 18,
    maxAge: user?.roommatePreferences?.maxAge || 100,
    gender: user?.roommatePreferences?.gender || "No Preference",
    sleepSchedule: user?.roommatePreferences?.sleepSchedule || "No Preference",
    cleanliness: user?.roommatePreferences?.cleanliness || 3,
    smoking: user?.roommatePreferences?.smoking || false,
    pets: user?.roommatePreferences?.pets || false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (user?.profilePicture) {
          const response = await fetch(`${backendUrl}/api/clients/file/${user.profilePicture}`, {
            headers: { Authorization: authorizationToken },
          });
          if (response.ok) setProfilePictureUrl(URL.createObjectURL(await response.blob()));
        }
        if (user?.verificationIdDoc) {
          const response = await fetch(`${backendUrl}/api/clients/file/${user.verificationIdDoc}`, {
            headers: { Authorization: authorizationToken },
          });
          if (response.ok) setVerificationDocUrl(URL.createObjectURL(await response.blob()));
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();

    return () => {
      if (profilePictureUrl) URL.revokeObjectURL(profilePictureUrl);
      if (verificationDocUrl) URL.revokeObjectURL(verificationDocUrl);
    };
  }, [user, authorizationToken]);

  const handleDocumentClick = async (fileId, fileName) => {
    setDownloading(fileId);
    try {
      const response = await fetch(`${backendUrl}/api/clients/file/${fileId}`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error("Failed to fetch document");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      toast.success(`Opened ${fileName} in a new tab`);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.error("Failed to open document: " + error.message);
    } finally {
      setDownloading(null);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/clients/profile`, {
        method: "PUT",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lookingForRoommate,
          roommatePreferences: roommatePrefs,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");
      setUser(data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100">
        <RotatingLines strokeColor="#0f766e" width="48" visible />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100">
        <div className="text-xl text-gray-600">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-teal-800 mb-2 flex items-center justify-center gap-3">
            <FaUser className="text-teal-600" /> My Profile
          </h1>
          <p className="text-lg text-teal-600">Manage your account and preferences</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 h-32 relative">
              {profilePictureUrl ? (
                <img 
                  src={profilePictureUrl} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white absolute -bottom-16 left-1/2 transform -translate-x-1/2 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center border-4 border-white absolute -bottom-16 left-1/2 transform -translate-x-1/2 shadow-lg">
                  <FaUser className="text-5xl text-teal-600" />
                </div>
              )}
            </div>
            <div className="pt-20 pb-6 px-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
              <p className="text-gray-600 mt-2 flex items-center justify-center gap-2">
                <FaEnvelope className="text-teal-600" /> {user.email}
              </p>
              <p className="text-gray-600 mt-1 flex items-center justify-center gap-2">
                <FaPhone className="text-teal-600" /> {user.phone}
              </p>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-teal-50 p-3 rounded-lg">
                  <p className="font-semibold text-teal-800">Age</p>
                  <p className="text-gray-700">{user.age}</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <p className="font-semibold text-teal-800">Gender</p>
                  <p className="text-gray-700">{user.gender}</p>
                </div>
              </div>

              {/* <motion.button
                onClick={logoutUser}
                className="mt-6 w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSignOutAlt /> Logout
              </motion.button> */}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaUser /> Personal Information
                </h2>
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="text-white hover:text-teal-200 transition-colors"
                >
                  <FaEdit />
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<FaVenusMars />} label="Gender" value={user.gender} />
                <InfoItem icon={<FaCalendarAlt />} label="Age" value={user.age} />
                <InfoItem icon={<FaHome />} label="Marital Status" value={user.maritalStatus} />
                <InfoItem 
                  icon={<FaMapMarkerAlt />} 
                  label="Address" 
                  value={
                    user.address.street || user.address.city || user.address.state || user.address.postalCode
                      ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}`.replace(/, ,/g, ",").trim()
                      : "Not provided"
                  } 
                />
              </div>
            </div>

            {/* Rental Preferences */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaHome /> Rental Preferences
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<FaUser />} label="Preference" value={user.preference} />
                <InfoItem icon={<FaCalendarAlt />} label="Lease Duration" value={user.leaseDuration} />
                <InfoItem icon={<FaMoneyBillWave />} label="Budget" value={`₹${user.budget}`} />
                <InfoItem icon={<FaMapMarkerAlt />} label="Preferred Location" value={user.preferredLocation} />
              </div>
            </div>

            {/* Lifestyle */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaBed /> Lifestyle
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<GiNightSleep />} label="Sleep Schedule" value={user.lifestyle.sleepSchedule} />
                <InfoItem icon={<FaSmoking />} label="Smoking" value={user.lifestyle.smoking ? "Yes" : "No"} />
                <InfoItem icon={<FaPaw />} label="Pets" value={user.lifestyle.pets ? "Yes" : "No"} />
                <InfoItem icon={<MdCleaningServices />} label="Cleanliness" value={`${user.lifestyle.cleanliness}/5`} />
              </div>
            </div>

            {/* Roommate Preferences */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaUserFriends /> Roommate Preferences
                </h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdateProfile}
                      className="text-white hover:text-teal-200 transition-colors"
                    >
                      <FaCheck />
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="text-white hover:text-teal-200 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-white hover:text-teal-200 transition-colors"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-gray-700 font-semibold">Looking for Roommate:</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={lookingForRoommate} 
                      onChange={(e) => setLookingForRoommate(e.target.checked)} 
                      className="sr-only peer" 
                      disabled={!isEditing}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                {lookingForRoommate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Min Age</label>
                      <input
                        type="number"
                        value={roommatePrefs.minAge}
                        onChange={(e) => setRoommatePrefs({ ...roommatePrefs, minAge: Number(e.target.value) })}
                        min="18"
                        max={roommatePrefs.maxAge}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Max Age</label>
                      <input
                        type="number"
                        value={roommatePrefs.maxAge}
                        onChange={(e) => setRoommatePrefs({ ...roommatePrefs, maxAge: Number(e.target.value) })}
                        min={roommatePrefs.minAge}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        value={roommatePrefs.gender}
                        onChange={(e) => setRoommatePrefs({ ...roommatePrefs, gender: e.target.value })}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        disabled={!isEditing}
                      >
                        <option>No Preference</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Sleep Schedule</label>
                      <select
                        value={roommatePrefs.sleepSchedule}
                        onChange={(e) => setRoommatePrefs({ ...roommatePrefs, sleepSchedule: e.target.value })}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        disabled={!isEditing}
                      >
                        <option>No Preference</option>
                        <option>Early Bird</option>
                        <option>Night Owl</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Cleanliness (1-5)</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setRoommatePrefs({ ...roommatePrefs, cleanliness: num })}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              roommatePrefs.cleanliness === num 
                                ? 'bg-teal-600 text-white' 
                                : 'bg-gray-100 text-gray-600'
                            } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!isEditing}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Smoking</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={roommatePrefs.smoking} 
                          onChange={(e) => setRoommatePrefs({ ...roommatePrefs, smoking: e.target.checked })} 
                          className="sr-only peer" 
                          disabled={!isEditing}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Pets</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={roommatePrefs.pets} 
                          onChange={(e) => setRoommatePrefs({ ...roommatePrefs, pets: e.target.checked })} 
                          className="sr-only peer" 
                          disabled={!isEditing}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaFileAlt /> Documents
                </h2>
              </div>
              <div className="p-6">
                {user.verificationIdDoc || user.profilePicture ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.profilePicture && (
                      <DocumentCard
                        icon={<FaUser className="text-teal-600" />}
                        label="Profile Picture"
                        onClick={() => handleDocumentClick(user.profilePicture, "Profile Picture")}
                        loading={downloading === user.profilePicture}
                      />
                    )}
                    {user.verificationIdDoc && (
                      <DocumentCard
                        icon={<FaFileAlt className="text-teal-600" />}
                        label="Verification ID"
                        onClick={() => handleDocumentClick(user.verificationIdDoc, "Verification ID")}
                        loading={downloading === user.verificationIdDoc}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 p-6 bg-teal-50 rounded-lg border border-dashed border-teal-200">
                    <FaFileUpload className="text-teal-600 text-xl" />
                    <p className="text-gray-600">No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-teal-600 mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-800">{value || "Not provided"}</p>
    </div>
  </div>
);

const DocumentCard = ({ icon, label, onClick, loading }) => (
  <motion.button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all text-left w-full"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
      {icon}
    </div>
    <span className="text-gray-700 font-medium">{label}</span>
    {loading ? (
      <RotatingLines strokeColor="#0f766e" width="20" className="ml-auto" />
    ) : (
      <FaEye className="text-teal-600 ml-auto" />
    )}
  </motion.button>
);

export default ClientProfile;