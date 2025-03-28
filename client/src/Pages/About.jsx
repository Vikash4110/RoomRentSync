import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoBulb, IoChatbox, IoDocumentText, IoRocket, IoPeople, 
  IoPhonePortrait, IoShieldCheckmark, IoSearch, IoHome, 
  IoPerson, IoBriefcase, IoStar, IoCheckmarkCircle 
} from "react-icons/io5";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import Img from "../assets/vecteezy_happy-3d-student-boy-with-books-on-white-background-png_22484651.png"; // Replace with your high-quality hero image
import FutureScopeImg from "../assets/vecteezy_white-clipboard-task-management-todo-check-list-efficient_9315274.png"; // Replace with your future scope image
import DevImg1 from "../assets/1687802304101.jpeg"; // Replace with actual developer images
import DevImg2 from "../assets/WhatsApp Image 2025-03-27 at 19.51.58.jpeg";
import DevImg3 from "../assets/WhatsApp Image 2025-03-27 at 19.50.14.jpeg";
import DevImg4 from "../assets/profile2.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  const [openSection, setOpenSection] = useState(null);
  const [activeTab, setActiveTab] = useState("features");

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      once: true,
      easing: 'ease-in-out-quad'
    });
  }, []);

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

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
  };

  const developers = [
    { 
      name: "Vikash Bharal", 
      img: DevImg1, 
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in React and Node.js",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      }
    },
    { 
      name: "Ujjwal", 
      img: DevImg2, 
      role: "UI/UX Designer",
      bio: "Creative designer focused on user experience and interfaces",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      }
    },
    { 
      name: "Yash Kumar Dubey", 
      img: DevImg3, 
      role: "Backend Engineer",
      bio: "Specializes in database architecture and API development",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      }
    },

  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 text-gray-800 px-6 py-12 md:px-20 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-20">
        <motion.div
          className="flex flex-col md:flex-row items-center gap-12"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="md:w-1/2" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6 leading-tight">
              Revolutionizing <span className="text-teal-600">Roommate</span> and <span className="text-teal-600">Rental</span> Experiences
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're on a mission to make finding roommates and rentals seamless, secure, and stress-free through innovative technology.
            </p>
            <div className="flex gap-4">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                Learn More
              </button>
              <button className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-3 rounded-lg font-medium transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
          <div className="md:w-1/2" data-aos="fade-left">
            <img 
              src={Img} 
              alt="About RoommateFinder" 
              className="w-full h-auto rounded-2xl object-cover transform hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        </motion.div>
      </section>

      {/* Features & Tabs Section */}
      <section className="max-w-7xl mx-auto mb-20">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-teal-800 mb-4"
            data-aos="fade-up"
          >
            Why Choose RoommateFinder?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Our platform combines cutting-edge technology with user-centric design to deliver exceptional value.
          </motion.p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            {["features", "technology", "benefits"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-medium text-lg transition-colors ${activeTab === tab ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "features" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {[
                    { 
                      title: "AI-Powered Matching", 
                      content: "Our advanced algorithm analyzes hundreds of data points to connect you with the most compatible roommates.",
                      icon: <IoPeople className="text-3xl text-teal-600" />,
                      stats: "95% match accuracy"
                    },
                    { 
                      title: "Verified Listings", 
                      content: "Every rental property is personally verified by our team to ensure quality and authenticity.",
                      icon: <IoShieldCheckmark className="text-3xl text-teal-600" />,
                      stats: "100% verified properties"
                    },
                    { 
                      title: "Secure Messaging", 
                      content: "Communicate safely with potential roommates and landlords through our encrypted chat system.",
                      icon: <IoChatbox className="text-3xl text-teal-600" />,
                      stats: "End-to-end encryption"
                    },
                    { 
                      title: "Dealer Network", 
                      content: "Access our nationwide network of trusted rental dealers and property managers.",
                      icon: <IoBriefcase className="text-3xl text-teal-600" />,
                      stats: "500+ partners"
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-50 hover:bg-teal-50 rounded-xl p-6 transition-all duration-300 border border-gray-100"
                      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)" }}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-teal-100 rounded-lg">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                          <p className="text-gray-600 mb-3">{feature.content}</p>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600">
                            <IoCheckmarkCircle /> {feature.stats}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "technology" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-3 gap-6"
                >
                  {[
                    { name: "React", description: "Frontend framework for responsive UI" },
                    { name: "Node.js", description: "Backend runtime environment" },
                    { name: "MongoDB", description: "NoSQL database for flexible data" },
                    { name: "TensorFlow", description: "Machine learning for matching" },
                    { name: "AWS", description: "Cloud infrastructure and hosting" },
                    { name: "Socket.io", description: "Real-time communication" },
                  ].map((tech, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-50 rounded-lg p-5 text-center border border-gray-200"
                      whileHover={{ scale: 1.03 }}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IoStar className="text-2xl text-teal-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{tech.name}</h3>
                      <p className="text-gray-600 text-sm">{tech.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "benefits" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-8 text-white">
                      <h3 className="text-2xl font-bold mb-4">For Roommates</h3>
                      <ul className="space-y-3">
                        {[
                          "Save time with smart matching",
                          "Reduce conflicts with compatibility scores",
                          "Find roommates with similar lifestyles",
                          "Secure payment splitting options",
                          "Verified background checks"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <IoCheckmarkCircle className="text-teal-200 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 text-white">
                      <h3 className="text-2xl font-bold mb-4">For Landlords</h3>
                      <ul className="space-y-3">
                        {[
                          "Higher quality tenant matches",
                          "Reduced vacancy periods",
                          "Automated tenant screening",
                          "Integrated rent collection",
                          "Property management tools"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <IoCheckmarkCircle className="text-gray-300 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="max-w-7xl mx-auto mb-20">
        <motion.div
          className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-2xl p-8 shadow-lg"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="md:w-1/2" data-aos="fade-right">
            <h2 className="text-3xl font-bold text-teal-800 mb-6">
              <IoRocket className="inline mr-3 text-teal-600" />
              Our Future Vision
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              We're constantly innovating to bring you the best roommate and rental experience. Here's what's coming next:
            </p>
            <div className="space-y-4">
              {[
                "Virtual reality property tours",
                "AI-powered lease agreement generator",
                "Integrated financial planning tools",
                "Global expansion to 10+ countries",
                "Mobile app with offline functionality"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-teal-100 p-1 rounded-full mt-1">
                    <IoCheckmarkCircle className="text-teal-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2" data-aos="fade-left">
            <img 
              src={FutureScopeImg} 
              alt="Future Vision" 
              className="w-full h-auto rounded-xl object-cover transform hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-teal-800 mb-4"
            data-aos="fade-up"
          >
            Meet Our Team
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            The passionate individuals behind RoommateFinder's success
          </motion.p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 "
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative group">
                <img
                  src={dev.img}
                  alt={dev.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white text-sm">{dev.bio}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{dev.name}</h3>
                <p className="text-teal-600 font-medium mb-3">{dev.role}</p>
                <div className="flex gap-3">
                  <a href={dev.social.linkedin} className="text-gray-500 hover:text-teal-600 transition-colors">
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a href={dev.social.github} className="text-gray-500 hover:text-teal-600 transition-colors">
                    <FaGithub className="text-xl" />
                  </a>
                  <a href={dev.social.twitter} className="text-gray-500 hover:text-teal-600 transition-colors">
                    <FaTwitter className="text-xl" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto mt-24 mb-12 text-center" data-aos="fade-up">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-10 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of happy users who found their ideal roommate or rental property.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg">
              Sign Up Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-bold transition-all duration-300">
              Learn How It Works
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;