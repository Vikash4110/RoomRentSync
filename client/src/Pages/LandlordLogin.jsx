import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faKey } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import Img from "../assets/homeHero.png";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const LandlordLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const handleInputChange = (e) => setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) return toast.error("Please enter both email and password");

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/landlords/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      
      storeTokenInLS(data.token);
      toast.success("Login Successful", { description: "Redirecting to your profile..." });
      setTimeout(() => navigate("/landlord-dashboard"), 1500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!credentials.email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/landlords/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");
      
      toast.success("OTP Sent", { description: "Check your email for the OTP." });
      setForgotPassword(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetOtp || !newPassword) return toast.error("Please enter OTP and new password");

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/landlords/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, otp: resetOtp, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reset password");

      toast.success("Password Reset Successful", { description: "Please log in with your new password." });
      setForgotPassword(false);
      setResetOtp("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 flex flex-col lg:flex-row items-center justify-center px-4 lg:px-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.div className="hidden lg:flex w-1/2 justify-center" initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <img src={Img} alt="Landlord Login" className="w-3/4 h-auto object-contain" />
      </motion.div>
      <motion.div className="w-full lg:w-1/2 flex justify-center" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="w-full max-w-md bg-white rounded-3xl py-10 px-6 shadow-2xl">
          <h2 className="text-4xl font-extrabold text-[#0f6f5c] mb-8 text-center">{forgotPassword ? "Reset Password" : "Landlord Login"}</h2>
          {!forgotPassword ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <InputField icon={faEnvelope} name="email" value={credentials.email} onChange={handleInputChange} placeholder="Email" type="email" />
              <InputField icon={faLock} name="password" value={credentials.password} onChange={handleInputChange} placeholder="Password" type="password" />
              <motion.button type="submit" disabled={loading} className={`w-full py-3 bg-teal-600 text-white rounded-lg ${loading ? "opacity-50" : "hover:bg-teal-700"}`} whileHover={{ scale: loading ? 1 : 1.05 }}>
                {loading ? <RotatingLines strokeColor="white" width="24" visible /> : "Login"}
              </motion.button>
              <div className="text-sm text-gray-600 text-center space-y-2">
                <p>New Here? <Link to="/landlord-register" className="text-[#0f6f5c] hover:underline">Sign Up</Link></p>
                <p className="cursor-pointer hover:text-[#0f6f5c]" onClick={handleForgotPassword}>Forgot Password?</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <p className="text-gray-600 text-center">Enter the OTP sent to {credentials.email} and your new password.</p>
              <InputField icon={faKey} value={resetOtp} onChange={(e) => setResetOtp(e.target.value)} placeholder="OTP" />
              <InputField icon={faLock} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" type="password" />
              <motion.button type="submit" disabled={loading} className={`w-full py-3 bg-teal-600 text-white rounded-lg ${loading ? "opacity-50" : "hover:bg-teal-700"}`} whileHover={{ scale: loading ? 1 : 1.05 }}>
                {loading ? <RotatingLines strokeColor="white" width="24" visible /> : "Reset Password"}
              </motion.button>
              <p className="text-sm text-gray-600 text-center cursor-pointer hover:text-[#0f6f5c]" onClick={() => setForgotPassword(false)}>Back to Login</p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500">
    <FontAwesomeIcon icon={icon} className="text-gray-500" />
    <input {...props} className="w-full focus:outline-none bg-transparent text-gray-700" required />
  </div>
);

export default LandlordLogin;
