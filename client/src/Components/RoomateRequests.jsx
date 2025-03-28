// // Components/RoommateRequests.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { FaUserCircle, FaCheck, FaTimes } from "react-icons/fa";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const RoommateRequests = () => {
//   const { authorizationToken } = useAuth();
//   const [requests, setRequests] = useState([]);
//   const [profilePics, setProfilePics] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/clients/roommate-requests`, {
//           headers: { Authorization: authorizationToken },
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to fetch requests");

//         setRequests(data.requests);

//         const pics = {};
//         for (const request of data.requests) {
//           if (request.requester.profilePicture) {
//             const picResponse = await fetch(`${backendUrl}/api/clients/file/${request.requester.profilePicture}`, {
//               headers: { Authorization: authorizationToken },
//             });
//             if (picResponse.ok) pics[request.requester._id] = URL.createObjectURL(await picResponse.blob());
//           }
//         }
//         setProfilePics(pics);
//       } catch (error) {
//         toast.error(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, [authorizationToken]);

//   const handleRequest = async (requesterId, action) => {
//     try {
//       const response = await fetch(`${backendUrl}/api/clients/handle-roommate-request`, {
//         method: "POST",
//         headers: {
//           Authorization: authorizationToken,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ requesterId, action }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to handle request");

//       toast.success(data.message);
//       setRequests((prev) => prev.filter((req) => req.requester._id !== requesterId));
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-full">Loading...</div>;
//   }

//   if (requests.length === 0) {
//     return <div className="text-center text-gray-600">No pending roommate requests.</div>;
//   }

//   return (
//     <motion.div
//       className="flex flex-col items-center space-y-6"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <h2 className="text-2xl font-bold text-teal-600">Pending Roommate Requests</h2>
//       {requests.map((request) => (
//         <motion.div
//           key={request.requester._id}
//           className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex flex-col items-center">
//             {profilePics[request.requester._id] ? (
//               <img
//                 src={profilePics[request.requester._id]}
//                 alt={request.requester.fullName}
//                 className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 mb-4"
//               />
//             ) : (
//               <FaUserCircle className="w-24 h-24 text-teal-500 mb-4" />
//             )}
//             <h3 className="text-xl font-bold text-gray-800">{request.requester.fullName}</h3>
//             <div className="mt-4 text-gray-700 space-y-2">
//               <p><strong>Age:</strong> {request.requester.age}</p>
//               <p><strong>Gender:</strong> {request.requester.gender}</p>
//               <p><strong>Location:</strong> {request.requester.preferredLocation}</p>
//               <p><strong>Budget:</strong> ${request.requester.budget}</p>
//               <p><strong>Lease:</strong> {request.requester.leaseDuration}</p>
//               <p><strong>Lifestyle:</strong></p>
//               <ul className="list-disc list-inside">
//                 <li>Sleep: {request.requester.lifestyle.sleepSchedule}</li>
//                 <li>Cleanliness: {request.requester.lifestyle.cleanliness}/5</li>
//                 <li>Smoking: {request.requester.lifestyle.smoking ? "Yes" : "No"}</li>
//                 <li>Pets: {request.requester.lifestyle.pets ? "Yes" : "No"}</li>
//               </ul>
//             </div>
//           </div>
//           <div className="flex justify-between mt-6">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => handleRequest(request.requester._id, "reject")}
//               className="bg-red-500 text-white p-3 rounded-full"
//             >
//               <FaTimes size={24} />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => handleRequest(request.requester._id, "accept")}
//               className="bg-green-500 text-white p-3 rounded-full"
//             >
//               <FaCheck size={24} />
//             </motion.button>
//           </div>
//         </motion.div>
//       ))}
//     </motion.div>
//   );
// };

// export default RoommateRequests;

// // Components/RoommateRequests.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { FaUserCircle, FaCheck, FaTimes } from "react-icons/fa";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const RoommateRequests = () => {
//   const { authorizationToken } = useAuth();
//   const [requests, setRequests] = useState([]);
//   const [profilePics, setProfilePics] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/clients/roommate-requests`, {
//           headers: { Authorization: authorizationToken },
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to fetch requests");

//         setRequests(data.requests);

//         const pics = {};
//         for (const request of data.requests) {
//           if (request.requester.profilePicture) {
//             const picResponse = await fetch(`${backendUrl}/api/clients/file/${request.requester.profilePicture}`, {
//               headers: { Authorization: authorizationToken },
//             });
//             if (picResponse.ok) pics[request.requester._id] = URL.createObjectURL(await picResponse.blob());
//           }
//         }
//         setProfilePics(pics);
//       } catch (error) {
//         toast.error(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, [authorizationToken]);

//   const handleRequest = async (requesterId, action) => {
//     try {
//       const response = await fetch(`${backendUrl}/api/clients/handle-roommate-request`, {
//         method: "POST",
//         headers: {
//           Authorization: authorizationToken,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ requesterId, action }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to handle request");

//       toast.success(data.message);
//       setRequests((prev) => prev.filter((req) => req.requester._id !== requesterId));
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
//   if (requests.length === 0) return <div className="text-center text-gray-600">No pending roommate requests.</div>;

//   return (
//     <motion.div
//       className="flex flex-col items-center space-y-6"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <h2 className="text-2xl font-bold text-teal-600">Pending Roommate Requests</h2>
//       {requests.map((request) => (
//         <motion.div
//           key={request.requester._id}
//           className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex flex-col items-center">
//             {profilePics[request.requester._id] ? (
//               <img
//                 src={profilePics[request.requester._id]}
//                 alt={request.requester.fullName}
//                 className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 mb-4"
//               />
//             ) : (
//               <FaUserCircle className="w-24 h-24 text-teal-500 mb-4" />
//             )}
//             <h3 className="text-xl font-bold text-gray-800">{request.requester.fullName}</h3>
//             <div className="mt-4 text-gray-700 space-y-2">
//               <p><strong>Age:</strong> {request.requester.age}</p>
//               <p><strong>Gender:</strong> {request.requester.gender}</p>
//               <p><strong>Location:</strong> {request.requester.preferredLocation}</p>
//               <p><strong>Budget:</strong> ${request.requester.budget}</p>
//               <p><strong>Lease:</strong> {request.requester.leaseDuration}</p>
//               <p><strong>Lifestyle:</strong></p>
//               <ul className="list-disc list-inside">
//                 <li>Sleep: {request.requester.lifestyle.sleepSchedule}</li>
//                 <li>Cleanliness: {request.requester.lifestyle.cleanliness}/5</li>
//                 <li>Smoking: {request.requester.lifestyle.smoking ? "Yes" : "No"}</li>
//                 <li>Pets: {request.requester.lifestyle.pets ? "Yes" : "No"}</li>
//               </ul>
//             </div>
//           </div>
//           <div className="flex justify-between mt-6">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => handleRequest(request.requester._id, "reject")}
//               className="bg-red-500 text-white p-3 rounded-full"
//             >
//               <FaTimes size={24} />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => handleRequest(request.requester._id, "accept")}
//               className="bg-green-500 text-white p-3 rounded-full"
//             >
//               <FaCheck size={24} />
//             </motion.button>
//           </div>
//         </motion.div>
//       ))}
//     </motion.div>
//   );
// };

// export default RoommateRequests;

import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaCheck, FaTimes, FaEnvelope, FaPhone, FaInfoCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import CompatibilityMeter from "../Components/CompatibilityMeter";
import LoadingSpinner from "../Components/LoadingSpinner";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const RoommateRequests = () => {
  const { authorizationToken, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [profilePics, setProfilePics] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedRequest, setExpandedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/clients/roommate-requests`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch requests");

        setRequests(data.requests);

        const pics = {};
        for (const request of data.requests) {
          if (request.requester.profilePicture) {
            const picResponse = await fetch(`${backendUrl}/api/clients/file/${request.requester.profilePicture}`, {
              headers: { Authorization: authorizationToken },
            });
            if (picResponse.ok) pics[request.requester._id] = URL.createObjectURL(await picResponse.blob());
          }
        }
        setProfilePics(pics);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [authorizationToken]);

  const calculateCompatibility = (requester) => {
    if (!user) return 0;

    const userFeatures = [
      user.age / 100,
      user.gender === "Male" ? 1 : user.gender === "Female" ? 0 : 0.5,
      user.lifestyle.cleanliness / 5,
      user.lifestyle.smoking ? 1 : 0,
      user.lifestyle.pets ? 1 : 0,
      user.lifestyle.sleepSchedule === "Early Bird" ? 1 : 0,
    ];
    const requesterFeatures = [
      requester.age / 100,
      requester.gender === "Male" ? 1 : requester.gender === "Female" ? 0 : 0.5,
      requester.lifestyle.cleanliness / 5,
      requester.lifestyle.smoking ? 1 : 0,
      requester.lifestyle.pets ? 1 : 0,
      requester.lifestyle.sleepSchedule === "Early Bird" ? 1 : 0,
    ];

    let dotProduct = 0;
    let userNorm = 0;
    let requesterNorm = 0;

    for (let i = 0; i < userFeatures.length; i++) {
      dotProduct += userFeatures[i] * requesterFeatures[i];
      userNorm += userFeatures[i] * userFeatures[i];
      requesterNorm += requesterFeatures[i] * requesterFeatures[i];
    }

    userNorm = Math.sqrt(userNorm);
    requesterNorm = Math.sqrt(requesterNorm);
    const similarity = userNorm * requesterNorm === 0 ? 0 : dotProduct / (userNorm * requesterNorm);

    return Math.round(similarity * 100);
  };

  const handleRequest = async (requesterId, action) => {
    try {
      const response = await fetch(`${backendUrl}/api/clients/handle-roommate-request`, {
        method: "POST",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterId, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to handle request");

      toast.success(data.message);
      setRequests((prev) => prev.filter((req) => req.requester._id !== requesterId));
      if (currentIndex >= requests.length - 1) {
        setCurrentIndex(Math.max(0, requests.length - 2));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const nextRequest = () => {
    setCurrentIndex((prev) => (prev + 1) % requests.length);
    setExpandedRequest(null);
  };

  const prevRequest = () => {
    setCurrentIndex((prev) => (prev - 1 + requests.length) % requests.length);
    setExpandedRequest(null);
  };

  if (loading) return <LoadingSpinner />;
  if (requests.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <FaInfoCircle className="text-4xl text-teal-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700">No Pending Requests</h3>
      <p className="text-gray-500 mt-2">You don't have any roommate requests at the moment.</p>
    </div>
  );

  const currentRequest = requests[currentIndex];
  const compatibilityScore = calculateCompatibility(currentRequest.requester);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">Roommate Requests</h2>
      
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRequest.requester._id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:w-1/3">
                {profilePics[currentRequest.requester._id] ? (
                  <img
                    src={profilePics[currentRequest.requester._id]}
                    alt={currentRequest.requester.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 mb-4"
                  />
                ) : (
                  <FaUserCircle className="w-32 h-32 text-teal-500 mb-4" />
                )}
                
                <h3 className="text-2xl font-bold text-gray-800 text-center">
                  {currentRequest.requester.fullName}
                </h3>
                
                <CompatibilityMeter score={compatibilityScore} className="my-4" />
                
                <div className="flex gap-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRequest(currentRequest.requester._id, "reject")}
                    className="bg-red-100 text-red-600 p-3 rounded-full shadow-md"
                  >
                    <FaTimes size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRequest(currentRequest.requester._id, "accept")}
                    className="bg-green-100 text-green-600 p-3 rounded-full shadow-md"
                  >
                    <FaCheck size={20} />
                  </motion.button>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-600 mb-2">Basic Info</h4>
                    <p><span className="font-medium">Age:</span> {currentRequest.requester.age}</p>
                    <p><span className="font-medium">Gender:</span> {currentRequest.requester.gender}</p>
                    <p><span className="font-medium">Location:</span> {currentRequest.requester.preferredLocation}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-600 mb-2">Housing Preferences</h4>
                    <p><span className="font-medium">Budget:</span> ${currentRequest.requester.budget}/mo</p>
                    <p><span className="font-medium">Lease:</span> {currentRequest.requester.leaseDuration}</p>
                  </div>
                </div>
                
                <div 
                  className={`mt-4 bg-gray-50 p-4 rounded-lg transition-all duration-300 ${expandedRequest === currentRequest.requester._id ? 'max-h-96' : 'max-h-24 overflow-hidden'}`}
                >
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(currentRequest.requester._id)}>
                    <h4 className="font-semibold text-teal-600">Lifestyle Details</h4>
                    <motion.div
                      animate={{ rotate: expandedRequest === currentRequest.requester._id ? 180 : 0 }}
                    >
                      <IoIosArrowDown />
                    </motion.div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><span className="font-medium">Sleep Schedule:</span> {currentRequest.requester.lifestyle.sleepSchedule}</p>
                        <p><span className="font-medium">Cleanliness:</span> 
                          <span className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`${i < currentRequest.requester.lifestyle.cleanliness ? 'text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p><span className="font-medium">Smoking:</span> {currentRequest.requester.lifestyle.smoking ? "Yes" : "No"}</p>
                        <p><span className="font-medium">Pets:</span> {currentRequest.requester.lifestyle.pets ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    
                    {expandedRequest === currentRequest.requester._id && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-700 mb-2">Contact Information</h5>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaEnvelope />
                          <p>{currentRequest.requester.email}</p>
                        </div>
                        {currentRequest.requester.phone && (
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <FaPhone />
                            <p>{currentRequest.requester.phone}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-between p-4 border-t border-gray-100">
          <button 
            onClick={prevRequest}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
            disabled={requests.length <= 1}
          >
            <IoIosArrowBack />
            Previous
          </button>
          <span className="text-gray-500">
            {currentIndex + 1} of {requests.length}
          </span>
          <button 
            onClick={nextRequest}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
            disabled={requests.length <= 1}
          >
            Next
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoommateRequests;