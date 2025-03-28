// Components/ConnectedRoommates.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const ConnectedRoommates = () => {
  const { authorizationToken } = useAuth();
  const [roommates, setRoommates] = useState([]);
  const [profilePics, setProfilePics] = useState({});
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (roommates.length === 0) return <div className="text-center text-gray-600">No connected roommates yet.</div>;

  return (
    <motion.div
      className="flex flex-col items-center space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-teal-600">Connected Roommates</h2>
      {roommates.map((roommate) => (
        <motion.div
          key={roommate._id}
          className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            {profilePics[roommate._id] ? (
              <img
                src={profilePics[roommate._id]}
                alt={roommate.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 mb-4"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 text-teal-500 mb-4" />
            )}
            <h3 className="text-xl font-bold text-gray-800">{roommate.fullName}</h3>
            <div className="mt-4 text-gray-700 space-y-2">
              <p><strong>Email:</strong> {roommate.email}</p>
              <p><strong>Phone:</strong> {roommate.phone || "N/A"}</p>
              <p><strong>Lifestyle:</strong></p>
              <ul className="list-disc list-inside">
                <li>Sleep: {roommate.lifestyle.sleepSchedule}</li>
                <li>Cleanliness: {roommate.lifestyle.cleanliness}/5</li>
                <li>Smoking: {roommate.lifestyle.smoking ? "Yes" : "No"}</li>
                <li>Pets: {roommate.lifestyle.pets ? "Yes" : "No"}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ConnectedRoommates;