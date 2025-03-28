// src/store/auth.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    console.log("Storing token:", serverToken);
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
    const decoded = jwtDecode(serverToken);
    console.log("Decoded token on store:", decoded);
    setRole(decoded.role);
  };

  const logoutUser = () => {
    console.log("Logging out user");
    setToken("");
    setUser(null);
    setRole(null);
    localStorage.removeItem("token");
    setIsLoading(false);
  };

  const getUserRoleFromToken = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const clientAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/clients/profile`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Client authentication failed:", error);
      setUser(null);
    }
  };

  const landlordAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/landlords/profile`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Landlord authentication failed:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const tokenRole = getUserRoleFromToken();
    setRole(tokenRole);

    if (!token) {
      setIsLoading(false);
      setUser(null);
      setRole(null);
      return;
    }

    const authenticate = async () => {
      setIsLoading(true);
      if (tokenRole === "client") await clientAuthentication();
      else if (tokenRole === "landlord") await landlordAuthentication();
      else setUser(null);
      setIsLoading(false);
    };

    authenticate();
  }, [token]);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, storeTokenInLS, logoutUser, user, setUser, role, authorizationToken, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) throw new Error("useAuth used outside of the Provider");
  return authContextValue;
};