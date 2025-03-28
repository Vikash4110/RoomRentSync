import React from 'react';
import { FaUserFriends } from "react-icons/fa"; // Corrected import
import { FaHouseUser, FaHandshake } from "react-icons/fa6"; // These exist in fa6
import { motion } from "framer-motion"; // For animations

const stats = [
  {
    icon: <FaUserFriends className="w-12 h-12 text-[#127C71]" />,
    title: "5,000+ Matches",
    description: "Roommates successfully paired using our AI system.",
  },
  {
    icon: <FaHouseUser className="w-12 h-12 text-[#127C71]" />,
    title: "1,000+ Listings",
    description: "Verified rental properties available from trusted dealers.",
  },
  {
    icon: <FaHandshake className="w-12 h-12 text-[#127C71]" />,
    title: "50+ Dealers",
    description: "Partnered rental brokers streamlining your search.",
  },
];

const StatisticsSection = () => {
  // Background animation
  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="bg-gradient-to-br from-gray-50 to-teal-50 py-12 md:py-20 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative text-gray-800">
            Our <span className="text-[#127C71] font-extrabold">Impact</span>
            <svg className="absolute -top-3 -right-8 w-6 md:w-8 h-auto" viewBox="0 0 3183 3072">
              <path fill="#127C71" d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z" />
              <path fill="#127C71" d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z" />
              <path fill="#127C71" d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z" />
            </svg>
          </span>
        </motion.h2>

        {/* Stats Grid */}
        <motion.div
          className="flex flex-col md:flex-row justify-center gap-8 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hover:border-teal-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 max-w-sm mx-auto md:mx-0"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-[#127C71] mb-2 tracking-tight">
                {stat.title}
              </h3>
              <p className="text-gray-600 font-medium text-base md:text-lg leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatisticsSection;
