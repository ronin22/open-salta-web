import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const fadeIn = (delay = 0, y = 20) => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } },
});

const HeroSection = () => {
  const handleScrollToInscription = (e) => {
    e.preventDefault();
    const targetElement = document.getElementById('inscripcion');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      className="relative text-center py-24 md:py-40 bg-gradient-to-br from-gray-900 via-brand-dark to-black rounded-xl shadow-2xl overflow-hidden"
      variants={fadeIn()}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 opacity-30">
        <img  alt="Luchadores de BJJ en una competencia intensa, desenfoque de movimiento" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1624938518616-3be0add427d1" />
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-lg uppercase tracking-wider"
          variants={fadeIn(0.2, 30)}
        >
          OPEN SALTA <span className="text-primary">2025</span>
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
          variants={fadeIn(0.4, 20)}
        >
          Nueva edición del clásico del NOA
        </motion.p>
        <motion.div variants={fadeIn(0.6)}>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <Link to="/#inscripcion" onClick={handleScrollToInscription}>¡Inscríbete Ahora!</Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;