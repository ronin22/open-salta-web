import {motion} from "framer-motion";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Banknote, LandmarkIcon} from "lucide-react";
import React from "react";

const PaymentInfoSection = () => {
	return (
		<motion.div
			initial={{opacity: 0, y: 20}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.6, delay: 0.2}}
		>
			<Card className="bg-card/70 backdrop-blur-md border-border shadow-xl overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/30">
					<CardTitle className="text-xl text-primary flex items-center">
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
								<p className="text-xs text-muted-foreground/80">Banco Galicia - Titular: Marco Leila - CUIT:
									20291756779</p>
							</div>
						</motion.div>
					</div>
				</CardContent>
				<CardContent className="px-6 md:px-8">
					<div className="space-y-4">
						<motion.div
							className="p-4 bg-background/50 rounded-lg border border-border shadow-sm"
							initial={{opacity: 0, x: -20}}
							animate={{opacity: 1, x: 0}}
							transition={{duration: 0.4, delay: 0.1}}
						>
							<div className="mb-3">
								<h3 className="text-lg font-semibold text-primary">Valor de la inscripción:</h3>
							</div>
							<div className="grid gap-3">
								<div className="flex justify-between items-center border-b border-border/50 pb-2">
									<span className="font-medium">Hasta el 10/06:</span>
									<span className="text-lg font-bold">$25.000</span>
								</div>
								<div className="flex justify-between items-center border-b border-border/50 pb-2">
									<span className="font-medium">Del 11/06 al 20/06:</span>
									<span className="text-lg font-bold">$30.000</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="font-medium">Del 21/06 al 25/06:</span>
									<span className="text-lg font-bold">$35.000</span>
								</div>
							</div>
						</motion.div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default PaymentInfoSection;