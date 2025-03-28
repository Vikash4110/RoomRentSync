// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHome, faTag, faMapMarkerAlt, faBed, faBath, faCalendarAlt, faImage, faList, faCheck } from "@fortawesome/free-solid-svg-icons";
// import { motion } from "framer-motion";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const ListProperty = () => {
//   const { authorizationToken } = useAuth();
//   const navigate = useNavigate();
//   const [property, setProperty] = useState({
//     title: "", description: "", location: { address: "", city: "", state: "", zipCode: "" }, price: "", propertyType: "",
//     bedrooms: "", bathrooms: "", amenities: [], availableFrom: "", leaseDuration: "",
//     rules: { smoking: false, pets: false, alcohol: false, guests: true }, additionalDetails: { furnished: false, utilitiesIncluded: false, parking: false },
//   });
//   const [images, setImages] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleInput = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name.includes("location.")) {
//       const field = name.split(".")[1];
//       setProperty((prev) => ({ ...prev, location: { ...prev.location, [field]: value } }));
//     } else if (name.includes("rules.")) {
//       const field = name.split(".")[1];
//       setProperty((prev) => ({ ...prev, rules: { ...prev.rules, [field]: type === "checkbox" ? checked : value } }));
//     } else if (name.includes("additionalDetails.")) {
//       const field = name.split(".")[1];
//       setProperty((prev) => ({ ...prev, additionalDetails: { ...prev.additionalDetails, [field]: type === "checkbox" ? checked : value } }));
//     } else {
//       setProperty((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value }));
//     }
//   };

//   const handleImages = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + images.length > 5) return toast.error("You can upload a maximum of 5 images");
//     setImages((prev) => [...prev, ...files]);
//     setPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (images.length < 1 || images.length > 5) return toast.error("Please upload between 1 and 5 images");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("data", JSON.stringify(property));
//     images.forEach((image) => formData.append("images", image));

//     try {
//       const response = await fetch(`${backendUrl}/api/landlords/create-property`, {
//         method: "POST",
//         headers: { Authorization: authorizationToken },
//         body: formData,
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to create property");

//       toast.success("Property Listed", { description: "Redirecting to your profile..." });
//       navigate("/landlord-profile");
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//       <motion.div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
//         <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">List a Property</h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <InputField icon={faTag} name="title" value={property.title} onChange={handleInput} placeholder="Property Title" />
//           <textarea name="description" value={property.description} onChange={handleInput} placeholder="Description (min 10 characters)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" rows="4" required />
//           <InputField icon={faMapMarkerAlt} name="location.address" value={property.location.address} onChange={handleInput} placeholder="Address" />
//           <InputField icon={faMapMarkerAlt} name="location.city" value={property.location.city} onChange={handleInput} placeholder="City" />
//           <InputField icon={faMapMarkerAlt} name="location.state" value={property.location.state} onChange={handleInput} placeholder="State" />
//           <InputField icon={faMapMarkerAlt} name="location.zipCode" value={property.location.zipCode} onChange={handleInput} placeholder="Zip Code" />
//           <InputField icon={faHome} name="price" type="number" value={property.price} onChange={handleInput} placeholder="Price (₹)" />
//           <select name="propertyType" value={property.propertyType} onChange={handleInput} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" required>
//             <option value="">Select Property Type</option>
//             {["Apartment", "House", "Condo", "Studio", "Villa"].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
//           </select>
//           <InputField icon={faBed} name="bedrooms" type="number" value={property.bedrooms} onChange={handleInput} placeholder="Bedrooms" />
//           <InputField icon={faBath} name="bathrooms" type="number" value={property.bathrooms} onChange={handleInput} placeholder="Bathrooms" />
//           <InputField icon={faList} name="amenities" value={property.amenities.join(",")} onChange={(e) => setProperty({ ...property, amenities: e.target.value.split(",") })} placeholder="Amenities (comma-separated)" />
//           <InputField icon={faCalendarAlt} name="availableFrom" type="date" value={property.availableFrom} onChange={handleInput} placeholder="Available From" />
//           <select name="leaseDuration" value={property.leaseDuration} onChange={handleInput} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" required>
//             <option value="">Select Lease Duration</option>
//             {["1-3 months", "3-6 months", "6-12 months", "12+ months"].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
//           </select>
//           <div className="space-y-2">
//             <label className="font-semibold text-gray-700">Rules:</label>
//             <CheckboxField name="rules.smoking" checked={property.rules.smoking} onChange={handleInput} label="Smoking Allowed" />
//             <CheckboxField name="rules.pets" checked={property.rules.pets} onChange={handleInput} label="Pets Allowed" />
//             <CheckboxField name="rules.alcohol" checked={property.rules.alcohol} onChange={handleInput} label="Alcohol Allowed" />
//             <CheckboxField name="rules.guests" checked={property.rules.guests} onChange={handleInput} label="Guests Allowed" />
//           </div>
//           <div className="space-y-2">
//             <label className="font-semibold text-gray-700">Additional Details:</label>
//             <CheckboxField name="additionalDetails.furnished" checked={property.additionalDetails.furnished} onChange={handleInput} label="Furnished" />
//             <CheckboxField name="additionalDetails.utilitiesIncluded" checked={property.additionalDetails.utilitiesIncluded} onChange={handleInput} label="Utilities Included" />
//             <CheckboxField name="additionalDetails.parking" checked={property.additionalDetails.parking} onChange={handleInput} label="Parking Available" />
//           </div>
//           <div className="space-y-2">
//             <label className="font-semibold text-gray-700">Images (1-5):</label>
//             <input type="file" multiple onChange={handleImages} className="hidden" id="image-upload" accept="image/*" />
//             <label htmlFor="image-upload" className="cursor-pointer bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700">Upload Images</label>
//             <div className="grid grid-cols-5 gap-2 mt-2">
//               {previews.map((preview, idx) => (
//                 <img key={idx} src={preview} alt={`Preview ${idx}`} className="w-full h-20 object-cover rounded-md" />
//               ))}
//             </div>
//           </div>
//           <motion.button type="submit" disabled={loading} className={`w-full py-3 bg-teal-600 text-white rounded-lg ${loading ? "opacity-50" : "hover:bg-teal-700"}`} whileHover={{ scale: loading ? 1 : 1.05 }}>
//             {loading ? "Listing..." : "List Property"}
//           </motion.button>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// };

// const InputField = ({ icon, ...props }) => (
//   <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500">
//     <FontAwesomeIcon icon={icon} className="text-gray-500" />
//     <input {...props} className="w-full focus:outline-none bg-transparent text-gray-700" required />
//   </div>
// );

// const CheckboxField = ({ name, checked, onChange, label }) => (
//   <div className="flex items-center gap-2">
//     <input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-4 w-4 text-teal-600" />
//     <label className="text-gray-700">{label}</label>
//   </div>
// );

// export default ListProperty;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  FaHome, 
  FaTag, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaCalendarAlt, 
  FaImage, 
  FaList, 
  FaCheck,
  FaSmokingBan,
  FaPaw,
  FaGlassCheers,
  FaUserFriends,
  FaCouch,
  FaPlug,
  FaParking,
  FaTimes
} from "react-icons/fa";
import { IoIosImages } from "react-icons/io";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const ListProperty = () => {
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    title: "", 
    description: "", 
    location: { 
      address: "", 
      city: "", 
      state: "", 
      zipCode: "" 
    }, 
    price: "", 
    propertyType: "",
    bedrooms: "", 
    bathrooms: "", 
    amenities: [], 
    availableFrom: "", 
    leaseDuration: "",
    rules: { 
      smoking: false, 
      pets: false, 
      alcohol: false, 
      guests: true 
    }, 
    additionalDetails: { 
      furnished: false, 
      utilitiesIncluded: false, 
      parking: false 
    },
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setProperty(prev => ({ 
        ...prev, 
        location: { ...prev.location, [field]: value } 
      }));
    } else if (name.includes("rules.")) {
      const field = name.split(".")[1];
      setProperty(prev => ({ 
        ...prev, 
        rules: { ...prev.rules, [field]: type === "checkbox" ? checked : value } 
      }));
    } else if (name.includes("additionalDetails.")) {
      const field = name.split(".")[1];
      setProperty(prev => ({ 
        ...prev, 
        additionalDetails: { ...prev.additionalDetails, [field]: type === "checkbox" ? checked : value } 
      }));
    } else {
      setProperty(prev => ({ 
        ...prev, 
        [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value 
      }));
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      return toast.error("Maximum 5 images allowed");
    }
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length < 1) {
      return toast.error("Please upload at least one image");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("data", JSON.stringify(property));
    images.forEach(image => formData.append("images", image));

    try {
      const response = await fetch(`${backendUrl}/api/landlords/create-property`, {
        method: "POST",
        headers: { Authorization: authorizationToken },
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create property");

      toast.success("Property listed successfully!");
      navigate("/landlord-profile");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = ["Apartment", "House", "Condo", "Studio", "Villa", "Townhouse", "Duplex"];
  const leaseDurations = ["1-3 months", "3-6 months", "6-12 months", "12+ months"];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FaHome className="text-xl" />
              List Your Property
            </h1>
            <p className="opacity-90 mt-1">Fill in the details to list your property for rent</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information Section */}
            <Section title="Basic Information" icon={<FaTag />}>
              <InputField 
                icon={<FaTag />}
                name="title"
                value={property.title}
                onChange={handleInput}
                placeholder="Property Title"
                required
              />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  name="description"
                  value={property.description}
                  onChange={handleInput}
                  placeholder="Describe your property (min 50 characters)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 min-h-[120px]"
                  required
                  minLength={50}
                />
              </div>
            </Section>

            {/* Location Section */}
            <Section title="Location Details" icon={<FaMapMarkerAlt />}>
              <InputField 
                icon={<FaMapMarkerAlt />}
                name="location.address"
                value={property.location.address}
                onChange={handleInput}
                placeholder="Street Address"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField 
                  name="location.city"
                  value={property.location.city}
                  onChange={handleInput}
                  placeholder="City"
                  required
                />
                <InputField 
                  name="location.state"
                  value={property.location.state}
                  onChange={handleInput}
                  placeholder="State"
                  required
                />
                <InputField 
                  name="location.zipCode"
                  value={property.location.zipCode}
                  onChange={handleInput}
                  placeholder="ZIP Code"
                  required
                />
              </div>
            </Section>

            {/* Property Details Section */}
            <Section title="Property Details" icon={<FaHome />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField
                  icon={<FaHome />}
                  name="propertyType"
                  value={property.propertyType}
                  onChange={handleInput}
                  options={propertyTypes}
                  placeholder="Property Type"
                  required
                />
                <InputField 
                  icon={<FaTag />}
                  name="price"
                  type="number"
                  value={property.price}
                  onChange={handleInput}
                  placeholder="Monthly Rent ($)"
                  required
                />
                <SelectField
                  name="leaseDuration"
                  value={property.leaseDuration}
                  onChange={handleInput}
                  options={leaseDurations}
                  placeholder="Lease Duration"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  icon={<FaBed />}
                  name="bedrooms"
                  type="number"
                  value={property.bedrooms}
                  onChange={handleInput}
                  placeholder="Bedrooms"
                  required
                />
                <InputField 
                  icon={<FaBath />}
                  name="bathrooms"
                  type="number"
                  value={property.bathrooms}
                  onChange={handleInput}
                  placeholder="Bathrooms"
                  required
                />
              </div>
              <InputField 
                icon={<FaCalendarAlt />}
                name="availableFrom"
                type="date"
                value={property.availableFrom}
                onChange={handleInput}
                placeholder="Available From"
                required
              />
              <InputField 
                icon={<FaList />}
                name="amenities"
                value={property.amenities.join(", ")}
                onChange={(e) => setProperty({ ...property, amenities: e.target.value.split(",").map(item => item.trim()) })}
                placeholder="Amenities (comma separated)"
              />
            </Section>

            {/* Rules Section */}
            <Section title="House Rules" icon={<FaCheck />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxCard 
                  name="rules.smoking"
                  checked={property.rules.smoking}
                  onChange={handleInput}
                  label="Smoking Allowed"
                  icon={<FaSmokingBan />}
                />
                <CheckboxCard 
                  name="rules.pets"
                  checked={property.rules.pets}
                  onChange={handleInput}
                  label="Pets Allowed"
                  icon={<FaPaw />}
                />
                <CheckboxCard 
                  name="rules.alcohol"
                  checked={property.rules.alcohol}
                  onChange={handleInput}
                  label="Alcohol Allowed"
                  icon={<FaGlassCheers />}
                />
                <CheckboxCard 
                  name="rules.guests"
                  checked={property.rules.guests}
                  onChange={handleInput}
                  label="Guests Allowed"
                  icon={<FaUserFriends />}
                />
              </div>
            </Section>

            {/* Additional Details */}
            <Section title="Additional Features" icon={<FaCheck />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CheckboxCard 
                  name="additionalDetails.furnished"
                  checked={property.additionalDetails.furnished}
                  onChange={handleInput}
                  label="Furnished"
                  icon={<FaCouch />}
                />
                <CheckboxCard 
                  name="additionalDetails.utilitiesIncluded"
                  checked={property.additionalDetails.utilitiesIncluded}
                  onChange={handleInput}
                  label="Utilities Included"
                  icon={<FaPlug />}
                />
                <CheckboxCard 
                  name="additionalDetails.parking"
                  checked={property.additionalDetails.parking}
                  onChange={handleInput}
                  label="Parking Available"
                  icon={<FaParking />}
                />
              </div>
            </Section>

            {/* Images Section */}
            <Section title="Property Images" icon={<FaImage />}>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <IoIosImages className="w-8 h-8 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 5 images)</p>
                    </div>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleImages} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </label>
                </div>
                
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {previews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${idx}`} 
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "List Property"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Components
const Section = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
      <div className="text-teal-500">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500">
    {icon && <div className="text-gray-500">{icon}</div>}
    <input 
      {...props} 
      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400" 
    />
  </div>
);

const SelectField = ({ icon, options, ...props }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500">
    {icon && <div className="text-gray-500">{icon}</div>}
    <select 
      {...props} 
      className="w-full focus:outline-none bg-transparent text-gray-700"
    >
      <option value="">{props.placeholder}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const CheckboxCard = ({ name, checked, onChange, label, icon }) => (
  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
    <input 
      type="checkbox" 
      name={name} 
      checked={checked} 
      onChange={onChange} 
      className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
    />
    <div className="flex items-center gap-2 text-gray-700">
      {icon}
      {label}
    </div>
  </label>
);

export default ListProperty;