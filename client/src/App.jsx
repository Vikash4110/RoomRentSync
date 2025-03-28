import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Store/auth";
// import Register from "./Pages/CounselorRegister";
// import Login from "./Pages/CounselorLogin";
// import Application from "./Pages/CouselorApplication";
// import Profile from "./Pages/CounselorProfile";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Navbar from "./Components/Navbar";
import Loader from "./Components/Loader";
import PropertyDetail from "./Components/PropertyDetail";
import ClientRegister from "./Pages/ClientRegister";
import ClientLogin from "./Pages/ClientLogin";
import ClientDashboard from "./Pages/ClientDashboard";
import ClientProfile from "./Pages/ClientProfile";
import LandlordRegister from "./Pages/LandlordRegister";
import LandlordLogin from "./Pages/LandlordLogin";
import LandlordProfile from "./Pages/LandlordProfile";
import LandlordDashboard from "./Pages/LandlordDashboard";
import ListProperty from "./Pages/ListProperty";
import LandlordProperties from "./Pages/LandlordProperties";
import AllProperties from "./Components/AllProperties";
import PropertyDetMain from "./Components/PropertyDetMain";
import NewLandlordProfile from './Components/LandProfileMain';
import LandlordRequests from './Components/LandlordRequests';
import LandlordConnectedClients from './Components/LandlordConnectedClients';
import ClientConnectedLandlords from './Components/ClientConnectedLandlords';

function App() {
  const [isLoading, setIsLoading] = useState(false); // Start false, update based on session

  useEffect(() => {
    // Check if the loader has already been shown in this session
    const hasLoaded = sessionStorage.getItem("hasLoaded");

    if (!hasLoaded) {
      setIsLoading(true); // Show loader only on first visit
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasLoaded", "true"); // Mark as loaded
      }, 2500); // 2.5 seconds

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, []);

  return (
    <AuthProvider>
      {isLoading && <Loader />}
      <div className={`${isLoading ? "hidden" : "block"}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-register" element={<ClientRegister />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route path="/client-connected-landlords" element={<ClientConnectedLandlords />} />
          <Route path="/landlord-register" element={<LandlordRegister />} />
          <Route path="/landlord-login" element={<LandlordLogin />} />
          <Route path="/landlord-profile" element={<LandlordProfile />} />
              <Route path="/landlord/requests" element={<LandlordRequests />} />
      <Route path="/landlord/connected-clients" element={<LandlordConnectedClients />} />
          <Route path="/list-property" element={<ListProperty />} />
          <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
          <Route path="/landlord-properties" element={<LandlordProperties />} />
          <Route path="/all-properties" element={<AllProperties />} />
          <Route path="/property-detail/:propertyId" element={<PropertyDetail />} />
          <Route path="/property-detail-main/:propertyId" element={<PropertyDetMain />} />
          <Route path="/landlord/:landlordId" element={<NewLandlordProfile />} /> 
      
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
