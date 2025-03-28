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
  IoLocationSharp,
  IoPerson,
  IoStar,
  IoHeart,
  IoHeartOutline
} from "react-icons/io5";
import { RotatingLines } from "react-loader-spinner";
import { FaBath, FaRulerCombined, FaWifi, FaParking } from "react-icons/fa";
import { GiHomeGarage } from "react-icons/gi";
import { MdPets, MdSmokeFree } from "react-icons/md";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const AllProperties = () => {
  const { user, isLoading, authorizationToken } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [propertyImages, setPropertyImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    availableFrom: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/landlords/properties`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch properties");
        setProperties(data);
        setFilteredProperties(data);

        const images = {};
        for (const property of data) {
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

        // Fetch favorites if user is logged in
        if (user && user.favorites) {
          setFavorites(user.favorites);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (user) fetchProperties();
  }, [user, authorizationToken]);

  const handleExploreClick = (propertyId) => {
    navigate(`/property-detail-main/${propertyId}`);
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const response = await fetch(`${backendUrl}/api/clients/toggle-favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({
          propertyId: propertyId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update favorites");

      setFavorites(prev => 
        prev.includes(propertyId) 
          ? prev.filter(id => id !== propertyId) 
          : [...prev, propertyId]
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearch = () => {
    let filtered = properties;
    
    // Text search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(lowerQuery) ||
          property.location.city.toLowerCase().includes(lowerQuery) ||
          property.propertyType.toLowerCase().includes(lowerQuery) ||
          property.landlord.fullName.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by property type
    if (activeFilters.propertyType) {
      filtered = filtered.filter(
        property => property.propertyType === activeFilters.propertyType
      );
    }

    // Filter by price range
    if (activeFilters.minPrice) {
      filtered = filtered.filter(
        property => property.price >= parseInt(activeFilters.minPrice)
      );
    }
    if (activeFilters.maxPrice) {
      filtered = filtered.filter(
        property => property.price <= parseInt(activeFilters.maxPrice)
      );
    }

    // Filter by bedrooms
    if (activeFilters.bedrooms) {
      filtered = filtered.filter(
        property => property.bedrooms >= parseInt(activeFilters.bedrooms)
      );
    }

    // Filter by availability
    if (activeFilters.availableFrom) {
      const filterDate = new Date(activeFilters.availableFrom);
      filtered = filtered.filter(
        property => new Date(property.availableFrom) >= filterDate
      );
    }

    setFilteredProperties(filtered);
  };

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
      case "rating_desc":
        sortedProperties.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    setFilteredProperties(sortedProperties);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, properties, activeFilters]);

  useEffect(() => {
    handleSort(sortBy);
  }, [sortBy]);

  const propertyTypes = [...new Set(properties.map(p => p.propertyType))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-50">
        <RotatingLines strokeColor="#0f766e" width="48" visible />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
       {/* Search and Filter Header */}
<div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
  <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
    <h1 className="text-3xl font-bold text-center mb-6">Find Your Perfect Property</h1>
    
    {/* Search Bar - Updated styling */}
    <div className="relative mb-6 max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Search by location, property type, or features..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-4 pl-12 rounded-xl focus:ring-2 focus:ring-teal-400 text-white shadow-md text-lg border border-gray-200"
      />
      <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600" size={24} />
    </div>

    {/* Quick Filters - Updated button styling */}
    <div className="flex flex-wrap justify-center gap-3 mb-4">
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-teal-700 rounded-full hover:bg-teal-50 transition font-medium"
      >
        <IoFilter /> {showFilters ? 'Hide Filters' : 'More Filters'}
      </button>
      <button 
        onClick={() => setSortBy("price_asc")}
        className={`flex items-center gap-1 px-4 py-2 rounded-full transition font-medium ${sortBy === "price_asc" ? 'bg-white text-teal-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
      >
        <IoChevronUp /> Price: Low to High
      </button>
      <button 
        onClick={() => setSortBy("price_desc")}
        className={`flex items-center gap-1 px-4 py-2 rounded-full transition font-medium ${sortBy === "price_desc" ? 'bg-white text-teal-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
      >
        <IoChevronDown /> Price: High to Low
      </button>
      <button 
        onClick={() => setSortBy("rating_desc")}
        className={`flex items-center gap-1 px-4 py-2 rounded-full transition font-medium ${sortBy === "rating_desc" ? 'bg-white text-teal-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
      >
        <IoStar /> Top Rated
      </button>
    </div>

    {/* Expanded Filters */}
    {showFilters && (
      <motion.div 
        className="bg-white/10 p-4 rounded-lg mt-4 backdrop-blur-sm"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Property Type</label>
            <select
              value={activeFilters.propertyType}
              onChange={(e) => setActiveFilters({...activeFilters, propertyType: e.target.value})}
              className="w-full p-2 rounded-lg border border-gray-300 text-black bg-white"
            >
              <option value="">All Types</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Min Price</label>
            <input
              type="number"
              placeholder="₹ Min"
              value={activeFilters.minPrice}
              onChange={(e) => setActiveFilters({...activeFilters, minPrice: e.target.value})}
              className="w-full p-2 rounded-lg border border-gray-300 text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Max Price</label>
            <input
              type="number"
              placeholder="₹ Max"
              value={activeFilters.maxPrice}
              onChange={(e) => setActiveFilters({...activeFilters, maxPrice: e.target.value})}
              className="w-full p-2 rounded-lg border border-gray-300 text-black bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Bedrooms (min)</label>
            <select
              value={activeFilters.bedrooms}
              onChange={(e) => setActiveFilters({...activeFilters, bedrooms: e.target.value})}
              className="w-full p-2 rounded-lg border border-gray-300 text-black bg-white"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Available From</label>
            <input
              type="date"
              value={activeFilters.availableFrom}
              onChange={(e) => setActiveFilters({...activeFilters, availableFrom: e.target.value})}
              className="w-full p-2 rounded-lg border border-gray-300 text-black bg-white"
            />
          </div>
        </div>
      </motion.div>
    )}
  </div>
</div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProperties.map((property) => (
                <motion.div
                  key={property._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  {/* Property Image */}
                  <div className="relative h-60 overflow-hidden">
                    {propertyImages[property._id]?.[0] ? (
                      <img
                        src={propertyImages[property._id][0]}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property._id);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                      >
                        {favorites.includes(property._id) ? (
                          <IoHeart className="text-red-500" />
                        ) : (
                          <IoHeartOutline className="text-gray-600" />
                        )}
                      </button>
                      {property.rating && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full shadow-md">
                          <IoStar className="text-yellow-500" />
                          <span className="font-medium">{property.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{property.title}</h3>
                      <p className="text-white/90 flex items-center">
                        <IoLocationSharp className="mr-1" />
                        {property.location.city}, {property.location.state}
                      </p>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-2xl font-bold text-teal-700">
                        ₹{property.price.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500"> / month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-gray-600">
                          <IoBed /> {property.bedrooms}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <FaBath /> {property.bathrooms}
                        </span>
                        {property.area && (
                          <span className="flex items-center gap-1 text-gray-600">
                            <FaRulerCombined /> {property.area} sqft
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600 line-clamp-2">{property.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {property.amenities.slice(0, 4).map((amenity, index) => (
                        <span key={index} className="flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">
                          {amenity === 'Wifi' && <FaWifi />}
                          {amenity === 'Parking' && <FaParking />}
                          {amenity === 'Garage' && <GiHomeGarage />}
                          {amenity === 'Pets Allowed' && <MdPets />}
                          {amenity === 'No Smoking' && <MdSmokeFree />}
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{property.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {property.landlord.profilePicture ? (
                          <img 
                            src={property.landlord.profilePicture} 
                            alt={property.landlord.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <IoPerson className="w-8 h-8 text-teal-600" />
                        )}
                        <span className="text-sm text-gray-600">{property.landlord.fullName}</span>
                      </div>
                      <button
                        onClick={() => handleExploreClick(property._id)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveFilters({
                  propertyType: "",
                  minPrice: "",
                  maxPrice: "",
                  bedrooms: "",
                  availableFrom: ""
                });
              }}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProperties;