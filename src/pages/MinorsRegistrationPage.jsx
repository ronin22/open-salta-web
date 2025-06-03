import React from 'react';
import {motion} from 'framer-motion';
import MinorsRegistrationForm from '@/components/minors-form/MinorsRegistrationForm';
import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {UserPlus} from 'lucide-react';

const MinorsRegistrationPage = () => {
	return (
		<motion.div
			initial={{opacity: 0, scale: 0.95}}
			animate={{opacity: 1, scale: 1}}
			transition={{duration: 0.5}}
			className="max-w-3xl mx-auto"
		>
			<Card className="glassmorphism shadow-2xl border-border">
				<CardHeader className="text-center">
					<div className="flex justify-center items-center mb-3">
						<UserPlus className="h-12 w-12 text-primary mr-3"/>
						<CardTitle className="text-3xl font-bold ">Inscripción para Menores de Edad</CardTitle>
					</div>
					<CardDescription className="text-muted-foreground">
						Completa los datos del competidor menor de edad y del padre/madre/tutor.
					</CardDescription>
				</CardHeader>
				<MinorsRegistrationForm/>
			</Card>
		</motion.div>
	);
};

export default MinorsRegistrationPage;