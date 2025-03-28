

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { 
//   FaBuilding, 
//   FaUsers, 
//   FaClipboardList, 
//   FaUserTie, 
//   FaSignOutAlt,
//   FaPlusCircle,
//   FaHome,
//   FaChartLine,
//   FaEnvelope
// } from "react-icons/fa";
// import { useAuth } from "../Store/auth";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import LandlordProperties from "./LandlordProperties";
// import LandlordConnectedClients from "../Components/LandlordConnectedClients";
// import LandlordRequests from "../Components/LandlordRequests";
// import LandlordProfile from "./LandlordProfile";
// import ListProperty from "./ListProperty"; // Import your ListProperty component

// const LandlordDashboard = () => {
//   const { logoutUser, role, isLoading, user } = useAuth();
//   const navigate = useNavigate();
//   const [activeSection, setActiveSection] = useState("dashboard"); // Default to dashboard

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.5 } },
//   };

//   const sidebarVariants = {
//     hover: { x: 5, transition: { duration: 0.2 } },
//     tap: { scale: 0.95 },
//   };

//   // Logout handler
//   const handleLogout = () => {
//     logoutUser();
//     toast.success("Logged out successfully");
//     navigate("/landlord-login");
//   };

//   // Render content based on active section
//   const renderContent = () => {
//     switch (activeSection) {
//       case "profile":
//         return <LandlordProfile />;
//       case "properties":
//         return <LandlordProperties />;
//       case "clients":
//         return <LandlordConnectedClients />;
//       case "requests":
//         return <LandlordRequests />;
//       case "list":
//         return <ListProperty />;
//       case "dashboard":
//       default:
//         return <DashboardOverview />;
//     }
//   };

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (role !== "landlord") {
//     toast.error("Unauthorized access");
//     navigate("/login");
//     return null;
//   }

//   // Dashboard Overview Component
//   const DashboardOverview = () => (
//     <motion.div
//       className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] space-y-12"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       {/* Welcome Section */}
//       <div className="relative w-full max-w-3xl text-center">
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 rounded-3xl opacity-15 blur-2xl -z-10"
//           initial={{ scale: 0.9 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.8 }}
//         />
//         <motion.div
//           className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
//           initial={{ y: 30 }}
//           animate={{ y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h2 className="text-5xl font-bold text-gray-800 mb-4">
//             Welcome, <span className="text-teal-600">{user?.fullName || "Landlord"}</span>!
//           </h2>
//           <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
//             Manage your properties, connect with potential tenants, and streamline your rental business with our comprehensive landlord tools.
//           </p>
//         </motion.div>
//       </div>

//       {/* Feature Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
//         <FeatureCard
//           icon={<FaBuilding className="w-12 h-12 text-teal-500" />}
//           title="My Properties"
//           description="View and manage all your listed properties."
//           gradient="from-teal-400 to-teal-600"
//           onClick={() => setActiveSection("properties")}
//         />
//         <FeatureCard
//           icon={<FaPlusCircle className="w-12 h-12 text-blue-500" />}
//           title="List Property"
//           description="Add a new property to your portfolio."
//           gradient="from-blue-400 to-blue-600"
//           onClick={() => setActiveSection("list")}
//         />
//         <FeatureCard
//           icon={<FaUsers className="w-12 h-12 text-indigo-500" />}
//           title="Connected Clients"
//           description="Manage your current tenants and applicants."
//           gradient="from-indigo-400 to-indigo-600"
//           onClick={() => setActiveSection("clients")}
//         />
//       </div>
//     </motion.div>
//   );

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
//               <FaUserTie className="text-teal-600" /> Landlord Hub
//             </h2>
//             <p className="text-sm text-gray-500 mt-2">Manage your rental properties</p>
//           </div>

//           <nav className="space-y-4">
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <button
//                 onClick={() => setActiveSection("dashboard")}
//                 className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                   activeSection === "dashboard"
//                     ? "text-teal-700 bg-teal-100 shadow-inner"
//                     : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//                 }`}
//               >
//                 <FaHome className="w-5 h-5" /> Dashboard
//               </button>
//             </motion.div>
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <button
//                 onClick={() => setActiveSection("properties")}
//                 className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                   activeSection === "properties"
//                     ? "text-teal-700 bg-teal-100 shadow-inner"
//                     : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//                 }`}
//               >
//                 <FaBuilding className="w-5 h-5" /> My Properties
//               </button>
//             </motion.div>
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <button
//                 onClick={() => setActiveSection("list")}
//                 className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                   activeSection === "list"
//                     ? "text-teal-700 bg-teal-100 shadow-inner"
//                     : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//                 }`}
//               >
//                 <FaPlusCircle className="w-5 h-5" /> List Property
//               </button>
//             </motion.div>
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <button
//                 onClick={() => setActiveSection("clients")}
//                 className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                   activeSection === "clients"
//                     ? "text-teal-700 bg-teal-100 shadow-inner"
//                     : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//                 }`}
//               >
//                 <FaUsers className="w-5 h-5" /> Connected Clients
//               </button>
//             </motion.div>
//             <motion.div variants={sidebarVariants} whileHover="hover" whileTap="tap">
//               <button
//                 onClick={() => setActiveSection("requests")}
//                 className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-semibold ${
//                   activeSection === "requests"
//                     ? "text-teal-700 bg-teal-100 shadow-inner"
//                     : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
//                 }`}
//               >
//                 <FaClipboardList className="w-5 h-5" /> Pending Requests
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
//             {activeSection === "dashboard" && "Overview"}
//             {activeSection === "profile" && "Your Profile"}
//             {activeSection === "properties" && "My Properties"}
//             {activeSection === "clients" && "Connected Clients"}
//             {activeSection === "requests" && "Pending Requests"}
//             {activeSection === "list" && "List New Property"}
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

// export default LandlordDashboard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBuilding, 
  FaUsers, 
  FaClipboardList, 
  FaUserTie, 
  FaSignOutAlt,
  FaPlusCircle,
  FaHome,
  FaChartLine,
  FaEnvelope,
  FaBell,
  FaCog,
  FaHandshake
} from "react-icons/fa";
import { useAuth } from "../Store/auth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import LandlordProperties from "./LandlordProperties";
import LandlordConnectedClients from "../Components/LandlordConnectedClients";
import LandlordRequests from "../Components/LandlordRequests";
import LandlordProfile from "./LandlordProfile";
import ListProperty from "./ListProperty";

const LandlordDashboard = () => {
  const { logoutUser, role, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
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

  if (role !== "landlord") {
    toast.error("Unauthorized access");
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <LandlordProfile />;
      case "properties":
        return <LandlordProperties />;
      case "clients":
        return <LandlordConnectedClients />;
      case "requests":
        return <LandlordRequests />;
      case "list":
        return <ListProperty />;
      case "dashboard":
      default:
        return <DashboardOverview />;
    }
  };

  // Dashboard Overview Component
  const DashboardOverview = () => (
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
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName || "Landlord"}!</h2>
            <p className="opacity-90 max-w-lg">
              Manage your properties, connect with tenants, and grow your rental business with our powerful tools.
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
          icon={<FaBuilding className="text-teal-500" />}
          value="8"
          label="Properties Listed"
          onClick={() => setActiveSection("properties")}
        />
        <StatCard 
          icon={<FaUsers className="text-blue-500" />}
          value="24"
          label="Active Tenants"
          onClick={() => setActiveSection("clients")}
        />
        <StatCard 
          icon={<FaClipboardList className="text-indigo-500" />}
          value="5"
          label="Pending Requests"
          onClick={() => setActiveSection("requests")}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            icon={<FaPlusCircle className="text-teal-500" />}
            title="List Property"
            description="Add a new rental property"
            onClick={() => setActiveSection("list")}
            color="teal"
          />
          <ActionCard
            icon={<FaUsers className="text-blue-500" />}
            title="Manage Tenants"
            description="View and manage your tenants"
            onClick={() => setActiveSection("clients")}
            color="blue"
          />
          <ActionCard
            icon={<FaClipboardList className="text-indigo-500" />}
            title="Review Requests"
            description="Check pending applications"
            onClick={() => setActiveSection("requests")}
            color="indigo"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <ActivityItem 
            icon={<FaBuilding className="text-teal-500" />}
            title="New property listed"
            description="You added a new 3-bedroom apartment"
            time="3 hours ago"
          />
          <ActivityItem 
            icon={<FaUsers className="text-blue-500" />}
            title="New tenant application"
            description="Sarah applied for your downtown condo"
            time="1 day ago"
          />
          <ActivityItem 
            icon={<FaEnvelope className="text-indigo-500" />}
            title="Maintenance request"
            description="You have 2 new maintenance requests"
            time="2 days ago"
          />
        </div>
      </div>
    </div>
  );

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
              Landlord Dashboard
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavItem 
              icon={<FaHome className="w-4 h-4" />}
              label="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => setActiveSection("dashboard")}
            />
            <NavItem 
              icon={<FaBuilding className="w-4 h-4" />}
              label="My Properties"
              active={activeSection === "properties"}
              onClick={() => setActiveSection("properties")}
            />
            <NavItem 
              icon={<FaPlusCircle className="w-4 h-4" />}
              label="List Property"
              active={activeSection === "list"}
              onClick={() => setActiveSection("list")}
            />
            <NavItem 
              icon={<FaUsers className="w-4 h-4" />}
              label="My Tenants"
              active={activeSection === "clients"}
              onClick={() => setActiveSection("clients")}
            />
            <NavItem 
              icon={<FaClipboardList className="w-4 h-4" />}
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
              {user?.fullName?.charAt(0) || "L"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.fullName || "Landlord"}</p>
              <p className="text-xs text-gray-500">Property Manager</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeSection === "dashboard" && "Dashboard Overview"}
            {activeSection === "profile" && "Profile Settings"}
            {activeSection === "properties" && "My Properties"}
            {activeSection === "clients" && "My Tenants"}
            {activeSection === "requests" && "Tenant Requests"}
            {activeSection === "list" && "List New Property"}
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
                {user?.fullName?.charAt(0) || "L"}
              </div>
              <span className="font-medium text-gray-700 hidden md:inline">{user?.fullName || "Landlord"}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeSection !== "dashboard" && (
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {activeSection === "properties" && (
                <button 
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setActiveSection("list")}
                >
                  Add New Property
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

export default LandlordDashboard;