import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Users, Shield, CalendarDays, MapPin, Medal, Image as ImageIcon, Video, HeartHandshake as Handshake, ExternalLink, Instagram, Facebook, Twitter as TwitterIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

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

const HeroSection = ({ content }) => (
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
        {content.tournament_name?.value || "OPEN SALTA"} <span className="text-primary">{content.tournament_highlight?.value || ""}</span>
      </motion.h1>
      <motion.p 
        className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
        variants={fadeIn(0.4, 20)}
      >
        {content.tournament_subtitle?.value || "Nueva edicion del clasico del NOA"}
      </motion.p>
      <motion.div variants={fadeIn(0.6)}>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <Link to="/#inscripcion">¡Inscríbete Ahora!</Link>
        </Button>
      </motion.div>
    </div>
  </motion.section>
);

const RegistrationCard = ({ title, description, linkTo, icon, buttonText, buttonClass }) => (
  <Card className="bg-card border-border shadow-xl h-full flex flex-col hover:shadow-primary/30 transition-shadow duration-300">
    <CardHeader className="text-center pt-8">
      {icon}
      <CardTitle className="text-3xl font-bold text-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-muted-foreground mb-6">{description}</p>
    </CardContent>
    <CardFooter className="p-6">
      <Link to={linkTo} className="w-full">
        <Button size="lg" className={`w-full text-lg py-3 ${buttonClass} shadow-md transform hover:scale-105 transition-all duration-300 rounded-md`}>
          {buttonText}
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

const RegistrationSection = ({ content }) => (
  <motion.section 
    id="inscripcion" 
    className="py-16 bg-card/70 rounded-xl shadow-xl glassmorphism"
    variants={fadeIn(0.2)}
    initial="hidden"
    animate="visible"
  >
    <div className="container mx-auto px-4 text-center">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
        variants={fadeIn(0.1)}
      >
        {content.registration_title?.value || "Asociacion Salteña de Brazilian Jiu Jitsu"}
      </motion.h2>
      {content.registration_subtitle?.value && (
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          variants={fadeIn(0.2)}
        >
          {content.registration_subtitle.value}
        </motion.p>
      )}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8"
        variants={staggerContainer(0.2)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeIn(0, 30)}>
          <RegistrationCard
            title="Inscripción Menores"
            description={content.minors_registration_card_description?.value || "Para competidores hasta 17 años."}
            linkTo="/affidavit/minors"
            icon={<Users className="h-12 w-12 mx-auto mb-4 text-secondary" />}
            buttonText="Inscribir Menor"
            buttonClass="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          />
        </motion.div>
        <motion.div variants={fadeIn(0, 30)}>
          <RegistrationCard
            title="Inscripción Adultos"
            description={content.adults_registration_card_description?.value || "Categorías Adultos y Masters."}
            linkTo="/affidavit/adults"
            icon={<Shield className="h-12 w-12 mx-auto mb-4 text-primary" />}
            buttonText="Inscribir Adulto"
            buttonClass="bg-primary hover:bg-primary/90 text-primary-foreground"
          />
        </motion.div>
      </motion.div>
    </div>
  </motion.section>
);

const InfoCard = ({ icon, title, description, link }) => {
  const cardContent = (
    <>
      <div className="p-4 rounded-full bg-primary/10 mb-4 inline-block">
        {React.cloneElement(icon, { className: "h-10 w-10" })}
      </div>
      <CardTitle className="text-2xl font-bold text-foreground mb-2">{title}</CardTitle>
      <CardDescription className="text-muted-foreground text-lg">{description}</CardDescription>
    </>
  );

  return (
    <motion.div
      variants={fadeIn(0.1, 15)}
      className="glassmorphism p-8 rounded-xl shadow-lg hover:shadow-secondary/30 transition-all duration-300 flex flex-col items-center text-center h-full"
    >
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center w-full h-full hover:text-primary">
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </motion.div>
  );
};


const EventInfoSection = ({ content }) => (
  <motion.section id="info" variants={fadeIn(0.3)} initial="hidden" animate="visible" className="py-12">
    <h2 className="text-4xl font-semibold text-center mb-12 gradient-text">{content.event_details_title?.value || "Detalles del Evento"}</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <InfoCard 
        icon={<CalendarDays className="text-primary"/>} 
        title={content.event_date_time?.title || "Fecha y Hora"} 
        description={content.event_date_time?.description || "Sábado, 28 de Junio de 2025. Inicio: 09:00AM"} 
      />
      <InfoCard 
        icon={<MapPin className="text-secondary"/>} 
        title={content.event_location?.title || "Ubicación"} 
        description={content.event_location?.description || "Diario la Razon 4400, Ciudad de Salta"}
        link={content.event_location?.link || "https://g.co/kgs/gydM6ij"}
      />
      <InfoCard 
        icon={<Medal className="text-yellow-500"/>} 
        title={content.event_categories_info?.title || "Categorías"} 
        description={content.event_categories_info?.description || "Infantiles, Juveniles, Adultos y Masters. Reglamento IBJJF"} 
      />
    </div>
  </motion.section>
);

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

const GalleryItem = ({ type, title, icon, imageUrl, videoUrl, altText }) => (
  <motion.div 
    variants={fadeIn(0.1, 15)}
    className="relative group overflow-hidden rounded-xl shadow-lg aspect-[4/3] glassmorphism"
    whileHover={{ scale: 1.03, zIndex: 10 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <img  alt={altText || title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" src={imageUrl || "https://images.unsplash.com/photo-1694388001616-1176f534d72f"} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
      <div className="flex items-center space-x-2 text-white">
        {React.cloneElement(icon, { className: "h-5 w-5" })}
        <span className="font-semibold">{title}</span>
      </div>
    </div>
     {type === 'video' && videoUrl && (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/50 p-3 rounded-full">
         <Video size={48} className="text-white drop-shadow-lg" />
        </div>
      </a>
    )}
  </motion.div>
);

const GallerySection = ({ content, galleryItems }) => (
  <motion.section id="gallery" variants={fadeIn(0.5)} initial="hidden" animate="visible" className="py-12">
    <h2 className="text-4xl font-semibold text-center mb-12 gradient-text">{content.gallery_title?.value || "Ediciones Anteriores"}</h2>
    {galleryItems.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <GalleryItem 
            key={item.id} 
            type={item.type} 
            title={item.title} 
            altText={item.alt_text || item.title} 
            icon={item.type === 'image' ? <ImageIcon /> : <Video />} 
            imageUrl={item.image_url}
            videoUrl={item.video_url}
          />
        ))}
      </div>
    ) : (
       <p className="text-center text-muted-foreground">Próximamente galería de eventos.</p>
    )}
  </motion.section>
);

const HomePage = () => {
  const [content, setContent] = useState({});
  const [sponsors, setSponsors] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: siteContentData, error: siteContentError } = await supabase
          .from('site_content')
          .select('element_key, content_value');
        
        if (siteContentError) throw siteContentError;

        const formattedContent = siteContentData.reduce((acc, item) => {
          acc[item.element_key] = item.content_value;
          return acc;
        }, {});
        setContent(formattedContent);

        const { data: sponsorsData, error: sponsorsError } = await supabase
          .from('sponsors')
          .select('*')
          .order('display_order', { ascending: true });

        if (sponsorsError) throw sponsorsError;
        setSponsors(sponsorsData || []);

        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery_items')
          .select('*')
          .order('display_order', { ascending: true });

        if (galleryError) throw galleryError;
        setGalleryItems(galleryData || []);

      } catch (err) {
        console.error("Error fetching data from Supabase:", err);
        setError("No se pudo cargar el contenido de la página. Por favor, inténtalo más tarde.");
        setContent({ // Fallback content
          tournament_name: {value: "OPEN SALTA"},
          tournament_subtitle: {value: "Nueva edicion del clasico del NOA"},
          registration_title: {value: "Asociacion Salteña de Brazilian Jiu Jitsu"},
          minors_registration_card_description: {value: "Para competidores hasta 17 años"},
          adults_registration_card_description: {value: "Categorías Adultos y Masters"},
          event_date_time: {title: "Fecha y Hora", description: "Sábado, 28 de Junio de 2025. Inicio: 09:00AM"},
          event_location: {title: "Ubicación", description: "Diario la Razon 4400, Ciudad de Salta", link: "https://g.co/kgs/gydM6ij"},
          event_categories_info: {title: "Categorías", description: "Infantiles, Juveniles, Adultos y Masters. Reglamento IBJJF"},
          sponsors_title: {value: "Nos Auspician:"},
          gallery_title: {value: "Ediciones Anteriores"}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-lg text-muted-foreground">Cargando contenido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <Shield className="h-20 w-20 text-destructive mb-4" />
        <h2 className="text-3xl font-bold text-destructive mb-2">Error al Cargar</h2>
        <p className="text-lg text-muted-foreground max-w-md">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Intentar de Nuevo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-20 md:space-y-28">
      <HeroSection content={content} />
      <RegistrationSection content={content} />
      <EventInfoSection content={content} />
      <SponsorsSection content={content} sponsors={sponsors} />
      <GallerySection content={content} galleryItems={galleryItems} />
    </div>
  );
};

export default HomePage;