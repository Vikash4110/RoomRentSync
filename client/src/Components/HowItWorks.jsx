import React from 'react';
import { FaUserFriends, FaSearch, FaHouseUser, FaEnvelope } from 'react-icons/fa'; // Updated icons
import { motion } from 'framer-motion'; // For animations

const steps = [
  {
    id: 1,
    title: 'Create Profile',
    icon: <FaUserFriends className="text-4xl text-white" />,
    bgColor: 'bg-teal-500',
    description: 'Set up your profile to find compatible roommates and rentals.',
  },
  {
    id: 2,
    title: 'Search Rentals',
    icon: <FaSearch className="text-4xl text-white" />,
    bgColor: 'bg-blue-500',
    description: 'Browse verified rental listings from trusted dealers.',
  },
  {
    id: 3,
    title: 'Match with Roommates',
    icon: <FaHouseUser className="text-4xl text-white" />,
    bgColor: 'bg-green-500',
    description: 'Get paired with roommates based on compatibility.',
  },
  {
    id: 4,
    title: 'Connect & Chat',
    icon: <FaEnvelope className="text-4xl text-white" />,
    bgColor: 'bg-purple-500',
    description: 'Message roommates and landlords securely.',
  },
];

const HowItWorksCurvyFlowchart = () => {
  // Animation variants (unchanged)
  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-teal-50 overflow-hidden">
      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple process to find your perfect roommate and rental—all in one place.
          </p>
        </div>

        {/* SVG Curved Path */}
        <svg
          className="absolute hidden md:block left-1/2 transform -translate-x-1/2 top-32 z-0 opacity-20"
          width="1200"
          height="900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 600 100 Q 300 200 600 350 Q 900 500 600 650 Q 300 800 600 900"
            stroke="#127c71"
            strokeWidth="4"
            strokeDasharray="10,10"
            fill="none"
          />
        </svg>

        {/* Step-by-step flowchart */}
        <div className="relative z-10 flex flex-col items-center">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`flex flex-col items-center mb-20 md:mb-24 ${
                index % 2 === 0 ? 'md:ml-0' : 'md:mr-0 md:ml-auto'
              } max-w-md`}
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Icon Circle */}
              <div
                className={`${step.bgColor} flex items-center justify-center w-20 h-20 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 mb-6 relative`}
              >
                {step.icon}
                {/* Step Number */}
                <div className="absolute -top-2 -left-2 bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  {step.id}
                </div>
              </div>
              {/* Title & Description */}
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksCurvyFlowchart;