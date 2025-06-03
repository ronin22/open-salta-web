import React, {useCallback, useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {CardContent, CardFooter} from '@/components/ui/card';
import {useToast} from '@/components/ui/use-toast';
import {Briefcase, Mail, ShieldCheck, UploadCloud, UserCog, VenetianMask} from 'lucide-react';
import FormSection from '@/components/minors-form/FormSection';
import PersonalInfoSection from '@/components/minors-form/PersonalInfoSection';
import CompetitionDataSection from '@/components/minors-form/CompetitionDataSection';
import GuardianInfoSection from '@/components/minors-form/GuardianInfoSection';
import DocumentUploadSection from '@/components/minors-form/DocumentUploadSection';
import {supabase} from '@/lib/supabaseClient';
import PaymentInfoSection from "@/components/payments/PaymentInfoSection.jsx";

async function generateRegistrationId(typePrefix) {
	const {data, error} = await supabase
		.from(typePrefix === 'ADULTO' ? 'adults_registrations' : 'minors_registrations')
		.select('id', {count: 'exact', head: true});

	if (error) {
		console.error('Error fetching count for ID generation:', error);
		return `${typePrefix}-${Date.now().toString().slice(-5)}`;
	}
	const count = data ? (await supabase.from(typePrefix === 'ADULTO' ? 'adults_registrations' : 'minors_registrations').select('id', {count: 'exact'})).count : 0;
	const nextId = (count || 0) + 1;
	return `TORNEO-${typePrefix}-${String(nextId).padStart(5, '0')}`;
}

const MinorsRegistrationForm = () => {
	const {toast} = useToast();
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

	const [loadingOptions, setLoadingOptions] = useState(true);
	const [tournamentName, setTournamentName] = useState("Torneo BJJ");

	const fetchSiteContent = useCallback(async (keys, setterFunction) => {
		try {
			const {data, error} = await supabase
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
			toast({
				title: "Error de Carga",
				description: `No se pudieron cargar algunos datos del sitio. ${error.message}`,
				variant: "destructive"
			});
			return {};
		}
	}, [toast]);


	useEffect(() => {
		const fetchInitialData = async () => {
			setLoadingOptions(true);
			try {
				const fetchWithHandling = async (query, tableName) => {
					const {data, error} = await query;
					if (error) {
						console.error(`Error fetching ${tableName}:`, error);
						toast({
							title: "Error de Carga",
							description: `No se pudieron cargar opciones de ${tableName}. ${error.message}`,
							variant: "destructive"
						});
						return [];
					}
					return data;
				};

				const academiesData = await fetchWithHandling(supabase.from('academies_options').select('name').order('display_order'), 'academias');
				const beltRanksData = await fetchWithHandling(supabase.from('belt_ranks_options').select('name').eq('type', 'minor').order('display_order'), 'graduaciones');
				const ageCategoriesData = await fetchWithHandling(supabase.from('age_categories_options').select('name').eq('type', 'minor').order('display_order'), 'categorías de edad');

				setOptions({
					genders: ["Masculino", "Femenino"],
					academies: academiesData.map(opt => opt.name),
					beltRanks: beltRanksData.map(opt => opt.name),
					ageCategories: ageCategoriesData.map(opt => opt.name),
				});

			} catch (error) {
				console.error("General error fetching form options/content for minors:", error);
				toast({
					title: "Error General de Carga",
					description: "No se pudieron cargar todos los datos del formulario para menores.",
					variant: "destructive"
				});
			} finally {
				setLoadingOptions(false);
			}
		};
		fetchInitialData();
	}, [toast, fetchSiteContent]);

	useEffect(() => {
		if (formData.childDob) {
			const birthDate = new Date(formData.childDob);
			const today = new Date();
			let age = today.getFullYear() - birthDate.getFullYear();
			const m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			setFormData(prev => ({...prev, childAge: age.toString()}));
		} else {
			setFormData(prev => ({...prev, childAge: ''}));
		}
	}, [formData.childDob]);

	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setFormData(prev => ({...prev, [name]: value}));
	};

	const handleSelectChange = (name, value) => {
		setFormData(prev => ({...prev, [name]: value}));
	};

	const handleFileChange = (e) => {
		const {name, files} = e.target;
		if (files.length > 0) {
			setFormData(prev => ({...prev, [name]: files[0]}));
		}
	};

	const uploadFile = async (file, bucket, pathPrefix = 'public') => {
		if (!file) return null;
		const fileName = `${pathPrefix}/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
		const {error} = await supabase.storage
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
		const {data: publicURLData} = supabase.storage.from(bucket).getPublicUrl(fileName);
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
				toast({
					title: "Error de Validación",
					description: `Por favor, completa el campo "${field}".`,
					variant: "destructive"
				});
				setIsSubmitting(false);
				return;
			}
		}

		if (formData.childAcademy === "Otra" && !formData.childOtherAcademy) {
			toast({
				title: "Error de Validación",
				description: "Por favor, especifica el nombre de la academia del menor.",
				variant: "destructive"
			});
			setIsSubmitting(false);
			return;
		}
		if (!formData.paymentProof || !formData.dniPhotoChild || !formData.dniPhotoParent) {
			toast({
				title: "Archivos Faltantes",
				description: "Por favor, sube el Comprobante de Pago y las Fotos de DNI (menor y tutor).",
				variant: "destructive"
			});
			setIsSubmitting(false);
			return;
		}

		try {
			const registration_id = await generateRegistrationId('MENOR');

			const paymentProofUrl = await uploadFile(formData.paymentProof, 'documents', `minors/${registration_id}/payment_proofs`);
			const dniPhotoChildUrl = await uploadFile(formData.dniPhotoChild, 'documents', `minors/${registration_id}/dni_child`);
			const dniPhotoParentUrl = await uploadFile(formData.dniPhotoParent, 'documents', `minors/${registration_id}/dni_parent`);

			let medicalCertUrl = null;
			if (formData.medicalCert) {
				medicalCertUrl = await uploadFile(formData.medicalCert, 'documents', `minors/${registration_id}/medical_certs`);
				if (!medicalCertUrl && formData.medicalCert) {
					toast({
						title: "Error de Subida de Archivos",
						description: "No se pudo subir el apto médico. Intenta de nuevo o envíalo más tarde.",
						variant: "destructive"
					});
					setIsSubmitting(false);
					return;
				}
			}

			if (!paymentProofUrl || !dniPhotoChildUrl || !dniPhotoParentUrl) {
				toast({
					title: "Error de Subida de Archivos",
					description: "Algunos archivos obligatorios no se pudieron subir. Intenta de nuevo.",
					variant: "destructive"
				});
				setIsSubmitting(false);
				return;
			}

			const registrationData = {
				registration_id,
				child_name: formData.childFirstName,
				child_surname: formData.childLastName,
				child_dni: formData.childDni,
				child_birth_date: formData.childDob,
				child_age: parseInt(formData.childAge, 10) || null,
				child_gender: formData.childGender,
				child_belt_rank: formData.childBeltRank,
				child_age_category: formData.childAgeCategory,
				child_weight: parseFloat(formData.childWeightKg) || null,
				child_academy: formData.childAcademy === 'Otra' ? formData.childOtherAcademy : formData.childAcademy,
				child_professor_name: formData.childProfessorName,
				parent_name: formData.parentName,
				parent_dni: formData.parentDni,
				parent_email: formData.contactEmail,
				parent_phone: formData.contactPhone,
				payment_proof_url: paymentProofUrl,
				medical_certificate_url: medicalCertUrl,
				dni_child_url: dniPhotoChildUrl,
				dni_parent_url: dniPhotoParentUrl,
				agreed_to_terms: true,
				registration_status: 'pending',
			};

			const {error: dbError} = await supabase
				.from('minors_registrations')
				.insert([registrationData]);

			if (dbError) {
				console.error("Supabase DB error (Minors):", dbError);
				toast({
					title: "Error en el Registro",
					description: `Hubo un problema al guardar los datos del menor: ${dbError.message}`,
					variant: "destructive"
				});
				setIsSubmitting(false);
				return;
			}

			// Send email
			const emailPayload = {
				recipientEmail: formData.contactEmail,
				registrationId: registration_id,
				tournamentName: tournamentName,
				type: 'minor',
				childDetails: {
					fullName: `${formData.childFirstName} ${formData.childLastName}`,
					dni: formData.childDni,
					academy: formData.childAcademy === 'Otra' ? formData.childOtherAcademy : formData.childAcademy,
					category: formData.childAgeCategory,
					weight: formData.childWeightKg + "kg",
					beltRank: formData.childBeltRank,
					professor: formData.childProfessorName,
				},
				parentDetails: {
					name: formData.parentName,
					dni: formData.parentDni,
					email: formData.contactEmail,
				}
			};

			const {data: emailData, error: emailError} = await supabase.functions.invoke('send-registration-email', {
				body: JSON.stringify(emailPayload),
			});

			if (emailError) {
				console.error('Error sending confirmation email for minor:', emailError);
				toast({
					title: "Correo no Enviado",
					description: "Se registró la inscripción del menor, pero hubo un problema al enviar el correo de confirmación.",
					variant: "destructive"
				});
			} else {
				console.log('Confirmation email for minor sent:', emailData);
				toast({
					title: "Correo Enviado",
					description: "Se ha enviado un correo de confirmación con los detalles de la inscripción del menor.",
					icon: <Mail className="h-5 w-5"/>
				});
			}

			toast({
				title: "Inscripción Enviada (Menores)",
				description: `La inscripción del menor ha sido registrada con el ID: ${registration_id}. Revisa el correo para la confirmación.`,
				variant: "default"
			});
			setFormData({
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
			Array.from(document.querySelectorAll("input[type='file']")).forEach(input => (input.value = null));
		} catch (error) {
			console.error("Submission error (Minors):", error);
			toast({
				title: "Error Inesperado",
				description: "Ocurrió un error al procesar la inscripción del menor. Por favor, inténtalo de nuevo.",
				variant: "destructive"
			});
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
				<FormSection title="Datos del Competidor (Menor)" icon={<VenetianMask className="h-5 w-5 mr-2 text-primary"/>}>
					<PersonalInfoSection formData={formData} handleInputChange={handleInputChange}
					                     handleSelectChange={handleSelectChange} options={options} isSubmitting={isSubmitting}/>
				</FormSection>

				<FormSection title="Datos de Competencia (Menor)" icon={<Briefcase className="h-5 w-5 mr-2 text-primary"/>}>
					<CompetitionDataSection
						formData={formData}
						handleInputChange={handleInputChange}
						handleSelectChange={handleSelectChange}
						options={options}
						isSubmitting={isSubmitting}
					/>
				</FormSection>

				<FormSection title="Datos del Padre/Madre/Tutor y Contacto"
				             icon={<UserCog className="h-5 w-5 mr-2 text-primary"/>}>
					<GuardianInfoSection formData={formData} handleInputChange={handleInputChange} isSubmitting={isSubmitting}/>
				</FormSection>

				<PaymentInfoSection/>

				<FormSection title="Documentación Requerida" icon={<UploadCloud className="h-5 w-5 mr-2 text-primary"/>}>
					<DocumentUploadSection formData={formData} handleFileChange={handleFileChange} isSubmitting={isSubmitting}/>
				</FormSection>
			</CardContent>
			<CardFooter className="flex justify-end pt-6">
				<Button type="submit" size="lg"
				        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50"
				        disabled={isSubmitting || loadingOptions}>
					<ShieldCheck className="mr-2 h-5 w-5"/> {isSubmitting ? 'Enviando...' : 'Enviar Inscripción'}
				</Button>
			</CardFooter>
		</form>
	);
};

export default MinorsRegistrationForm;