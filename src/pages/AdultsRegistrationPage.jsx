import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserCheck, ShieldPlus, VenetianMask, Award, UploadCloud, Briefcase, Banknote, Info } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AdultPersonalInfoSection from '@/components/adults-form/AdultPersonalInfoSection';
import AdultCompetitionDataSection from '@/components/adults-form/AdultCompetitionDataSection';
import AdultDocumentUploadSection from '@/components/adults-form/AdultDocumentUploadSection';

const PaymentInfoSection = ({ paymentDetails }) => (
  <div className="space-y-2 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-primary/30 shadow-lg">
    <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center">
      <Banknote className="h-5 w-5 mr-2 text-primary" /> {paymentDetails.payment_details_title || "Datos para la Transferencia"}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
      <p className="text-muted-foreground"><strong className="text-foreground">Alias:</strong> {paymentDetails.payment_alias}</p>
      <p className="text-muted-foreground"><strong className="text-foreground">CBU:</strong> {paymentDetails.payment_cbu}</p>
      <p className="text-muted-foreground"><strong className="text-foreground">Banco:</strong> {paymentDetails.payment_bank}</p>
      <p className="text-muted-foreground"><strong className="text-foreground">Titular:</strong> {paymentDetails.payment_holder}</p>
      <p className="text-muted-foreground"><strong className="text-foreground">CUIL:</strong> {paymentDetails.payment_cuil}</p>
    </div>
     <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md text-yellow-200 text-xs flex items-start">
      <Info size={16} className="mr-2 mt-0.5 flex-shrink-0 text-yellow-400" />
      <span>Recuerda adjuntar el comprobante de pago más abajo. La inscripción no será válida sin el comprobante.</span>
    </div>
  </div>
);


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
        
        const siteContentData = await fetchWithHandling(
          supabase.from('site_content').select('element_key, content_value')
            .in('element_key', ['payment_details_title', 'payment_alias', 'payment_cbu', 'payment_bank', 'payment_holder', 'payment_cuil', 'adults_weight_chart_image_url_v3']),
          'detalles de pago y URL de imagen'
        );
        
        setOptions({
          genders: ["Masculino", "Femenino"],
          academies: academiesData.map(opt => opt.name),
          beltRanks: beltRanksData.map(opt => opt.name),
          ageCategories: ageCategoriesData.map(opt => opt.name),
          weightCategories: weightCategoriesData.map(opt => opt.name),
        });

        const content = siteContentData.reduce((acc, item) => {
          if (item.content_value && item.content_value.value) {
            acc[item.element_key] = item.content_value.value;
          }
          return acc;
        }, {});
        setPaymentDetails(content);
        setAdultsWeightChartUrl(content.adults_weight_chart_image_url_v3 || '');

      } catch (error) {
        console.error("General error fetching form options/content for adults:", error);
        toast({ title: "Error General de Carga", description: "No se pudieron cargar todos los datos del formulario para adultos.", variant: "destructive" });
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchInitialData();
  }, [toast]);


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
      const paymentProofUrl = await uploadFile(formData.paymentProof, 'documents', 'adults/payment_proofs');
      let medicalCertUrl = null;
      if (formData.medicalCert) {
        medicalCertUrl = await uploadFile(formData.medicalCert, 'documents', 'adults/medical_certs');
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
        first_name: formData.firstName,
        last_name: formData.lastName,
        dni: formData.dni,
        email: formData.email,
        phone_contact: formData.phoneContact,
        dob: formData.dob,
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

      toast({ title: "Inscripción Enviada (Adultos)", description: "Tus datos han sido registrados. Recibirás una confirmación pronto.", variant: "default" });
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
            <CardTitle className="text-3xl font-bold gradient-text">Inscripción para Adultos</CardTitle>
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
            
            <PaymentInfoSection paymentDetails={paymentDetails} />

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