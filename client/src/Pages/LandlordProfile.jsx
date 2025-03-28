import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaHome, 
  FaVenusMars, 
  FaMapMarkerAlt, 
  FaFileAlt, 
  FaEye, 
  FaSignOutAlt, 
  FaFileUpload,
  FaCalendarAlt,
  FaBuilding,
  FaStar,
  FaPlusCircle,
  FaList
} from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const LandlordProfile = () => {
  const { user, logoutUser, isLoading, authorizationToken } = useAuth();
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [verificationDocUrl, setVerificationDocUrl] = useState(null);
  const [proofOfOwnershipUrl, setProofOfOwnershipUrl] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (user?.profilePicture) {
          const response = await fetch(`${backendUrl}/api/landlords/file/${user.profilePicture}`, { 
            headers: { Authorization: authorizationToken } 
          });
          if (response.ok) setProfilePictureUrl(URL.createObjectURL(await response.blob()));
        }
        if (user?.verificationIdDoc) {
          const response = await fetch(`${backendUrl}/api/landlords/file/${user.verificationIdDoc}`, { 
            headers: { Authorization: authorizationToken } 
          });
          if (response.ok) setVerificationDocUrl(URL.createObjectURL(await response.blob()));
        }
        if (user?.proofOfOwnership) {
          const response = await fetch(`${backendUrl}/api/landlords/file/${user.proofOfOwnership}`, { 
            headers: { Authorization: authorizationToken } 
          });
          if (response.ok) setProofOfOwnershipUrl(URL.createObjectURL(await response.blob()));
        }
      } catch (error) {
        toast.error("Error fetching files");
      }
    };
    fetchFiles();
    return () => {
      [profilePictureUrl, verificationDocUrl, proofOfOwnershipUrl].forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [user, authorizationToken]);

  const handleDocumentClick = async (fileId, fileName) => {
    setDownloading(fileId);
    try {
      const response = await fetch(`${backendUrl}/api/landlords/file/${fileId}`, { 
        headers: { Authorization: authorizationToken } 
      });
      if (!response.ok) throw new Error("Failed to fetch document");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      toast.success(`Opened ${fileName}`);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDownloading(null);
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
            <FaUser className="text-teal-600" /> Landlord Dashboard
          </h1>
          <p className="text-lg text-teal-600">Manage your properties and profile</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-xl overflow-hidden"
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
              <div className="mt-4 space-y-2">
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <FaEnvelope className="text-teal-600" /> {user.email}
                </p>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <FaPhone className="text-teal-600" /> {user.phone}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span className="text-gray-700 font-medium">
                    Rating: {user.rating?.toFixed(1) || 'N/A'}/5
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <motion.button
                  onClick={logoutUser}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSignOutAlt /> Logout
                </motion.button>

                <Link 
                  to="/list-property" 
                  className="block w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md"
                >
                  <FaPlusCircle /> List Property
                </Link>

                <Link 
                  to="/landlord-properties" 
                  className="block w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md"
                >
                  <FaList /> My Properties
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaUser /> Personal Information
                </h2>
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

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaFileAlt /> Documents
                </h2>
              </div>
              <div className="p-6">
                {user.verificationIdDoc || user.proofOfOwnership || user.profilePicture ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    {user.proofOfOwnership && (
                      <DocumentCard
                        icon={<FaBuilding className="text-teal-600" />}
                        label="Proof of Ownership"
                        onClick={() => handleDocumentClick(user.proofOfOwnership, "Proof of Ownership")}
                        loading={downloading === user.proofOfOwnership}
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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Total Properties" 
                value={user.propertiesCount || 0} 
                icon={<FaBuilding className="text-teal-600 text-2xl" />}
                color="bg-teal-100"
              />
              <StatCard 
                title="Average Rating" 
                value={user.rating?.toFixed(1) || 'N/A'} 
                icon={<FaStar className="text-yellow-500 text-2xl" />}
                color="bg-yellow-100"
              />
              <StatCard 
                title="Verified Status" 
                value={user.isVerified ? "Verified" : "Pending"} 
                icon={<FaFileAlt className={user.isVerified ? "text-green-600 text-2xl" : "text-orange-500 text-2xl"} />}
                color={user.isVerified ? "bg-green-100" : "bg-orange-100"}
              />
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

const StatCard = ({ title, value, icon, color }) => (
  <motion.div 
    className={`${color} p-6 rounded-2xl shadow-sm`}
    whileHover={{ y: -5 }}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-white bg-opacity-50">
        {icon}
      </div>
    </div>
  </motion.div>
);

export default LandlordProfile;