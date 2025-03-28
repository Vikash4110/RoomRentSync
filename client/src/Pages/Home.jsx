import React, { useEffect } from "react";
import Hero from "../Components/VideoMain";
import HeroSection from "../Components/HeroSection";
import SectionWhy from "../Components/SectionWhy";
import Acheivment from "../Components/Acheivment";
import HowItWorks from "../Components/HowItWorks";
import Footer from "../Components/Footer";
// import WhySolvit from "../Components/WhySolvit";
// import Footer from "../Components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out",
      once: true,
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <>
    {/* <Hero/> */}
      <HeroSection />
      <SectionWhy/>
      <HowItWorks/>
      <Acheivment/>
      <Footer/>
      {/* <OurServices />
      <WhySolvit />
      <Footer /> */}
    </>
  );
};

export default Home;