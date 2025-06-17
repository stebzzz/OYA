import React, { useState } from 'react';
import { Play, CheckCircle, ArrowRight, Target, Zap, Shield, TrendingUp, Users, Clock, DollarSign, Star, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ROICalculator from '../components/ROICalculator';
import Testimonials from '../components/Testimonials';

import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f4f0ec]">
      <Header />
      <Hero />
      <Features />
      <ROICalculator />
      <Testimonials />

      <Footer />
    </div>
  );
};

export default LandingPage;