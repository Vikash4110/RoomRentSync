import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { RotatingLines } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";
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
  FaPaperPlane,
  FaHeart,
  FaShare,
  FaWifi,
  FaTv,
  FaParking,
  FaUtensils,
  FaSwimmingPool,
  FaSnowflake,
  FaDumbbell
} from "react-icons/fa";
import { GiWashingMachine, GiDesk } from "react-icons/gi";
import { MdPets, MdSmokeFree, MdLocalLaundryService } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { BsHouseDoor } from "react-icons/bs";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const PropertyDetMain = () => {
  const { authorizationToken, user, role } = useAuth();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [propertyImages, setPropertyImages] = useState([]);
  const [landlordProfilePic, setLandlordProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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

        // Check if property is in favorites
        if (user && user.favorites) {
          setIsFavorite(user.favorites.includes(propertyId));
        }
      } catch (error) {
        toast.error(error.message);
        navigate("/all-properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, authorizationToken, navigate, user]);

  const handleViewLandlordProfile = () => {
    if (property?.landlord?._id) {
      navigate(`/landlord/${property.landlord._id}`);
    } else {
      toast.error("Landlord ID not found");
    }
  };

  const handleConnectWithLandlord = async () => {
    if (role !== "client") {
      toast.error("Only clients can send connection requests");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/clients/send-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({
          landlordId: property.landlord._id,
          propertyId: property._id,
          message: `Hi ${property.landlord.fullName}, I'm interested in renting your property: ${property.title}.`,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send request");

      toast.success("Connection request sent successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleFavorite = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/clients/toggle-favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({
          propertyId: property._id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update favorites");

      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      }).catch(() => {
        toast.info("Sharing cancelled");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-50">
        <RotatingLines strokeColor="#0f766e" width="48" visible />
      </div>
    );
  }

  if (!property) return null;

  const renderAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <FaWifi className="text-teal-600" />;
      case 'tv': return <FaTv className="text-teal-600" />;
      case 'parking': return <FaParking className="text-teal-600" />;
      case 'kitchen': return <FaUtensils className="text-teal-600" />;
      case 'pool': return <FaSwimmingPool className="text-teal-600" />;
      case 'ac': return <FaSnowflake className="text-teal-600" />;
      case 'gym': return <FaDumbbell className="text-teal-600" />;
      case 'washing machine': return <GiWashingMachine className="text-teal-600" />;
      case 'desk': return <GiDesk className="text-teal-600" />;
      case 'pets allowed': return <MdPets className="text-teal-600" />;
      case 'no smoking': return <MdSmokeFree className="text-teal-600" />;
      case 'laundry': return <MdLocalLaundryService className="text-teal-600" />;
      case 'furnished': return <BsHouseDoor className="text-teal-600" />;
      default: return <IoIosPeople className="text-teal-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Property Header */}
        <div className="mb-8">
          <motion.button
            onClick={() => navigate("/all-properties")}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors"
            whileHover={{ x: -5 }}
          >
            <FaArrowLeft /> Back to Properties
          </motion.button>
        </div>

        {/* Main Property Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-96 bg-gray-200 overflow-hidden">
            {propertyImages.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={propertyImages[activeImage]}
                    alt={`Property ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {propertyImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-3 h-3 rounded-full ${activeImage === index ? 'bg-teal-600' : 'bg-white bg-opacity-50'}`}
                    />
                  ))}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full bg-white bg-opacity-80 shadow-md ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <FaHeart />
                  </button>
                  <button
                    onClick={shareProperty}
                    className="p-2 rounded-full bg-white bg-opacity-80 shadow-md text-teal-600"
                  >
                    <FaShare />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500 italic">No images available</p>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Details */}
              <div className="md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                    <div className="flex items-center gap-2 text-teal-600 mt-2">
                      <FaMapMarkerAlt />
                      <span>{`${property.location.address}, ${property.location.city}, ${property.location.state}`}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-teal-700">
                    ₹{property.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500"> / month</span>
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                  <div className="bg-teal-50 p-3 rounded-lg text-center">
                    <FaBed className="mx-auto text-teal-600 text-xl" />
                    <p className="font-medium">{property.bedrooms} Bed</p>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-lg text-center">
                    <FaBath className="mx-auto text-teal-600 text-xl" />
                    <p className="font-medium">{property.bathrooms} Bath</p>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-lg text-center">
                    <FaRulerCombined className="mx-auto text-teal-600 text-xl" />
                    <p className="font-medium">{property.area} sqft</p>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-lg text-center">
                    <BsHouseDoor className="mx-auto text-teal-600 text-xl" />
                    <p className="font-medium">{property.propertyType}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                  <p className="text-gray-600">{property.description}</p>
                </div>

                {/* Amenities */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {renderAmenityIcon(amenity)}
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Property Rules</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MdSmokeFree className={property.rules.smoking ? "text-red-500" : "text-green-500"} />
                      <span>Smoking {property.rules.smoking ? "Allowed" : "Not Allowed"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdPets className={property.rules.pets ? "text-green-500" : "text-red-500"} />
                      <span>Pets {property.rules.pets ? "Allowed" : "Not Allowed"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoIosPeople className={property.rules.guests ? "text-green-500" : "text-red-500"} />
                      <span>Guests {property.rules.guests ? "Allowed" : "Not Allowed"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Landlord Card */}
              <div className="md:w-1/3">
                <div className="bg-teal-50 rounded-xl p-6 shadow-sm border border-teal-100">
                  <h2 className="text-xl font-semibold text-teal-800 mb-4">Landlord Information</h2>
                  <div className="flex items-center gap-4 mb-6">
                    {landlordProfilePic ? (
                      <img
                        src={landlordProfilePic}
                        alt="Landlord"
                        className="w-16 h-16 rounded-full object-cover border-2 border-teal-600"
                      />
                    ) : (
                      <FaUserCircle className="w-16 h-16 text-teal-600" />
                    )}
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{property.landlord.fullName}</p>
                      <p className="text-sm text-teal-600">Verified Landlord</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-teal-600" />
                      <span className="text-gray-700">{property.landlord.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-teal-600" />
                      <span className="text-gray-700">{property.landlord.email}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <motion.button
                      onClick={handleConnectWithLandlord}
                      className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-teal-700 hover:to-teal-800 transition-all shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPaperPlane /> Connect with Landlord
                    </motion.button>
                    <motion.button
                      onClick={handleViewLandlordProfile}
                      className="w-full bg-white text-teal-600 border border-teal-600 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-teal-50 transition-all shadow-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaUser /> View Profile
                    </motion.button>
                  </div>
                </div>

                {/* Availability */}
                <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available From:</span>
                      <span className="font-medium">
                        {new Date(property.availableFrom).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lease Duration:</span>
                      <span className="font-medium">{property.leaseDuration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Images */}
            {propertyImages.length > 1 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">More Photos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {propertyImages.map((img, index) => (
                    <motion.div
                      key={index}
                      className="cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setActiveImage(index)}
                    >
                      <img
                        src={img}
                        alt={`Property ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetMain;