import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WhyOya from '../components/WhyOya';
import ROISimulator from '../components/ROISimulator';
import VisionTeam from '../components/VisionTeam';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f4f0ec]">
      <Header />
      <Hero />
      <WhyOya />
      <ROISimulator />
      <VisionTeam />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default LandingPage;