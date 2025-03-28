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

// Components/RoommateRequests.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FaUserCircle, FaCheck, FaTimes } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const RoommateRequests = () => {
  const { authorizationToken } = useAuth();
  const [requests, setRequests] = useState([]);
  const [profilePics, setProfilePics] = useState({});
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (requests.length === 0) return <div className="text-center text-gray-600">No pending roommate requests.</div>;

  return (
    <motion.div
      className="flex flex-col items-center space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-teal-600">Pending Roommate Requests</h2>
      {requests.map((request) => (
        <motion.div
          key={request.requester._id}
          className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            {profilePics[request.requester._id] ? (
              <img
                src={profilePics[request.requester._id]}
                alt={request.requester.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 mb-4"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 text-teal-500 mb-4" />
            )}
            <h3 className="text-xl font-bold text-gray-800">{request.requester.fullName}</h3>
            <div className="mt-4 text-gray-700 space-y-2">
              <p><strong>Age:</strong> {request.requester.age}</p>
              <p><strong>Gender:</strong> {request.requester.gender}</p>
              <p><strong>Location:</strong> {request.requester.preferredLocation}</p>
              <p><strong>Budget:</strong> ${request.requester.budget}</p>
              <p><strong>Lease:</strong> {request.requester.leaseDuration}</p>
              <p><strong>Lifestyle:</strong></p>
              <ul className="list-disc list-inside">
                <li>Sleep: {request.requester.lifestyle.sleepSchedule}</li>
                <li>Cleanliness: {request.requester.lifestyle.cleanliness}/5</li>
                <li>Smoking: {request.requester.lifestyle.smoking ? "Yes" : "No"}</li>
                <li>Pets: {request.requester.lifestyle.pets ? "Yes" : "No"}</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRequest(request.requester._id, "reject")}
              className="bg-red-500 text-white p-3 rounded-full"
            >
              <FaTimes size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRequest(request.requester._id, "accept")}
              className="bg-green-500 text-white p-3 rounded-full"
            >
              <FaCheck size={24} />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RoommateRequests;