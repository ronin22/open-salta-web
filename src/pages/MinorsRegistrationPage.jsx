import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MinorsRegistrationForm from '@/components/minors-form/MinorsRegistrationForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserPlus, FileText as FileTextIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';


const MinorsRegistrationPage = () => {
  const [minorsAffidavitContent, setMinorsAffidavitContent] = useState('');
  const [loadingAffidavit, setLoadingAffidavit] = useState(true);
  const { toast } = useToast();


  useEffect(() => {
    const fetchAffidavit = async () => {
      setLoadingAffidavit(true);
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content_value')
          .eq('element_key', 'affidavit_minors_text_v2') 
          .single();

        if (error) {
          if (error.code === 'PGRST116') { 
            console.warn("Specific minors affidavit 'affidavit_minors_text_v2' not found in site_content. Ensure it is populated in the database.");
            setMinorsAffidavitContent("Declaración jurada para menores no encontrada. Por favor, contacte a la organización.");
            toast({ title: "Advertencia", description: "No se encontró el texto de la declaración jurada para menores.", variant: "destructive" });
          } else {
            throw error;
          }
        } else if (data && data.content_value && data.content_value.value) {
          setMinorsAffidavitContent(data.content_value.value);
        } else {
           setMinorsAffidavitContent("Declaración jurada para menores no disponible. Contacte a la organización.");
           console.warn("Minors affidavit 'affidavit_minors_text_v2' found but content_value is missing or empty.");
        }
      } catch (error) {
        console.error("Error fetching minors affidavit:", error);
        toast({ title: "Error", description: "No se pudo cargar la declaración jurada para menores.", variant: "destructive" });
        setMinorsAffidavitContent("Error al cargar la declaración. Por favor, contacta a la organización.");
      } finally {
        setLoadingAffidavit(false);
      }
    };

    fetchAffidavit();
  }, [toast]);


  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="glassmorphism shadow-2xl border-border mb-8">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-3">
             <FileTextIcon className="h-12 w-12 text-primary mr-3" />
            <CardTitle className="text-3xl font-bold ">Declaración Jurada (Menores)</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground">
            Por favor, lee atentamente la siguiente declaración jurada. Debe ser comprendida por el padre/madre/tutor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingAffidavit ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="ml-3 text-muted-foreground">Cargando declaración...</p>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 border border-border rounded-md bg-background/50 max-h-60 overflow-y-auto text-xs whitespace-pre-line">
              {minorsAffidavitContent}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glassmorphism shadow-2xl border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-3">
            <UserPlus className="h-12 w-12 text-primary mr-3" />
            <CardTitle className="text-3xl font-bold ">Inscripción para Menores de Edad</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Completa los datos del competidor menor de edad y del padre/madre/tutor.
          </CardDescription>
        </CardHeader>
        <MinorsRegistrationForm />
      </Card>
    </motion.div>
  );
};

export default MinorsRegistrationPage;