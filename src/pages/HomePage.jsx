import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import RegistrationSection from "@/components/home/RegistrationSection";

const HomePage = () => {

  return (
    <div className="space-y-20 md:space-y-28">
      <HeroSection  />
      <RegistrationSection />
      {/*<EventInfoSection  />
      <SponsorsSection  />
      <GallerySection />*/}
    </div>
  );
};

export default HomePage;