import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import videoSrc from "../assets/ptuvid.mp4"; // Double-check this path

const slides = [
  {
    title: "Find Your Perfect Roommate",
    description: "Connect with compatible roommates effortlessly.",
  },
  {
    title: "Secure Your Ideal Space",
    description: "Discover rentals tailored to your lifestyle.",
  },
  {
    title: "Simplify Your Search",
    description: "A seamless experience with RoomRentSync.",
  },
];

const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [videoError, setVideoError] = useState(false); // Track if video fails
  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  // Handle scroll event to toggle navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Video load debugging and error handling
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.setAttribute("preload", "auto");
      video.addEventListener("loadeddata", () => {
        console.log("Video loaded successfully");
        setVideoError(false);
      });
      video.addEventListener("error", (e) => {
        console.error("Video failed to load:", e);
        setVideoError(true);
      });
      video.load(); // Force reload
    }
  }, []);

  const navbarVariants = {
    hidden: { backgroundColor: "rgba(0, 0, 0, 0)" },
    visible: { backgroundColor: "rgba(255, 255, 255, 0.95)" },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: "40px", width: "100%", textAlign: "center" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-white rounded-full opacity-50 hover:opacity-100 transition-opacity cursor-pointer"></div>
    ),
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ filter: "brightness(60%) contrast(120%)" }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag. Please try a different browser or check the video file.
        </video>
      ) : (
        // Fallback if video fails
        <div
          className="absolute top-0 left-0 w-full h-full z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080?text=Video+Failed+to+Load')" }}
        ></div>
      )}

      {/* Overlay for text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>

      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-30 shadow-md transition-all duration-300"
        initial="hidden"
        animate={isScrolled ? "visible" : "hidden"}
        variants={navbarVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className={`text-2xl font-bold ${isScrolled ? "text-teal-600" : "text-white"}`}>
            RoomRentSync
          </Link>
          <div className="flex space-x-6">
            <Link
              to="/client-login"
              className={`text-lg font-medium ${isScrolled ? "text-gray-700 hover:text-teal-600" : "text-white hover:text-teal-200"} transition-colors`}
            >
              Login
            </Link>
            <Link
              to="/client-register"
              className={`text-lg font-medium px-4 py-2 rounded-lg ${isScrolled ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-white text-teal-600 hover:bg-teal-100"} transition-colors`}
            >
              Register
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Slider Content */}
      <Slider {...sliderSettings} ref={sliderRef} className="relative z-20 min-h-screen">
        {slides.map((slide, index) => (
          <div key={index} className="min-h-screen flex items-center justify-center text-center px-4">
            <div className="text-white">
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                {slide.description}
              </motion.p>
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/client-register"
                  className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-all shadow-lg"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1 } }}
      >
        <FontAwesomeIcon icon={faArrowDown} className="text-white text-2xl" />
      </motion.div>

      {/* Wave Effect */}
      <div className="relative w-full h-[150px] -mt-[150px] overflow-hidden z-20">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
            style={{ stroke: "none", fill: "#ffffff" }}
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;