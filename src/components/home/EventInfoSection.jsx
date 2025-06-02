import React, {useState} from 'react';
import {Banknote, CalendarDays, Info, Landmark as LandmarkIcon, MapPin} from 'lucide-react';
import {motion} from 'framer-motion';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

const iconVariants = {
	hover: {scale: 1.1, rotate: 5},
	tap: {scale: 0.95}
};

const EventInfoSection = () => {
	const [eventDetails, setEventDetails] = useState({
		date: "28 de Junio de 2025",
		location: "Complejo Nicolás Vitale, Barrio El Tribuno, Salta Capital",
		description: "¡Prepárate para el torneo de Jiu-Jitsu más esperado del Norte Argentino! Dos días de pura adrenalina, técnica y camaradería. Contaremos con categorías para todas las edades y niveles de experiencia, desde cinturones blancos hasta los más experimentados cinturones negros.",
		tournamentName: "Open Salta BJJ"
	});

	const InfoItem = ({icon: Icon, title, content}) => (
		<motion.div
			className="flex items-start space-x-4 p-6 bg-card/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-primary/30 transition-shadow duration-300"
			whileHover="hover"
			whileTap="tap"
		>
			<motion.div variants={iconVariants} className="text-primary">
				<Icon size={32}/>
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
					className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 "
					initial={{opacity: 0, y: -20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6}}
				>
					Información del Evento: {eventDetails.tournamentName}
				</motion.h2>

				<div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
						<InfoItem icon={CalendarDays} title="Fecha" content={eventDetails.date}/>
						<InfoItem icon={MapPin} title="Lugar" content={eventDetails.location}/>
						<motion.div
							className="md:col-span-2 flex items-start space-x-4 p-6 bg-card/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-primary/30 transition-shadow duration-300"
							whileHover="hover"
							whileTap="tap"
						>
							<motion.div variants={iconVariants} className="text-primary">
								<Info size={32}/>
							</motion.div>
							<div>
								<h3 className="text-xl font-semibold text-primary mb-1">Descripción del Torneo</h3>
								<p className="text-muted-foreground leading-relaxed">{eventDetails.description}</p>
							</div>
						</motion.div>
					</div>

				{/*<motion.div
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6, delay: 0.2}}
				>
					<Card className="bg-card/70 backdrop-blur-md border-border shadow-xl overflow-hidden">
						<CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/30">
							<CardTitle className="text-2xl md:text-3xl font-bold text-primary flex items-center">
								<Banknote size={36} className="mr-3 text-primary"/>
								Datos para la Transferencia e Inscripción
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6 md:p-8">
							<div className="space-y-5">
								<motion.div
									className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-background/50 rounded-lg border border-border shadow-sm hover:border-primary/50 transition-colors"
									initial={{opacity: 0, x: -20}}
									animate={{opacity: 1, x: 0}}
									transition={{duration: 0.4, delay: 0.1}}
								>
									<div className="flex items-center mb-2 sm:mb-0">
										<LandmarkIcon className="h-5 w-5 mr-3 text-primary/80"/>
										<span className="font-semibold text-muted-foreground min-w-[200px]">ALIAS</span>
									</div>
									<div className="text-right sm:text-left">
										<p className="text-lg font-medium text-foreground">checkmat.st</p>
										<p className="text-xs text-muted-foreground/80">Banco Galicia - Titular: Marco Leila - CUIT: 20291756779</p>
									</div>
								</motion.div>
							</div>
						</CardContent>
					</Card>
				</motion.div>*/}
			</div>
		</section>
	);
};

export default EventInfoSection;
