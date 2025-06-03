import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, HeartHandshake as Handshake, Camera, FileImage as LucideImage, Landmark } from 'lucide-react'; // Added Landmark
import { motion } from 'framer-motion';
import RegistrationsTable from '@/components/admin/RegistrationsTable';
import SponsorsManager from '@/components/admin/SponsorsManager';
import GalleryManager from '@/components/admin/GalleryManager';
import PaymentInstructionsManager from '@/components/admin/PaymentInstructionsManager'; // New import

const AdminRegistrationsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('adults');
  
  const [adultsRegistrations, setAdultsRegistrations] = useState([]);
  const [minorsRegistrations, setMinorsRegistrations] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [paymentInstructions, setPaymentInstructions] = useState([]); // New state

  const [loading, setLoading] = useState({
    adults: false,
    minors: false,
    sponsors: false,
    gallery: false,
    paymentInstructions: false, // New loading state
  });

  const fetchData = useCallback(async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    let query;
    switch (type) {
      case 'adults':
        query = supabase.from('adults_registrations').select('*').order('created_at', { ascending: false });
        break;
      case 'minors':
        query = supabase.from('minors_registrations').select('*').order('created_at', { ascending: false });
        break;
      case 'sponsors':
        query = supabase.from('sponsors').select('*').order('display_order', { ascending: true });
        break;
      case 'gallery':
        query = supabase.from('gallery_items').select('*').order('display_order', { ascending: true });
        break;
      case 'paymentInstructions': // New case
        query = supabase.from('payment_instructions').select('*').order('display_order', { ascending: true });
        break;
      default:
        setLoading(prev => ({ ...prev, [type]: false }));
        return;
    }

    try {
      const { data, error } = await query;
      if (error) throw error;
      
      switch (type) {
        case 'adults': setAdultsRegistrations(data || []); break;
        case 'minors': setMinorsRegistrations(data || []); break;
        case 'sponsors': setSponsors(data || []); break;
        case 'gallery': setGalleryItems(data || []); break;
        case 'paymentInstructions': setPaymentInstructions(data || []); break; // Set new state
      }
    } catch (error) {
      toast({ title: `Error al cargar ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}`, description: error.message, variant: 'destructive' });
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [toast]);

  useEffect(() => {
    fetchData('adults');
    fetchData('minors');
    fetchData('sponsors');
    fetchData('gallery');
    fetchData('paymentInstructions'); // Fetch new data
  }, [fetchData]);


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 md:px-0"
    >
      <h1 className="text-4xl font-bold mb-8  text-center">Panel de Administración</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6 bg-background/70 backdrop-blur-md">
          <TabsTrigger value="adults" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="mr-2 h-5 w-5" /> Inscripciones Adultos
          </TabsTrigger>
          <TabsTrigger value="minors" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="mr-2 h-5 w-5" /> Inscripciones Menores
          </TabsTrigger>
          <TabsTrigger value="sponsors" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Handshake className="mr-2 h-5 w-5" /> Patrocinadores
          </TabsTrigger>
          <TabsTrigger value="gallery" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Camera className="mr-2 h-5 w-5" /> Galería
          </TabsTrigger>
          <TabsTrigger value="paymentInstructions" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Landmark className="mr-2 h-5 w-5" /> Datos de Transferencia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adults" className="p-4 bg-card rounded-xl shadow-lg">
          {loading.adults ? <p className="text-center py-4">Cargando inscripciones de adultos...</p> : <RegistrationsTable data={adultsRegistrations} type="adults" />}
        </TabsContent>
        <TabsContent value="minors" className="p-4 bg-card rounded-xl shadow-lg">
          {loading.minors ? <p className="text-center py-4">Cargando inscripciones de menores...</p> : <RegistrationsTable data={minorsRegistrations} type="minors" />}
        </TabsContent>
        <TabsContent value="sponsors" className="p-4 bg-card rounded-xl shadow-lg">
          <SponsorsManager 
            initialSponsors={sponsors} 
            loading={loading.sponsors} 
            fetchSponsors={() => fetchData('sponsors')} 
          />
        </TabsContent>
        <TabsContent value="gallery" className="p-4 bg-card rounded-xl shadow-lg">
          <GalleryManager 
            initialGalleryItems={galleryItems} 
            loading={loading.gallery}
            fetchGalleryItems={() => fetchData('gallery')}
          />
        </TabsContent>
        <TabsContent value="paymentInstructions" className="p-4 bg-card rounded-xl shadow-lg"> {/* New Tab Content */}
          <PaymentInstructionsManager
            initialInstructions={paymentInstructions}
            loading={loading.paymentInstructions}
            fetchInstructions={() => fetchData('paymentInstructions')}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-700 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center">
          <LucideImage className="mr-2 h-5 w-5" /> Instrucciones para Imágenes/Logos:
        </h3>
        <ol className="list-decimal list-inside text-blue-200 space-y-1 text-sm">
          <li>Accede a tu proyecto en <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-100">Supabase</a>.</li>
          <li>En el menú lateral, ve a "Storage".</li>
          <li>Crea un nuevo bucket (o usa uno existente, ej: "public_assets"). Asegúrate de que sea público si quieres acceso directo.</li>
          <li>Sube tu archivo (logo, foto de galería) al bucket.</li>
          <li>Una vez subido, selecciona el archivo y busca la opción "Get URL" o "Copy URL".</li>
          <li>Pega esa URL en el campo correspondiente del formulario ("URL del Logo", "URL de Imagen") en esta página de administración.</li>
        </ol>
      </div>

    </motion.div>
  );
};

export default AdminRegistrationsPage;
