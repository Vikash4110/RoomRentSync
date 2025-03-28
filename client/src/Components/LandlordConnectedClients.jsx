// components/LandlordConnectedClients.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const LandlordConnectedClients = () => {
  const { authorizationToken, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true); // Local loading for fetch
  const [profilePics, setProfilePics] = useState({});

  useEffect(() => {
    console.log("LandlordConnectedClients - Current role:", role);
    console.log("LandlordConnectedClients - Authorization token:", authorizationToken);
    console.log("LandlordConnectedClients - isLoading:", isLoading);

    // Wait until authentication is complete
    if (isLoading) return; // Do nothing until isLoading is false

    if (!authorizationToken) {
      toast.error("Please log in as a landlord");
      navigate("/landlord-login");
      return;
    }
    if (role !== "landlord") {
      toast.error("Only landlords can view this page");
      navigate("/all-properties");
      return;
    }

    const fetchConnectedClients = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/landlords/connected-clients`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await response.json();
        console.log("Connected clients data:", data);
        if (!response.ok) throw new Error(data.message || "Failed to fetch connected clients");

        setClients(data);

        const pics = {};
        for (const request of data) {
          if (request.client.profilePicture) {
            const picResponse = await fetch(`${backendUrl}/api/landlords/file/${request.client.profilePicture}`, {
              headers: { Authorization: authorizationToken },
            });
            if (picResponse.ok) pics[request.client._id] = URL.createObjectURL(await picResponse.blob());
          }
        }
        setProfilePics(pics);
      } catch (error) {
        console.error("Fetch connected clients error:", error);
        toast.error(error.message);
        navigate("/all-properties");
      } finally {
        setLoading(false);
      }
    };
    fetchConnectedClients();
  }, [authorizationToken, navigate, role, isLoading]);

  if (isLoading || loading) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-teal-100">
        <RotatingLines strokeColor="#0f766e" width="48" visible />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-teal-50 to-teal-100 py-12 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative bg-gradient-to-r from-teal-600 to-indigo-600 text-white p-6">
          <motion.button
            onClick={() => navigate("/landlord-properties")}
            className="absolute top-4 left-4 bg-white text-teal-600 p-2 rounded-full hover:bg-teal-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowLeft size={20} />
          </motion.button>
          <motion.h1
            className="text-4xl font-extrabold tracking-tight text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Connected Clients
          </motion.h1>
        </div>
        <div className="p-8 bg-gray-50">
          {clients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((request) => (
                <motion.div
                  key={request._id}
                  className="bg-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {profilePics[request.client._id] ? (
                      <img
                        src={profilePics[request.client._id]}
                        alt={request.client.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-teal-600"
                      />
                    ) : (
                      <FaUserCircle className="w-16 h-16 text-teal-600" />
                    )}
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{request.client.fullName}</p>
                      <p className="text-sm text-gray-600">{request.property.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> {request.client.email}</p>
                    <p><strong>Phone:</strong> {request.client.phone || "N/A"}</p>
                    <p><strong>Age:</strong> {request.client.age}</p>
                    <p><strong>Gender:</strong> {request.client.gender}</p>
                    <p><strong>Preference:</strong> {request.client.preference}</p>
                    <p><strong>Connected On:</strong> {new Date(request.updatedAt).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic text-center">No connected clients yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LandlordConnectedClients;