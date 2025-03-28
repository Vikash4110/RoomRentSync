// // Components/ConnectedRoommates.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { FaUserCircle } from "react-icons/fa";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const ConnectedRoommates = () => {
//   const { authorizationToken } = useAuth();
//   const [roommates, setRoommates] = useState([]);
//   const [profilePics, setProfilePics] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRoommates = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/clients/connected-roommates`, {
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
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoommates();
//   }, [authorizationToken]);

//   if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
//   if (roommates.length === 0) return <div className="text-center text-gray-600">No connected roommates yet.</div>;

//   return (
//     <motion.div
//       className="flex flex-col items-center space-y-6"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <h2 className="text-2xl font-bold text-teal-600">Connected Roommates</h2>
//       {roommates.map((roommate) => (
//         <motion.div
//           key={roommate._id}
//           className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex flex-col items-center">
//             {profilePics[roommate._id] ? (
//               <img
//                 src={profilePics[roommate._id]}
//                 alt={roommate.fullName}
//                 className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 mb-4"
//               />
//             ) : (
//               <FaUserCircle className="w-24 h-24 text-teal-500 mb-4" />
//             )}
//             <h3 className="text-xl font-bold text-gray-800">{roommate.fullName}</h3>
//             <div className="mt-4 text-gray-700 space-y-2">
//               <p><strong>Email:</strong> {roommate.email}</p>
//               <p><strong>Phone:</strong> {roommate.phone || "N/A"}</p>
//               <p><strong>Lifestyle:</strong></p>
//               <ul className="list-disc list-inside">
//                 <li>Sleep: {roommate.lifestyle.sleepSchedule}</li>
//                 <li>Cleanliness: {roommate.lifestyle.cleanliness}/5</li>
//                 <li>Smoking: {roommate.lifestyle.smoking ? "Yes" : "No"}</li>
//                 <li>Pets: {roommate.lifestyle.pets ? "Yes" : "No"}</li>
//               </ul>
//             </div>
//           </div>
//         </motion.div>
//       ))}
//     </motion.div>
//   );
// };

// export default ConnectedRoommates;

// MAIIN
import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaEnvelope, FaPhone, FaInfoCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import LoadingSpinner from "../Components/LoadingSpinner";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const ConnectedRoommates = () => {
  const { authorizationToken, user } = useAuth();
  const [roommates, setRoommates] = useState([]);
  const [profilePics, setProfilePics] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedRoommate, setExpandedRoommate] = useState(null);

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/clients/connected-roommates`, {
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
      } finally {
        setLoading(false);
      }
    };
    fetchRoommates();
  }, [authorizationToken]);

  const toggleExpand = (id) => {
    setExpandedRoommate(expandedRoommate === id ? null : id);
  };

  const nextRoommate = () => {
    setCurrentIndex((prev) => (prev + 1) % roommates.length);
    setExpandedRoommate(null);
  };

  const prevRoommate = () => {
    setCurrentIndex((prev) => (prev - 1 + roommates.length) % roommates.length);
    setExpandedRoommate(null);
  };

  if (loading) return <LoadingSpinner />;
  if (roommates.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <FaInfoCircle className="text-4xl text-teal-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700">No Connected Roommates</h3>
      <p className="text-gray-500 mt-2">You haven't connected with any roommates yet.</p>
    </div>
  );

  const currentRoommate = roommates[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">Your Roommate Connections</h2>
      
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoommate._id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:w-1/3">
                {profilePics[currentRoommate._id] ? (
                  <img
                    src={profilePics[currentRoommate._id]}
                    alt={currentRoommate.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 mb-4"
                  />
                ) : (
                  <FaUserCircle className="w-32 h-32 text-teal-500 mb-4" />
                )}
                
                <h3 className="text-2xl font-bold text-gray-800 text-center">
                  {currentRoommate.fullName}
                </h3>
                
                <div className="mt-4 flex flex-col items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaEnvelope />
                    <p>{currentRoommate.email}</p>
                  </div>
                  {currentRoommate.phone && (
                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <FaPhone />
                      <p>{currentRoommate.phone}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div 
                  className={`bg-gray-50 p-4 rounded-lg transition-all duration-300 ${expandedRoommate === currentRoommate._id ? 'max-h-96' : 'max-h-24 overflow-hidden'}`}
                >
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(currentRoommate._id)}>
                    <h4 className="font-semibold text-teal-600">Roommate Details</h4>
                    <motion.div
                      animate={{ rotate: expandedRoommate === currentRoommate._id ? 180 : 0 }}
                    >
                      <IoIosArrowDown />
                    </motion.div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <h5 className="font-medium text-gray-700 mb-2">Basic Info</h5>
                        <p><span className="font-medium">Age:</span> {currentRoommate.age}</p>
                        <p><span className="font-medium">Gender:</span> {currentRoommate.gender}</p>
                        <p><span className="font-medium">Location:</span> {currentRoommate.preferredLocation}</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg">
                        <h5 className="font-medium text-gray-700 mb-2">Housing Preferences</h5>
                        <p><span className="font-medium">Budget:</span> ${currentRoommate.budget}/mo</p>
                        <p><span className="font-medium">Lease:</span> {currentRoommate.leaseDuration}</p>
                      </div>
                    </div>
                    
                    {expandedRoommate === currentRoommate._id && (
                      <div className="mt-4 bg-white p-3 rounded-lg">
                        <h5 className="font-medium text-gray-700 mb-2">Lifestyle</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p><span className="font-medium">Sleep Schedule:</span> {currentRoommate.lifestyle.sleepSchedule}</p>
                            <p><span className="font-medium">Cleanliness:</span> {currentRoommate.lifestyle.cleanliness}/5</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Smoking:</span> {currentRoommate.lifestyle.smoking ? "Yes" : "No"}</p>
                            <p><span className="font-medium">Pets:</span> {currentRoommate.lifestyle.pets ? "Yes" : "No"}</p>
                          </div>
                        </div>
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
            onClick={prevRoommate}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
            disabled={roommates.length <= 1}
          >
            <IoIosArrowBack />
            Previous
          </button>
          <span className="text-gray-500">
            {currentIndex + 1} of {roommates.length}
          </span>
          <button 
            onClick={nextRoommate}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
            disabled={roommates.length <= 1}
          >
            Next
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedRoommates;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { FaUserCircle, FaComment } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useSocket } from "../context/SocketContext";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const ConnectedRoommates = () => {
//   const { authorizationToken, user } = useAuth();
//   const [roommates, setRoommates] = useState([]);
//   const [profilePics, setProfilePics] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const navigate = useNavigate();
//   const socket = useSocket();

//   useEffect(() => {
//     const fetchRoommates = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/clients/connected-roommates`, {
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
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoommates();
//   }, [authorizationToken]);

//   useEffect(() => {
//     if (!socket) return;

//     // Listen for online users updates
//     socket.on('online-users', (users) => {
//       setOnlineUsers(users);
//     });

//     // Request online users list
//     socket.emit('get-online-users');

//     return () => {
//       socket.off('online-users');
//     };
//   }, [socket]);

//   const handleMessageClick = (roommateId) => {
//     navigate(`/messages/${roommateId}`);
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-64">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//     </div>
//   );

//   if (roommates.length === 0) return (
//     <div className="text-center py-12">
//       <h3 className="text-xl font-medium text-gray-700 mb-2">No connected roommates yet</h3>
//       <p className="text-gray-500">Find and connect with potential roommates to start messaging</p>
//     </div>
//   );

//   return (
//     <motion.div
//       className="container mx-auto px-4 py-8"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">Your Roommate Connections</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {roommates.map((roommate) => (
//           <motion.div
//             key={roommate._id}
//             className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//             whileHover={{ y: -5 }}
//             transition={{ duration: 0.2 }}
//           >
//             <div className="p-6">
//               <div className="flex flex-col items-center">
//                 <div className="relative">
//                   {profilePics[roommate._id] ? (
//                     <img
//                       src={profilePics[roommate._id]}
//                       alt={roommate.fullName}
//                       className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 mb-4"
//                     />
//                   ) : (
//                     <FaUserCircle className="w-24 h-24 text-teal-500 mb-4" />
//                   )}
//                   {onlineUsers.includes(roommate._id) && (
//                     <div className="absolute bottom-4 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                   )}
//                 </div>
                
//                 <h3 className="text-xl font-bold text-gray-800 text-center">{roommate.fullName}</h3>
//                 <p className="text-gray-500 text-sm mb-4">
//                   {onlineUsers.includes(roommate._id) ? 'Online now' : 'Last seen recently'}
//                 </p>
                
//                 <button
//                   onClick={() => handleMessageClick(roommate._id)}
//                   className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
//                 >
//                   <FaComment /> Message
//                 </button>
//               </div>

//               <div className="mt-6 border-t border-gray-100 pt-4">
//                 <h4 className="font-semibold text-gray-700 mb-2">Lifestyle Preferences</h4>
//                 <ul className="space-y-1 text-sm text-gray-600">
//                   <li className="flex justify-between">
//                     <span>Sleep Schedule:</span>
//                     <span className="font-medium">{roommate.lifestyle.sleepSchedule}</span>
//                   </li>
//                   <li className="flex justify-between">
//                     <span>Cleanliness:</span>
//                     <span className="font-medium">{roommate.lifestyle.cleanliness}/5</span>
//                   </li>
//                   <li className="flex justify-between">
//                     <span>Smoking:</span>
//                     <span className="font-medium">{roommate.lifestyle.smoking ? "Yes" : "No"}</span>
//                   </li>
//                   <li className="flex justify-between">
//                     <span>Pets:</span>
//                     <span className="font-medium">{roommate.lifestyle.pets ? "Yes" : "No"}</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// export default ConnectedRoommates;