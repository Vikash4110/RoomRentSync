// // Pages/ClientDashboard.jsx
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   FaHome,
//   FaSearch,
//   FaUsers,
//   FaUserFriends,
//   FaEnvelope,
//   FaUserTie,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import { useAuth } from "../Store/auth";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import ClientConnectedLandlords from "../Components/ClientConnectedLandlords";
// import ClientProfile from "../Pages/ClientProfile";
// import RoommateFinder from "../Components/RoommateFinder";
// import RoommateRequests from "../Components/RoomateRequests"; // Fixed typo
// import ConnectedRoommates from "../Components/ConnectedRoommates";

// const ClientDashboard = () => {
//   const { logoutUser, role, isLoading, user } = useAuth();
//   const navigate = useNavigate();
//   const [activeSection, setActiveSection] = useState("home"); // Default to "home"

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (role !== "client") {
//     toast.error("Unauthorized access");
//     navigate("/login");
//     return null;
//   }

//   const handleLogout = () => {
//     logoutUser();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   const renderContent = () => {
//     switch (activeSection) {
//       case "home":
//         return (
//           <motion.div
//             className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] space-y-12"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6 }}
//           >
//             {/* Welcome Section */}
//             <div className="relative w-full max-w-3xl text-center">
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 rounded-3xl opacity-15 blur-2xl -z-10"
//                 initial={{ scale: 0.9 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.8 }}
//               />
//               <motion.div
//                 className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
//                 initial={{ y: 30 }}
//                 animate={{ y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <h2 className="text-5xl font-bold text-gray-800 mb-4">
//                   Welcome, <span className="text-teal-600">{user?.fullName || "Client"}</span>!
//                 </h2>
//                 <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
//                   Elevate your rental journey with RoomRentSync. Seamlessly connect with landlords, find ideal roommates, and manage your preferences—all in one place.
//                 </p>
//               </motion.div>
//             </div>

//             {/* Feature Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
//               <FeatureCard
//                 icon={<FaSearch className="w-12 h-12 text-teal-500" />}
//                 title="Find Rentals"
//                 description="Discover properties that match your lifestyle and budget."
//                 gradient="from-teal-400 to-teal-600"
//                 onClick={() => navigate("/all-properties")}
//               />
//               <FeatureCard
//                 icon={<FaUsers className="w-12 h-12 text-blue-500" />}
//                 title="Connected Landlords"
//                 description="Stay in touch with your trusted property owners."
//                 gradient="from-blue-400 to-blue-600"
//                 onClick={() => setActiveSection("landlords")}
//               />
//               <FeatureCard
//                 icon={<FaUserFriends className="w-12 h-12 text-indigo-500" />}
//                 title="Find Roommates"
//                 description="Connect with compatible roommates effortlessly."
//                 gradient="from-indigo-400 to-indigo-600"
//                 onClick={() => setActiveSection("roommates")}
//               />
//             </div>
//           </motion.div>
//         );
//       case "landlords":
//         return <ClientConnectedLandlords />;
//       case "roommates":
//         return <RoommateFinder />;
//       case "requests":
//         return <RoommateRequests />;
//       case "connected":
//         return <ConnectedRoommates />;
//       case "profile":
//         return <ClientProfile />;
//       default:
//         return <ClientProfile />;
//     }
//   };

//   const sidebarVariants = {
//     hover: { x: 5, transition: { duration: 0.2 } },
//     tap: { scale: 0.95 },
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
//       {/* Sidebar */}
//       <motion.aside
//         className="w-72 bg-white shadow-xl p-6 flex flex-col justify-between fixed h-full border-r border-gray-200"
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div>
//           <div className="mb-12">
//             <h2 className="text-3xl font-bold text-teal-700 flex items-center gap-3">
//               <FaUserTie className="text-teal-600" /> Client Dashboard
//             </h2>
//             <p className="text-sm text-gray-500 mt-2">Manage your rental journey</p>
//           </div>

//           <nav className="space-y-4">
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <button
//                 onClick={() => setActiveSection("home")}
//                 className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                   activeSection === "home"
//                     ? "text-teal-700 bg-teal-100 shadow-inner"
//                     : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//                 }`}
//               >
//                 <FaHome className="w-5 h-5" /> Home
//               </button>
//             </motion.div>
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <Link
//                 to="/all-properties"
//                 className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//               >
//                 <FaSearch className="w-5 h-5" /> Find Rentals
//               </Link>
//             </motion.div>
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <button
//                 onClick={() => setActiveSection("landlords")}
//                 className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                   activeSection === "landlords"
//                     ? "text-teal-700 bg-teal-100 shadow-inner"
//                     : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//                 }`}
//               >
//                 <FaUsers className="w-5 h-5" /> Connected Landlords
//               </button>
//             </motion.div>
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <button
//                 onClick={() => setActiveSection("roommates")}
//                 className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                   activeSection === "roommates"
//                     ? "text-teal-700 bg-teal-100 shadow-inner"
//                     : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//                 }`}
//               >
//                 <FaUserFriends className="w-5 h-5" /> Find Roommates
//               </button>
//             </motion.div>
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <button
//                 onClick={() => setActiveSection("connected")}
//                 className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                   activeSection === "connected"
//                     ? "text-teal-700 bg-teal-100 shadow-inner"
//                     : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//                 }`}
//               >
//                 <FaUsers className="w-5 h-5" /> Connected Roommates
//               </button>
//             </motion.div>
//           </nav>
//         </div>

//         <div>
//           <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//             <button
//               onClick={() => setActiveSection("profile")}
//               className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                 activeSection === "profile"
//                   ? "text-teal-700 bg-teal-100 shadow-inner"
//                   : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//               }`}
//             >
//               <FaUserTie className="w-5 h-5" /> Your Profile
//             </button>
//           </motion.div>
//           <motion.button
//             onClick={handleLogout}
//             className="flex items-center gap-3 text-red-600 hover:bg-red-50 p-3 rounded-lg transition-all duration-300 font-semibold border-t border-gray-200 mt-4 w-full"
//             variants={sidebarVariants}
//             whileHover="hover"
//             whileTap="tap"
//           >
//             <FaSignOutAlt className="w-5 h-5" /> Logout
//           </motion.button>
//         </div>
//       </motion.aside>

//       {/* Main Content */}
//       <main className="flex-1 ml-72 p-8">
//         <motion.div
//           className="mb-8 flex justify-between items-center"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-4xl font-bold text-gray-800">
//             {activeSection === "home" && ""}
//             {activeSection === "landlords" && "Connected Landlords"}
//             {activeSection === "roommates" && "Find Roommates"}
//             {activeSection === "requests" && "Roommate Requests"}
//             {activeSection === "connected" && "Connected Roommates"}
//             {activeSection === "profile" && "Your Profile"}
//           </h1>
//           <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
//         </motion.div>

//         <motion.div
//           className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           {renderContent()}
//         </motion.div>
//       </main>
//     </div>
//   );
// };

// // Feature Card Component
// const FeatureCard = ({ icon, title, description, gradient, onClick }) => (
//   <motion.div
//     className={`relative bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer`}
//     whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
//     whileTap={{ scale: 0.95 }}
//     onClick={onClick}
//   >
//     <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
//     <div className="relative flex flex-col items-center">
//       <div className="mb-4">{icon}</div>
//       <h3 className="text-xl font-semibold text-gray-800 text-center">{title}</h3>
//       <p className="text-gray-600 text-center mt-2">{description}</p>
//     </div>
//   </motion.div>
// );

// export default ClientDashboard;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaUsers,
  FaUserFriends,
  FaEnvelope,
  FaUserTie,
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaChartLine,
  FaHandshake
} from "react-icons/fa";
import { useAuth } from "../Store/auth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ClientConnectedLandlords from "../Components/ClientConnectedLandlords";
import ClientProfile from "../Pages/ClientProfile";
import RoommateFinder from "../Components/RoommateFinder";
import RoommateRequests from "../Components/RoomateRequests";
import ConnectedRoommates from "../Components/ConnectedRoommates";
import AllProperties from "../Components/AllProperties";

const ClientDashboard = () => {
  const { logoutUser, role, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-teal-400 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (role !== "client") {
    toast.error("Unauthorized access");
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleRentalsClick = () => {
    setActiveSection("rentals");
    navigate("/all-properties");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <DashboardHome user={user} setActiveSection={setActiveSection} navigate={navigate} />;
      case "rentals":
        return <AllProperties />;
      case "landlords":
        return <ClientConnectedLandlords />;
      case "roommates":
        return <RoommateFinder />;
      case "requests":
        return <RoommateRequests />;
      case "connected":
        return <ConnectedRoommates />;
      case "profile":
        return <ClientProfile />;
      default:
        return <DashboardHome user={user} setActiveSection={setActiveSection} navigate={navigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between fixed h-full border-r border-gray-200 z-10"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          {/* Logo/Branding */}
          <div className="mb-10 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-500 p-2 rounded-lg">
                <FaUserTie className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">RoomRentSync</h2>
            </div>
            <p className="text-xs text-gray-500 bg-teal-50 px-2 py-1 rounded-full">
              Client Dashboard
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavItem 
              icon={<FaHome className="w-4 h-4" />}
              label="Dashboard"
              active={activeSection === "home"}
              onClick={() => setActiveSection("home")}
            />
            <NavItem 
              icon={<FaSearch className="w-4 h-4" />}
              label="Find Rentals"
              active={activeSection === "rentals"}
              onClick={handleRentalsClick}
            />
            <NavItem 
              icon={<FaUsers className="w-4 h-4" />}
              label="My Landlords"
              active={activeSection === "landlords"}
              onClick={() => setActiveSection("landlords")}
            />
            <NavItem 
              icon={<FaUserFriends className="w-4 h-4" />}
              label="Find Roommates"
              active={activeSection === "roommates"}
              onClick={() => setActiveSection("roommates")}
            />
            <NavItem 
              icon={<FaHandshake className="w-4 h-4" />}
              label="My Roommates"
              active={activeSection === "connected"}
              onClick={() => setActiveSection("connected")}
            />
            <NavItem 
              icon={<FaEnvelope className="w-4 h-4" />}
              label="Requests"
              active={activeSection === "requests"}
              onClick={() => setActiveSection("requests")}
            />
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          <NavItem 
            icon={<FaCog className="w-4 h-4" />}
            label="Settings"
            active={activeSection === "profile"}
            onClick={() => setActiveSection("profile")}
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-medium text-red-500 hover:bg-red-50"
          >
            <FaSignOutAlt className="w-4 h-4" /> Logout
          </button>
          
          {/* User Profile Mini */}
          <div className="flex items-center gap-3 mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.fullName || "User"}</p>
              <p className="text-xs text-gray-500">Client Account</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeSection === "home" && "Dashboard Overview"}
            {activeSection === "rentals" && "Find Rentals"}
            {activeSection === "landlords" && "My Landlords"}
            {activeSection === "roommates" && "Find Roommates"}
            {activeSection === "requests" && "Roommate Requests"}
            {activeSection === "connected" && "My Roommates"}
            {activeSection === "profile" && "Profile Settings"}
          </h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <FaBell className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <span className="font-medium text-gray-700 hidden md:inline">{user?.fullName || "User"}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeSection !== "home" && (
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {activeSection === "landlords" && (
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Connect New Landlord
                </button>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>

      {/* Notifications Panel */}
      {notificationsOpen && (
        <motion.div 
          className="fixed right-6 top-16 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="p-4">
            <div className="text-center py-8 text-gray-500">
              <FaBell className="mx-auto text-2xl mb-2 opacity-30" />
              <p>No new notifications</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ user, setActiveSection, navigate }) => (
  <div className="space-y-8">
    {/* Welcome Card */}
    <motion.div
      className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg p-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName || "Client"}!</h2>
          <p className="opacity-90 max-w-lg">
            You're all set to find your perfect rental and roommate. Check your latest connections or explore new opportunities.
          </p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <FaChartLine className="text-xl" />
        </div>
      </div>
    </motion.div>

    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        icon={<FaUsers className="text-blue-500" />}
        value="12"
        label="Landlords Connected"
        onClick={() => setActiveSection("landlords")}
      />
      <StatCard 
        icon={<FaUserFriends className="text-indigo-500" />}
        value="5"
        label="Roommates Found"
        onClick={() => setActiveSection("connected")}
      />
      <StatCard 
        icon={<FaEnvelope className="text-teal-500" />}
        value="3"
        label="Pending Requests"
        onClick={() => setActiveSection("requests")}
      />
    </div>

    {/* Quick Actions */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          icon={<FaSearch className="text-teal-500" />}
          title="Find Rentals"
          description="Browse available properties"
          onClick={() => {
            setActiveSection("rentals");
            navigate("/all-properties");
          }}
          color="teal"
        />
        <ActionCard
          icon={<FaUserFriends className="text-blue-500" />}
          title="Find Roommates"
          description="Connect with potential roommates"
          onClick={() => setActiveSection("roommates")}
          color="blue"
        />
        <ActionCard
          icon={<FaHandshake className="text-indigo-500" />}
          title="My Connections"
          description="Manage your network"
          onClick={() => setActiveSection("landlords")}
          color="indigo"
        />
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <ActivityItem 
          icon={<FaUsers className="text-blue-500" />}
          title="New landlord connection"
          description="You connected with John Properties"
          time="2 hours ago"
        />
        <ActivityItem 
          icon={<FaUserFriends className="text-indigo-500" />}
          title="Roommate request"
          description="Alex sent you a roommate request"
          time="1 day ago"
        />
        <ActivityItem 
          icon={<FaEnvelope className="text-teal-500" />}
          title="New message"
          description="You have 3 unread messages"
          time="2 days ago"
        />
      </div>
    </div>
  </div>
);

// Reusable Components
const NavItem = ({ icon, label, active, onClick }) => (
  <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
        active 
          ? "bg-teal-50 text-teal-600 font-semibold" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      <span className={`w-5 h-5 flex items-center justify-center ${active ? "text-teal-500" : "text-gray-500"}`}>
        {icon}
      </span>
      {label}
    </button>
  </motion.div>
);

const StatCard = ({ icon, value, label, onClick }) => (
  <motion.div 
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer"
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-gray-600">{label}</p>
      </div>
      <div className="p-3 rounded-lg bg-opacity-20 bg-gray-200">
        {icon}
      </div>
    </div>
  </motion.div>
);

const ActionCard = ({ icon, title, description, onClick, color }) => (
  <motion.div
    className={`bg-white border border-${color}-100 rounded-lg p-5 cursor-pointer hover:border-${color}-300 transition-colors`}
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <div className={`w-10 h-10 rounded-full bg-${color}-50 flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

const ActivityItem = ({ icon, title, description, time }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
  </div>
);

export default ClientDashboard;