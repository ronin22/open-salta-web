import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPlus as CalendarIcon, Users2, Mail, Phone, Fingerprint } from 'lucide-react';

const InputField = ({ id, label, type = "text", required = true, value, onChange, icon, disabled = false, isSubmitting }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-muted-foreground flex items-center">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2 text-primary"})}
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <Input id={id} name={id} type={type} value={value} onChange={onChange} required={required} disabled={disabled || isSubmitting} className="bg-input border-border text-foreground focus:border-primary disabled:opacity-70" />
  </div>
);

const SelectField = ({ id, label, options, required = true, value, onChange, placeholder, icon, isSubmitting }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-muted-foreground flex items-center">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2 text-primary"})}
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <Select name={id} value={value} onValueChange={(val) => onChange(id, val)} required={required} disabled={isSubmitting}>
      <SelectTrigger className="w-full bg-input border-border text-foreground focus:border-primary disabled:opacity-70">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border text-popover-foreground">
        {options.map(option => (
          <SelectItem key={option} value={option} className="hover:bg-accent focus:bg-accent">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const AdultPersonalInfoSection = ({ formData, handleInputChange, handleSelectChange, options, isSubmitting }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField id="firstName" label="Nombre" value={formData.firstName} onChange={handleInputChange} isSubmitting={isSubmitting} />
      <InputField id="lastName" label="Apellido" value={formData.lastName} onChange={handleInputChange} isSubmitting={isSubmitting} />
      <InputField id="dni" label="DNI" type="text" value={formData.dni} onChange={handleInputChange} icon={<Fingerprint />} isSubmitting={isSubmitting} />
      <InputField id="email" label="Mail de Contacto" type="email" value={formData.email} onChange={handleInputChange} icon={<Mail />} isSubmitting={isSubmitting} />
      <InputField id="phoneContact" label="Celular" type="tel" value={formData.phoneContact} onChange={handleInputChange} icon={<Phone />} isSubmitting={isSubmitting} />
      <InputField id="dob" label="Fecha de Nacimiento" type="date" value={formData.dob} onChange={handleInputChange} icon={<CalendarIcon />} isSubmitting={isSubmitting} />
      <InputField id="age" label="Edad" type="number" value={formData.age} onChange={() => {}} icon={<Users2 />} disabled={true} isSubmitting={isSubmitting} />
      <SelectField id="gender" label="Sexo" options={options.genders} value={formData.gender} onChange={handleSelectChange} placeholder="Selecciona tu sexo" icon={<Users2 />} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AdultPersonalInfoSection;