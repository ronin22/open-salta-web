import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPlus as CalendarIcon, Users2, Fingerprint } from 'lucide-react';

const InputField = ({ id, label, type = "text", required = true, value, onChange, icon, disabled = false, prefix = "child", isSubmitting }) => (
  <div className="space-y-2">
    <Label htmlFor={prefix + id} className="text-muted-foreground flex items-center">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2 text-primary"})}
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <Input id={prefix + id} name={prefix + id} type={type} value={value} onChange={onChange} required={required} disabled={disabled || isSubmitting} className="bg-input border-border text-foreground focus:border-primary disabled:opacity-70" />
  </div>
);

const SelectField = ({ id, label, options, required = true, value, onChange, placeholder, icon, prefix = "child", isSubmitting }) => (
  <div className="space-y-2">
    <Label htmlFor={prefix + id} className="text-muted-foreground flex items-center">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2 text-primary"})}
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <Select name={prefix + id} value={value} onValueChange={(val) => onChange(prefix + id, val)} required={required} disabled={isSubmitting || !options || options.length === 0}>
      <SelectTrigger className="w-full bg-input border-border text-foreground focus:border-primary disabled:opacity-70">
        <SelectValue placeholder={(!options || options.length === 0) ? "Cargando..." : placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border text-popover-foreground">
        {options && options.map(option => (
          <SelectItem key={option} value={option} className="hover:bg-accent focus:bg-accent">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);


const PersonalInfoSection = ({ formData, handleInputChange, handleSelectChange, options, isSubmitting }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField id="FirstName" label="Nombre del Menor" value={formData.childFirstName} onChange={handleInputChange} isSubmitting={isSubmitting} />
      <InputField id="LastName" label="Apellido del Menor" value={formData.childLastName} onChange={handleInputChange} isSubmitting={isSubmitting} />
      <InputField id="Dni" label="DNI del Menor" type="text" value={formData.childDni} onChange={handleInputChange} icon={<Fingerprint />} isSubmitting={isSubmitting} />
      <InputField id="Dob" label="Fecha de Nacimiento del Menor" type="date" value={formData.childDob} onChange={handleInputChange} icon={<CalendarIcon />} isSubmitting={isSubmitting} />
      <InputField id="Age" label="Edad del Menor" type="number" value={formData.childAge} onChange={() => {}} icon={<Users2 />} disabled={true} isSubmitting={isSubmitting} />
      <SelectField id="Gender" label="Sexo del Menor" options={options.genders} value={formData.childGender} onChange={handleSelectChange} placeholder="Selecciona sexo" icon={<Users2 />} isSubmitting={isSubmitting} />
    </div>
  );
};

export default PersonalInfoSection;