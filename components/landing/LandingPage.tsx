import React from 'react';
import {HeroSection} from './HeroSection'
import {FeaturesGrid} from './FeaturesGrid'

const LandingPage = () => {
  return (
    <div className=" bg-gradient-to-br from-black to-zinc-900">
      <HeroSection />
      <FeaturesGrid />
    </div>
  );
};

export default LandingPage;