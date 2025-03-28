// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import { RotatingLines } from "react-loader-spinner";
// import { motion } from "framer-motion";
// import {
//   FaMapMarkerAlt,
//   FaMoneyBillWave,
//   FaCalendarAlt,
//   FaBed,
//   FaBath,
//   FaRulerCombined,
//   FaArrowLeft,
//   FaUserCircle,
//   FaPhone,
//   FaEnvelope,
//   FaUser,
// } from "react-icons/fa";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const PropertyDetail = () => {
//   const { authorizationToken, user } = useAuth();
//   const { propertyId } = useParams();
//   const navigate = useNavigate();
//   const [property, setProperty] = useState(null);
//   const [propertyImages, setPropertyImages] = useState([]);
//   const [landlordProfilePic, setLandlordProfilePic] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/landlords/profile`, {
//           headers: { Authorization: authorizationToken },
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to fetch property");

//         const selectedProperty = data.properties.find((p) => p._id === propertyId);
//         if (!selectedProperty) throw new Error("Property not found");
//         setProperty(selectedProperty);

//         const imageUrls = await Promise.all(
//           selectedProperty.images.map(async (imgId) => {
//             const imgResponse = await fetch(`${backendUrl}/api/landlords/file/${imgId}`, {
//               headers: { Authorization: authorizationToken },
//             });
//             return imgResponse.ok ? URL.createObjectURL(await imgResponse.blob()) : null;
//           })
//         );
//         setPropertyImages(imageUrls.filter((url) => url));

//         if (user?.profilePicture) {
//           const picResponse = await fetch(`${backendUrl}/api/landlords/file/${user.profilePicture}`, {
//             headers: { Authorization: authorizationToken },
//           });
//           if (picResponse.ok) setLandlordProfilePic(URL.createObjectURL(await picResponse.blob()));
//         }
//       } catch (error) {
//         toast.error(error.message);
//         navigate("/landlord-properties");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProperty();
//   }, [propertyId, authorizationToken, navigate, user]);

//   const bgVariants = {
//     animate: {
//       backgroundPosition: ["0% 0%", "100% 100%"],
//       transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
//     },
//   };

//   if (loading)
//     return (
//       <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-teal-100">
//         <RotatingLines strokeColor="#0f766e" width="48" visible />
//       </motion.div>
//     );

//   if (!property) return null;

//   return (
//     <motion.div
//       className="min-h-screen bg-gradient-to-br from-indigo-50 via-teal-50 to-teal-100 py-12 px-6 lg:px-12"
//       variants={bgVariants}
//       animate="animate"
//       style={{ backgroundSize: "200% 200%" }}
//     >
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
//         {/* Header Section */}
//         <div className="relative bg-gradient-to-r from-teal-600 to-indigo-600 text-white p-6">
//           <motion.button
//             onClick={() => navigate("/landlord-properties")}
//             className="absolute top-4 left-4 bg-white text-teal-600 p-2 rounded-full hover:bg-teal-100 transition-colors"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <FaArrowLeft size={20} />
//           </motion.button>
//           <motion.h1
//             className="text-4xl font-extrabold tracking-tight text-center"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             {property.title}
//           </motion.h1>
//           <motion.p
//             className="text-lg mt-2 flex items-center justify-center gap-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//           >
//             <FaMapMarkerAlt /> {`${property.location.address}, ${property.location.city}, ${property.location.state} ${property.location.zipCode}`}
//           </motion.p>
//         </div>

//         {/* Details Section */}
//         <div className="p-8 bg-gray-50">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Property Details */}
//             <motion.div
//               className="lg:col-span-2"
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               <h2 className="text-3xl font-semibold text-teal-800 mb-6">Property Details</h2>
//               <div className="space-y-6 text-gray-700 bg-white p-6 rounded-xl shadow-md">
//                 <p className="text-2xl font-bold text-teal-700 flex items-center gap-2">
//                   <FaMoneyBillWave /> ₹{property.price.toLocaleString()}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <FaRulerCombined className="text-teal-600" /> <strong className="text-teal-600">Type:</strong> {property.propertyType}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <FaBed className="text-teal-600" /> <strong className="text-teal-600">Bedrooms:</strong> {property.bedrooms}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <FaBath className="text-teal-600" /> <strong className="text-teal-600">Bathrooms:</strong> {property.bathrooms}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <FaCalendarAlt className="text-teal-600" /> <strong className="text-teal-600">Available From:</strong> {new Date(property.availableFrom).toLocaleDateString()}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <FaCalendarAlt className="text-teal-600" /> <strong className="text-teal-600">Lease Duration:</strong> {property.leaseDuration}
//                 </p>
//                 <p>
//                   <strong className="text-teal-600">Description:</strong> {property.description}
//                 </p>
//                 <p>
//                   <strong className="text-teal-600">Amenities:</strong> {property.amenities.length ? property.amenities.join(", ") : "None"}
//                 </p>
//                 <p>
//                   <strong className="text-teal-600">Rules:</strong> Smoking: {property.rules.smoking ? "Yes" : "No"}, Pets: {property.rules.pets ? "Yes" : "No"}, Alcohol: {property.rules.alcohol ? "Yes" : "No"}, Guests: {property.rules.guests ? "Yes" : "No"}
//                 </p>
//                 <p>
//                   <strong className="text-teal-600">Additional Details:</strong> Furnished: {property.additionalDetails.furnished ? "Yes" : "No"}, Utilities: {property.additionalDetails.utilitiesIncluded ? "Yes" : "No"}, Parking: {property.additionalDetails.parking ? "Yes" : "No"}
//                 </p>
//               </div>
//             </motion.div>

//             {/* Landlord Info */}
//             <motion.div
//               className="bg-teal-100 p-6 rounded-xl shadow-inner"
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               <h2 className="text-2xl font-semibold text-teal-800 mb-4">Landlord Information</h2>
//               <div className="flex items-center gap-4 mb-6">
//                 {landlordProfilePic ? (
//                   <img
//                     src={landlordProfilePic}
//                     alt="Landlord"
//                     className="w-20 h-20 rounded-full object-cover border-2 border-teal-600 shadow-sm"
//                   />
//                 ) : (
//                   <FaUserCircle className="w-20 h-20 text-teal-600" />
//                 )}
//                 <div>
//                   <p className="text-lg font-semibold text-gray-800">{user?.fullName || "Landlord Name"}</p>
//                   <p className="text-sm text-gray-600">Verified Landlord</p>
//                 </div>
//               </div>
//               <div className="space-y-4 text-gray-700">
//                 <p className="flex items-center gap-2">
//                   <FaPhone className="text-teal-600" /> {user?.phone || "N/A"}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <FaEnvelope className="text-teal-600" /> {user?.email || "N/A"}
//                 </p>
//               </div>
//               <motion.button
//                 className="mt-6 w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-md"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Contact Landlord
//               </motion.button>
//               <motion.button
//                 onClick={() => navigate("/landlord-profile")}
//                 className="mt-4 w-full bg-white text-teal-600 border border-teal-600 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-md"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaUser className="inline mr-2" /> View Landlord Profile
//               </motion.button>
//             </motion.div>
//           </div>
//         </div>

//         {/* Images Section */}
//         <div className="p-8">
//           <motion.h2
//             className="text-3xl font-semibold text-teal-800 mb-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             Property Images
//           </motion.h2>
//           {propertyImages.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {propertyImages.map((img, idx) => (
//                 <motion.img
//                   key={idx}
//                   src={img}
//                   alt={`Property Image ${idx + 1}`}
//                   className="w-full h-64 object-cover rounded-xl shadow-md"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: idx * 0.1, duration: 0.5 }}
//                   whileHover={{ scale: 1.03 }}
//                 />
//               ))}
//             </div>
//           ) : (
//             <motion.div
//               className="h-64 bg-gray-200 flex items-center justify-center rounded-xl"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <p className="text-gray-500 italic text-lg">No images available</p>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default PropertyDetail;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaArrowLeft,
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const PropertyDetail = () => {
  const { authorizationToken } = useAuth();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [propertyImages, setPropertyImages] = useState([]);
  const [landlordProfilePic, setLandlordProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/landlords/properties/${propertyId}`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch property");

        setProperty(data);

        const imageUrls = await Promise.all(
          data.images.map(async (imgId) => {
            const imgResponse = await fetch(`${backendUrl}/api/landlords/file/${imgId}`, {
              headers: { Authorization: authorizationToken },
            });
            return imgResponse.ok ? URL.createObjectURL(await imgResponse.blob()) : null;
          })
        );
        setPropertyImages(imageUrls.filter((url) => url));

        if (data.landlord?.profilePicture) {
          const picResponse = await fetch(`${backendUrl}/api/landlords/file/${data.landlord.profilePicture}`, {
            headers: { Authorization: authorizationToken },
          });
          if (picResponse.ok) setLandlordProfilePic(URL.createObjectURL(await picResponse.blob()));
        }
      } catch (error) {
        toast.error(error.message);
        navigate("/all-properties"); // Redirect to a general page on error
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, authorizationToken, navigate]);

  const handleViewLandlordProfile = () => {
    if (property?.landlord?._id) {
      navigate(`/landlord/${property.landlord._id}`);
    } else {
      toast.error("Landlord ID not found");
    }
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

  if (!property) return null;

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
            onClick={() => navigate(-1)} // Go back to the previous page (e.g., LandProfileMain)
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
            {property.title}
          </motion.h1>
          <motion.p
            className="text-lg mt-2 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <FaMapMarkerAlt /> {`${property.location.address}, ${property.location.city}, ${property.location.state} ${property.location.zipCode}`}
          </motion.p>
        </div>

        {/* Details Section */}
        <div className="p-8 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-semibold text-teal-800 mb-6">Property Details</h2>
              <div className="space-y-6 text-gray-700 bg-white p-6 rounded-xl shadow-md">
                <p className="text-2xl font-bold text-teal-700 flex items-center gap-2">
                  <FaMoneyBillWave /> ₹{property.price.toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <FaRulerCombined className="text-teal-600" /> <strong className="text-teal-600">Type:</strong> {property.propertyType}
                </p>
                <p className="flex items-center gap-2">
                  <FaBed className="text-teal-600" /> <strong className="text-teal-600">Bedrooms:</strong> {property.bedrooms}
                </p>
                <p className="flex items-center gap-2">
                  <FaBath className="text-teal-600" /> <strong className="text-teal-600">Bathrooms:</strong> {property.bathrooms}
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-teal-600" /> <strong className="text-teal-600">Available From:</strong> {new Date(property.availableFrom).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-teal-600" /> <strong className="text-teal-600">Lease Duration:</strong> {property.leaseDuration}
                </p>
                <p>
                  <strong className="text-teal-600">Description:</strong> {property.description}
                </p>
                <p>
                  <strong className="text-teal-600">Amenities:</strong> {property.amenities.length ? property.amenities.join(", ") : "None"}
                </p>
                <p>
                  <strong className="text-teal-600">Rules:</strong> Smoking: {property.rules.smoking ? "Yes" : "No"}, Pets: {property.rules.pets ? "Yes" : "No"}, Alcohol: {property.rules.alcohol ? "Yes" : "No"}, Guests: {property.rules.guests ? "Yes" : "No"}
                </p>
                <p>
                  <strong className="text-teal-600">Additional Details:</strong> Furnished: {property.additionalDetails.furnished ? "Yes" : "No"}, Utilities: {property.additionalDetails.utilitiesIncluded ? "Yes" : "No"}, Parking: {property.additionalDetails.parking ? "Yes" : "No"}
                </p>
              </div>
            </motion.div>

            {/* Landlord Info */}
            <motion.div
              className="bg-teal-100 p-6 rounded-xl shadow-inner"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">Landlord Information</h2>
              <div className="flex items-center gap-4 mb-6">
                {landlordProfilePic ? (
                  <img
                    src={landlordProfilePic}
                    alt="Landlord"
                    className="w-20 h-20 rounded-full object-cover border-2 border-teal-600 shadow-sm"
                  />
                ) : (
                  <FaUserCircle className="w-20 h-20 text-teal-600" />
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-800">{property.landlord.fullName}</p>
                  <p className="text-sm text-gray-600">Verified Landlord</p>
                </div>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="flex items-center gap-2">
                  <FaPhone className="text-teal-600" /> {property.landlord.phone || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-teal-600" /> {property.landlord.email || "N/A"}
                </p>
              </div>
              <motion.button
                className="mt-6 w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Landlord
              </motion.button>
              <motion.button
                onClick={handleViewLandlordProfile}
                className="mt-4 w-full bg-white text-teal-600 border border-teal-600 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser className="inline mr-2" /> View Landlord Profile
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Images Section */}
        <div className="p-8">
          <motion.h2
            className="text-3xl font-semibold text-teal-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Property Images
          </motion.h2>
          {propertyImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyImages.map((img, idx) => (
                <motion.img
                  key={idx}
                  src={img}
                  alt={`Property Image ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="h-64 bg-gray-200 flex items-center justify-center rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-500 italic text-lg">No images available</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetail;