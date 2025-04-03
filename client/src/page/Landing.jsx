import React from 'react';
import Header from '../components/Landing/sections/Header';
import Hero from '../components/Landing/sections/Hero';
import Features from '../components/Landing/sections/Features';
import HowItWorks from '../components/Landing/sections/HowItWorks';
import SecurityOwnership from '../components/Landing/sections/SecurityOwnership';
import Faqs from '../components/Landing/sections/faqs';
import Footer from '../components/Landing/sections/Footer';
const Landing = () => {
  return (
    <main className="overflow-y-auto overflow-x-hidden h-full">
      <Header />
      <Hero />
      <Features />
      <HowItWorks/>
      <SecurityOwnership/>
      <Faqs/>
      <Footer />
    </main>
  );
};

export default Landing;