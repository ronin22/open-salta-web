import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, GraduationCap, Layers, Award, Weight } from 'lucide-react';

const InputField = ({ id, label, type = "text", required = true, value, onChange, icon, prefix = "child", isSubmitting, suffix }) => (
  <div className="space-y-2">
    <Label htmlFor={prefix + id} className="text-muted-foreground flex items-center">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2 text-primary"})}
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <div className="flex items-center">
      <Input 
        id={prefix + id} 
        name={prefix + id} 
        type={type} 
        value={value} 
        onChange={onChange} 
        required={required} 
        disabled={isSubmitting} 
        className="bg-input border-border text-foreground focus:border-primary disabled:opacity-70" 
        step={type === "number" ? "0.1" : undefined}
      />
      {suffix && <span className="ml-2 text-muted-foreground">{suffix}</span>}
    </div>
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

const CompetitionDataSection = ({ formData, handleInputChange, handleSelectChange, options, isSubmitting }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SelectField id="BeltRank" label="Graduación" options={options.beltRanks} value={formData.childBeltRank} onChange={handleSelectChange} placeholder="Selecciona graduación" icon={<Award />} isSubmitting={isSubmitting} />
      <SelectField id="AgeCategory" label="Categoría (Edad)" options={options.ageCategories} value={formData.childAgeCategory} onChange={handleSelectChange} placeholder="Selecciona categoría" icon={<Layers />} isSubmitting={isSubmitting} />
      <InputField id="WeightKg" label="Peso" type="number" value={formData.childWeightKg} onChange={handleInputChange} icon={<Weight />} suffix="kg" isSubmitting={isSubmitting} />
      <SelectField id="Academy" label="Academia" options={options.academies} value={formData.childAcademy} onChange={handleSelectChange} placeholder="Selecciona academia" icon={<Building />} isSubmitting={isSubmitting} />
      {formData.childAcademy === "Otra" && (
        <InputField id="OtherAcademy" label="Nombre de Academia (Si es Otra)" value={formData.childOtherAcademy} onChange={handleInputChange} icon={<Building />} isSubmitting={isSubmitting} />
      )}
      <InputField id="ProfessorName" label="Nombre del Profesor" value={formData.childProfessorName} onChange={handleInputChange} icon={<GraduationCap />} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CompetitionDataSection;