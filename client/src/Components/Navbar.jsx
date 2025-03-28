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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaInfoCircle, FaEnvelope, FaUserFriends, FaHouseUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from "../Store/auth";
import { toast } from "sonner";

// Animation variants
const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, height: 0 },
  visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn, logoutUser, user, role, isLoading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/");
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const navbarHeight = '80px'; // Fixed height for consistency

  // Determine dashboard and profile links based on role
  const dashboardLink = role === 'client' ? '/client-dashboard' : role === 'landlord' ? '/landlord-dashboard' : '/';
  const profileLink = role === 'client' ? '/client-profile' : role === 'landlord' ? '/landlord-profile' : '/';

  // Debug user and role state in Navbar
  useEffect(() => {
    console.log("Navbar user:", user);
    console.log("Navbar role:", role);
  }, [user, role]);

  if (isLoading) {
    return (
      <div className="bg-teal-600 shadow-lg fixed top-0 left-0 w-full z-50" style={{ height: navbarHeight }}>
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center py-4 h-full">
          <div className="text-white font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.nav
        className="bg-teal-600 shadow-lg fixed top-0 left-0 w-full z-50"
        style={{ height: navbarHeight }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center py-4 h-full">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="text-2xl font-bold text-white tracking-tight hover:text-teal-200 transition-colors duration-300"
            >
              RoommateFinder
            </Link>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 text-lg font-medium">
            {[
              { to: '/', text: 'Home', icon: <FaHome className="mr-2" /> },
              { to: '/about', text: 'About', icon: <FaInfoCircle className="mr-2" /> },
              { to: '/contact', text: 'Contact', icon: <FaEnvelope className="mr-2" /> },
              { to: '/roommates', text: 'Roommates', icon: <FaUserFriends className="mr-2" /> },
              { to: '/rentals', text: 'Rentals', icon: <FaHouseUser className="mr-2" /> },
            ].map((link, index) => (
              <motion.div
                key={index}
                variants={navItemVariants}
                whileHover={{ scale: 1.1, color: '#ffffff' }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={link.to}
                  className="text-teal-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  {link.icon}
                  {link.text}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-white font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser className="text-lg" />
                  <span>{user?.fullName || 'User'}</span>
                </motion.button>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border border-teal-100"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Link
                      to={profileLink}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>
                    <Link
                      to={dashboardLink}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaHouseUser className="mr-2" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/client-register"
                    className="bg-white text-teal-600 font-semibold py-2 px-6 rounded-full shadow-md hover:bg-teal-50 hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <FaUserFriends className="mr-2" /> Find Roommates
                  </Link>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/dealer-register"
                    className="bg-teal-700 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-teal-800 hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <FaHouseUser className="mr-2" /> List Properties
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? (
                <FaTimes className="w-6 h-6 text-white" />
              ) : (
                <FaBars className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-teal-600 shadow-xl px-6 py-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="flex flex-col space-y-6 text-lg font-medium">
              {[
                { to: '/', text: 'Home', icon: <FaHome className="mr-2" /> },
                { to: '/about', text: 'About', icon: <FaInfoCircle className="mr-2" /> },
                { to: '/contact', text: 'Contact', icon: <FaEnvelope className="mr-2" /> },
                { to: '/roommates', text: 'Roommates', icon: <FaUserFriends className="mr-2" /> },
                { to: '/rentals', text: 'Rentals', icon: <FaHouseUser className="mr-2" /> },
              ].map((link, index) => (
                <motion.div
                  key={index}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="text-teal-100 hover:text-white transition-colors duration-300 flex items-center"
                    onClick={toggleMenu}
                  >
                    {link.icon}
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col space-y-4 mt-6">
              {isLoggedIn ? (
                <>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to={profileLink}
                      className="bg-white text-teal-600 font-semibold py-3 px-6 rounded-full shadow-md hover:bg-teal-50 transition-all duration-300 w-full text-center flex items-center justify-center"
                      onClick={toggleMenu}
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to={dashboardLink}
                      className="bg-teal-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-teal-800 hover:shadow-lg transition-all duration-300 w-full text-center flex items-center justify-center"
                      onClick={toggleMenu}
                    >
                      <FaHouseUser className="mr-2" /> Dashboard
                    </Link>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 w-full text-center flex items-center justify-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/client-register"
                      className="bg-white text-teal-600 font-semibold py-3 px-6 rounded-full shadow-md hover:bg-teal-50 hover:shadow-lg transition-all duration-300 w-full text-center flex items-center justify-center"
                      onClick={toggleMenu}
                    >
                      <FaUserFriends className="mr-2" /> Find Roommates
                    </Link>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/dealer-register"
                      className="bg-teal-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-teal-800 hover:shadow-lg transition-all duration-300 w-full text-center flex items-center justify-center"
                      onClick={toggleMenu}
                    >
                      <FaHouseUser className="mr-2" /> List Properties
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>
      {/* Spacer div to prevent content overlap */}
      <div style={{ height: navbarHeight }} />
    </>
  );
};

export default Navbar;