import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, Shield } from 'lucide-react';

const fadeIn = (delay = 0, y = 20) => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } },
});

const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

const RegistrationCard = ({ title, description, linkTo, icon, buttonText, buttonClass }) => (
  <Card className="bg-card border-border shadow-xl h-full flex flex-col hover:shadow-primary/30 transition-shadow duration-300">
    <CardHeader className="text-center pt-8">
      {icon}
      <CardTitle className="text-3xl font-bold text-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-muted-foreground mb-6">{description}</p>
    </CardContent>
    <CardFooter className="p-6">
      <Link to={linkTo} className="w-full">
        <Button size="lg" className={`w-full text-lg py-3 ${buttonClass} shadow-md transform hover:scale-105 transition-all duration-300 rounded-md`}>
          {buttonText}
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

const RegistrationSection = () => (
  <motion.section 
    id="inscripcion" 
    className="py-16 bg-card/70 rounded-xl shadow-xl glassmorphism"
    variants={fadeIn(0.2)}
    initial="hidden"
    animate="visible"
  >
    <div className="container mx-auto px-4 text-center">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold mb-4 "
        variants={fadeIn(0.1)}
      >
        Asociación Salteña de Brazilian Jiu Jitsu
      </motion.h2>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8"
        variants={staggerContainer(0.2)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeIn(0, 30)}>
          <RegistrationCard
            title="Inscripción Menores"
            description={"Para competidores hasta 17 años."}
            linkTo="/affidavit/minors"
            icon={<Users className="h-12 w-12 mx-auto mb-4 text-secondary" />}
            buttonText="Inscribir Menor"
            buttonClass="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          />
        </motion.div>
        <motion.div variants={fadeIn(0, 30)}>
          <RegistrationCard
            title="Inscripción Adultos"
            description={"Categorías Adultos y Masters."}
            linkTo="/affidavit/adults"
            icon={<Shield className="h-12 w-12 mx-auto mb-4 text-primary" />}
            buttonText="Inscribir Adulto"
            buttonClass="bg-primary hover:bg-primary/90 text-primary-foreground"
          />
        </motion.div>
      </motion.div>
    </div>
  </motion.section>
);

export default RegistrationSection;