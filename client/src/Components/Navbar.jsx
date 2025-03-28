// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaBars, FaTimes, FaUserFriends, FaHouseUser } from "react-icons/fa"; // Updated icons
// import { motion } from "framer-motion";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   // Framer Motion Variants (unchanged)
//   const logoVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   const navItemVariants = {
//     hidden: { opacity: 0, y: -10 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.05, transition: { duration: 0.3 } },
//     tap: { scale: 0.95 },
//   };

//   const mobileMenuVariants = {
//     hidden: { opacity: 0, y: -50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
//     exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
//   };

//   return (
//     <nav className="bg-teal-600 shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* Logo Section */}
//           <motion.div
//             className="flex-shrink-0"
//             initial="hidden"
//             animate="visible"
//             variants={logoVariants}
//           >
//             <Link to="/" className="flex items-center space-x-2">
//               <span className="text-3xl font-extrabold text-white tracking-tight">
//                 RoommateFinder
//               </span>
//             </Link>
//           </motion.div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex md:items-center">
//             <motion.div
//               className="ml-12 flex items-baseline space-x-10"
//               initial="hidden"
//               animate="visible"
//               variants={containerVariants}
//             >
//               {["Home", "Roommates", "Rentals", "Dealers"].map((item, index) => (
//                 <motion.div key={index} variants={navItemVariants}>
//                   <Link
//                     to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
//                     className="text-white hover:text-teal-200 px-4 py-2 rounded-lg text-base font-semibold transition duration-300 ease-in-out"
//                   >
//                     {item}
//                   </Link>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>

//           {/* Desktop Buttons */}
//           <div className="hidden md:flex items-center space-x-5">
//             <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
//               <Link
//                 to="/roommate-login"
//                 className="text-teal-600 bg-white px-5 py-2 rounded-lg text-base font-semibold border-2 border-teal-600 hover:bg-teal-50 transition duration-300 flex items-center space-x-2 shadow-md"
//               >
//                 <FaUserFriends className="w-4 h-4" />
//                 <span>Login as Roommate</span>
//               </Link>
//             </motion.div>
//             <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
//               <Link
//                 to="/dealer-login"
//                 className="bg-teal-700 text-white px-5 py-2 rounded-lg text-base font-semibold hover:bg-teal-800 transition duration-300 flex items-center space-x-2 shadow-md"
//               >
//                 <FaHouseUser className="w-4 h-4" />
//                 <span>Login as Dealer</span>
//               </Link>
//             </motion.div>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <motion.button
//               onClick={() => setIsOpen(!isOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-full text-white hover:text-teal-200 hover:bg-teal-700 focus:outline-none transition duration-300"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <span className="sr-only">Open main menu</span>
//               {!isOpen ? <FaBars className="h-7 w-7" /> : <FaTimes className="h-7 w-7" />}
//             </motion.button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <motion.div
//           className="md:hidden bg-teal-600 shadow-lg"
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           variants={mobileMenuVariants}
//         >
//           <div className="px-4 pt-4 pb-6 space-y-3">
//             {["Home", "Roommates", "Rentals", "Dealers"].map((item, index) => (
//               <motion.div key={index} variants={navItemVariants}>
//                 <Link
//                   to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
//                   className="text-white hover:text-teal-200 block px-4 py-3 rounded-lg text-lg font-medium transition duration-300 hover:bg-teal-700"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item}
//                 </Link>
//               </motion.div>
//             ))}
//             <div className="pt-4 space-y-3">
//               <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
//                 <Link
//                   to="/roommate-login"
//                   className="text-teal-600 bg-white  px-4 py-3 rounded-lg text-lg font-medium border-2 border-teal-600 hover:bg-teal-50 transition duration-300 flex items-center space-x-2 shadow-md"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaUserFriends className="w-5 h-5" />
//                   <span>Login as Roommate</span>
//                 </Link>
//               </motion.div>
//               <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
//                 <Link
//                   to="/dealer-login"
//                   className="bg-teal-700 text-white  px-4 py-3 rounded-lg text-lg font-medium hover:bg-teal-800 transition duration-300  items-center space-x-2 shadow-md"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaHouseUser className="w-5 h-5" />
//                   <span>Login as Dealer</span>
//                 </Link>
//               </motion.div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </nav>
//   );
// };

// // Container Variants for Desktop Nav (unchanged)
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
// };

// export default Navbar; 

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import logo from "../assets/react.svg"; // Replace with your logo

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, logoutUser, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
    
  };

  // Navigation links (only Home and About)
  const navLinks = [
    { to: "/", text: "Home", icon: <FaHome className="mr-2" /> },
    { to: "/about", text: "About", icon: <FaInfoCircle className="mr-2" /> },
  ];
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Determine dashboard and profile links based on role
  const dashboardLink = role === "client" ? "/client-dashboard" : role === "landlord" ? "/landlord-dashboard" : "/";
  const profileLink = role === "client" ? "/client-profile" : role === "landlord" ? "/landlord-profile" : "/";

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-3"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div className="flex items-center space-x-3" variants={sectionVariants}>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="bg-white w-5 h-5 rounded-full shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <motion.div
                  className="bg-teal-200 w-3 h-3 rounded-full shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                />
              </div>
              <motion.span
                className="text-2xl font-bold tracking-tight text-teal-600"
                variants={sectionVariants}
              >
                RoomRentSync
              </motion.span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                    location.pathname === link.to ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                  }`}
                >
                  {link.icon}
                  {link.text}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
                aria-label="Search"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              {isLoggedIn ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                    <span className="font-medium text-gray-700">{user?.fullName || "User"}</span>
                    {isDropdownOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={profileLink}
                          className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors flex items-center"
                        >
                          <FaUser className="mr-3" /> Profile
                        </Link>
                        <Link
                          to={dashboardLink}
                          className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors flex items-center"
                        >
                          <FaHome className="mr-3" /> Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center border-t border-gray-100"
                        >
                          <FaSignOutAlt className="mr-3" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/client-login"
                    className="hidden lg:flex items-center px-4 py-2 rounded-lg font-medium text-teal-600 hover:bg-teal-50 transition-colors"
                  >
                    <FaUser className="mr-2" /> Login as Client
                  </Link>
                  <Link
                    to="/landlord-login"
                    className="hidden lg:flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm"
                  >
                    <FaHome className="mr-2" /> Login as Landlord
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-teal-600 transition-colors"
                aria-label="Menu"
              >
                {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search properties, roommates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    autoFocus
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden bg-white shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-4 py-3 rounded-lg font-medium flex items-center ${
                        location.pathname === link.to ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {link.icon}
                      {link.text}
                    </Link>
                  ))}

                  {isLoggedIn ? (
                    <>
                      <Link
                        to={profileLink}
                        className="px-4 py-3 rounded-lg font-medium flex items-center text-gray-700 hover:bg-gray-100"
                      >
                        <FaUser className="mr-3" /> Profile
                      </Link>
                      <Link
                        to={dashboardLink}
                        className="px-4 py-3 rounded-lg font-medium flex items-center text-gray-700 hover:bg-gray-100"
                      >
                        <FaHome className="mr-3" /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-3 rounded-lg font-medium flex items-center text-red-600 hover:bg-red-50 text-left"
                      >
                        <FaSignOutAlt className="mr-3" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/client-login"
                        className="px-4 py-3 rounded-lg font-medium flex items-center justify-center bg-teal-50 text-teal-600 hover:bg-teal-100"
                      >
                        <FaUser className="mr-2" /> Login as Client
                      </Link>
                      <Link
                        to="/landlord-login"
                        className="px-4 py-3 rounded-lg font-medium flex items-center justify-center bg-teal-600 text-white hover:bg-teal-700"
                      >
                        <FaHome className="mr-2" /> Login as Landlord
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from being hidden behind navbar */}
      <div className={`h-20 transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`} />
    </>
  );
};

export default Navbar;