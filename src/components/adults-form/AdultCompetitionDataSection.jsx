import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, GraduationCap, Layers, Award, Weight } from 'lucide-react';

const InputField = ({ id, label, required = true, value, onChange, icon, isSubmitting }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-muted-foreground flex items-center">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2 text-primary"})}
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <Input id={id} name={id} type="text" value={value} onChange={onChange} required={required} disabled={isSubmitting} className="bg-input border-border text-foreground focus:border-primary disabled:opacity-70" />
  </div>
);

const SelectField = ({ id, label, options, required = true, value, onChange, placeholder, icon, isSubmitting, className }) => (
  <div className={`space-y-2 ${className || ''}`}>
    <Label htmlFor={id} className="text-muted-foreground flex items-center">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 mr-2 text-primary"})}
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <Select name={id} value={value} onValueChange={(val) => onChange(id, val)} required={required} disabled={isSubmitting || !options || options.length === 0}>
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

const AdultCompetitionDataSection = ({ formData, handleInputChange, handleSelectChange, options, isSubmitting, adultsWeightChartUrl }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField id="academy" label="Academia" options={options.academies} value={formData.academy} onChange={handleSelectChange} placeholder="Selecciona tu academia" icon={<Building />} isSubmitting={isSubmitting} />
        {formData.academy === "Otra" && (
          <InputField id="otherAcademy" label="Nombre de Academia (Si es Otra)" value={formData.otherAcademy} onChange={handleInputChange} icon={<Building />} isSubmitting={isSubmitting} />
        )}
        <InputField id="professorName" label="Nombre del Profesor" value={formData.professorName} onChange={handleInputChange} icon={<GraduationCap />} isSubmitting={isSubmitting} />
        <SelectField id="beltRank" label="Graduación" options={options.beltRanks} value={formData.beltRank} onChange={handleSelectChange} placeholder="Selecciona tu graduación" icon={<Award />} isSubmitting={isSubmitting} />
        <SelectField id="ageCategory" label="Categoría (Edad)" options={options.ageCategories} value={formData.ageCategory} onChange={handleSelectChange} placeholder="Selecciona tu categoría" icon={<Layers />} isSubmitting={isSubmitting} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {adultsWeightChartUrl && (
          <div className="my-4 md:my-0">
            <Label className="text-muted-foreground mb-2 block">Tabla de Pesos (Adultos/Masters)</Label>
            <img-replace src={adultsWeightChartUrl} alt="Tabla de Pesos para Adultos y Masters IBJJF" className="rounded-md border border-border shadow-sm w-full max-w-md" />
          </div>
        )}
        <SelectField 
          id="weightCategory" 
          label="Peso" 
          options={options.weightCategories} 
          value={formData.weightCategory} 
          onChange={handleSelectChange} 
          placeholder="Selecciona tu categoría de peso" 
          icon={<Weight />} 
          isSubmitting={isSubmitting}
          className={adultsWeightChartUrl ? "md:mt-[28px]" : ""} 
        />
      </div>
    </div>
  );
};

export default AdultCompetitionDataSection;