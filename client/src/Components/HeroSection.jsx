import React from 'react';
import { motion } from 'framer-motion'; // For animations
import { Link } from 'react-router-dom';
import homeHero from '../assets/vecteezy_3d-male-character-sitting-on-a-sofa-and-working-on-a-laptop_24785818.png'; 

// Experience data tailored to the new platform
const exps = [
  { label: 'Users Matched', value: '5K+' }, // Mock data for demo
  { label: 'Rental Listings', value: '1K+' },
  { label: 'Verified Dealers', value: '50+' },
];

// ExpItem Component (unchanged, works well as-is)
const ExpItem = ({ item }) => {
  const { value, label } = item;
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <p className="text-[#127C71] text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
        {value}
      </p>
      <p className="text-gray-600 text-sm md:text-base">{label}</p>
    </motion.div>
  );
};

const HeroSection = () => {
  // Animation variants (unchanged)
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <section
      id="hero"
      className="bg-gradient-to-br from-gray-50 to-teal-50 py-12 md:py-16 lg:py-20 overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <motion.div
            className="flex-1 lg:w-1/2 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 relative">
              <span className="text-gray-800">
                Find Your{' '}
                <span className="relative text-[#127C71]">
                  Perfect
                </span>
              </span>
              <br />
              <span className="relative inline-flex items-center">
                Roommate &{' '}
                <span className="ml-2 text-[#127C71]">
                  Rental
                  <svg
                    className="absolute bottom-10 right-[-20px] w-6 md:w-8 lg:w-10 h-auto"
                    viewBox="0 0 3183 3072"
                  >
                    <path
                      fill="#127C71"
                      d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z"
                    />
                    <path
                      fill="#127C71"
                      d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z"
                    />
                    <path
                      fill="#127C71"
                      d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z"
                    />
                  </svg>
                </span>
              </span>
            </h1>
            <p className="text-gray-600 font-semibold text-base md:text-lg lg:text-xl leading-relaxed mb-8">
              "Match with compatible roommates and discover rentals with trusted dealers—all in one place."
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/find-roommate"
                  className="bg-gradient-to-r from-[#127C71] to-teal-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300 flex items-center justify-center"
                >
                  Find a Roommate
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/search-rentals"
                  className="bg-white border-2 border-[#127C71] text-[#127C71] font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gradient-to-r hover:from-[#127C71] hover:to-teal-500 hover:text-white hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  Search Rentals
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
            {/* Experience Stats */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-8 lg:gap-12">
              {exps.map((exp, index) => (
                <ExpItem key={index} item={exp} />
              ))}
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="flex-1 lg:w-1/2 relative mt-8 lg:mt-0"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          >
            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
              <img
                src={homeHero} // Replace with an image of roommates or a house
                className="w-full h-auto rounded-xl transition-all duration-300"
                alt="Roommate and Rental Illustration"
              />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-teal-100 rounded-full opacity-50 blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;