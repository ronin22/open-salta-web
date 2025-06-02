import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeartHandshake as Handshake, ExternalLink, Instagram, Facebook, Twitter as TwitterIcon } from 'lucide-react';

const fadeIn = (delay = 0, y = 20) => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } },
});

const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

const SponsorCard = ({ sponsor }) => (
  <motion.div 
    variants={fadeIn(0.1, 15)}
    className="glassmorphism p-4 rounded-lg shadow-md hover:shadow-primary/40 transition-all duration-300 flex flex-col items-center text-center group h-full"
  >
    <a href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer" className="block w-full flex flex-col flex-grow">
      <div className="h-24 w-full flex items-center justify-center mb-3 bg-gray-700/30 rounded flex-shrink-0">
        {sponsor.logo_url ? (
            <img src={sponsor.logo_url} alt={`Logo de ${sponsor.name}`} className="max-h-20 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Logo no disponible</div>
          )}
      </div>
      <p className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors mt-auto">{sponsor.name}</p>
    </a>
    <div className="flex space-x-3 mt-3 flex-shrink-0">
      {sponsor.website_url && (
        <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" aria-label={`${sponsor.name} website`} className="text-muted-foreground/70 hover:text-primary transition-colors">
          <ExternalLink size={18} />
        </a>
      )}
      {sponsor.instagram_url && (
        <a href={sponsor.instagram_url} target="_blank" rel="noopener noreferrer" aria-label={`${sponsor.name} Instagram`} className="text-muted-foreground/70 hover:text-primary transition-colors">
          <Instagram size={18} />
        </a>
      )}
      {sponsor.facebook_url && (
        <a href={sponsor.facebook_url} target="_blank" rel="noopener noreferrer" aria-label={`${sponsor.name} Facebook`} className="text-muted-foreground/70 hover:text-primary transition-colors">
          <Facebook size={18} />
        </a>
      )}
      {sponsor.twitter_url && (
        <a href={sponsor.twitter_url} target="_blank" rel="noopener noreferrer" aria-label={`${sponsor.name} Twitter`} className="text-muted-foreground/70 hover:text-primary transition-colors">
          <TwitterIcon size={18} />
        </a>
      )}
    </div>
  </motion.div>
);

const SponsorsSection = ({ content, sponsors }) => (
  <motion.section id="sponsors" variants={fadeIn(0.4)} initial="hidden" animate="visible" className="py-12">
    <h2 className="text-4xl font-semibold text-center mb-12 gradient-text flex items-center justify-center">
      <Handshake className="mr-3 h-10 w-10 text-primary" /> {content.sponsors_title?.value || "Nos Auspician:"}
    </h2>
    {sponsors.length > 0 ? (
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center"
        variants={staggerContainer(0.15)}
        initial="hidden"
        animate="visible"
      >
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} />
        ))}
      </motion.div>
    ) : (
      <p className="text-center text-muted-foreground">Próximamente más patrocinadores.</p>
    )}
    <div className="text-center mt-10">
        <p className="text-muted-foreground">
          ¿Quieres que tu marca sea parte de este gran evento? 
          <Button variant="link" asChild className="text-primary p-0 h-auto ml-1">
            <a href={`mailto:${content.sponsors_contact_email?.value || 'sponsor@example.com'}`}>
              {content.sponsors_contact_text?.value || "Contáctanos"}
            </a>
          </Button>
        </p>
    </div>
  </motion.section>
);

export default SponsorsSection;