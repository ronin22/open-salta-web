import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, UserCircle, Fingerprint } from 'lucide-react';

const InputField = ({ id, label, type = "text", required = true, value, onChange, icon, name, isSubmitting }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-muted-foreground flex items-center">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2 text-primary"})}
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <Input id={id} name={name} type={type} value={value} onChange={onChange} required={required} disabled={isSubmitting} className="bg-input border-border text-foreground focus:border-primary disabled:opacity-70" />
  </div>
);

const GuardianInfoSection = ({ formData, handleInputChange, isSubmitting }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField id="parentName" name="parentName" label="Nombre y Apellido del Tutor" value={formData.parentName} onChange={handleInputChange} icon={<UserCircle />} isSubmitting={isSubmitting} />
      <InputField id="parentDni" name="parentDni" label="DNI del Tutor" type="text" value={formData.parentDni} onChange={handleInputChange} icon={<Fingerprint />} isSubmitting={isSubmitting} />
      <InputField id="contactEmail" name="contactEmail" label="Mail de Contacto" type="email" value={formData.contactEmail} onChange={handleInputChange} icon={<Mail />} isSubmitting={isSubmitting} />
      <InputField id="contactPhone" name="contactPhone" label="Celular de Contacto" type="tel" value={formData.contactPhone} onChange={handleInputChange} icon={<Phone />} isSubmitting={isSubmitting} />
    </div>
  );
};

export default GuardianInfoSection;