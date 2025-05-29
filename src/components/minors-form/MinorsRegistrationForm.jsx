import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, VenetianMask, Award, UserCog, UploadCloud, Banknote, Info, Briefcase, Weight, Layers, Fingerprint as DniIcon } from 'lucide-react';
import FormSection from '@/components/minors-form/FormSection';
import PersonalInfoSection from '@/components/minors-form/PersonalInfoSection';
import CompetitionDataSection from '@/components/minors-form/CompetitionDataSection';
import GuardianInfoSection from '@/components/minors-form/GuardianInfoSection';
import DocumentUploadSection from '@/components/minors-form/DocumentUploadSection';
import { supabase } from '@/lib/supabaseClient';

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

const MinorsRegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    childFirstName: '',
    childLastName: '',
    childDni: '',
    childDob: '',
    childAge: '',
    childGender: '',
    childBeltRank: '',
    childAgeCategory: '',
    childWeightKg: '',
    childAcademy: '',
    childOtherAcademy: '',
    childProfessorName: '',
    parentName: '',
    parentDni: '',
    contactEmail: '', 
    contactPhone: '', 
    paymentProof: null,
    medicalCert: null, 
    dniPhotoChild: null,
    dniPhotoParent: null,
  });

  const [options, setOptions] = useState({
    genders: ["Masculino", "Femenino"],
    academies: [],
    beltRanks: [],
    ageCategories: [],
  });

  const [paymentDetails, setPaymentDetails] = useState({});
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
        const beltRanksData = await fetchWithHandling(supabase.from('belt_ranks_options').select('name').eq('type', 'minor').order('display_order'), 'graduaciones');
        const ageCategoriesData = await fetchWithHandling(supabase.from('age_categories_options').select('name').eq('type', 'minor').order('display_order'), 'categorías de edad');
        
        const siteContentData = await fetchWithHandling(
          supabase.from('site_content').select('element_key, content_value')
            .in('element_key', ['payment_details_title', 'payment_alias', 'payment_cbu', 'payment_bank', 'payment_holder', 'payment_cuil']),
          'detalles de pago'
        );
        
        setOptions({
          genders: ["Masculino", "Femenino"],
          academies: academiesData.map(opt => opt.name),
          beltRanks: beltRanksData.map(opt => opt.name),
          ageCategories: ageCategoriesData.map(opt => opt.name),
        });

        const content = siteContentData.reduce((acc, item) => {
          if (item.content_value && item.content_value.value) {
            acc[item.element_key] = item.content_value.value;
          }
          return acc;
        }, {});
        setPaymentDetails(content);

      } catch (error) {
        console.error("General error fetching form options/content for minors:", error);
        toast({ title: "Error General de Carga", description: "No se pudieron cargar todos los datos del formulario para menores.", variant: "destructive" });
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchInitialData();
  }, [toast]);

  useEffect(() => {
    if (formData.childDob) {
      const birthDate = new Date(formData.childDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, childAge: age.toString() }));
    } else {
      setFormData(prev => ({ ...prev, childAge: '' }));
    }
  }, [formData.childDob]);

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

    const requiredChildFields = [
      'childFirstName', 'childLastName', 'childDni', 
      'childDob', 'childGender', 'childBeltRank', 'childAgeCategory', 'childWeightKg', 
      'childAcademy', 'childProfessorName'
    ];
    const requiredParentFields = ['parentName', 'parentDni', 'contactEmail', 'contactPhone'];

    for (const field of [...requiredChildFields, ...requiredParentFields]) {
      if (!formData[field]) {
        toast({ title: "Error de Validación", description: `Por favor, completa el campo "${field}".`, variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
    }

    if (formData.childAcademy === "Otra" && !formData.childOtherAcademy) {
      toast({ title: "Error de Validación", description: "Por favor, especifica el nombre de la academia del menor.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (!formData.paymentProof || !formData.dniPhotoChild || !formData.dniPhotoParent) {
      toast({ title: "Archivos Faltantes", description: "Por favor, sube el Comprobante de Pago y las Fotos de DNI (menor y tutor).", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const paymentProofUrl = await uploadFile(formData.paymentProof, 'documents', 'minors/payment_proofs');
      const dniPhotoChildUrl = await uploadFile(formData.dniPhotoChild, 'documents', 'minors/dni_child');
      const dniPhotoParentUrl = await uploadFile(formData.dniPhotoParent, 'documents', 'minors/dni_parent');
      
      let medicalCertUrl = null;
      if (formData.medicalCert) {
        medicalCertUrl = await uploadFile(formData.medicalCert, 'documents', 'minors/medical_certs');
         if (!medicalCertUrl && formData.medicalCert) {
             toast({ title: "Error de Subida de Archivos", description: "No se pudo subir el apto médico. Intenta de nuevo o envíalo más tarde.", variant: "destructive" });
             setIsSubmitting(false);
             return;
        }
      }

      if (!paymentProofUrl || !dniPhotoChildUrl || !dniPhotoParentUrl) {
         toast({ title: "Error de Subida de Archivos", description: "Algunos archivos obligatorios no se pudieron subir. Intenta de nuevo.", variant: "destructive" });
         setIsSubmitting(false);
         return;
      }

      const registrationData = {
        child_first_name: formData.childFirstName,
        child_last_name: formData.childLastName,
        child_dni: formData.childDni,
        child_dob: formData.childDob,
        child_age: parseInt(formData.childAge, 10) || null,
        child_gender: formData.childGender,
        child_belt_rank: formData.childBeltRank,
        child_age_category: formData.childAgeCategory,
        child_weight_kg: parseFloat(formData.childWeightKg) || null,
        child_academy: formData.childAcademy,
        child_other_academy: formData.childAcademy === 'Otra' ? formData.childOtherAcademy : null,
        child_professor_name: formData.childProfessorName,
        parent_name: formData.parentName,
        parent_dni: formData.parentDni,
        parent_email: formData.contactEmail, // Updated to generic contact email
        parent_phone: formData.contactPhone, // Updated to generic contact phone
        payment_proof_url: paymentProofUrl,
        medical_cert_url: medicalCertUrl,
        dni_photo_child_url: dniPhotoChildUrl,
        dni_photo_parent_url: dniPhotoParentUrl,
        registration_status: 'pending',
      };

      const { error: dbError } = await supabase
        .from('minors_registrations')
        .insert([registrationData]);

      if (dbError) {
        console.error("Supabase DB error (Minors):", dbError);
        toast({ title: "Error en el Registro", description: `Hubo un problema al guardar los datos del menor: ${dbError.message}`, variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      toast({ title: "Inscripción Enviada (Menores)", description: "Los datos del menor han sido registrados. Recibirás una confirmación pronto.", variant: "default" });
      setFormData({
        childFirstName: '', childLastName: '', childDni: '', childDob: '', childAge: '', childGender: '',
        childBeltRank: '', childAgeCategory: '', childWeightKg: '', childAcademy: '', childOtherAcademy: '', childProfessorName: '',
        parentName: '', parentDni: '', contactEmail: '', contactPhone: '',
        paymentProof: null, medicalCert: null, dniPhotoChild: null, dniPhotoParent: null,
      });
      Array.from(document.querySelectorAll("input[type='file']")).forEach(input => (input.value = null));
    } catch (error) {
      console.error("Submission error (Minors):", error);
      toast({ title: "Error Inesperado", description: "Ocurrió un error al procesar la inscripción del menor. Por favor, inténtalo de nuevo.", variant: "destructive" });
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
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-8 pt-6">
        <FormSection title="Datos del Competidor (Menor)" icon={<VenetianMask className="h-5 w-5 mr-2 text-primary" />}>
          <PersonalInfoSection formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} options={options} isSubmitting={isSubmitting} />
        </FormSection>

        <FormSection title="Datos de Competencia (Menor)" icon={<Briefcase className="h-5 w-5 mr-2 text-primary" />}>
          <CompetitionDataSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSelectChange={handleSelectChange} 
            options={options} 
            isSubmitting={isSubmitting}
          />
        </FormSection>

        <FormSection title="Datos del Padre/Madre/Tutor y Contacto" icon={<UserCog className="h-5 w-5 mr-2 text-primary" />}>
          <GuardianInfoSection formData={formData} handleInputChange={handleInputChange} isSubmitting={isSubmitting} />
        </FormSection>
        
        <PaymentInfoSection paymentDetails={paymentDetails} />

        <FormSection title="Documentación Requerida" icon={<UploadCloud className="h-5 w-5 mr-2 text-primary" />}>
          <DocumentUploadSection formData={formData} handleFileChange={handleFileChange} isSubmitting={isSubmitting} />
        </FormSection>
      </CardContent>
      <CardFooter className="flex justify-end pt-6">
        <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50" disabled={isSubmitting || loadingOptions}>
          <ShieldCheck className="mr-2 h-5 w-5" /> {isSubmitting ? 'Enviando...' : 'Enviar Inscripción'}
        </Button>
      </CardFooter>
    </form>
  );
};

export default MinorsRegistrationForm;