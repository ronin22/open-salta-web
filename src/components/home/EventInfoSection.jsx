import React from 'react';
import {CalendarDays, Info, MapPin} from 'lucide-react';
import {motion} from 'framer-motion';

const iconVariants = {
	hover: {scale: 1.1, rotate: 5},
	tap: {scale: 0.95}
};

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

const EventInfoSection = () => {
	return (
		<section id="event-info" className="py-16 md:py-24 bg-gradient-to-br from-background to-background/80">
			<div className="container mx-auto px-4">
				<motion.h2
					className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 "
					initial={{opacity: 0, y: -20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6}}
				>
					Información del Evento: Open Salta BJJ 2025
				</motion.h2>

				<div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
					<InfoItem icon={CalendarDays} title="Fecha" content="28 de Junio de 2025"/>
					<a href="https://maps.app.goo.gl/FA8Ro6Ff2TymydHD9" target="_blank" rel="noreferrer">
						<InfoItem icon={MapPin} title="Lugar" content="Complejo Nicolás Vitale, Barrio El Tribuno, Salta Capital"/>
					</a>
					<motion.div
						className="md:col-span-2 flex items-start space-x-4 p-6 bg-card/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-primary/30 transition-shadow duration-300"
						whileHover="hover"
						whileTap="tap"
					>
						<motion.div variants={iconVariants} className="text-primary">
							<Info size={32}/>
						</motion.div>
						<div>
							<h3 className="text-xl font-semibold text-primary mb-1">Descripción del torneo</h3>
							<p className="text-muted-foreground leading-relaxed">
								¡Prepárate para el torneo de Jiu-Jitsu más esperado del Norte Argentino! Pura adrenalina,
								técnica y camaradería. Contaremos con categorías para todas las edades y niveles de experiencia, desde
								cinturones blancos hasta los más experimentados cinturones negros.
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default EventInfoSection;
