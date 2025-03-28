// // Components/RoommateFinder.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { FaUserCircle, FaCheck, FaTimes } from "react-icons/fa";
// import * as tf from "@tensorflow/tfjs"; // Dependency for AI compatibility scoring

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const RoommateFinder = () => {
//   const { authorizationToken, role, isLoading, user } = useAuth();
//   const navigate = useNavigate();
//   const [roommates, setRoommates] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [profilePics, setProfilePics] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (isLoading) return;
//     if (!authorizationToken || role !== "client") {
//       toast.error("Please log in as a client");
//       navigate("/login");
//       return;
//     }

//     const fetchRoommates = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/clients/potential-roommates`, {
//           headers: { Authorization: authorizationToken },
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to fetch roommates");

//         setRoommates(data.roommates);

//         const pics = {};
//         for (const roommate of data.roommates) {
//           if (roommate.profilePicture) {
//             const picResponse = await fetch(`${backendUrl}/api/clients/file/${roommate.profilePicture}`, {
//               headers: { Authorization: authorizationToken },
//             });
//             if (picResponse.ok) pics[roommate._id] = URL.createObjectURL(await picResponse.blob());
//           }
//         }
//         setProfilePics(pics);
//       } catch (error) {
//         toast.error(error.message);
//         navigate("/client-dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoommates();
//   }, [authorizationToken, navigate, role, isLoading]);

//   // Corrected AI compatibility scoring using TensorFlow.js
//   const calculateCompatibility = (candidate) => {
//     if (!user) return 0;

//     const userFeatures = [
//       user.age / 100, // Normalize
//       user.gender === "Male" ? 1 : user.gender === "Female" ? 0 : 0.5,
//       user.lifestyle.cleanliness / 5,
//       user.lifestyle.smoking ? 1 : 0,
//       user.lifestyle.pets ? 1 : 0,
//       user.lifestyle.sleepSchedule === "Early Bird" ? 1 : 0,
//     ];
//     const candidateFeatures = [
//       candidate.age / 100,
//       candidate.gender === "Male" ? 1 : candidate.gender === "Female" ? 0 : 0.5,
//       candidate.lifestyle.cleanliness / 5,
//       candidate.lifestyle.smoking ? 1 : 0,
//       candidate.lifestyle.pets ? 1 : 0,
//       candidate.lifestyle.sleepSchedule === "Early Bird" ? 1 : 0,
//     ];

//     const userTensor = tf.tensor2d([userFeatures]);
//     const candidateTensor = tf.tensor2d([candidateFeatures]);

//     // Compute dot product
//     const dotProduct = tf.dot(userTensor, candidateTensor.transpose()).dataSync()[0];

//     // Compute norms (magnitudes)
//     const userNorm = userTensor.norm().dataSync()[0];
//     const candidateNorm = candidateTensor.norm().dataSync()[0];

//     // Compute cosine similarity
//     const similarity = userNorm * candidateNorm === 0 ? 0 : dotProduct / (userNorm * candidateNorm);

//     // Dispose tensors to free memory
//     userTensor.dispose();
//     candidateTensor.dispose();

//     return Math.round(similarity * 100); // Convert to percentage
//   };

//   const handleSwipe = async (action, roommateId) => {
//     try {
//       if (action === "accept") {
//         await fetch(`${backendUrl}/api/clients/send-roommate-request`, {
//           method: "POST",
//           headers: {
//             Authorization: authorizationToken,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ roommateId }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.message) toast.success(data.message);
//             else toast.error(data.error || "Failed to send request");
//           });
//       }
//       setCurrentIndex((prev) => prev + 1);
//     } catch (error) {
//       toast.error("Error processing swipe");
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-full">Loading...</div>;
//   }

//   if (currentIndex >= roommates.length) {
//     return (
//       <div className="text-center text-gray-600">
//         No more potential roommates available. Check back later!
//       </div>
//     );
//   }

//   const currentRoommate = roommates[currentIndex];
//   const compatibilityScore = calculateCompatibility(currentRoommate);

//   return (
//     <motion.div
//       className="flex flex-col items-center"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
//         <div className="flex flex-col items-center">
//           {profilePics[currentRoommate._id] ? (
//             <img
//               src={profilePics[currentRoommate._id]}
//               alt={currentRoommate.fullName}
//               className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 mb-4"
//             />
//           ) : (
//             <FaUserCircle className="w-32 h-32 text-teal-500 mb-4" />
//           )}
//           <h3 className="text-2xl font-bold text-gray-800">{currentRoommate.fullName}</h3>
//           <p className="text-sm text-gray-500">Compatibility: {compatibilityScore}%</p>
//           <div className="mt-4 text-gray-700 space-y-2">
//             <p><strong>Age:</strong> {currentRoommate.age}</p>
//             <p><strong>Gender:</strong> {currentRoommate.gender}</p>
//             <p><strong>Location:</strong> {currentRoommate.preferredLocation}</p>
//             <p><strong>Budget:</strong> ${currentRoommate.budget}</p>
//             <p><strong>Lease:</strong> {currentRoommate.leaseDuration}</p>
//             <p><strong>Lifestyle:</strong></p>
//             <ul className="list-disc list-inside">
//               <li>Sleep: {currentRoommate.lifestyle.sleepSchedule}</li>
//               <li>Cleanliness: {currentRoommate.lifestyle.cleanliness}/5</li>
//               <li>Smoking: {currentRoommate.lifestyle.smoking ? "Yes" : "No"}</li>
//               <li>Pets: {currentRoommate.lifestyle.pets ? "Yes" : "No"}</li>
//             </ul>
//           </div>
//         </div>
//         <div className="flex justify-between mt-6">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => handleSwipe("reject", currentRoommate._id)}
//             className="bg-red-500 text-white p-3 rounded-full"
//           >
//             <FaTimes size={24} />
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => handleSwipe("accept", currentRoommate._id)}
//             className="bg-green-500 text-white p-3 rounded-full"
//           >
//             <FaCheck size={24} />
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default RoommateFinder;

// Components/RoommateFinder.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { FaUserCircle, FaCheck, FaTimes } from "react-icons/fa";
// import * as tf from "@tensorflow/tfjs";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const RoommateFinder = () => {
//   const { authorizationToken, role, isLoading, user } = useAuth();
//   const navigate = useNavigate();
//   const [roommates, setRoommates] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [profilePics, setProfilePics] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (isLoading) return;
//     if (!authorizationToken || role !== "client") {
//       toast.error("Please log in as a client");
//       navigate("/login");
//       return;
//     }

//     const fetchRoommates = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/clients/potential-roommates`, {
//           headers: { Authorization: authorizationToken },
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to fetch roommates");

//         setRoommates(data.roommates);

//         const pics = {};
//         for (const roommate of data.roommates) {
//           if (roommate.profilePicture) {
//             const picResponse = await fetch(`${backendUrl}/api/clients/file/${roommate.profilePicture}`, {
//               headers: { Authorization: authorizationToken },
//             });
//             if (picResponse.ok) pics[roommate._id] = URL.createObjectURL(await picResponse.blob());
//           }
//         }
//         setProfilePics(pics);
//       } catch (error) {
//         toast.error(error.message);
//         navigate("/client-dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoommates();
//   }, [authorizationToken, navigate, role, isLoading]);

//   const calculateCompatibility = (candidate) => {
//     if (!user) return 0;

//     const userFeatures = [
//       user.age / 100,
//       user.gender === "Male" ? 1 : user.gender === "Female" ? 0 : 0.5,
//       user.lifestyle.cleanliness / 5,
//       user.lifestyle.smoking ? 1 : 0,
//       user.lifestyle.pets ? 1 : 0,
//       user.lifestyle.sleepSchedule === "Early Bird" ? 1 : 0,
//     ];
//     const candidateFeatures = [
//       candidate.age / 100,
//       candidate.gender === "Male" ? 1 : candidate.gender === "Female" ? 0 : 0.5,
//       candidate.lifestyle.cleanliness / 5,
//       candidate.lifestyle.smoking ? 1 : 0,
//       candidate.lifestyle.pets ? 1 : 0,
//       candidate.lifestyle.sleepSchedule === "Early Bird" ? 1 : 0,
//     ];

//     const userTensor = tf.tensor2d([userFeatures]);
//     const candidateTensor = tf.tensor2d([candidateFeatures]);

//     const dotProduct = tf.dot(userTensor, candidateTensor.transpose()).dataSync()[0];
//     const userNorm = userTensor.norm().dataSync()[0];
//     const candidateNorm = candidateTensor.norm().dataSync()[0];
//     const similarity = userNorm * candidateNorm === 0 ? 0 : dotProduct / (userNorm * candidateNorm);

//     userTensor.dispose();
//     candidateTensor.dispose();

//     return Math.round(similarity * 100);
//   };

//   const handleSwipe = async (action, roommateId) => {
//     try {
//       if (action === "accept") {
//         await fetch(`${backendUrl}/api/clients/send-roommate-request`, {
//           method: "POST",
//           headers: {
//             Authorization: authorizationToken,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ roommateId }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.message) toast.success(data.message);
//             else toast.error(data.error || "Failed to send request");
//           });
//       }
//       setCurrentIndex((prev) => prev + 1);
//     } catch (error) {
//       toast.error("Error processing swipe");
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
//   if (currentIndex >= roommates.length)
//     return <div className="text-center text-gray-600">No more potential roommates available.</div>;

//   const currentRoommate = roommates[currentIndex];
//   const compatibilityScore = calculateCompatibility(currentRoommate);

//   return (
//     <motion.div
//       className="flex flex-col items-center"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
//         <div className="flex flex-col items-center">
//           {profilePics[currentRoommate._id] ? (
//             <img
//               src={profilePics[currentRoommate._id]}
//               alt={currentRoommate.fullName}
//               className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 mb-4"
//             />
//           ) : (
//             <FaUserCircle className="w-32 h-32 text-teal-500 mb-4" />
//           )}
//           <h3 className="text-2xl font-bold text-gray-800">{currentRoommate.fullName}</h3>
//           <p className="text-sm text-gray-500">Compatibility: {compatibilityScore}%</p>
//           <div className="mt-4 text-gray-700 space-y-2">
//             <p><strong>Age:</strong> {currentRoommate.age}</p>
//             <p><strong>Gender:</strong> {currentRoommate.gender}</p>
//             <p><strong>Location:</strong> {currentRoommate.preferredLocation}</p>
//             <p><strong>Budget:</strong> ${currentRoommate.budget}</p>
//             <p><strong>Lease:</strong> {currentRoommate.leaseDuration}</p>
//             <p><strong>Lifestyle:</strong></p>
//             <ul className="list-disc list-inside">
//               <li>Sleep: {currentRoommate.lifestyle.sleepSchedule}</li>
//               <li>Cleanliness: {currentRoommate.lifestyle.cleanliness}/5</li>
//               <li>Smoking: {currentRoommate.lifestyle.smoking ? "Yes" : "No"}</li>
//               <li>Pets: {currentRoommate.lifestyle.pets ? "Yes" : "No"}</li>
//             </ul>
//           </div>
//         </div>
//         <div className="flex justify-between mt-6">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => handleSwipe("reject", currentRoommate._id)}
//             className="bg-red-500 text-white p-3 rounded-full"
//           >
//             <FaTimes size={24} />
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => handleSwipe("accept", currentRoommate._id)}
//             className="bg-green-500 text-white p-3 rounded-full"
//           >
//             <FaCheck size={24} />
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default RoommateFinder;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaCheck, FaTimes, FaStar, FaInfoCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import CompatibilityMeter from "../Components/CompatibilityMeter";
import LoadingSpinner from "../Components/LoadingSpinner";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const RoommateFinder = () => {
  const { authorizationToken, role, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [roommates, setRoommates] = useState([]);
  const [profilePics, setProfilePics] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedProfile, setExpandedProfile] = useState(null);

  useEffect(() => {
    if (isLoading) return;
    if (!authorizationToken || role !== "client") {
      toast.error("Please log in as a client");
      navigate("/login");
      return;
    }

    const fetchRoommates = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/clients/potential-roommates`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch roommates");

        setRoommates(data.roommates);

        const pics = {};
        for (const roommate of data.roommates) {
          if (roommate.profilePicture) {
            const picResponse = await fetch(`${backendUrl}/api/clients/file/${roommate.profilePicture}`, {
              headers: { Authorization: authorizationToken },
            });
            if (picResponse.ok) pics[roommate._id] = URL.createObjectURL(await picResponse.blob());
          }
        }
        setProfilePics(pics);
      } catch (error) {
        toast.error(error.message);
        navigate("/client-dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchRoommates();
  }, [authorizationToken, navigate, role, isLoading]);

  const calculateCompatibility = (candidate) => {
    if (!user) return 0;

    const userFeatures = [
      user.age / 100,
      user.gender === "Male" ? 1 : user.gender === "Female" ? 0 : 0.5,
      user.lifestyle.cleanliness / 5,
      user.lifestyle.smoking ? 1 : 0,
      user.lifestyle.pets ? 1 : 0,
      user.lifestyle.sleepSchedule === "Early Bird" ? 1 : 0,
    ];
    const candidateFeatures = [
      candidate.age / 100,
      candidate.gender === "Male" ? 1 : candidate.gender === "Female" ? 0 : 0.5,
      candidate.lifestyle.cleanliness / 5,
      candidate.lifestyle.smoking ? 1 : 0,
      candidate.lifestyle.pets ? 1 : 0,
      candidate.lifestyle.sleepSchedule === "Early Bird" ? 1 : 0,
    ];

    let dotProduct = 0;
    let userNorm = 0;
    let candidateNorm = 0;

    for (let i = 0; i < userFeatures.length; i++) {
      dotProduct += userFeatures[i] * candidateFeatures[i];
      userNorm += userFeatures[i] * userFeatures[i];
      candidateNorm += candidateFeatures[i] * candidateFeatures[i];
    }

    userNorm = Math.sqrt(userNorm);
    candidateNorm = Math.sqrt(candidateNorm);
    const similarity = userNorm * candidateNorm === 0 ? 0 : dotProduct / (userNorm * candidateNorm);

    return Math.round(similarity * 100);
  };

  const handleSwipe = async (action, roommateId) => {
    try {
      if (action === "accept") {
        const response = await fetch(`${backendUrl}/api/clients/send-roommate-request`, {
          method: "POST",
          headers: {
            Authorization: authorizationToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roommateId }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to send request");
        toast.success("Request sent successfully!");
      }
      setRoommates((prev) => prev.filter((roommate) => roommate._id !== roommateId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleExpand = (id) => {
    setExpandedProfile(expandedProfile === id ? null : id);
  };

  if (loading) return <LoadingSpinner />;
  if (roommates.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <FaInfoCircle className="text-4xl text-teal-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700">No Potential Matches</h3>
      <p className="text-gray-500 mt-2">We couldn't find any potential roommates matching your preferences.</p>
      <button 
        onClick={() => navigate('/profile-settings')}
        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
        Update Preferences
      </button>
    </div>
  );

  const currentRoommate = roommates[0];
  const compatibilityScore = calculateCompatibility(currentRoommate);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">Find Your Perfect Roommate</h2>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoommate._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <div className="flex flex-col items-center">
              {profilePics[currentRoommate._id] ? (
                <img
                  src={profilePics[currentRoommate._id]}
                  alt={currentRoommate.fullName}
                  className="w-40 h-40 rounded-full object-cover border-4 border-teal-500 mb-4"
                />
              ) : (
                <FaUserCircle className="w-40 h-40 text-teal-500 mb-4" />
              )}
              
              <h3 className="text-2xl font-bold text-gray-800 text-center">
                {currentRoommate.fullName}
              </h3>
              
              <CompatibilityMeter score={compatibilityScore} className="my-4" />
              
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-teal-600 mb-2">Basic Info</h4>
                  <p><span className="font-medium">Age:</span> {currentRoommate.age}</p>
                  <p><span className="font-medium">Gender:</span> {currentRoommate.gender}</p>
                  <p><span className="font-medium">Location:</span> {currentRoommate.preferredLocation}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-teal-600 mb-2">Housing Preferences</h4>
                  <p><span className="font-medium">Budget:</span> ${currentRoommate.budget}/mo</p>
                  <p><span className="font-medium">Lease:</span> {currentRoommate.leaseDuration}</p>
                </div>
              </div>
              
              <div 
                className={`w-full bg-gray-50 p-4 rounded-lg transition-all duration-300 ${expandedProfile === currentRoommate._id ? 'max-h-96' : 'max-h-24 overflow-hidden'}`}
              >
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(currentRoommate._id)}>
                  <h4 className="font-semibold text-teal-600">Lifestyle Details</h4>
                  <motion.div
                    animate={{ rotate: expandedProfile === currentRoommate._id ? 180 : 0 }}
                  >
                    <IoIosArrowDown />
                  </motion.div>
                </div>
                
                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-medium">Sleep Schedule:</span> {currentRoommate.lifestyle.sleepSchedule}</p>
                      <p><span className="font-medium">Cleanliness:</span> 
                        <span className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`${i < currentRoommate.lifestyle.cleanliness ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p><span className="font-medium">Smoking:</span> {currentRoommate.lifestyle.smoking ? "Yes" : "No"}</p>
                      <p><span className="font-medium">Pets:</span> {currentRoommate.lifestyle.pets ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-6 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSwipe("reject", currentRoommate._id)}
                  className="bg-red-100 text-red-600 p-4 rounded-full shadow-md"
                >
                  <FaTimes size={24} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSwipe("accept", currentRoommate._id)}
                  className="bg-green-100 text-green-600 p-4 rounded-full shadow-md"
                >
                  <FaCheck size={24} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="mt-4 text-center text-gray-500">
        <p>{roommates.length} potential matches remaining</p>
      </div>
    </div>
  );
};

export default RoommateFinder;