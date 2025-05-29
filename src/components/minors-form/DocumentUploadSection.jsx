import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, FileText, ShieldQuestion, Fingerprint } from 'lucide-react';

const FileInputField = ({ id, label, required = true, onChange, file, prefix = "", isSubmitting, icon, accept }) => (
  <div className="space-y-2">
    <Label htmlFor={prefix + id} className="text-muted-foreground flex items-center">
      {icon || <UploadCloud className="h-4 w-4 mr-2 text-primary" />}
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <div className="flex items-center space-x-2 p-3 border-2 border-dashed border-border rounded-md bg-background hover:border-primary transition-colors">
      <Input 
        id={prefix + id} 
        name={prefix + id} 
        type="file" 
        onChange={onChange} 
        required={required} 
        disabled={isSubmitting} 
        className="text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer disabled:opacity-70" 
        accept={accept || ".jpg,.jpeg,.png,.pdf"} 
      />
    </div>
    {file && <p className="text-xs text-green-500 mt-1">Archivo seleccionado: {file.name}</p>}
  </div>
);

const DocumentUploadSection = ({ formData, handleFileChange, isSubmitting }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileInputField 
            id="paymentProof" 
            label="Comprobante de Pago" 
            required={true} 
            onChange={handleFileChange} 
            file={formData.paymentProof} 
            isSubmitting={isSubmitting}
            icon={<FileText className="h-4 w-4 mr-2 text-primary" />}
        />
        <FileInputField 
            id="medicalCert" 
            label="Certificado Apto Médico (Menor)" 
            required={false} // Optional
            onChange={handleFileChange} 
            file={formData.medicalCert} 
            isSubmitting={isSubmitting}
            icon={<ShieldQuestion className="h-4 w-4 mr-2 text-primary" />}
        />
        <FileInputField 
            id="dniPhotoChild" 
            label="Foto DNI del Menor" 
            required={true} 
            onChange={handleFileChange} 
            file={formData.dniPhotoChild} 
            isSubmitting={isSubmitting}
            icon={<Fingerprint className="h-4 w-4 mr-2 text-primary" />}
        />
        <FileInputField 
            id="dniPhotoParent" 
            label="Foto DNI del Tutor" 
            required={true} 
            onChange={handleFileChange} 
            file={formData.dniPhotoParent} 
            isSubmitting={isSubmitting}
            icon={<Fingerprint className="h-4 w-4 mr-2 text-primary" />}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-3">Formatos aceptados: PDF, JPG, PNG. Tamaño máximo por archivo: 5MB.</p>
    </>
  );
};

export default DocumentUploadSection;