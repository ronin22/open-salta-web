import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserCheck, ShieldPlus, VenetianMask, UploadCloud, Briefcase, Banknote, Info, CalendarClock, Copy, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AdultPersonalInfoSection from '@/components/adults-form/AdultPersonalInfoSection';
import AdultCompetitionDataSection from '@/components/adults-form/AdultCompetitionDataSection';
import AdultDocumentUploadSection from '@/components/adults-form/AdultDocumentUploadSection';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import PaymentInfoSection from "@/components/payments/PaymentInfoSection.jsx";

async function generateRegistrationId(typePrefix) {
  const { data, error } = await supabase
    .from(typePrefix === 'ADULTO' ? 'adults_registrations' : 'minors_registrations')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching count for ID generation:', error);
    // Fallback or throw error
    return `${typePrefix}-${Date.now().toString().slice(-5)}`; 
  }
  const count = data ? (await supabase.from(typePrefix === 'ADULTO' ? 'adults_registrations' : 'minors_registrations').select('id', { count: 'exact' })).count : 0;
  const nextId = (count || 0) + 1;
  return `TORNEO-${typePrefix}-${String(nextId).padStart(5, '0')}`;
}

const AdultsRegistrationPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phoneContact: '', 
    dob: '',
    age: '',
    gender: '',
    academy: '',
    otherAcademy: '',
    professorName: '',
    beltRank: '',
    ageCategory: '', 
    weightCategory: '', 
    paymentProof: null,
    medicalCert: null, 
  });

  const [options, setOptions] = useState({
    genders: ["Masculino", "Femenino"],
    academies: [],
    beltRanks: [],
    ageCategories: [], 
    weightCategories: [], 
  });

  const [paymentDetails, setPaymentDetails] = useState({});
  const [adultsWeightChartUrl, setAdultsWeightChartUrl] = useState('');
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [tournamentName, setTournamentName] = useState("Torneo BJJ");

  const fetchSiteContent = useCallback(async (keys, setterFunction) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('element_key, content_value')
        .in('element_key', keys);

      if (error) throw error;

      const content = data.reduce((acc, item) => {
        if (item.content_value && item.content_value.value !== undefined) {
          acc[item.element_key] = item.content_value.value;
        }
        return acc;
      }, {});
      setterFunction(content);
      if (content.tournament_name) {
        setTournamentName(content.tournament_name);
      }
      return content;
    } catch (error) {
      console.error("Error fetching site content:", error);
      toast({ title: "Error de Carga", description: `No se pudieron cargar algunos datos del sitio. ${error.message}`, variant: "destructive" });
      return {};
    }
  }, [toast]);


  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingOptions(true);
      try {
        const fetchWithHandling = async (query, tableName) => {
          const { data, error } = await query;
          if (error) {
            console.error(`Error fetching ${tableName}:`, error);
            toast({ title: "Error de Carga", description: `No se pudieron cargar opciones de ${tableName}. ${error.message}`, variant: "destructive" });
            return [];
          }
          return data;
        };

        const academiesData = await fetchWithHandling(supabase.from('academies_options').select('name').order('display_order'), 'academias');
        const beltRanksData = await fetchWithHandling(supabase.from('belt_ranks_options').select('name').eq('type', 'adult').order('display_order'), 'graduaciones');
        const ageCategoriesData = await fetchWithHandling(supabase.from('age_categories_options').select('name').eq('type', 'adult').order('display_order'), 'categorías de edad');
        const weightCategoriesData = await fetchWithHandling(supabase.from('weight_categories_options').select('name').order('display_order'), 'categorías de peso');
        
        setOptions({
          genders: ["Masculino", "Femenino"],
          academies: academiesData.map(opt => opt.name),
          beltRanks: beltRanksData.map(opt => opt.name),
          ageCategories: ageCategoriesData.map(opt => opt.name),
          weightCategories: weightCategoriesData.map(opt => opt.name),
        });
        
        const paymentContentKeys = ['payment_details_title', 'payment_alias', 'payment_cbu', 'payment_bank', 'payment_holder', 'payment_cuil', 'adults_weight_chart_image_url_v3', 'payment_value_tiers_v2', 'tournament_name'];
        const fetchedPaymentDetails = await fetchSiteContent(paymentContentKeys, setPaymentDetails);
        setAdultsWeightChartUrl(fetchedPaymentDetails.adults_weight_chart_image_url_v3 || '');


      } catch (error) {
        console.error("General error fetching form options/content for adults:", error);
        toast({ title: "Error General de Carga", description: "No se pudieron cargar todos los datos del formulario para adultos.", variant: "destructive" });
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchInitialData();
  }, [toast, fetchSiteContent]);


  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    } else {
      setFormData(prev => ({ ...prev, age: '' }));
    }
  }, [formData.dob]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };
  
  const uploadFile = async (file, bucket, pathPrefix = 'public') => {
    if (!file) return null;
    const fileName = `${pathPrefix}/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error(`Error uploading ${file.name}:`, error);
      toast({
        title: "Error de Subida",
        description: `No se pudo subir el archivo ${file.name}: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
    const { data: publicURLData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicURLData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ['firstName', 'lastName', 'dni', 'email', 'phoneContact', 'dob', 'gender', 'academy', 'professorName', 'beltRank', 'ageCategory', 'weightCategory'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({ title: "Error de Validación", description: `Por favor, completa el campo "${field}".`, variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
    }
    if (formData.academy === "Otra" && !formData.otherAcademy) {
      toast({ title: "Error de Validación", description: "Por favor, especifica el nombre de tu academia.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (!formData.paymentProof) { 
      toast({ title: "Archivo Faltante", description: "Por favor, sube el comprobante de pago.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    try {
      const registration_id = await generateRegistrationId('ADULTO');

      const paymentProofUrl = await uploadFile(formData.paymentProof, 'documents', `adults/${registration_id}/payment_proofs`);
      let medicalCertUrl = null;
      if (formData.medicalCert) {
        medicalCertUrl = await uploadFile(formData.medicalCert, 'documents', `adults/${registration_id}/medical_certs`);
        if (!medicalCertUrl && formData.medicalCert) { 
            toast({ title: "Error de Subida de Archivos", description: "No se pudo subir el apto médico. Intenta de nuevo o envíalo más tarde.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }
      }

      if (!paymentProofUrl) {
        toast({ title: "Error de Subida de Archivos", description: "No se pudo subir el comprobante de pago. Intenta de nuevo.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      
      const registrationData = {
        registration_id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        dni: formData.dni,
        email: formData.email,
        phone: formData.phoneContact,
        birth_date: formData.dob,
        age: parseInt(formData.age, 10) || null,
        gender: formData.gender,
        academy: formData.academy,
        other_academy: formData.academy === 'Otra' ? formData.otherAcademy : null,
        professor_name: formData.professorName,
        belt_rank: formData.beltRank,
        age_category: formData.ageCategory, 
        weight_category: formData.weightCategory, 
        payment_proof_url: paymentProofUrl,
        medical_cert_url: medicalCertUrl, 
        registration_status: 'pending',
      };

      const { error: dbError } = await supabase
        .from('adults_registrations')
        .insert([registrationData]);

      if (dbError) {
        console.error("Supabase DB error:", dbError);
        toast({ title: "Error en el Registro", description: `Hubo un problema al guardar tus datos: ${dbError.message}`, variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      // Send email
      const emailPayload = {
        recipientEmail: formData.email,
        registrationId: registration_id,
        fullName: `${formData.firstName} ${formData.lastName}`,
        dni: formData.dni,
        academy: formData.academy === 'Otra' ? formData.otherAcademy : formData.academy,
        category: formData.ageCategory,
        weight: formData.weightCategory,
        beltRank: formData.beltRank,
        professor: formData.professorName,
        tournamentName: tournamentName,
        type: 'adult',
      };
      
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-registration-email', {
          body: JSON.stringify(emailPayload),
      });

      if (emailError) {
          console.error('Error sending confirmation email:', emailError);
          toast({ title: "Correo no Enviado", description: "Se registró tu inscripción, pero hubo un problema al enviar el correo de confirmación.", variant: "destructive" });
      } else {
          console.log('Confirmation email sent:', emailData);
          toast({ title: "Correo Enviado", description: "Se ha enviado un correo de confirmación con los detalles de tu inscripción.", icon: <Mail className="h-5 w-5" /> });
      }

      toast({ title: "Inscripción Enviada (Adultos)", description: `Tu inscripción ha sido registrada con el ID: ${registration_id}. Revisa tu correo para la confirmación.`, variant: "default" });
      setFormData({
        firstName: '', lastName: '', dni: '', email: '', phoneContact: '', dob: '', age: '', gender: '',
        academy: '', otherAcademy: '', professorName: '', beltRank: '', ageCategory: '', weightCategory: '',
        paymentProof: null, medicalCert: null,
      });
      Array.from(document.querySelectorAll("input[type='file']")).forEach(input => (input.value = null));
    } catch (error) {
      console.error("Submission error:", error);
      toast({ title: "Error Inesperado", description: "Ocurrió un error al procesar tu inscripción. Por favor, inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loadingOptions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-muted-foreground text-lg">Cargando opciones del formulario...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="glassmorphism shadow-2xl border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-3">
            <UserCheck className="h-12 w-12 text-primary mr-3" />
            <CardTitle className="text-3xl font-bold ">Inscripción para Adultos</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Completa tus datos personales para participar en el torneo.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 pt-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center">
                <VenetianMask className="h-5 w-5 mr-2 text-primary" /> Datos Personales
              </h3>
              <AdultPersonalInfoSection
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                options={options}
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" /> Datos Profesionales y de Academia
              </h3>
              <AdultCompetitionDataSection
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                options={options}
                isSubmitting={isSubmitting}
                adultsWeightChartUrl={adultsWeightChartUrl}
              />
            </div>
            
            <PaymentInfoSection />

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center">
                <UploadCloud className="h-5 w-5 mr-2 text-primary" /> Documentación Requerida
              </h3>
              <AdultDocumentUploadSection
                formData={formData}
                handleFileChange={handleFileChange}
                isSubmitting={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-6">
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50" disabled={isSubmitting || loadingOptions}>
              <ShieldPlus className="mr-2 h-5 w-5" /> {isSubmitting ? 'Enviando...' : 'Enviar Inscripción'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AdultsRegistrationPage;