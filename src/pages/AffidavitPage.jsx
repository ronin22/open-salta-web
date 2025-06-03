import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {useToast} from '@/components/ui/use-toast';
import {motion} from 'framer-motion';
import {AlertTriangle, FileText} from 'lucide-react';
import {MINORS_AFFIDAVIT_TEXT} from "@/data/affidavits/minors.js";
import {ADULTS_AFFIDAVIT_TEXT} from "@/data/affidavits/adults.js";

const AffidavitPage = () => {
	const [isChecked, setIsChecked] = useState(false);
	const [showDeclineAlert, setShowDeclineAlert] = useState(false);
	const navigate = useNavigate();
	const {type} = useParams();
	const {toast} = useToast();

	const handleAccept = () => {
		if (isChecked) {
			toast({
				title: "Declaración Aceptada",
				description: "Serás redirigido al formulario de inscripción.",
				variant: "default",
			});
			navigate(type === 'minors' ? '/register/minors' : '/register/adults');
		} else {
			toast({
				title: "Error",
				description: "Debes aceptar los términos para continuar.",
				variant: "destructive",
			});
		}
	};

	const handleDecline = () => {
		setShowDeclineAlert(true);
	};

	const confirmDecline = () => {
		setShowDeclineAlert(false);
		toast({
			title: "Inscripción Cancelada",
			description: "Has decidido no aceptar la declaración jurada.",
			variant: "default",
		});
		navigate('/');
	};

	return (
		<motion.div
			initial={{opacity: 0, y: 20}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.5}}
			className="max-w-3xl mx-auto"
		>
			<Card className="glassmorphism shadow-xl border-border">
				<CardHeader className="text-center">
					<div className="flex justify-center items-center mb-4">
						<FileText className="h-12 w-12 text-primary mr-3"/>
						<CardTitle className="text-3xl font-bold ">Declaración Jurada</CardTitle>
					</div>
					<p className="text-muted-foreground">Por favor, lee atentamente y acepta los términos para continuar con la
						inscripción.</p>
				</CardHeader>
				<CardContent className="space-y-6 pt-6">
					<div className="p-4 border border-border rounded-lg max-h-[60vh] overflow-y-auto bg-background/50">
						<pre className="whitespace-pre-wrap text-sm text-foreground/80 leading-relaxed">
							{type === 'minors' ? MINORS_AFFIDAVIT_TEXT : ADULTS_AFFIDAVIT_TEXT}
						</pre>
					</div>
					<div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-md border border-border">
						<Checkbox
							id="terms"
							checked={isChecked}
							onCheckedChange={setIsChecked}
							className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
						/>
						<Label htmlFor="terms" className="text-base font-medium text-foreground cursor-pointer">
							He leído y acepto los términos de la declaración jurada.
						</Label>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 pt-6">
					<Button
						variant="destructive"
						onClick={handleDecline}
						className="w-full sm:w-auto shadow-md transform hover:scale-105 transition-transform"
					>
						No Acepto
					</Button>
					<Button
						onClick={handleAccept}
						disabled={!isChecked}
						className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-md transform hover:scale-105 transition-transform disabled:bg-muted disabled:cursor-not-allowed"
					>
						Acepto y Continuo
					</Button>
				</CardFooter>
			</Card>

			<AlertDialog open={showDeclineAlert} onOpenChange={setShowDeclineAlert}>
				<AlertDialogContent className="bg-card border-border text-foreground">
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center text-yellow-500">
							<AlertTriangle className="mr-2 h-6 w-6"/>
							¿Estás seguro?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-muted-foreground">
							Si no aceptas la declaración jurada, no podrás continuar con el proceso de inscripción.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => setShowDeclineAlert(false)}
							className="bg-muted hover:bg-muted/80 border-border text-muted-foreground"
						>
							Volver
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDecline}
							className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
						>
							Sí, Cancelar Inscripción
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</motion.div>
	);
};

export default AffidavitPage;