import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle } from 'lucide-react';

const AffidavitPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [showDeclineAlert, setShowDeclineAlert] = useState(false);
  const navigate = useNavigate();
  const { type } = useParams(); 
  const { toast } = useToast();

  const affidavitText = `
DECLARACIÓN JURADA DE APTITUD FÍSICA Y RESPONSABILIDAD

Yo, [Nombre Completo del Participante o Tutor Legal si es menor], DNI N° [Número de DNI], en mi carácter de [Participante / Padre / Madre / Tutor Legal del menor [Nombre del Menor]], declaro bajo juramento:

1.  CONOCIMIENTO Y ACEPTACIÓN DE RIESGOS:
    Que participo/autorizo la participación en el torneo de Brazilian Jiu-Jitsu organizado por [Nombre de la Organización del Torneo] (en adelante "LA ORGANIZACIÓN") de forma totalmente voluntaria.
    Que entiendo y acepto que el Brazilian Jiu-Jitsu es un deporte de contacto con riesgos inherentes de lesiones físicas, que pueden incluir, pero no limitarse a, contusiones, esguinces, luxaciones, fracturas, lesiones articulares, musculares, y en casos extremos, lesiones graves o incluso fatales.
    Que conozco y acepto el reglamento del torneo y me comprometo/comprometo al menor a respetarlo en su totalidad, así como las decisiones de los árbitros y autoridades del evento.

2.  APTITUD FÍSICA:
    Que me encuentro/el menor se encuentra en óptimas condiciones de salud física y mental para participar en una competencia de alta exigencia como lo es un torneo de Brazilian Jiu-Jitsu.
    Que no padezco/el menor no padece ninguna enfermedad, condición médica preexistente, lesión o incapacidad que me/le impida participar de forma segura en el torneo, o que pueda agravarse con dicha participación.
    Que poseo/el menor posee un certificado de aptitud física vigente, expedido por un profesional médico matriculado, que avala mi/su capacidad para realizar actividades deportivas de contacto y alta intensidad, el cual adjunto a la presente inscripción.

3.  EXIMICIÓN DE RESPONSABILIDAD:
    Que eximo de toda responsabilidad civil, penal, administrativa o de cualquier otra índole a LA ORGANIZACIÓN, sus directivos, empleados, voluntarios, patrocinadores, al propietario o administrador de las instalaciones donde se desarrolle el evento, y a los demás participantes, por cualquier accidente, lesión, daño material, enfermedad, incapacidad o fallecimiento que pudiera sufrir yo/el menor, o mis/sus bienes, como consecuencia directa o indirecta de mi/su participación en el torneo, ya sea durante los combates, entrenamientos, calentamientos o cualquier otra actividad relacionada con el evento. Esta eximición incluye reclamos por negligencia, salvo que se trate de negligencia grave o dolo debidamente comprobado judicialmente.

4.  DERECHOS DE IMAGEN:
    Que autorizo/autorizo en nombre del menor a LA ORGANIZACIÓN a tomar fotografías, filmar videos y realizar grabaciones de audio durante el torneo en las que pueda aparecer yo/el menor.
    Que cedo gratuitamente a LA ORGANIZACIÓN todos los derechos de imagen y voz sobre dicho material para su utilización con fines promocionales, informativos, periodísticos, educativos o comerciales del torneo o de futuras ediciones, en cualquier medio de comunicación existente o futuro (incluyendo, pero no limitándose a, televisión, internet, redes sociales, prensa escrita, etc.), sin límite de tiempo ni territorial.

5.  DATOS PERSONALES:
    Que los datos personales proporcionados en el formulario de inscripción son veraces, exactos y completos. Autorizo a LA ORGANIZACIÓN al tratamiento de mis/los datos personales del menor con la finalidad de gestionar mi/su inscripción, participación en el torneo, y para el envío de información relacionada con este u otros eventos organizados por LA ORGANIZACIÓN, de acuerdo con la legislación vigente en materia de protección de datos personales.

6.  COMPROMISO (PARA MENORES DE EDAD - COMPLETAR POR PADRE/MADRE/TUTOR):
    Como padre/madre/tutor legal de [Nombre del Menor], DNI N° [DNI del Menor], declaro que he leído y comprendido íntegramente la presente declaración jurada, que he explicado su contenido al menor en un lenguaje apropiado a su edad y entendimiento, y que tanto el menor como yo aceptamos todos sus términos y condiciones.
    Asumo plena responsabilidad por la participación del menor en el torneo, su comportamiento, y su bienestar físico y emocional durante el evento. Me comprometo a acompañar al menor o designar un adulto responsable para su supervisión durante toda su permanencia en las instalaciones del torneo.

7.  VERACIDAD Y CONSECUENCIAS:
    Declaro que todo lo manifestado en la presente es fiel expresión de la verdad y que cualquier omisión o falsedad en esta declaración podrá dar lugar a la anulación de la inscripción, la exclusión del torneo y, en su caso, a las acciones legales que correspondan.

He leído, comprendido y acepto voluntariamente todos los puntos de esta Declaración Jurada.
  `;

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="glassmorphism shadow-xl border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <FileText className="h-12 w-12 text-primary mr-3" />
            <CardTitle className="text-3xl font-bold gradient-text">Declaración Jurada</CardTitle>
          </div>
          <p className="text-muted-foreground">Por favor, lee atentamente y acepta los términos para continuar con la inscripción.</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="p-4 border border-border rounded-lg max-h-[60vh] overflow-y-auto bg-background/50">
            <pre className="whitespace-pre-wrap text-sm text-foreground/80 leading-relaxed">{affidavitText}</pre>
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
              <AlertTriangle className="mr-2 h-6 w-6" />
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