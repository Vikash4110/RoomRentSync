// Components/ClientConnectedLandlords.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const ClientConnectedLandlords = () => {
  const { authorizationToken, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePics, setProfilePics] = useState({});

  useEffect(() => {
    console.log("ClientConnectedLandlords - Current role:", role);
    console.log("ClientConnectedLandlords - Authorization token:", authorizationToken);
    console.log("ClientConnectedLandlords - isLoading:", isLoading);

    if (isLoading) return;

    if (!authorizationToken) {
      toast.error("Please log in as a client");
      navigate("/login");
      return;
    }
    if (role !== "client") {
      toast.error("Only clients can view this page");
      navigate("/all-properties");
      return;
    }

    const fetchConnectedLandlords = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/clients/connected-landlords`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await response.json();
        console.log("Connected landlords data:", data);
        if (!response.ok) throw new Error(data.message || "Failed to fetch connected landlords");

        setLandlords(data.landlords);

        const pics = {};
        for (const landlord of data.landlords) {
          if (landlord.profilePicture) {
            const picResponse = await fetch(`${backendUrl}${landlord.profilePicture}`, {
              headers: { Authorization: authorizationToken },
            });
            if (picResponse.ok) pics[landlord.landlordId] = URL.createObjectURL(await picResponse.blob());
          }
        }
        setProfilePics(pics);
      } catch (error) {
        console.error("Fetch connected landlords error:", error);
        toast.error(error.message);
        navigate("/all-properties");
      } finally {
        setLoading(false);
      }
    };
    fetchConnectedLandlords();
  }, [authorizationToken, navigate, role, isLoading]);

  if (isLoading || loading) {
    return (
      <motion.div className="flex items-center justify-center h-full">
        <RotatingLines strokeColor="#0f766e" width="48" visible />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Connected Landlords</h2>
      {landlords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {landlords.map((landlord) => {
            // Safely handle location if it's still an object (fallback for old data)
            const locationDisplay =
              typeof landlord.property.location === "object"
                ? `${landlord.property.location.address || ""}, ${landlord.property.location.city || ""}, ${landlord.property.location.state || ""} ${landlord.property.location.zipCode || ""}`.trim()
                : landlord.property.location || "N/A";

            return (
              <motion.div
                key={landlord.landlordId}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  {profilePics[landlord.landlordId] ? (
                    <img
                      src={profilePics[landlord.landlordId]}
                      alt={landlord.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-teal-600"
                    />
                  ) : (
                    <FaUserCircle className="w-16 h-16 text-teal-600" />
                  )}
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{landlord.fullName}</p>
                    <p className="text-sm text-gray-600">{landlord.property.title}</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> {landlord.email}</p>
                  <p><strong>Phone:</strong> {landlord.phone}</p>
                  <p><strong>Property Location:</strong> {locationDisplay}</p>
                  <p><strong>Price:</strong> ${landlord.property.price}</p>
                  <p><strong>Connected On:</strong> {new Date(landlord.connectedOn).toLocaleDateString()}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600 italic text-center">No connected landlords yet.</p>
      )}
    </motion.div>
  );
};

export default ClientConnectedLandlords;