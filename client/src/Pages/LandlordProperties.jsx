import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSearch,
  IoFilter,
  IoChevronUp,
  IoChevronDown,
  IoBed,
  IoCalendar,
  IoCash,
} from "react-icons/io5";
import { RotatingLines } from "react-loader-spinner";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const LandlordProperties = () => {
  const { user, isLoading, authorizationToken } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [propertyImages, setPropertyImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/landlords/profile`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch properties");
        setProperties(data.properties);
        setFilteredProperties(data.properties);

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
      }
    };
    if (user) fetchProperties();
  }, [user, authorizationToken]);

  const handleExploreClick = (propertyId) => {
    navigate(`/property-detail/${propertyId}`);
  };

  // Handle search functionality
  const handleSearch = () => {
    let filtered = properties;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(lowerQuery) ||
          property.location.city.toLowerCase().includes(lowerQuery) ||
          property.propertyType.toLowerCase().includes(lowerQuery)
      );
    }
    setFilteredProperties(filtered);
  };

  // Handle sort functionality
  const handleSort = (sortType) => {
    let sortedProperties = [...filteredProperties];
    switch (sortType) {
      case "price_asc":
        sortedProperties.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sortedProperties.sort((a, b) => b.price - a.price);
        break;
      case "beds_asc":
        sortedProperties.sort((a, b) => a.bedrooms - b.bedrooms);
        break;
      case "beds_desc":
        sortedProperties.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case "date_asc":
        sortedProperties.sort((a, b) => new Date(a.availableFrom) - new Date(b.availableFrom));
        break;
      case "date_desc":
        sortedProperties.sort((a, b) => new Date(b.availableFrom) - new Date(a.availableFrom));
        break;
      default:
        break;
    }
    setFilteredProperties(sortedProperties);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, properties]);

  useEffect(() => {
    handleSort(sortBy);
  }, [sortBy]);

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  if (isLoading)
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-teal-100">
        <RotatingLines strokeColor="#0f766e" width="48" visible />
      </motion.div>
    );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-teal-50 to-teal-100 p-8 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Search and Sort Section */}
      <motion.div
        className="max-w-7xl mx-auto mb-12 bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="bg-gradient-to-r from-teal-600 to-indigo-600 p-8 text-white">
          <motion.h2
            className="text-4xl font-extrabold mb-6 tracking-tight leading-tight text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Manage Your Properties
          </motion.h2>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by title, city, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-5 pl-14 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 text-gray-800 shadow-sm bg-white text-lg"
            />
            <IoSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-teal-500" size={24} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <motion.button
              onClick={() => setSortBy("price_asc")}
              className="flex items-center justify-center p-3 bg-teal-700 bg-opacity-90 text-white rounded-lg hover:bg-teal-800 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoChevronUp className="mr-2" /> Price: Low
            </motion.button>
            <motion.button
              onClick={() => setSortBy("price_desc")}
              className="flex items-center justify-center p-3 bg-teal-700 bg-opacity-90 text-white rounded-lg hover:bg-teal-800 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoChevronDown className="mr-2" /> Price: High
            </motion.button>
            <motion.button
              onClick={() => setSortBy("beds_asc")}
              className="flex items-center justify-center p-3 bg-teal-700 bg-opacity-90 text-white rounded-lg hover:bg-teal-800 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoChevronUp className="mr-2" /> Beds: Low
            </motion.button>
            <motion.button
              onClick={() => setSortBy("beds_desc")}
              className="flex items-center justify-center p-3 bg-teal-700 bg-opacity-90 text-white rounded-lg hover:bg-teal-800 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoChevronDown className="mr-2" /> Beds: High
            </motion.button>
            <motion.button
              onClick={() => setSortBy("date_asc")}
              className="flex items-center justify-center p-3 bg-teal-700 bg-opacity-90 text-white rounded-lg hover:bg-teal-800 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoChevronUp className="mr-2" /> Date: Soon
            </motion.button>
            <motion.button
              onClick={() => setSortBy("date_desc")}
              className="flex items-center justify-center p-3 bg-teal-700 bg-opacity-90 text-white rounded-lg hover:bg-teal-800 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoChevronDown className="mr-2" /> Date: Later
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Properties List */}
      {filteredProperties.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence>
            {filteredProperties.map((property) => (
              <motion.div
                key={property._id}
                className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 to-indigo-400" />
                <motion.img
                  src={propertyImages[property._id]?.[0] }
                  alt={property.title}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 tracking-tight truncate">{property.title}</h3>
                  <p className="text-gray-700 flex items-center text-base">
                    <IoCash className="mr-2 text-teal-600" />
                    <span className="font-bold text-teal-800">₹{property.price.toLocaleString()}</span>
                  </p>
                  <p className="text-gray-700 flex items-center text-base">
                    <IoBed className="mr-2 text-teal-600" />
                    <span className="font-bold">Beds:</span> <span className="ml-1">{property.bedrooms}</span>
                  </p>
                  <p className="text-gray-700 flex items-center text-base">
                    <IoCalendar className="mr-2 text-teal-600" />
                    <span className="font-bold">Available:</span>{" "}
                    <span className="ml-1">{new Date(property.availableFrom).toLocaleDateString()}</span>
                  </p>
                  <p className="text-gray-700 flex items-center text-base">
                    <IoFilter className="mr-2 text-teal-600" />
                    <span className="font-bold">Type:</span> <span className="ml-1">{property.propertyType}</span>
                  </p>
                </div>
                <motion.button
                  onClick={() => handleExploreClick(property._id)}
                  className="mt-6 w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-indigo-500 hover:from-teal-700 hover:to-indigo-600 shadow-md transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Property
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center text-gray-600 italic py-10">
          <p className="text-lg font-medium">No properties match your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search or add a new property!</p>
        </div>
      )}
    </motion.div>
  );
};

export default LandlordProperties;

