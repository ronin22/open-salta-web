import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Info, Banknote, Landmark as LandmarkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const iconVariants = {
  hover: { scale: 1.1, rotate: 5 },
  tap: { scale: 0.95 }
};

const EventInfoSection = () => {
  const [eventDetails, setEventDetails] = useState({
    date: "28 y 29 de Septiembre, 2024",
    location: "Complejo Nicolás Vitale, Barrio El Tribuno, Salta Capital",
    description: "¡Prepárate para el torneo de Jiu-Jitsu más esperado del Norte Argentino! Dos días de pura adrenalina, técnica y camaradería. Contaremos con categorías para todas las edades y niveles de experiencia, desde cinturones blancos hasta los más experimentados cinturones negros.",
    tournamentName: "Open Salta BJJ"
  });
  const [paymentInstructions, setPaymentInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const { data: siteContentData, error: siteContentError } = await supabase
          .from('site_content')
          .select('element_key, content_value')
          .in('element_key', ['event_date', 'event_location', 'event_description', 'tournament_name']);

        if (siteContentError) throw siteContentError;
        
        const newEventDetails = {...eventDetails};
        siteContentData.forEach(item => {
          if (item.content_value && item.content_value.value) {
            switch (item.element_key) {
              case 'event_date': newEventDetails.date = item.content_value.value; break;
              case 'event_location': newEventDetails.location = item.content_value.value; break;
              case 'event_description': newEventDetails.description = item.content_value.value; break;
              case 'tournament_name': newEventDetails.tournamentName = item.content_value.value; break;
            }
          }
        });
        setEventDetails(newEventDetails);

        const { data: paymentData, error: paymentError } = await supabase
          .from('payment_instructions')
          .select('label, value, details, display_order')
          .order('display_order', { ascending: true });

        if (paymentError) throw paymentError;
        setPaymentInstructions(paymentData || []);

      } catch (error) {
        console.error("Error fetching event info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);

  const InfoItem = ({ icon: Icon, title, content }) => (
    <motion.div 
      className="flex items-start space-x-4 p-6 bg-card/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-primary/30 transition-shadow duration-300"
      whileHover="hover"
      whileTap="tap"
    >
      <motion.div variants={iconVariants} className="text-primary">
        <Icon size={32} />
      </motion.div>
      <div>
        <h3 className="text-xl font-semibold text-primary mb-1">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );

  return (
    <section id="event-info" className="py-16 md:py-24 bg-gradient-to-br from-background to-background/80">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Información del Evento: {eventDetails.tournamentName}
        </motion.h2>
        
        {loading ? (
          <p className="text-center text-lg text-muted-foreground">Cargando información del evento...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
            <InfoItem icon={CalendarDays} title="Fecha" content={eventDetails.date} />
            <InfoItem icon={MapPin} title="Lugar" content={eventDetails.location} />
            <motion.div 
              className="md:col-span-2 flex items-start space-x-4 p-6 bg-card/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-primary/30 transition-shadow duration-300"
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div variants={iconVariants} className="text-primary">
                <Info size={32} />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-1">Descripción del Torneo</h3>
                <p className="text-muted-foreground leading-relaxed">{eventDetails.description}</p>
              </div>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/70 backdrop-blur-md border-border shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/30">
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary flex items-center">
                <Banknote size={36} className="mr-3 text-primary" />
                Datos para la Transferencia e Inscripción
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              {loading ? (
                 <p className="text-center text-lg text-muted-foreground py-4">Cargando datos de pago...</p>
              ) : paymentInstructions.length > 0 ? (
                <div className="space-y-5">
                  {paymentInstructions.map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-background/50 rounded-lg border border-border shadow-sm hover:border-primary/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex items-center mb-2 sm:mb-0">
                        <LandmarkIcon className="h-5 w-5 mr-3 text-primary/80" />
                        <span className="font-semibold text-muted-foreground min-w-[200px]">{item.label}:</span>
                      </div>
                      <div className="text-right sm:text-left">
                         <p className="text-lg font-medium text-foreground">{item.value}</p>
                         {item.details && <p className="text-xs text-muted-foreground/80">{item.details}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No hay instrucciones de pago disponibles en este momento.</p>
              )}
              <motion.div 
                className="mt-8 p-4 bg-primary/10 border-l-4 border-primary rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: paymentInstructions.length * 0.1 + 0.2 }}
              >
                <p className="text-sm text-primary-foreground/90">
                  <strong>Importante:</strong> Una vez realizada la transferencia, por favor envía el comprobante de pago a <a href="mailto:pagos@opensaltabjj.com" className="font-bold underline hover:text-primary-foreground">pagos@opensaltabjj.com</a> o súbelo durante el proceso de inscripción online. Tu inscripción solo será confirmada tras verificar el pago.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default EventInfoSection;
