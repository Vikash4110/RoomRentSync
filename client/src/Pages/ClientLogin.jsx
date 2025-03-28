import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faKey } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth"; // Import useAuth for token management
import Img from "../assets/homeHero.png";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const ClientLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth(); // Use storeTokenInLS from useAuth

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error("Missing Credentials", {
        description: "Please enter both email and password.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/clients/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Invalid Credentials", {
            description: "Email or password is incorrect. Please try again.",
          });
        } else {
          toast.error("Login Failed", {
            description: data.error || "An unexpected error occurred. Please try again.",
          });
        }
        throw new Error(data.error || "Login failed");
      }

      storeTokenInLS(data.token); // Store token using useAuth
      toast.success("Login Successful", {
        description: "Welcome back! Redirecting to your dashboard...",
      });
      setTimeout(() => navigate("/client-dashboard"), 1500);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!credentials.email) {
      toast.error("Email Required", {
        description: "Please enter your email to reset your password.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/clients/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Email Not Found", {
            description: "This email is not registered. Please check or sign up.",
          });
        } else {
          toast.error("Failed to Send OTP", {
            description: data.message || "An unexpected error occurred.",
          });
        }
        throw new Error(data.message || "Failed to send OTP");
      }

      toast.success("OTP Sent", {
        description: "An OTP has been sent to your email for password reset.",
      });
      setForgotPassword(true);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetOtp || !newPassword) {
      toast.error("Missing Information", {
        description: "Please enter both OTP and new password.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/clients/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, otp: resetOtp, newPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          toast.error("Invalid OTP", {
            description: "The OTP is incorrect or has expired. Please try again.",
          });
        } else if (response.status === 404) {
          toast.error("Client Not Found", {
            description: "This email is no longer valid.",
          });
        } else {
          toast.error("Reset Failed", {
            description: data.message || "An unexpected error occurred.",
          });
        }
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("Password Reset Successful", {
        description: "Your password has been updated. Please log in with your new password.",
      });
      setForgotPassword(false);
      setResetOtp("");
      setNewPassword("");
      setCredentials({ email: credentials.email, password: "" });
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 flex flex-col lg:flex-row items-center justify-center px-4 lg:px-10 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <motion.div
        className="hidden lg:flex w-1/2 justify-center"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img src={Img} alt="RoomRentSync Login" className="w-3/4 h-auto object-contain" />
      </motion.div>

      <motion.div className="w-full lg:w-1/2 flex justify-center" variants={formVariants} initial="hidden" animate="visible">
        <div className="w-full max-w-md mx-auto text-center bg-white rounded-3xl py-10 lg:py-12 px-6 lg:px-10 shadow-2xl border border-gray-100">
          <motion.h2
            className="text-4xl font-extrabold text-[#0f6f5c] mb-8 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {forgotPassword ? "Reset Password" : "Login as Client"}
          </motion.h2>

          {!forgotPassword ? (
            <form onSubmit={handleLoginSubmit}>
              <motion.div
                className="relative h-12 w-full mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder=""
                  className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
                  required
                />
                <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
                  <FontAwesomeIcon icon={faEnvelope} /> <span>Email</span>
                </label>
              </motion.div>

              <motion.div
                className="relative h-12 w-full mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder=""
                  className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
                  required
                />
                <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
                  <FontAwesomeIcon icon={faLock} /> <span>Password</span>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                className={`py-3 px-6 rounded-full font-semibold text-white w-2/3 mx-auto flex justify-center items-center bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                disabled={loading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {loading ? (
                  <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="24" visible={true} />
                ) : (
                  "Login"
                )}
              </motion.button>

              <motion.div
                className="flex flex-col items-center mt-6 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <p className="text-sm text-gray-600">
                  New Here?{" "}
                  <Link to="/client-register" className="text-[#0f6f5c] font-semibold hover:underline transition-all">
                    Sign Up
                  </Link>
                </p>
                <p
                  className="text-sm text-gray-600 cursor-pointer hover:text-[#0f6f5c] transition-all"
                  onClick={handleForgotPassword}
                >
                  Forgot Password? Reset Here
                </p>
              </motion.div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <motion.p
                className="text-gray-600 text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Enter the OTP sent to {credentials.email} and your new password.
              </motion.p>

              <motion.div
                className="relative h-12 w-full mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <input
                  type="text"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  placeholder=""
                  className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
                  required
                />
                <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
                  <FontAwesomeIcon icon={faKey} /> <span>OTP</span>
                </label>
              </motion.div>

              <motion.div
                className="relative h-12 w-full mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder=""
                  className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
                  required
                />
                <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
                  <FontAwesomeIcon icon={faLock} /> <span>New Password</span>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                className={`py-3 px-6 rounded-full font-semibold text-white w-2/3 mx-auto flex justify-center items-center bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                disabled={loading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {loading ? (
                  <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="24" visible={true} />
                ) : (
                  "Reset Password"
                )}
              </motion.button>

              <motion.p
                className="text-sm text-gray-600 text-center mt-6 cursor-pointer hover:text-[#0f6f5c] transition-all"
                onClick={() => setForgotPassword(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Back to Login
              </motion.p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClientLogin;