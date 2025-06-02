import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react'; // Assuming Shield is used for error display
import HeroSection from '@/components/home/HeroSection';
import RegistrationSection from '@/components/home/RegistrationSection';
import EventInfoSection from '@/components/home/EventInfoSection';
import SponsorsSection from '@/components/home/SponsorsSection';
import GallerySection from '@/components/home/GallerySection';

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
        setContent({ 
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