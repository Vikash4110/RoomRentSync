import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";
import { FaUserCircle, FaPhone, FaEnvelope, FaArrowLeft, FaIdCard, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const LandProfileMain = () => {
  const { authorizationToken } = useAuth();
  const { landlordId } = useParams();
  const navigate = useNavigate();
  const [landlord, setLandlord] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertyImages, setPropertyImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandlordProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/landlords/landlord/${landlordId}`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch landlord profile");

        setLandlord(data);
        setProperties(data.properties);

        if (data.profilePicture) {
          const picResponse = await fetch(`${backendUrl}/api/landlords/file/${data.profilePicture}`, {
            headers: { Authorization: authorizationToken },
          });
          if (picResponse.ok) setProfilePic(URL.createObjectURL(await picResponse.blob()));
        }

        const images = {};
        for (const property of data.properties) {
          const imageUrls = await Promise.all(
            property.images.map(async (imgId) => {
              const imgResponse = await fetch(`${backendUrl}/api/landlords/file/${imgId}`, {
                headers: { Authorization: authorizationToken },
              });
              return imgResponse.ok ? URL.createObjectURL(await imgResponse.blob()) : null;
            })
          );
          images[property._id] = imageUrls.filter((url) => url);
        }
        setPropertyImages(images);
      } catch (error) {
        toast.error(error.message);
        navigate("/all-properties");
      } finally {
        setLoading(false);
      }
    };
    fetchLandlordProfile();
  }, [landlordId, authorizationToken, navigate]);

  const handlePropertyClick = (propertyId) => {
    navigate(`/property-detail/${propertyId}`);
  };

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  if (loading)
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-teal-100">
        <RotatingLines strokeColor="#0f766e" width="48" visible />
      </motion.div>
    );

  if (!landlord) return null;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-teal-50 to-teal-100 py-12 px-6 lg:px-12"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-teal-600 to-indigo-600 text-white p-6">
          <motion.button
            onClick={() => navigate(-1)}
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
            {landlord.fullName}'s Profile
          </motion.h1>
        </div>

        {/* Profile Section */}
        <div className="p-8 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Landlord Info */}
            <motion.div
              className="md:w-1/3 bg-teal-100 p-6 rounded-xl shadow-inner"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Landlord"
                    className="w-24 h-24 rounded-full object-cover border-2 border-teal-600 shadow-sm"
                  />
                ) : (
                  <FaUserCircle className="w-24 h-24 text-teal-600" />
                )}
                <div>
                  <p className="text-xl font-semibold text-gray-800">{landlord.fullName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    {landlord.isVerified ? (
                      <>
                        <FaCheckCircle className="text-teal-600" /> Verified Landlord
                      </>
                    ) : (
                      "Unverified Landlord"
                    )}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="flex items-center gap-2">
                  <FaPhone className="text-teal-600" /> <strong>Phone:</strong> {landlord.phone || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-teal-600" /> <strong>Email:</strong> {landlord.email || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <FaIdCard className="text-teal-600" /> <strong>Verification ID:</strong> {landlord.verificationIdNo || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-teal-600" /> <strong>Joined:</strong>{" "}
                  {landlord.createdAt ? new Date(landlord.createdAt).toLocaleDateString() : "N/A"}
                </p>
                {/* Add more fields as needed */}
              </div>
            </motion.div>

            {/* Properties Section */}
            <motion.div
              className="md:w-2/3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-semibold text-teal-800 mb-6">Properties</h2>
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <motion.div
                      key={property._id}
                      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => handlePropertyClick(property._id)}
                    >
                      <img
                        src={propertyImages[property._id]?.[0] || "https://via.placeholder.com/300x200"}
                        alt={property.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                      <p className="text-lg font-semibold text-gray-800">{property.title}</p>
                      <p className="text-gray-600">₹{property.price.toLocaleString()}</p>
                      <p className="text-gray-600">{property.location.city}, {property.location.state}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">No properties listed by this landlord.</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandProfileMain;