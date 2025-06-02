import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import RegistrationSection from "@/components/home/RegistrationSection";
import EventInfoSection from "@/components/home/EventInfoSection";
import SponsorsSection from "@/components/home/SponsorsSection";

const HomePage = () => {

  return (
    <div className="space-y-20 md:space-y-28">
      <HeroSection  />
      <RegistrationSection />
      <EventInfoSection  />
      <SponsorsSection  />
      {/*<GallerySection />*/}
    </div>
  );
};

export default HomePage;